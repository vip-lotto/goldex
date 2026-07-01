import "./Toast.css";

export default function Toast({
show,
message,
type = "success"
}) {

if (!show) return null;

return ( <div className="toast">


  <div
    className={`toast-content ${type}`}
  >

    <div className="toast-icon">

      {type === "success"
        ? "✓"
        : "!"}

    </div>

    <div className="toast-text">
      {message}
    </div>

  </div>

</div>


);
}
