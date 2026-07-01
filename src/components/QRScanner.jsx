import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({
  onScan,
  onClose
}) {

  useEffect(() => {

    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250
        },
        false
      );

    scanner.render(

      (decodedText) => {

        onScan(decodedText);

        scanner.clear();

      },

      () => {}
    );

    return () => {

      scanner.clear()
      .catch(()=>{});

    };

  }, []);

  return (

    <div
      style={{
        position:"fixed",
        inset:0,
        background:"#000000dd",
        zIndex:9999,
        padding:"20px"
      }}
    >

      <button
        onClick={onClose}
        style={{
          marginBottom:"15px"
        }}
      >
        ปิด
      </button>

      <div id="reader" />

    </div>

  );

}