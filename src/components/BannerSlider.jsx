import { useEffect, useState } from "react";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

export default function BannerSlider(){

    const banners=[
        banner1,
        banner2,
        banner3
    ];

    const [index,setIndex]=useState(0);

    useEffect(()=>{

        const timer=setInterval(()=>{

            setIndex(prev=>(prev+1)%banners.length);

        },3000);

        return()=>clearInterval(timer);

    },[]);

    return(

        <div className="banner">

            <div
                className="banner-track"
                style={{
                    transform:`translateX(-${index*100}%)`
                }}
            >

                {banners.map((img,i)=>(

                    <div
                        className="banner-slide"
                        key={i}
                    >

                        <img
                            src={img}
                            alt=""
                            className="banner-image"
                        />

                    </div>

                ))}

            </div>

            <div className="banner-dots">

                {banners.map((_,i)=>

                    <span
                        key={i}
                        className={
                            index===i
                            ? "banner-dot active"
                            : "banner-dot"
                        }
                    />

                )}

            </div>

        </div>

    );

}