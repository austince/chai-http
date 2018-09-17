import 'isomorphic-fetch';
import assignURL from './util/assign-url';
import serverAddress from './util/server-address';

Object.entries = (obj: object):  IterableIterator<Array<[string, any]>> => {
  return {
    [Symbol.iterator](),
    next() => [],
  }
};

const shortHandTypes = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

interface FluentRequestInit extends RequestInit {
  url?: string;
}


export default class FluentRequest extends Request {
  app: boolean|Function;

  constructor(app, initOptions: FluentRequestInit = {}) {
    let url = app
    if (typeof app === 'function') {
      url = initOptions.url || serverAddress(app)
    } else {
      app = false
    }
    super(url, initOptions)
  }

  clone(overrides: FluentRequestInit = {}) {
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
    }, overrides)
    return new FluentRequest(this.app || this.url, initOptions)
  }

  get(pathname) {
    return this.clone({
      method: 'GET',
      url: assignURL(this.url, {pathname})
    })
  }

  put(pathname) {
    return this.clone({
      method: 'PUT',
      url: assignURL(this.url, {pathname})
    })
  }

  post(pathname) {
    return this.clone({
      method: 'POST',
      url: assignURL(this.url, {pathname})
    })
  }

  delete(pathname) {
    return this.clone({
      method: 'DELETE',
      url: assignURL(this.url, {pathname})
    })
  }

  head(pathname) {
    return this.clone({
      method: 'HEAD',
      url: assignURL(this.url, {pathname})
    })
  }

  
  set(key: object|string, value) {
    if (typeof key === 'object') {
      for(const [objKey, value] of Object.entries(key)) {
        this.headers.set(objKey, value)
      return this
    }
    this.headers.set(key, value)
    return this
  }

  type(type: string) {
    this.set('Content-Type', shortHandTypes[type] || type)
    return this
  }

  accept(type: string) {
    this.set('Accept', shortHandTypes[type] || type)
    return this
  }

  query(query) {
    query = new URLSearchParams(query)
    const {searchParams} = new URL(this.url)
    for (let [key, value] of query) {
      searchParams.set(key, value)
    }
    this.url = assignURL(this.url, {searchParams})
    return this
  }

  sortQuery() {
    // todo
  }

  redirects(count) {
    // todo
  }

  auth() {
    // todo
  }

  withCredentials() {
    // todo
  }

  retry() {
    // todo
  }

  ok() {
    // todo
  }

  timeout() {
    // todo
  }

  buffer() {
    // todo
  }

  serialize() {
    // todo
  }

  parse() {
    // todo
  }

  ca() {
    // todo
  }

  key() {
    // todo
  }

  pfx() {
    // todo
  }

  cert() {
    // todo
  }


  then(resolve, reject) {
    return fetch(this).then(resolve, reject)
  }

  end(resolve, reject) {
    return fetch(this).then(resolve, reject)
  }

}