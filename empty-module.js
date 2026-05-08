// Stub module — used by Turbopack to satisfy pdfjs-dist's optional require('canvas')
// pdfjs-dist only needs canvas in Node.js server-side rendering contexts; in the browser
// it is always undefined, so this empty export is safe.
module.exports = {}
