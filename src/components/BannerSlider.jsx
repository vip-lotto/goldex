import { useEffect, useState } from "react";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

export default function BannerSlider() {

  const banners = [
    banner1,
    banner2,
    banner3
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) =>
        (prev + 1) % banners.length
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner">
      <img
        src={banners[index]}
        alt=""
        className="banner-image"
      />
    </div>
  );
}