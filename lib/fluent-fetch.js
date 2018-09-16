import {Headers, Request} fetch from 'isomorphic-fetch'
import {URL} from 'url'

const assignURL = (url, parts) => Object.assign(new URL(url), parts).toString()

shortHandTypes = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};


export default class FluentRequest extends Request {

  constructor(app, initOptions) {
    let url = app
    this.app = false
    if (typeof app === 'function') {
      this.app = app
      url = (initOptions || {}).url || serverAddress(app)
    }
    super(url, initOptions)
  }

  clone(overrides) {
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

  set(key, value) {
    if (typeof key === 'object') {
      for([key, value] of Object.entries(key)) this.headers.set(key, value)
      return this
    }
    this.headers.set(key, value)
    return this
  }

  type(type) {
    this.set('Content-Type', shortHandTypes[type] || type)
    return this
  }

  accept() {
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