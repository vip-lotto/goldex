let socket = null;

let listeners = [];

export function connectMarketSocket() {

  if (socket) return;

  socket = new WebSocket(
    "wss://stream.binance.com:9443/ws/!ticker@arr"
  );

  socket.onopen = () => {

    console.log("✅ Binance Connected");

  };

  socket.onmessage = (event) => {

    const tickers = JSON.parse(event.data);

    listeners.forEach((callback) => {

      callback(tickers);

    });

  };

  socket.onerror = (err) => {

    console.error(err);

  };

  socket.onclose = () => {

    console.log("Socket Closed");

    socket = null;

  };

}

export function subscribeMarket(callback) {

  listeners.push(callback);

}

export function unsubscribeMarket(callback) {

  listeners = listeners.filter(
    (item) => item !== callback
  );

}