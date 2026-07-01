import axios from "axios";

const API_KEY = "ใส่_API_KEY_ของคุณ";

export async function getGoldPrice() {
  const res = await axios.get(
    `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU`
  );

  const xau = res.data.rates.XAU;

  // แปลงเป็นราคาทองต่อออนซ์โดยประมาณ
  const price = 1 / xau;

  return {
    price,
    high: price,
    low: price,
    volume: 0,
    change: 0,
  };
}