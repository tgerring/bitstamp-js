var bitstamp = new Bitstamp('clientid', 'api_key', 'api_secret');

function displayInputParams(params) {
  $('#params').val(JSON.stringify(params));
}

function debugResponse(response) {
  if ('error' in response) {
    $('#response').val(response.error);
  } else if ('data' in response) {
    $('#response').val(JSON.stringify(response.data));
  } else {
    $('#response').val('Unknown error');
  }
}

function getTicker() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.ticker, debugResponse);
  displayInputParams(params);
}

function getOrderBook() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.orderbook, debugResponse);
  displayInputParams(params);
}

function getTransactions(group) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.transactions, debugResponse, {group: group});
  displayInputParams(params);
}

function getEurUsdRate() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.eurusd, debugResponse);
  displayInputParams(params);
}

function getBalance() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.balance, debugResponse);
  displayInputParams(params);
}

function getUserTransactions(offset, limit, sort) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.usertransactions, debugResponse, {offset: offset, limit: limit, sort: sort});
  displayInputParams(params);
}

function getOpenOrders() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.openorders, debugResponse);
  displayInputParams(params);
}

function cancelOrder(orderid) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.cancelorder, debugResponse, {id: orderid});
  displayInputParams(params);
}

function orderBuy(currency_pair, amount, price) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.orderbuy, {currency_pair: currency_pair, amount: amount, price: price});
  displayInputParams(params);
}

function orderSell(currency_pair, amount, price) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.ordersell, {currency_pair, amount:amount, price: price});
  displayInputParams(params);
}

function withdrawalRequest() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.withdrawalrequests, debugResponse);
  displayInputParams(params);
}

function bitcoinWithdrawal(amount, address) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.btcwithdrawal, debugResponse, {amount: amount, address: address});
  displayInputParams(params);
}

function getBitcoinDepositAddress() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.btcdepositaddress, debugResponse);
  displayInputParams(params);
}

function listUnconfirmedBitcoinTransactions() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.unconfirmedbtc, debugResponse);
  displayInputParams(params);
}

function rippleWithdrawal(amount, address, currency) {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.ripplewithdrawal, debugResponse, {amount: amount, address: address, currency: currency});
  displayInputParams(params);
}

function getRippleDepositAddress() {
  $('#response').val('');
  params = bitstamp.submitRequest(bitstamp.methods.rippledepositaddress, debugResponse);
  displayInputParams(params);
}
