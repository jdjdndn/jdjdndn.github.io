const s=(e,t=150)=>{let r;return(...n)=>{clearTimeout(r),r=setTimeout(()=>e(...n),t)}},o=e=>e?new Date(e)<new Date:!1;export{s as d,o as i};
