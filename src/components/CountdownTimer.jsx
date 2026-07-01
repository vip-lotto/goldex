import { useEffect, useState } from "react";

export default function CountdownTimer({

  minutes = 1,

  onFinish,

}) {

  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {

    setTimeLeft(minutes * 60);

  }, [minutes]);

  useEffect(() => {

    if (timeLeft <= 0) {

      if (onFinish) {

        onFinish();

      }

      return;

    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, onFinish]);

  const minute = Math.floor(timeLeft / 60);

  const second = timeLeft % 60;

  const format = (value) => {

    return value.toString().padStart(2, "0");

  };

  const percent =

    ((minutes * 60 - timeLeft) /

      (minutes * 60)) *

    100;

  return (

    <div className="countdown-box">

      <h3>

        Trading Countdown

      </h3>

      <div className="countdown-time">

        {format(minute)}:{format(second)}

      </div>

      <div className="progress">

        <div

          className="progress-bar"

          style={{

            width: `${percent}%`,

          }}

        />

      </div>

      <p>

        Waiting for trade result...

      </p>

    </div>

  );

}