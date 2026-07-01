import React from "react";

export default function OrderHistory() {

    const orders = [

        {
            time:"2026-05-02 14:35",
            pair:"XAU/USD",
            type:"BUY",
            price:"3350.25",
            amount:"0.50",
            status:"Filled"
        },

        {
            time:"2026-05-02 14:10",
            pair:"XAU/USD",
            type:"SELL",
            price:"3348.60",
            amount:"0.20",
            status:"Filled"
        },

        {
            time:"2026-05-02 13:42",
            pair:"BTC/USDT",
            type:"BUY",
            price:"106240",
            amount:"0.01",
            status:"Pending"
        },

        {
            time:"2026-05-02 12:55",
            pair:"ETH/USDT",
            type:"SELL",
            price:"2485",
            amount:"0.80",
            status:"Cancelled"
        }

    ];

    return (

        <div className="history card">

            <div className="history-header">

                <h3>Order History</h3>

                <span>Recent Orders</span>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Time</th>
                        <th>Pair</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.map((item,index)=>(

                            <tr key={index}>

                                <td>{item.time}</td>

                                <td>{item.pair}</td>

                                <td>

                                    <span

                                        className={
                                            item.type==="BUY"
                                            ? "buy-tag"
                                            : "sell-tag"
                                        }

                                    >

                                        {item.type}

                                    </span>

                                </td>

                                <td>{item.price}</td>

                                <td>{item.amount}</td>

                                <td>

                                    <span

                                        className={

                                            item.status==="Filled"

                                            ? "status-filled"

                                            : item.status==="Pending"

                                            ? "status-pending"

                                            : "status-cancel"

                                        }

                                    >

                                        {item.status}

                                    </span>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}