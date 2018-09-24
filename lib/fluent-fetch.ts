import 'isomorphic-fetch';
import assignURL from './util/assign-url';
import serverAddress from './util/server-address';

if (typeof URLSearchParams === 'undefined') {
  // Node 
  const { URL, URLSearchParams } = require('url')
}

if (!Object.entries) {
  Object.defineProperty(Object, 'entries', function(obj){
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
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

interface FluentRequestInit extends RequestInit {
  url?: string;
}


export default class FluentRequest extends Request {
  app: boolean|Function;
  url: string;
  body: ReadableStream;
  credentials: RequestCredentials

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

  get(pathname: string) {
    return this.clone({
      method: 'GET',
      url: assignURL(this.url, {pathname})
    })
  }

  put(pathname: string) {
    return this.clone({
      method: 'PUT',
      url: assignURL(this.url, {pathname})
    })
  }

  post(pathname: string) {
    return this.clone({
      method: 'POST',
      url: assignURL(this.url, {pathname})
    })
  }

  delete(pathname: string) {
    return this.clone({
      method: 'DELETE',
      url: assignURL(this.url, {pathname})
    })
  }

  head(pathname: string) {
    return this.clone({
      method: 'HEAD',
      url: assignURL(this.url, {pathname})
    })
  }

  
  set(key: object|string, value) {
    if (typeof key === 'object') {
      for(const [objKey, value] of Object.entries(key)) {
        this.headers.set(objKey, value)
      }
    } else if (typeof key === 'string') {
      this.headers.set(key, value)
    }
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

  query(query: string[][] | Record<string, string> | string | URLSearchParams) {
    const queryParams = new URLSearchParams(query)
    const {searchParams} = new URL(this.url)
    for (const [key, value] of queryParams) {
      searchParams.set(key, value)
    }
    this.url = assignURL(this.url, {searchParams})
    return this
  }

  // Breaking change from the SuperAgent api
  // Sort comparitor takes two tuples of form [param, value]
  sortQuery(comparitor?: (a: [string, string], b: [string, string]) => boolean) {
    const {searchParams} = new URL(this.url)
    const queryArr = Array.from(searchParams)
    if (comparitor) {
      queryArr.sort(comparitor)
    } else {
      queryArr.sort()
    }
    const sortedParams = new URLSearchParams(queryArr)
    this.url = assignURL(this.url, {searchParams})
    return this
  }

  redirects(count: number) {
    // todo
  }

  // Breaking: currently only supports basic auth
  auth(username: string, password: string) {
    const auth = `${username}:${password}`;
    const basicAuth = `Basic ${Buffer.from(auth).toString('base64')}`;
    return this.set('Authorization', basicAuth)
  }

  withCredentials() {
    this.credentials = 'include'
    return this
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


  send(data: string|object) {
    // todo: Handle things like FormData
    if (typeof data === 'string') {
      this.type(shortHandTypes.urlencoded)
    } else {
      // Default to json
      this.type(shortHandTypes.json)
    }

    // Either overwrite or append to the body
    if (typeof this.body === 'string') {
      // Concatenate form data
      data = this.body + '&'
    } else if (typeof this.body === 'object') {
      data = Object.assign(this.body, data)
    }

    this.body = data as ReadableStream

    return this
  }


  then(resolve, reject) {
    return fetch(this).then(resolve, reject)
  }

  end(resolve, reject) {
    return fetch(this).then(resolve, reject)
  }
}