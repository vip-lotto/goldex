import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode
} from "html5-qrcode";
import jsQR from "jsqr";

export default function QRScanner({
  onScan,
  onClose
}) {

  const readerId = "goldex-reader";

  const scannerRef = useRef(null);

  const fileRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [cameraError, setCameraError] =
    useState("");

  const stopScanner =
    async () => {

      try {

        if (scannerRef.current) {

          await scannerRef.current.stop();

          await scannerRef.current.clear();

          scannerRef.current = null;

        }

      } catch {}

    };

  const normalizeAddress =
    (text) => {

      if (!text) return "";

      return text
        .trim()
        .replace(/^tron:/i, "")
        .replace(/^bitcoin:/i, "")
        .replace(/^ethereum:/i, "")
        .replace(/^usdt:/i, "")
        .replace(/^bitcoin=/i, "")
        .replace(/^ethereum=/i, "")
        .replace(/^tron=/i, "")
        .split("?")[0]
        .trim();

    };

  useEffect(() => {

    let mounted = true;

    async function startCamera() {

      try {

        const scanner =
          new Html5Qrcode(
            readerId
          );

        scannerRef.current =
          scanner;

        const cameras =
          await Html5Qrcode.getCameras();

        if (
          !cameras ||
          cameras.length === 0
        ) {

          setCameraError(
            "No camera found."
          );

          setLoading(false);

          return;

        }

        let cameraId =
          cameras[0].id;

        const back =
          cameras.find(c =>
            /back|rear|environment/i.test(
              c.label
            )
          );

        if (back)
          cameraId = back.id;

        await scanner.start(

          cameraId,

          {

            fps: 10,

            qrbox: {

              width: 260,

              height: 260

            }

          },

          async (
            decodedText
          ) => {

            const address =
              normalizeAddress(
                decodedText
              );

            await stopScanner();

            onScan(address);

          },

          () => {}

        );

        if (mounted)
          setLoading(false);

      } catch (err) {

        console.log(err);

        setCameraError(
          "Cannot open camera."
        );

        setLoading(false);

      }

    }

    startCamera();

    return () => {

      mounted = false;

      stopScanner();

    };

  }, []);

  const chooseImage =
    () => {

      fileRef.current?.click();

    };

  const readImage =
    async (file) => {

      if (!file) return;

      const img =
        new Image();

      img.onload = () => {

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          img.width;

        canvas.height =
          img.height;

        const ctx =
          canvas.getContext(
            "2d"
          );

        ctx.drawImage(
          img,
          0,
          0
        );

        const image =
          ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

        const code =
          jsQR(
            image.data,
            image.width,
            image.height
          );

        if (!code) {

          alert(
            "QR Code not found."
          );

          return;

        }

        const address =
          normalizeAddress(
            code.data
          );

        stopScanner();

        onScan(address);

      };

      img.src =
        URL.createObjectURL(
          file
        );

    };

      return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,10,20,.96)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#0b1626",
          border: "1px solid #1f4d8f",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,.45)"
        }}
      >

        <div
          style={{
            background:
              "linear-gradient(180deg,#18d8ff,#0b8fff)",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <div
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 700
            }}
          >
            Scan QR Code
          </div>

          <button
            onClick={async () => {

              await stopScanner();

              onClose();

            }}
            style={{
              background: "#fff",
              color: "#0b8fff",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Close
          </button>

        </div>

        <div
          style={{
            padding: 20
          }}
        >

          <div
            id={readerId}
            style={{
              width: "100%",
              minHeight: 320,
              borderRadius: 18,
              overflow: "hidden",
              background: "#111"
            }}
          />

          {loading && (

            <div
              style={{
                color: "#7fdfff",
                textAlign: "center",
                marginTop: 18
              }}
            >
              Opening Camera...
            </div>

          )}

          {cameraError && (

            <div
              style={{
                color: "#ff7d7d",
                textAlign: "center",
                marginTop: 18,
                fontSize: 15
              }}
            >
              {cameraError}
            </div>

          )}

          <button
            onClick={chooseImage}
            style={{
              marginTop: 25,
              width: "100%",
              height: 52,
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              background:
                "linear-gradient(180deg,#16d8ff,#1188ff)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700
            }}
          >
            🖼 Choose QR Image
          </button>

          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              readImage(
                e.target.files[0]
              )
            }
          />

          <div
            style={{
              marginTop: 20,
              color: "#8fa8c9",
              fontSize: 14,
              lineHeight: 1.7,
              textAlign: "center"
            }}
          >
             QR Code 
            <br />
            
          </div>

        </div>

      </div>

    </div>

  );

}