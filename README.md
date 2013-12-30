# bitstamp-js

A JavaScript library for accessing Bitstamp's REST API.

bitstamp-js provides an interface to Bitstamp's REST API that runs in the browser. You must include all dependencies, for example `<script src="hmac-sha256.js" type="text/javascript"></script>`. To access Bitstamp through bitstamp-js, instantiate a new Bitstamp object with the Bitstamp credentials and interact with it through submitRequest(). submitRequest() takes a particular method as defined in Bitstamp.methods (see bitstamp.js for full list). These objects defines the endpoints, methods, and parameters for accessing the endpoint. If a particular method requires authentication, bitstamp-js will lazily add it if missing. Other parameters may be optional or required by Bitstamp.

A working test suite is included to debug the input/output. Run index.html in your browser, which makes use of test.js. This is a good starting place to understand how to interact with the API calls using input supplied from the user (just set your authentication info). Most of the wrapper functions don't require extra parameters, so a lazy call as this often works without further tweaking (where doStuff is a function defined to handle the )
`inputparams = bitstamp.submitRequest(bitstamp.methods.balance, debugResponse);`

To execute your own request function (for example to work around [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues), simply override `bitstamp.requestFunction`. For example: `bitstamp.requestFunction = function(xhrParams){ $.ajax(xhrParams) }`. The parameter names are identical to jQuery's.


## Depends
* hmac-sha256.js (https://code.google.com/p/crypto-js/downloads/list)
* jquery.js (http://jquery.com/download/)

## Usage
```
var bitstamp = new Bitstamp('clientid', 'apikey', 'apisecret');
bitstamp.submitRequest(bitstamp.methods.ticker, debugResponse ); // lazy function pointer when extra no params are required
bitstamp.submitRequest(bitstamp.methods.cancelorder, {id: 1}, function(data){console.log(data);} ); // where the order id = 1
```
