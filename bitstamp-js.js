/*
Depends:
* hmac-sha256.js (Google JS Crypto library)
* jquery.js

Usage:
// Instantiate
var bitstamp = new Bitstamp('clientid', 'apikey', 'apisecret');
// Call with no option parameters
bitstamp.submitRequest(bitstamp.methods.ticker, function(data){console.log(data);} );
// Call with extra parameters
bitstamp.submitRequest(bitstamp.methods.cancelorder, {id: 1}, function(data){console.log(data);} );
// Override REST call
bitstamp.requestFunction = function(xhrParams){ $.ajax(xhrParams) }
*/

Bitstamp = function(client_id, api_key, api_secret) {
  this.auth = {client_id: client_id, api_key: api_key, api_secret: api_secret};
  this.host = 'https://www.bitstamp.net';
  this.methods = {
    ticker: {
        endpoint: '/api/ticker/',
        method: 'GET'
    },
    orderbook: {
        endpoint: '/api/order_book/',
        method: 'GET',
        params: ['group']
    },
    transactions: {
        endpoint: '/api/transactions/',
        method: 'GET',
        params: ['time']
    },
    eurusd: {
        endpoint: '/api/eur_usd/',
        method: 'GET'
    },
    balance: {
        endpoint: '/api/balance/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    },
    usertransactions: {
        endpoint: '/api/user_transactions/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'offset', 'limit', 'sort']
    },
    openorders: {
        endpoint: '/api/open_orders/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    },
    cancelorder: {
        endpoint: '/api/cancel_order/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'id']
    },
    orderbuy: {
        endpoint: '/api/v2/buy/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'price', 'amount']
    },
    ordersell: {
        endpoint: '/api/v2/sell/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'price', 'amount']
    },
    withdrawalrequests: {
        endpoint: '/api/withdrawal_requests/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    },
    btcwithdrawal: {
        endpoint: '/api/bitcoin_withdrawal/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'amount', 'address']
    },
    btcdepositaddress: {
        endpoint: '/api/bitcoin_deposit_address/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    },
    unconfirmedbtc: {
        endpoint: '/api/unconfirmed_btc/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    },
    ripplewithdrawal: {
        endpoint: '/api/ripple_withdrawal/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'amount', 'address', 'currency']
    },
    rippledepositaddress: {
        endpoint: '/api/ripple_address/',
        method: 'POST',
        params: ['key', 'signature', 'nonce']
    }
  }
}

Bitstamp.prototype.submitRequest = function(bitstampmethod, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = {};
  }

  if ($.inArray('signature', bitstampmethod.params) > -1 && !('signature' in params) ) {
    console.log('Signature required but not in supplied params');

    unix_timestamp_ms = Math.round(+new Date());
    message = unix_timestamp_ms.toString() + this.auth.client_id + this.auth.api_key;

    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, this.auth.api_secret);
    hmac.update(message);
    var hash = hmac.finalize();
    signature = hash.toString().toUpperCase();
    
    params.key = this.auth.api_key;
    params.signature = signature;
    params.nonce = unix_timestamp_ms;
  }

  console.log(params);
  for (var param in params) {
    if (typeof params[param] === 'undefined') {
      delete params[param];
    } else {
      params[param] = params[param].toString();
    }
  }

  var currency_pair = '';
  if(params.currency_pair != undefined){
    alert('fsdf');
    currency_pair = params.currency_pair + '/';
    delete params.currency_pair;
  }

  console.log('Submitting request');
  

  var that = this;
  this.requestFunction({
    type: bitstampmethod.method,
    url: this.host + bitstampmethod.endpoint + currency_pair,
    data: params,
    success: function(data, textStatus, jqXHR){that.parseResponse(data, callback);},
    error: function(jqXHR, textStatus, errorThrown){that.handleError(textStatus, errorThrown, callback);},
    timeout: 30000,
    dataType: 'json'
  });

  return params;
}

Bitstamp.prototype.requestFunction = function(xhrParams) {
  console.log('requestFunction with params:');
  console.log(xhrParams);
  
  $.ajax(xhrParams);
}

Bitstamp.prototype.handleError = function(textStatus, errorThrown, callback) {
  console.log('Error returned');
  console.log(errorThrown);

  var data = {};
  data.error = 'Error with request: ' + errorThrown;
  this.parseResponse(data, callback);
}

Bitstamp.prototype.parseResponse = function(response, callback) {
  console.log('Response returned');
  console.log(response);

  var returnval = {};

  if (typeof response === 'object' && 'error' in response) {
    console.log('Error condition');
    var errorstring = '';
    if (typeof response.error === 'string') {
      errorstring = response.error;
    } else {
      for (var key in response.error) {
        errorstring += response.error[key] + "\n";
      }
    }
    returnval.error = errorstring;
  } else {
    returnval.data = response;
  }

  callback(returnval);
}
