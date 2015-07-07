/**
 * Hijacks the node https library and adds console logging to the request method
 *
 * Affects all https requires using the same require.cache
 */

var https = require('https')
var stringify = require('json-stringify-safe')
var _httpRequest = https.request
https.request = function (options, callback) {
  // Concatenate everything in a single string so output is always in order
  var out = ' --- HTTPS Request ---'
  out += '\n' + stringify(options, null, 2)
  var request = _httpRequest(options, function (res) {
    var response = ''
    res.on('data', function (d) {
      response += d
    })
    res.on('end', function () {
      out += '\n --- HTTPS Response ---'
      out += '\nstatus: ' + res.statusCode
      out += '\nheaders: ' + stringify(res.headers, null, 2)
      out += '\nbody: ' + response
      console.log(out)
    })
    callback(res)
  })
  // Hijack request body
  if (options.method === 'POST' || options.method === 'PUT') {
    out += '\nbody: '
    var _write = request.write
    request.write = function (chunk, encoding, callback) {
      out += chunk
      request.write = _write
      return request.write(chunk, encoding, callback)
    }
    var _end = request.end
    request.end = function (data, encoding, callback) {
      if (data) {
        out += data
      }
      request.end = _end
      return request.end(data, encoding, callback)
    }
  }
  return request
}
module.exports = https
