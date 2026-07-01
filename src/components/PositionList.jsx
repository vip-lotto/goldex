import React from "react";

export default function PositionList() {

    const positions = [

        {
            pair:"XAU/USD",
            side:"BUY",
            entry:"3350.22",
            mark:"3354.23",
            pnl:"+40.15",
            leverage:"20x",
            margin:"50 USDT"
        },

        {
            pair:"BTC/USDT",
            side:"SELL",
            entry:"106250",
            mark:"106020",
            pnl:"+125.40",
            leverage:"10x",
            margin:"120 USDT"
        }

    ];

    return (

        <div className="position card">

            <div className="position-header">

                <h3>Open Positions</h3>

                <span>2 Positions</span>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Pair</th>

                        <th>Side</th>

                        <th>Entry</th>

                        <th>Mark</th>

                        <th>Leverage</th>

                        <th>Margin</th>

                        <th>PNL</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {

                        positions.map((item,index)=>(

                            <tr key={index}>

                                <td>{item.pair}</td>

                                <td>

                                    <span
                                        className={
                                            item.side==="BUY"
                                            ?"buy-tag"
                                            :"sell-tag"
                                        }
                                    >
                                        {item.side}
                                    </span>

                                </td>

                                <td>{item.entry}</td>

                                <td>{item.mark}</td>

                                <td>{item.leverage}</td>

                                <td>{item.margin}</td>

                                <td className="profit">

                                    {item.pnl}

                                </td>

                                <td>

                                    <button className="close-btn">

                                        Close

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}