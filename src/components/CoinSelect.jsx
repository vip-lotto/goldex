import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CoinSelect({
    coins,
    value,
    onChange
}) {

    const [open, setOpen] = useState(false);

    return (

        <div className="coin-select">

            <div
    className="coin-selected"
    onClick={() => setOpen(!open)}
>

    <div className="coin-left">

        <img
    src={`/coins/${value.symbol.toLowerCase()}.png`}
    alt=""
    className="coin-logo"
/>

        <span>{value.symbol}</span>

    </div>

    <ChevronDown
    size={18}
    className={`coin-arrow ${open ? "rotate" : ""}`}
    />

</div>

            {

                open && (

                    <div className="coin-menu">

                        {

                            coins.map((coin)=>(

                                <div

                                    key={coin.symbol}

                                    className="coin-item"

                                    onClick={()=>{

                                        onChange(coin.symbol);

                                        setOpen(false);

                                    }}

                                >

                                    <img
                                        src={`/coins/${coin.symbol.toLowerCase()}.png`}
                                        alt=""
                                    />

                                    <span>

                                        {coin.symbol}

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}