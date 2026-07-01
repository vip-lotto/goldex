import React from "react";

export default function OrderBook() {

    const sellOrders = [
        {price:"3354.82", amount:"0.251"},
        {price:"3354.76", amount:"0.845"},
        {price:"3354.70", amount:"1.126"},
        {price:"3354.66", amount:"2.315"},
        {price:"3354.60", amount:"0.954"},
        {price:"3354.58", amount:"3.211"},
        {price:"3354.52", amount:"0.468"},
        {price:"3354.45", amount:"1.285"}
    ];

    const buyOrders = [
        {price:"3354.20", amount:"0.456"},
        {price:"3354.18", amount:"1.452"},
        {price:"3354.14", amount:"0.782"},
        {price:"3354.08", amount:"2.615"},
        {price:"3354.03", amount:"1.025"},
        {price:"3353.98", amount:"0.895"},
        {price:"3353.92", amount:"1.582"},
        {price:"3353.88", amount:"2.146"}
    ];

    return (

        <div className="orderbook card">

            <h3>Order Book</h3>

            <div className="orderbook-header">

                <span>Price</span>

                <span>Amount</span>

            </div>

            <div className="sell-list">

                {sellOrders.map((item,index)=>(
                    <div className="sell-row" key={index}>

                        <span className="sell-price">
                            {item.price}
                        </span>

                        <span>
                            {item.amount}
                        </span>

                    </div>
                ))}

            </div>

            <div className="current-price">

                3354.23

            </div>

            <div className="buy-list">

                {buyOrders.map((item,index)=>(
                    <div className="buy-row" key={index}>

                        <span className="buy-price">
                            {item.price}
                        </span>

                        <span>
                            {item.amount}
                        </span>

                    </div>
                ))}

            </div>

        </div>

    );

}