/**
 * Tier 12: Terms of Service & Privacy Policy Legal Invariants Test Suite
 *
 * Verifies:
 * 1. Privacy Policy data model & legal requirements (GDPR, CCPA, COPPA, HIPAA, GitHub Pages, Zero Data Collection)
 * 2. Terms of Service data model & disclaimers (Medical Disclaimer, Emergency Disclaimer, Liability Limitation, AS-IS)
 * 3. Bilingual Label Hierarchy & Ordering (English First Invariant across all titles and summaries)
 * 4. Static HTML pages integrity (public/, root, and dist/ bundles)
 * 5. Offline PWA precache registration in sw.js and public/sw.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import '../setup.js';

import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../../src/services/legal/legalContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

describe('Tier 12: Terms of Service & Privacy Policy Legal Invariants', () => {

  describe('1. Privacy Policy Data Model & Global Privacy Compliance', () => {
    it('should have valid metadata, effective dates, and titles', () => {
      assert.equal(PRIVACY_POLICY.id, 'privacy-policy');
      assert.equal(PRIVACY_POLICY.title, 'Privacy Policy');
      assert.equal(PRIVACY_POLICY.titleZh, '隱私權政策');
      assert.ok(PRIVACY_POLICY.effectiveDate.length > 0);
      assert.ok(PRIVACY_POLICY.lastUpdated.length > 0);
      assert.ok(PRIVACY_POLICY.subtitle.length > 0);
      assert.ok(PRIVACY_POLICY.subtitleZh.length > 0);
    });

    it('should declare Zero Personal Data Collection in summary and sections', () => {
      const summaryText = PRIVACY_POLICY.summaryPoints.map(p => p.en).join(' ');
      assert.match(summaryText, /Zero Personal Data/i);
      assert.match(summaryText, /do not collect/i);

      const overviewSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-overview');
      assert.ok(overviewSection, 'privacy-overview section must exist');
      const overviewEn = overviewSection.contentEn.join(' ');
      assert.match(overviewEn, /DO NOT COLLECT/i);
      assert.match(overviewEn, /Article 25/i); // GDPR Privacy by Design
    });

    it('should disclose 100% Local On-Device Storage (IndexedDB, Dexie, localStorage)', () => {
      const storageSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-data-types');
      assert.ok(storageSection, 'privacy-data-types section must exist');
      const storageEn = storageSection.contentEn.join(' ');
      assert.match(storageEn, /IndexedDB/i);
      assert.match(storageEn, /Dexie/i);
      assert.match(storageEn, /localStorage/i);
      assert.match(storageEn, /None of this data ever leaves your device/i);
    });

    it('should disclose Audio & Speech Synthesis Processing (Web Speech API, zero cloud speech upload)', () => {
      const audioSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-audio-speech');
      assert.ok(audioSection, 'privacy-audio-speech section must exist');
      const audioEn = audioSection.contentEn.join(' ');
      assert.match(audioEn, /Web Speech API/i);
      assert.match(audioEn, /not sent to external cloud speech APIs/i);
    });

    it('should disclose GitHub Pages Static Hosting & Server Logs policy', () => {
      const hostingSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-hosting');
      assert.ok(hostingSection, 'privacy-hosting section must exist');
      const hostingEn = hostingSection.contentEn.join(' ');
      assert.match(hostingEn, /GitHub Pages/i);
      assert.match(hostingEn, /GitHub, Inc/i);
      assert.match(hostingEn, /docs\.github\.com/i);
    });

    it('should disclose optional Google Sheets Auto-Sync feature', () => {
      const sheetsSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-google-sheets');
      assert.ok(sheetsSection, 'privacy-google-sheets section must exist');
      assert.match(sheetsSection.title, /Google Sheets/i);
      const sheetsEn = sheetsSection.contentEn.join(' ');
      assert.match(sheetsEn, /Google Sheet/i);
      assert.match(sheetsEn, /direct client-side HTTPS/i);
    });

    it('should declare Zero Tracking Cookies policy', () => {
      const cookieSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-cookies');
      assert.ok(cookieSection, 'privacy-cookies section must exist');
      const cookieEn = cookieSection.contentEn.join(' ');
      assert.match(cookieEn, /Zero Tracking Cookies/i);
      assert.match(cookieEn, /Service Worker/i);
    });

    it('should include GDPR, CCPA/CPRA, COPPA, and HIPAA compliance statements', () => {
      const rightsSection = PRIVACY_POLICY.sections.find(s => s.id === 'privacy-global-rights');
      assert.ok(rightsSection, 'privacy-global-rights section must exist');
      const rightsEn = rightsSection.contentEn.join(' ');
      assert.match(rightsEn, /GDPR/i);
      assert.match(rightsEn, /CCPA/i);
      assert.match(rightsEn, /COPPA/i);
      assert.match(rightsEn, /HIPAA/i);
    });
  });

  describe('2. Terms of Service Data Model & Clinical / Safety Disclaimers', () => {
    it('should have valid metadata, effective dates, and titles', () => {
      assert.equal(TERMS_OF_SERVICE.id, 'terms-of-service');
      assert.equal(TERMS_OF_SERVICE.title, 'Terms of Service');
      assert.equal(TERMS_OF_SERVICE.titleZh, '服務條款');
      assert.ok(TERMS_OF_SERVICE.effectiveDate.length > 0);
      assert.ok(TERMS_OF_SERVICE.lastUpdated.length > 0);
    });

    it('should include STRICT MEDICAL & CLINICAL DISCLAIMER (NOT MEDICAL ADVICE)', () => {
      const medSection = TERMS_OF_SERVICE.sections.find(s => s.id === 'terms-medical-disclaimer');
      assert.ok(medSection, 'terms-medical-disclaimer section must exist');
      assert.equal(medSection.isImportant, true);
      const medEn = medSection.contentEn.join(' ');
      assert.match(medEn, /NOT A MEDICAL DEVICE/i);
      assert.match(medEn, /NOT a substitute for professional medical assessment/i);
      assert.match(medEn, /Always seek the advice of a qualified physician/i);
    });

    it('should include STRICT EMERGENCY & LIFE SAFETY DISCLAIMER (NOT AN EMERGENCY SYSTEM)', () => {
      const emergSection = TERMS_OF_SERVICE.sections.find(s => s.id === 'terms-emergency-disclaimer');
      assert.ok(emergSection, 'terms-emergency-disclaimer section must exist');
      assert.equal(emergSection.isImportant, true);
      const emergEn = emergSection.contentEn.join(' ');
      assert.match(emergEn, /NOT AN EMERGENCY DISPATCH SYSTEM/i);
      assert.match(emergEn, /Bedside Alerting Only/i);
      assert.match(emergEn, /Cannot Contact Authorities/i);
      assert.match(emergEn, /IMMEDIATELY call your local emergency telephone number/i);
    });

    it('should include Disclaimer of Warranties (AS IS) and Limitation of Liability', () => {
      const warrantySection = TERMS_OF_SERVICE.sections.find(s => s.id === 'terms-warranty-disclaimer');
      assert.ok(warrantySection, 'terms-warranty-disclaimer must exist');
      const warrantyEn = warrantySection.contentEn.join(' ');
      assert.match(warrantyEn, /AS IS/i);
      assert.match(warrantyEn, /AS AVAILABLE/i);

      const liabilitySection = TERMS_OF_SERVICE.sections.find(s => s.id === 'terms-limitation-liability');
      assert.ok(liabilitySection, 'terms-limitation-liability must exist');
      assert.match(liabilitySection.title, /Limitation of Liability/i);
      const liabilityEn = liabilitySection.contentEn.join(' ');
      assert.match(liabilityEn, /IN NO EVENT SHALL THE DEVELOPERS/i);
      assert.match(liabilityEn, /THIS LIMITATION APPLIES/i);
    });

    it('should detail User Content ownership and Local Storage backup responsibility', () => {
      const userContentSection = TERMS_OF_SERVICE.sections.find(s => s.id === 'terms-user-content');
      assert.ok(userContentSection, 'terms-user-content must exist');
      const userContentEn = userContentSection.contentEn.join(' ');
      assert.match(userContentEn, /Ownership of Content/i);
      assert.match(userContentEn, /RESPONSIBLE FOR MAINTAINING REGULAR BACKUPS/i);
    });
  });

  describe('3. Bilingual Label Hierarchy & Ordering (English First Invariant)', () => {
    it('should always provide English text before Chinese in Privacy Policy sections', () => {
      for (const section of PRIVACY_POLICY.sections) {
        assert.ok(section.title.length > 0, 'Section must have English title');
        assert.ok(section.titleZh.length > 0, 'Section must have Chinese title');
        assert.ok(section.contentEn.length > 0, 'Section must have English content array');
        assert.ok(section.contentZh.length > 0, 'Section must have Chinese content array');
        // Ensure English title does not contain Chinese characters
        assert.ok(!/[\u4e00-\u9fa5]/.test(section.title), `English title "${section.title}" must not contain Chinese characters`);
        // Ensure Chinese title contains Traditional Chinese characters
        assert.ok(/[\u4e00-\u9fa5]/.test(section.titleZh), `Chinese title "${section.titleZh}" must contain Chinese characters`);
      }
    });

    it('should always provide English text before Chinese in Terms of Service sections', () => {
      for (const section of TERMS_OF_SERVICE.sections) {
        assert.ok(section.title.length > 0, 'Section must have English title');
        assert.ok(section.titleZh.length > 0, 'Section must have Chinese title');
        assert.ok(section.contentEn.length > 0, 'Section must have English content array');
        assert.ok(section.contentZh.length > 0, 'Section must have Chinese content array');
        assert.ok(!/[\u4e00-\u9fa5]/.test(section.title), `English title "${section.title}" must not contain Chinese characters`);
        assert.ok(/[\u4e00-\u9fa5]/.test(section.titleZh), `Chinese title "${section.titleZh}" must contain Chinese characters`);
      }
    });

    it('should have bilingual pairs for all summary points', () => {
      for (const pt of PRIVACY_POLICY.summaryPoints) {
        assert.ok(pt.en.length > 0 && !/[\u4e00-\u9fa5]/.test(pt.en));
        assert.ok(pt.zh.length > 0 && /[\u4e00-\u9fa5]/.test(pt.zh));
      }
      for (const pt of TERMS_OF_SERVICE.summaryPoints) {
        assert.ok(pt.en.length > 0 && !/[\u4e00-\u9fa5]/.test(pt.en));
        assert.ok(pt.zh.length > 0 && /[\u4e00-\u9fa5]/.test(pt.zh));
      }
    });
  });

  describe('4. Static HTML Files & Production Distribution Integrity', () => {
    it('should contain valid public/privacy.html and public/terms.html files', () => {
      const publicPrivacy = path.join(rootDir, 'public/privacy.html');
      const publicTerms = path.join(rootDir, 'public/terms.html');

      assert.ok(fs.existsSync(publicPrivacy), 'public/privacy.html must exist');
      assert.ok(fs.existsSync(publicTerms), 'public/terms.html must exist');

      const privacyHtml = fs.readFileSync(publicPrivacy, 'utf8');
      const termsHtml = fs.readFileSync(publicTerms, 'utf8');

      assert.ok(privacyHtml.includes('Privacy Policy'), 'privacy.html must contain Privacy Policy header');
      assert.ok(privacyHtml.includes('Zero Data Collection'), 'privacy.html must declare Zero Data Collection');
      assert.ok(privacyHtml.includes('GitHub Pages'), 'privacy.html must reference GitHub Pages');
      assert.ok(privacyHtml.includes('terms.html'), 'privacy.html must link to terms.html');

      assert.ok(termsHtml.includes('Terms of Service'), 'terms.html must contain Terms of Service header');
      assert.ok(termsHtml.includes('STRICT MEDICAL & CLINICAL DISCLAIMER'), 'terms.html must contain Medical Disclaimer');
      assert.ok(termsHtml.includes('STRICT EMERGENCY & LIFE SAFETY DISCLAIMER'), 'terms.html must contain Emergency Disclaimer');
      assert.ok(termsHtml.includes('privacy.html'), 'terms.html must link to privacy.html');
    });

    it('should contain valid root privacy.html and root terms.html for GitHub Pages direct routing', () => {
      const rootPrivacy = path.join(rootDir, 'privacy.html');
      const rootTerms = path.join(rootDir, 'terms.html');

      assert.ok(fs.existsSync(rootPrivacy), 'root privacy.html must exist');
      assert.ok(fs.existsSync(rootTerms), 'root terms.html must exist');

      const privacyHtml = fs.readFileSync(rootPrivacy, 'utf8');
      const termsHtml = fs.readFileSync(rootTerms, 'utf8');

      assert.ok(privacyHtml.length > 5000, 'privacy.html must be a comprehensive standalone page');
      assert.ok(termsHtml.length > 5000, 'terms.html must be a comprehensive standalone page');
    });

    it('should verify dist/ bundle contains privacy.html and terms.html if built', () => {
      const distDir = path.join(rootDir, 'dist');
      if (fs.existsSync(distDir)) {
        const distPrivacy = path.join(distDir, 'privacy.html');
        const distTerms = path.join(distDir, 'terms.html');
        assert.ok(fs.existsSync(distPrivacy), 'dist/privacy.html must exist in production build');
        assert.ok(fs.existsSync(distTerms), 'dist/terms.html must exist in production build');
      }
    });
  });

  describe('5. Offline Service Worker Precache Configuration', () => {
    it('should include privacy.html and terms.html in sw.js PRECACHE_ASSETS', () => {
      const swPath = path.join(rootDir, 'sw.js');
      assert.ok(fs.existsSync(swPath), 'sw.js must exist');
      const swContent = fs.readFileSync(swPath, 'utf8');
      assert.ok(swContent.includes('./privacy.html'), 'sw.js PRECACHE_ASSETS must contain ./privacy.html');
      assert.ok(swContent.includes('./terms.html'), 'sw.js PRECACHE_ASSETS must contain ./terms.html');
    });

    it('should include privacy.html and terms.html in public/sw.js PRECACHE_ASSETS', () => {
      const pubSwPath = path.join(rootDir, 'public/sw.js');
      assert.ok(fs.existsSync(pubSwPath), 'public/sw.js must exist');
      const pubSwContent = fs.readFileSync(pubSwPath, 'utf8');
      assert.ok(pubSwContent.includes('./privacy.html'), 'public/sw.js PRECACHE_ASSETS must contain ./privacy.html');
      assert.ok(pubSwContent.includes('./terms.html'), 'public/sw.js PRECACHE_ASSETS must contain ./terms.html');
    });
  });
});
