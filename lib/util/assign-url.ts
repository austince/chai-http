import { URL } from 'url';

/**
 * Build a URL from parts.
 */
export default (url: string, parts: Url): string => Object.assign(new URL(url), parts).toString()
