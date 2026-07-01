let socket = null;
let listeners = [];

export function connectMarketSocket() {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    return;
  }

  socket = new WebSocket(
    "wss://stream.binance.com:9443/ws/!ticker@arr"
  );

  socket.onopen = () => {
    console.log("✅ Binance Connected");
  };

  socket.onmessage = (event) => {
    try {
      const tickers = JSON.parse(event.data);

      listeners.forEach((callback) => {
        callback(tickers);
      });

    } catch (err) {
      console.error("Socket Parse Error", err);
    }
  };

  socket.onerror = (err) => {
    console.error("Socket Error", err);
  };

  socket.onclose = () => {
    console.log("❌ Binance Closed");

    socket = null;

    // reconnect หลัง 3 วินาที
    setTimeout(() => {
      connectMarketSocket();
    }, 3000);
  };
}

export function subscribeMarket(callback) {
  if (!listeners.includes(callback)) {
    listeners.push(callback);
  }
}

export function unsubscribeMarket(callback) {
  listeners = listeners.filter(
    (item) => item !== callback
  );
}