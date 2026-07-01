import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Filler,
Tooltip,
Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Filler,
Tooltip,
Legend
);

export default function GoldChart() {
const data = {
labels: [
"16 Jun",
"17 Jun",
"18 Jun",
"19 Jun",
"20 Jun",
"21 Jun",
"22 Jun",
],


datasets: [
  {
    label: "Gold",
    data: [
      4200,
      4240,
      4310,
      4185,
      4130,
      4140,
      4210,
    ],

    borderColor: "#D4AF37",
    backgroundColor:
      "rgba(212,175,55,.15)",

    fill: true,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2,
  },
],


};

const options = {
responsive: true,
maintainAspectRatio: false,


plugins: {
  legend: {
    display: false,
  },
},

scales: {
  x: {
    ticks: {
      color: "#999",
    },
    grid: {
      color:
        "rgba(255,255,255,.05)",
    },
  },

  y: {
    ticks: {
      color: "#999",
    },
    grid: {
      color:
        "rgba(255,255,255,.05)",
    },
  },
},


};

return ( <div className="gold-chart-card">


  <div className="gold-top">

    <div>
      <h3>XAU/USD</h3>
      <span>Gold Spot</span>
    </div>

    <div className="gold-price">
      $4,210.01
    </div>

  </div>

  <div className="gold-chart">

    <Line
      data={data}
      options={options}
    />

  </div>

</div>


);
}
