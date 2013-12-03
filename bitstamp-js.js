/*

Depends:
* jssha256.js
* jquery.js

Usage:
var bitstamp = new Bitstamp('clientid', 'apikey', 'apisecret');
bitstamp.submitRequest(bitstamp.methods.ticker, function(data){console.log(data);} );
bitstamp.submitRequest(bitstamp.methods.cancelorder, function(data){console.log(data);}, {id: 1} );

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
        params: ['key', 'signature', 'nonce', 'offest', 'limit', 'sort']
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
        endpoint: '/api/buy/',
        method: 'POST',
        params: ['key', 'signature', 'nonce', 'price', 'amount']
    },
    ordersell: {
        endpoint: '/api/sell/',
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

Bitstamp.prototype.submitRequest = function(bitstampmethod, callback, params) {
  if (!params)
    params = {};

  if ($.inArray('signature', bitstampmethod.params) > -1 && !('signature' in bitstampmethod.params) ) {
    console.log('Signature required but not in supplied params');

    unix_timestamp = Math.round(+new Date() / 1000);
    message = unix_timestamp.toString() + this.auth.client_id + this.auth.api_key;
    signature = HMAC_SHA256_MAC(this.auth.api_secret, message).toUpperCase();

    params.key = this.auth.api_key;
    params.signature = signature;
    params.nonce = unix_timestamp;
  }

  for (var param in params) {
    if (typeof params[param] === 'undefined') {
      delete params[param];
    } else {
      params[param] = params[param].toString();
    }
  }

  console.log('Submitting request');

  var that = this;
  $.ajax({
    type: bitstampmethod.method,
    url: this.host + bitstampmethod.endpoint,
    data: params,
    success: function(data, textStatus, jqXHR){that.parseResponse(data, callback);},
    error: function(jqXHR, textStatus, errorThrown){that.handleError(textStatus, errorThrown, callback);},
    timeout: 30000,
    dataType: 'json'
  });

  return params;
}

Bitstamp.prototype.handleError = function(textStatus, errorThrown, callback) {
    var data = {};
    data.error = 'Error with request: ' + errorThrown;
    this.parseResponse(data, callback);
}

Bitstamp.prototype.parseResponse = function(data, callback) {
  console.log('Response returned');
  console.log(data);

  var returnval = {};

  if ('error' in data) {
    var errorstring = '';
    if (typeof data.error === 'string') {
      errorstring = data.error;
    } else {
      for (var key in data.error) {
        errorstring += data.error[key] + '\n';
      }
    }
    returnval.error = errorstring;
  } else {
    returnval.data = data;
  }
  callback(returnval);
}
