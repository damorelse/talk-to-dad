/**
 * Google Identity Services (GIS) OAuth 2.0 Authentication Service
 * Manages token acquisition, validation, userinfo fetching, revocation, and session caching
 * for private Google Sheets access in TalkWithDad AAC.
 */

export interface GoogleAuthState {
  isAuthenticated: boolean;
  userEmail?: string;
  expiresAt?: number;
  clientId?: string;
}

export interface OAuthTokenResult {
  accessToken: string;
  expiresIn: number;
  expiresAt: number;
  userEmail?: string;
  scope?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token: string;
              expires_in: number | string;
              scope?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (error: unknown) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
          revoke: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}

const SESSION_STORAGE_KEY = 'talkwithdad_gis_oauth_session';
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const SHEETS_READONLY_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const USERINFO_EMAIL_SCOPE = 'https://www.googleapis.com/auth/userinfo.email';

export class GoogleAuthService {
  private activeToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private userEmail: string = '';
  private activeClientId: string = '834068800593-2pmbqakdb5r82rgr84nu1cfvmjjfghdb.apps.googleusercontent.com';
  private isScriptLoaded: boolean = false;
  private scriptLoadingPromise: Promise<void> | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.restoreSessionFromStorage();
  }

  /**
   * Restores cached session token from sessionStorage if valid and not expired.
   */
  private restoreSessionFromStorage(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;

    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      const now = Date.now();

      // Ensure token has at least 60 seconds of validity remaining
      if (data.accessToken && data.expiresAt && data.expiresAt > now + 60000) {
        this.activeToken = data.accessToken;
        this.tokenExpiresAt = data.expiresAt;
        this.userEmail = data.userEmail || '';
        this.activeClientId = data.clientId || '';
      } else {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('[GoogleAuthService] Failed to restore cached session:', err);
    }
  }

  /**
   * Persists session token to sessionStorage.
   */
  private saveSessionToStorage(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;

    try {
      if (this.activeToken && this.tokenExpiresAt > Date.now()) {
        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({
            accessToken: this.activeToken,
            expiresAt: this.tokenExpiresAt,
            userEmail: this.userEmail,
            clientId: this.activeClientId,
          })
        );
      } else {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('[GoogleAuthService] Failed to save session:', err);
    }
  }

  /**
   * Dynamically loads Google Identity Services (GIS) client script if not already present.
   */
  async loadGisScript(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (window.google?.accounts?.oauth2) {
      this.isScriptLoaded = true;
      return;
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      // Check if script tag already exists in DOM
      const existingScript = document.querySelector(`script[src="${GIS_SCRIPT_URL}"]`);
      if (existingScript) {
        if (window.google?.accounts?.oauth2) {
          this.isScriptLoaded = true;
          resolve();
          return;
        }
        existingScript.addEventListener('load', () => {
          this.isScriptLoaded = true;
          resolve();
        });
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }

      const script = document.createElement('script');
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.id = 'gsi-client-script';

      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };

      script.onerror = (err) => {
        this.scriptLoadingPromise = null;
        reject(new Error(`Failed to load Google Identity Services library: ${String(err)}`));
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Requests an OAuth 2.0 Access Token using Google Identity Services tokenClient.
   */
  async requestAccessToken(options: {
    clientId?: string;
    prompt?: string;
  } = {}): Promise<OAuthTokenResult> {
    await this.loadGisScript();

    const envClientId = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || '';
    const clientId = (options.clientId || this.activeClientId || envClientId).trim();

    if (!clientId) {
      throw new Error(
        'Google OAuth Client ID is not configured. Please set your Client ID in Caregiver Settings.'
      );
    }

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services SDK is not available.');
    }

    const oauth2 = window.google.accounts.oauth2;

    return new Promise((resolve, reject) => {
      try {
        const tokenClient = oauth2.initTokenClient({
          client_id: clientId,
          scope: `${SHEETS_READONLY_SCOPE} ${USERINFO_EMAIL_SCOPE}`,
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              const errMsg = tokenResponse.error_description || tokenResponse.error;
              reject(new Error(`Google authorization failed: ${errMsg}`));
              return;
            }

            if (!tokenResponse.access_token) {
              reject(new Error('No access token returned by Google Identity Services.'));
              return;
            }

            const expiresInSec = typeof tokenResponse.expires_in === 'string'
              ? parseInt(tokenResponse.expires_in, 10)
              : (tokenResponse.expires_in || 3600);

            const expiresAt = Date.now() + expiresInSec * 1000;
            this.activeToken = tokenResponse.access_token;
            this.tokenExpiresAt = expiresAt;
            this.activeClientId = clientId;

            // Fetch user profile email
            try {
              const userInfo = await this.fetchGoogleUserInfo(tokenResponse.access_token);
              if (userInfo?.email) {
                this.userEmail = userInfo.email;
              }
            } catch (userErr) {
              console.warn('[GoogleAuthService] Failed to fetch user info:', userErr);
            }

            this.saveSessionToStorage();
            this.notify();

            resolve({
              accessToken: tokenResponse.access_token,
              expiresIn: expiresInSec,
              expiresAt,
              userEmail: this.userEmail,
              scope: tokenResponse.scope,
            });
          },
          error_callback: (err) => {
            reject(new Error(`Google OAuth error: ${JSON.stringify(err)}`));
          },
        });

        // Trigger Google OAuth popup dialog
        tokenClient.requestAccessToken({
          prompt: options.prompt !== undefined ? options.prompt : '',
        });
      } catch (err: unknown) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  /**
   * Fetches the authenticated user's email from Google OAuth2 userinfo endpoint.
   */
  async fetchGoogleUserInfo(accessToken: string): Promise<{ email?: string; name?: string; picture?: string } | null> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (err) {
      console.warn('[GoogleAuthService] Userinfo request error:', err);
      return null;
    }
  }

  /**
   * Returns current active token if present and not within 60 seconds of expiration.
   */
  getValidAccessToken(): string | null {
    const now = Date.now();
    if (this.activeToken && this.tokenExpiresAt > now + 60000) {
      return this.activeToken;
    }

    // Try restoring from storage if memory was cleared
    this.restoreSessionFromStorage();
    if (this.activeToken && this.tokenExpiresAt > now + 60000) {
      return this.activeToken;
    }

    return null;
  }

  /**
   * Returns current authentication state.
   */
  getAuthState(): GoogleAuthState {
    const validToken = this.getValidAccessToken();
    return {
      isAuthenticated: Boolean(validToken),
      userEmail: validToken ? this.userEmail : undefined,
      expiresAt: validToken ? this.tokenExpiresAt : undefined,
      clientId: this.activeClientId,
    };
  }

  /**
   * Sets credentials manually (useful for testing or direct token hydration).
   */
  setSession(token: string, expiresInSec: number, userEmail?: string, clientId?: string): void {
    this.activeToken = token;
    this.tokenExpiresAt = Date.now() + expiresInSec * 1000;
    this.userEmail = userEmail || '';
    this.activeClientId = clientId || '';
    this.saveSessionToStorage();
    this.notify();
  }

  /**
   * Revokes the current token with Google and cleans up session state.
   */
  async signOut(): Promise<void> {
    const token = this.activeToken;

    this.activeToken = null;
    this.tokenExpiresAt = 0;
    this.userEmail = '';
    this.saveSessionToStorage();
    this.notify();

    if (token && typeof window !== 'undefined' && window.google?.accounts?.oauth2?.revoke) {
      try {
        await new Promise<void>((resolve) => {
          window.google!.accounts.oauth2.revoke(token, () => resolve());
        });
      } catch (err) {
        console.warn('[GoogleAuthService] Token revocation error:', err);
      }
    }
  }

  /**
   * Subscribes a listener to auth state changes.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[GoogleAuthService] Error in auth listener:', err);
      }
    });
  }
}

export const googleAuthService = new GoogleAuthService();
