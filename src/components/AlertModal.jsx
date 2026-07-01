export default function AlertModal({
show,
title,
message,
onClose
}) {

if(!show) return null;

return (
<div
style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,0.65)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999,
backdropFilter:"blur(4px)"
}}
>
<div
style={{
width:"90%",
maxWidth:"380px",
background:"#111827",
borderRadius:"20px",
padding:"25px",
textAlign:"center",
border:"1px solid rgba(250,204,21,.3)",
boxShadow:
"0 0 30px rgba(250,204,21,.15)"
}}
>


    <div
      style={{
        width:"80px",
        height:"80px",
        margin:"0 auto 15px",
        borderRadius:"50%",
        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        fontSize:"38px",
        fontWeight:"bold",
        color:"#111827"
      }}
    >
      !
    </div>

    <h2
      style={{
        color:"#facc15",
        marginBottom:"10px"
      }}
    >
      {title}
    </h2>

    <p
      style={{
        color:"#d1d5db",
        lineHeight:"1.6",
        marginBottom:"20px"
      }}
    >
      {message}
    </p>

    <button
      onClick={onClose}
      style={{
        width:"100%",
        padding:"13px",
        border:"none",
        borderRadius:"12px",
        background:"#facc15",
        color:"#111827",
        fontWeight:"bold",
        cursor:"pointer",
        fontSize:"15px"
      }}
    >
      ตกลง
    </button>

  </div>
</div>


);
}
