'use strict';

const common = require('../common');
const assert = require('assert');
const h2 = require('http2');
const body =
  '<html><head></head><body><h1>this is some data</h2></body></html>';
const trailerKey = 'test-trailer';
const trailerValue = 'testing';

const server = h2.createServer();

// we use the lower-level API here
server.on('stream', common.mustCall(onStream));

function onStream(stream, headers, flags) {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.on('fetchTrailers', function(trailers) {
    trailers[trailerKey] = trailerValue;
  });
  stream.end(body);
}

server.listen(0);

server.on('listening', common.mustCall(function() {
  const client = h2.connect(`http://localhost:${this.address().port}`);
  const req = client.request({':path': '/'});
  req.on('data', common.mustCall());
  req.on('trailers', common.mustCall((headers) => {
    assert.strictEqual(headers[trailerKey], trailerValue);
    req.end();
  }));
  req.on('end', common.mustCall(() => {
    server.close();
    client.destroy();
  }));
  req.end();

}));

//The HEADERS frame starting the trailers header block has the END_STREAM flag set.
/**
 *
 */


//A sender must not generate a trailer that contains a field necessary for message framing (e.g., Transfer-Encoding and Content-Length), routing (e.g., Host), request modifiers (e.g., controls and conditionals in Section 5 of [RFC7231]), authentication (e.g., see [RFC7235] and [RFC6265]), response control data (e.g., see Section 7.1 of [RFC7231]), or determining how to process the payload (e.g., Content-Encoding, Content-Type, Content-Range, and Trailer).
/**
 * create response,
 * add valid trailers
 * everything is fine
 */

/**
 * create response
 * add invalid header (retrieve complete list of invalid ones)
 * get exception
 */

//can trailers be sent only if client accepts them in TE ?

