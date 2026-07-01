import { useState } from "react";

export default function TradeForm() {

  const tradeOptions = [
    {
      id: 1,
      minute: 6,
      payout: 15,
      minimum: 100,
    },
    {
      id: 2,
      minute: 5,
      payout: 20,
      minimum: 1000,
    },
    {
      id: 3,
      minute: 4,
      payout: 25,
      minimum: 5000,
    },
    {
      id: 4,
      minute: 3,
      payout: 30,
      minimum: 10000,
    },
    {
      id: 5,
      minute: 2,
      payout: 40,
      minimum: 30000,
    },
    {
      id: 6,
      minute: 1,
      payout: 60,
      minimum: 50000,
    },
  ];

  const [option, setOption] = useState(tradeOptions[0]);

  const [amount, setAmount] = useState("");

  const [side, setSide] = useState("BUY");

  const calculateProfit = () => {

    if (!amount) return 0;

    return (
      Number(amount) *
      option.payout /
      100
    );

  };

  const submitTrade = () => {

    if (Number(amount) < option.minimum) {

      alert(
        `Minimum ${option.minimum}$`
      );

      return;

    }

    alert(
      `${side}

Amount : ${amount}$

Time : ${option.minute} Minutes

Profit : ${calculateProfit()}$`
    );

  };

  return (

    <div className="trade-panel">

      <label>

        Trading Time

      </label>

      <select

        value={option.id}

        onChange={(e)=>{

          const item =
          tradeOptions.find(
            x=>x.id===Number(e.target.value)
          );

          setOption(item);

        }}

      >

        {tradeOptions.map(item=>(

          <option

            key={item.id}

            value={item.id}

          >

            {item.minute} Minutes

            (+{item.payout}%)

            Min ${item.minimum}

          </option>

        ))}

      </select>

      <label>

        Investment

      </label>

      <input

        type="number"

        placeholder="Amount"

        value={amount}

        onChange={(e)=>setAmount(e.target.value)}

      />

      <div className="trade-info">

        <p>

          Payout

          <span>

            +{option.payout}%

          </span>

        </p>

        <p>

          Minimum

          <span>

            ${option.minimum}

          </span>

        </p>

        <p>

          Profit

          <span>

            ${calculateProfit()}

          </span>

        </p>

      </div>

      <div className="trade-buttons">

        <button

          className="buy-btn"

          onClick={()=>{

            setSide("BUY");

            submitTrade();

          }}

        >

          BUY

        </button>

        <button

          className="sell-btn"

          onClick={()=>{

            setSide("SELL");

            submitTrade();

          }}

        >

          SELL

        </button>

      </div>

    </div>

  );

}