import marketData from "../data/marketData";


const BINANCE_URL =
"https://api.binance.com/api/v3/ticker/24hr";


export async function getMarkets() {

try {


const res = await fetch(BINANCE_URL);

const binance = await res.json();



const markets = marketData.map((item)=>{


const ticker = binance.find(
(x)=>x.symbol === item.code
);



if(ticker){

return {

...item,

price:Number(ticker.lastPrice),

change:Number(
ticker.priceChangePercent
),

status:"online"

};

}



return {

...item,

price:item.price ?? 0,

change:item.change ?? 0,

status:"online"

};


});


return markets;



}catch(err){

console.error(
"Market API Error:",
err
);


return marketData.map(item=>({

...item,

price:0,

change:0,

status:"offline"

}));

}


}