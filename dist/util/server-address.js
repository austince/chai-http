"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
function serverAddress(app, path) {
    if ('string' === typeof app) {
        return app + path;
    }
    const addr = app.address();
    if (!addr) {
        throw new Error('Server is not listening');
    }
    const protocol = (app instanceof https.Server) ? 'https' : 'http';
    if (addr.address === '0.0.0.0' || addr.address === '::') {
        addr.address = '127.0.0.1';
    }
    return `${protocol}://${addr.address}:${addr.port}${path}`;
}
exports.default = serverAddress;
//# sourceMappingURL=server-address.js.map