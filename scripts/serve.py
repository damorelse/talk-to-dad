#!/usr/bin/env python3
"""
TalkWithDad AAC PWA Local Server
Serves the production build from dist/ with proper MIME types, CORS, and SPA fallback.
"""

import http.server
import socketserver
import os
import sys
import mimetypes

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('application/manifest+json', '.webmanifest')

class SPAServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_GET(self):
        # SPA routing: if path doesn't exist, serve index.html
        path = self.translate_path(self.path)
        if not os.path.exists(path) and '.' not in os.path.basename(self.path):
            self.path = '/index.html'
        return super().do_GET()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    with ThreadingTCPServer(('0.0.0.0', PORT), SPAServerHandler) as httpd:
        print(f"TalkWithDad AAC server listening at http://0.0.0.0:{PORT} (serving {DIRECTORY})")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
