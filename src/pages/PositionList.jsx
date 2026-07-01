// src/components/PositionList.jsx

import React from "react";

export default function PositionList({ positions = [] }) {
  if (!positions.length) {
    return (
      <div className="card">
        <h3>Open Positions</h3>
        <div className="empty">No Position</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Open Positions</h3>

      {positions.map((item) => (
        <div className="position-item" key={item.id}>
          <div className="position-left">
            <div className="position-symbol">
              {item.symbol}
            </div>

            <div className="position-type">
              {item.side.toUpperCase()}
            </div>
          </div>

          <div className="position-right">
            <div>
              ${item.amount}
            </div>

            <div
              className={
                item.pnl >= 0
                  ? "profit"
                  : "loss"
              }
            >
              {item.pnl >= 0 ? "+" : ""}
              ${item.pnl}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}