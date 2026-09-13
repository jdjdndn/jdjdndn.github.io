import"./style-CZHMfpG_.js";const s="/api/coupons",u=document.querySelector("#search-input"),E=document.querySelector("#add-btn"),r=document.querySelector("#modal-overlay"),w=document.querySelector("#modal-title"),k=document.querySelector("#coupon-form"),h=document.querySelector("#coupon-id"),f=document.querySelector("#title"),L=document.querySelector("#code"),$=document.querySelector("#expireAt"),g=document.querySelector("#link"),q=document.querySelector("#cancel-btn"),p=document.querySelector("#table-section"),x=document.querySelector("#count-text"),y=()=>JSON.parse(localStorage.getItem("coupons")||"[]"),m=e=>localStorage.setItem("coupons",JSON.stringify(e)),v=async()=>{try{return(await fetch(s,{method:"GET"})).ok}catch{return!1}},I=async()=>await v()?(await fetch(s)).json():y(),N=e=>{if(!e)return"未设置";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString("zh-CN")},i=e=>{const t=document.createElement("div");return t.textContent=e,t.innerHTML};let c=[];const T=(e="")=>{const t=e.trim().toLowerCase(),o=t?c.filter(n=>n.title.toLowerCase().includes(t)||n.code.toLowerCase().includes(t)):c;if(x.textContent=`共 ${o.length} 条`+(t?`（筛选自 ${c.length} 条）`:""),!o.length){p.innerHTML=`<div class="empty-msg">${t?"没有匹配的优惠券":"暂无优惠券，点击「新增优惠券」添加"}</div>`;return}p.innerHTML=`
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>标题</th>
          <th>优惠码</th>
          <th>有效期</th>
          <th>链接</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${o.map((n,a)=>`
          <tr>
            <td>${a+1}</td>
            <td>${i(n.title)}</td>
            <td><span class="code-cell">${i(n.code)}</span></td>
            <td>${N(n.expireAt)}</td>
            <td class="link-cell"><a href="${i(n.link)}" target="_blank" rel="noopener">${i(n.link)}</a></td>
            <td class="actions-cell">
              <button class="secondary" data-action="edit" data-id="${n.id}">编辑</button>
              <button class="secondary" data-action="delete" data-id="${n.id}">删除</button>
              <button class="primary" data-action="open" data-link="${i(n.link)}">访问</button>
            </td>
          </tr>`).join("")}
      </tbody>
    </table>
  `},b=async()=>{c=await I(),T(u.value)},C=(e="新增优惠券")=>{w.textContent=e,r.classList.remove("hidden"),f.focus()},l=()=>{k.reset(),h.value="",r.classList.add("hidden")},A=()=>{C("新增优惠券")},D=e=>{const t=c.find(o=>o.id===e);t&&(w.textContent="编辑优惠券",h.value=t.id,f.value=t.title,L.value=t.code,$.value=t.expireAt,g.value=t.link,C("编辑优惠券"))},O=async e=>{e.preventDefault();const t={title:f.value.trim(),code:L.value.trim(),expireAt:$.value,link:g.value.trim()},o=h.value;if(await v())o?await fetch(`${s}/${o}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}):await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});else{const n=y();if(o){const a=n.map(d=>d.id===o?{...d,...t}:d);m(a)}else n.push({id:String(Date.now()),...t}),m(n)}l(),await b()},M=async e=>{const t=c.find(n=>n.id===e);if(window.confirm(`确认删除「${t?t.title:""}」吗？`)){if(await v())await fetch(`${s}/${e}`,{method:"DELETE"});else{const n=y().filter(a=>a.id!==e);m(n)}await b()}};E.addEventListener("click",A);q.addEventListener("click",l);k.addEventListener("submit",O);r.addEventListener("click",e=>{e.target===r&&l()});document.addEventListener("keydown",e=>{e.key==="Escape"&&!r.classList.contains("hidden")&&l()});let S=null;u.addEventListener("input",()=>{clearTimeout(S),S=setTimeout(()=>T(u.value),200)});p.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const{action:o,id:n,link:a}=t.dataset;o==="edit"?D(n):o==="delete"?M(n):o==="open"&&a&&window.open(a,"_blank","noopener")});b();
