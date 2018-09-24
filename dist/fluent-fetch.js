"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
const assign_url_1 = require("./util/assign-url");
const server_address_1 = require("./util/server-address");
if (!Object.entries) {
    Object.defineProperty(Object, 'entries', function (obj) {
        var ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i);
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    });
}
const shortHandTypes = {
    html: 'text/html',
    json: 'application/json',
    xml: 'text/xml',
    urlencoded: 'application/x-www-form-urlencoded',
    form: 'application/x-www-form-urlencoded',
    'form-data': 'application/x-www-form-urlencoded'
};
class FluentRequest extends Request {
    constructor(app, initOptions = {}) {
        let url = app;
        if (typeof app === 'function') {
            url = initOptions.url || server_address_1.default(app);
        }
        else {
            app = false;
        }
        super(url, initOptions);
    }
    clone(overrides = {}) {
        const initOptions = Object.assign({
            method: this.method,
            headers: this.headers,
            body: this.body,
            mode: this.mode,
            credentials: this.credentials,
            cache: this.cache,
            redirect: this.redirect,
            referrer: this.referrer,
            integrity: this.integrity,
        }, overrides);
        return new FluentRequest(this.app || this.url, initOptions);
    }
    get(pathname) {
        return this.clone({
            method: 'GET',
            url: assign_url_1.default(this.url, { pathname })
        });
    }
    put(pathname) {
        return this.clone({
            method: 'PUT',
            url: assign_url_1.default(this.url, { pathname })
        });
    }
    post(pathname) {
        return this.clone({
            method: 'POST',
            url: assign_url_1.default(this.url, { pathname })
        });
    }
    delete(pathname) {
        return this.clone({
            method: 'DELETE',
            url: assign_url_1.default(this.url, { pathname })
        });
    }
    head(pathname) {
        return this.clone({
            method: 'HEAD',
            url: assign_url_1.default(this.url, { pathname })
        });
    }
    set(key, value) {
        if (typeof key === 'object') {
            for (const [objKey, value] of Object.entries(key)) {
                this.headers.set(objKey, value);
            }
        }
        else if (typeof key === 'string') {
            this.headers.set(key, value);
        }
        return this;
    }
    type(type) {
        this.set('Content-Type', shortHandTypes[type] || type);
        return this;
    }
    accept(type) {
        this.set('Accept', shortHandTypes[type] || type);
        return this;
    }
    query(query) {
        const queryParams = new URLSearchParams(query);
        const { searchParams } = new URL(this.url);
        for (const [key, value] of queryParams.entries()) {
            searchParams.set(key, value);
        }
        this.url = assign_url_1.default(this.url, { searchParams });
        return this;
    }
    sortQuery() {
        const parsedUrl = url.parse(this.url);
    }
    redirects(count) {
    }
    auth() {
    }
    withCredentials() {
    }
    retry() {
    }
    ok() {
    }
    timeout() {
    }
    buffer() {
    }
    serialize() {
    }
    parse() {
    }
    ca() {
    }
    key() {
    }
    pfx() {
    }
    cert() {
    }
    then(resolve, reject) {
        return fetch(this).then(resolve, reject);
    }
    end(resolve, reject) {
        return fetch(this).then(resolve, reject);
    }
}
exports.default = FluentRequest;
//# sourceMappingURL=fluent-fetch.js.map