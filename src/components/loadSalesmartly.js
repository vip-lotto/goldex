let loaded = false;


export function openSalesmartly(){


  if(!loaded){

    const script = document.createElement("script");

    script.src =
    "https://plugin-code.salesmartly.com/js/project_643211_663506_1772776912.js";


    script.async = true;


    script.onload = ()=>{

      loaded = true;


      setTimeout(()=>{

        if(window.ssq){

          window.ssq("show");
          window.ssq("open");

        }

      },1000);


    };


    document.body.appendChild(script);


  }
  else{


    if(window.ssq){

      window.ssq("show");
      window.ssq("open");

    }


  }

}




export function closeSalesmartly(){

  if(window.ssq){

    window.ssq("hide");

  }


  document
  .querySelectorAll(
    '[id*="salesmartly"], iframe'
  )
  .forEach((el)=>{

    el.style.display="none";

  });


}