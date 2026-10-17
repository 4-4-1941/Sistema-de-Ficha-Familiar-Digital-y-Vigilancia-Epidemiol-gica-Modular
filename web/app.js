// Ficha Familiar Digital - banderas, vacunas y guardado cifrado
// Los datos se guardan solo en este dispositivo (localStorage). Nada se envia a servidores.
var KEY="ffd-proto-1",PERF=[["ENFERMERIA","Enfermería"],["NUTRICION","Nutrición"],["PSICOLOGIA","Psicología"],["MEDICINA","Medicina"]];
var H0={agua:"",san:"",comb:"",dorm:1,tratada:false,vect:false,mono:false};
var S={h:Object.assign({},H0),p:[],perfil:"ENFERMERIA"};
try{var j=localStorage.getItem(KEY);if(j)S=JSON.parse(j)}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var $=function(i){return document.getElementById(i)};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var L={LACTANTE:["Lactante (menor de 1 año)","a"],NINO_1_A_4:["Niño de 1 a 4 años","a"],NINO_5_A_11:["Niño de 5 a 11 años",""],ADOLESCENTE:["Adolescente","a"],JOVEN:["Joven",""],ADULTO:["Adulto",""],ADULTO_MAYOR:["Adulto mayor","a"],GESTANTE:["Gestante","r"],MADRE_LACTANTE:["Madre lactante","a"],CRONICO:["Crónico","a"],DISCAPACIDAD:["Discapacidad","a"],DESERCION_ESCOLAR:["Deserción escolar","r"],EDAD_FALTANTE:["Falta fecha de nacimiento","r"],HACINAMIENTO:["Hacinamiento","r"],AGUA_NO_SEGURA:["Agua no segura","r"],SIN_SANEAMIENTO:["Sin saneamiento","r"],HUMO:["Humo en la cocina","a"],VECTORIAL:["Riesgo vectorial","r"],MONOPARENTAL:["Monoparental","a"],VAC_PENDIENTE:["Vacunas pendientes","r"]};
function chips(a){return a.length?a.map(function(c){var l=L[c]||[c,""];return '<span class="f '+l[1]+'">'+l[0]+'</span>'}).join(""):'<span class="f v">Sin banderas</span>'}
function edad(f){if(!f)return null;var n=new Date(),b=new Date(f+"T00:00:00");var m=(n.getFullYear()-b.getFullYear())*12+n.getMonth()-b.getMonth();if(n.getDate()<b.getDate())m--;return m<0?null:{m:m,a:Math.floor(m/12)}}
function banP(p){var e=edad(p.fn),b=[];if(!e)return["EDAD_FALTANTE"];var a=e.a;
b.push(a<1?"LACTANTE":a<=4?"NINO_1_A_4":a<=11?"NINO_5_A_11":a<=17?"ADOLESCENTE":a<=29?"JOVEN":a<=59?"ADULTO":"ADULTO_MAYOR");
if(a>=3&&a<=17&&p.esc)b.push("DESERCION_ESCOLAR");if(p.ges)b.push("GESTANTE");if(p.lac)b.push("MADRE_LACTANTE");if(p.cro)b.push("CRONICO");if(p.dis)b.push("DISCAPACIDAD");return b}
var AG=["pilon","pozo","rio","acequia","lluvia","camion","manantial"],HU=["lenia_sin_chimenea","bosta","carbon"];
function banH(){var h=S.h,b=[],n=S.p.length;if(n&&h.dorm>0&&n/h.dorm>3)b.push("HACINAMIENTO");
if(AG.indexOf(h.agua)>-1||(h.agua&&h.agua!=="red_domiciliaria"&&!h.tratada))b.push("AGUA_NO_SEGURA");
if(["pozo_ciego","rio","no_tiene"].indexOf(h.san)>-1)b.push("SIN_SANEAMIENTO");if(HU.indexOf(h.comb)>-1)b.push("HUMO");if(h.vect)b.push("VECTORIAL");if(h.mono)b.push("MONOPARENTAL");return b}

// Esquema infantil (NTS 246-2026, 6.2.2). [id, vacuna, dosis, mes en que toca, ultimo mes en que aplica (null = sin limite)]
var SCH=[["bcg","BCG","Dosis única",0,null],["hvb","Hepatitis B (recién nacido)","Dosis única",0,null],["acvrs","Anticuerpo monoclonal VRS","Dosis única",0,6],
["pen1","Pentavalente o hexavalente","1ª dosis",2,null],["ipv1","IPV (polio inyectable)","1ª dosis",2,null],["rot1","Rotavirus","1ª dosis",2,8],["neu1","Neumococo","1ª dosis",2,null],
["pen2","Pentavalente o hexavalente","2ª dosis",4,null],["ipv2","IPV (polio inyectable)","2ª dosis",4,null],["rot2","Rotavirus","2ª dosis",4,8],["neu2","Neumococo","2ª dosis",4,null],
["pen3","Pentavalente o hexavalente","3ª dosis",6,null],["ipv3","IPV (polio inyectable)","3ª dosis",6,null],["fl1","Influenza pediátrica","1ª dosis",6,11],["fl2","Influenza pediátrica","2ª dosis",7,11],
["spr1","SPR","1ª dosis",12,null],["neu3","Neumococo","3ª dosis",12,null],["var1","Varicela","1ª dosis",12,null],["fl12","Influenza pediátrica","Dosis única",12,null],
["ama","Antiamarílica","Dosis única",15,null],["hepa","Hepatitis A","Dosis única",15,null],["rdpt1","DPT + IPV (o hexavalente)","1er refuerzo",18,null],["spr2","SPR","2ª dosis",18,null],
["fl24","Influenza pediátrica","Dosis única",24,null],["var2","Varicela","2ª dosis (se incorpora progresivamente)",24,null],["fl36","Influenza adulto","Dosis única",36,null],
["rdpt2","DPT","2º refuerzo",48,null],["rapo2","Polio oral (APO)","2º refuerzo",48,null],["vph","VPH","Dosis única (9 a 18 años)",108,227]];
// Desde los 12 anos (6.2.3 a 6.2.6). [id, vacuna, dosis, edad minima, edad maxima, dias de vigencia (0 = permanente)]
var ADU=[["aflu","Influenza adulto","Dosis anual",12,200,365],["dt1","dT adulto","1ª dosis (esquema primario)",12,59,0],["dt2","dT adulto","2ª dosis",12,59,0],["dt3","dT adulto","3ª dosis",12,59,0],
["hb1","Hepatitis B","1ª dosis (esquema primario)",12,59,0],["hb2","Hepatitis B","2ª dosis",12,59,0],["hb3","Hepatitis B","3ª dosis",12,59,0],["aama","Antiamarílica","Dosis única",12,59,0],["aneu","Neumococo","Dosis única",60,200,0]];
var GES=[["gtd","Tdap","1 dosis en cada embarazo (20 a 36 semanas)",300],["gvrs","VRS","1 dosis en cada embarazo (32 a 36 semanas)",300],["gfl","Influenza","1 dosis anual",365]];
function hecha(p,id,vig){var v=p.vac&&p.vac[id];if(!v)return false;if(!vig)return true;var d=(new Date()-new Date(v+"T00:00:00"))/864e5;return d<=vig}
function dosis(p,e){var r=[],m=e.m,a=e.a;
if(m<144||(m>=108&&m<=227))SCH.forEach(function(d){var ok=hecha(p,d[0]);var vph=d[0]==="vph";
if(vph?(m<108||m>227):m>=144)return;
if(ok)r.push({id:d[0],n:d[1],d:d[2],m:d[3],s:"ok"});
else if(d[3]<=m){if(d[4]!==null&&m>d[4])return;r.push({id:d[0],n:d[1],d:d[2],m:d[3],s:"pend"})}
else r.push({id:d[0],n:d[1],d:d[2],m:d[3],s:"prox"})});
ADU.forEach(function(d){if(a<d[3]||a>d[4])return;r.push({id:d[0],n:d[1],d:d[2],m:-1,s:hecha(p,d[0],d[5])?"ok":"pend"})});
if(p.ges)GES.forEach(function(d){r.push({id:d[0],n:d[1],d:d[2],m:-1,s:hecha(p,d[0],d[3])?"ok":"pend"})});
var sig=null;r.forEach(function(x){if(x.s==="prox"&&(sig===null||x.m<sig))sig=x.m});
return r.filter(function(x){return x.s!=="prox"||x.m===sig})}
function cuando(m){return m<0?"":m===0?"recién nacido":m<24?"a los "+m+" meses":"a los "+(m/12)+" años"}
function panelVac(i,p,e){var r=dosis(p,e),n=r.filter(function(x){return x.s==="pend"}).length;
var h=r.map(function(x){var f=p.vac&&p.vac[x.id];var tx=x.s==="ok"?"✓ "+(f||""):x.s==="pend"?"Pendiente":"Próxima "+cuando(x.m);
return '<label class="dv '+x.s+'"><input type="checkbox" data-v="'+x.id+'" data-i="'+i+'"'+(x.s==="ok"?" checked":"")+'><span><b>'+x.n+'</b> · '+x.d+'<span class="m">'+(x.m>=0&&x.s!=="ok"?cuando(x.m)+" · ":"")+tx+'</span></span></label>'}).join("");
return '<details'+(n?" open":"")+'><summary>💉 Vacunas · '+n+' pendiente'+(n===1?"":"s")+'</summary>'+h+'<p class="m">Al marcar una dosis se guarda la fecha de hoy. SR/SPR y Tdap solo en zonas de brote o gestantes: no se cuentan como pendientes.</p></details>'}
function vista(i,p,e,b){var t=[],a=e.a,pf=S.perfil;
if(pf==="ENFERMERIA")return panelVac(i,p,e);
if(pf==="NUTRICION"){if(a<=6||p.ges||p.lac)t.push("Vaso de Leche: prioridad 1 (niño de 0 a 6 años, gestante o madre lactante)");else if(a<=13)t.push("Vaso de Leche: prioridad 2 (7 a 13 años)");else if(a>=60)t.push("Vaso de Leche: prioridad 2 (adulto mayor; edad de anciano por confirmar)");else t.push("Sin criterio de Vaso de Leche por edad o condición")}
if(pf==="PSICOLOGIA"){if(b.indexOf("ADOLESCENTE")>-1||b.indexOf("ADULTO_MAYOR")>-1||p.ges||p.lac)t.push("Priorizar tamizaje (criterio provisional)");else t.push("Sin prioridad por etapa (criterio provisional)")}
if(pf==="MEDICINA"){if(p.cro||p.ges||p.dis||a>=60)t.push("Priorizar control: "+[p.cro&&"crónico",p.ges&&"gestante",p.dis&&"discapacidad",a>=60&&"adulto mayor"].filter(Boolean).join(", ")+" (criterio provisional)");else t.push("Sin prioridad por condición (criterio provisional)")}
return t.map(function(x){return '<div class="prog">'+x+'</div>'}).join("")}
function draw(){var h=S.h;$("agua").value=h.agua;$("san").value=h.san;$("comb").value=h.comb;$("dorm").value=h.dorm;$("tratada").checked=h.tratada;$("vect").checked=h.vect;$("mono").checked=h.mono;
$("fh").innerHTML=chips(banH());
$("perfiles").innerHTML=PERF.map(function(x){return '<button data-p="'+x[0]+'" class="'+(S.perfil===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("");
$("cnt").textContent="("+S.p.length+")";
$("lista").innerHTML=S.p.length?S.p.map(function(p,i){var e=edad(p.fn),b=banP(p);var ed=e?(e.a<5?e.a+" a "+(e.m%12)+" m":e.a+" años"):"sin fecha";
if(e&&S.perfil==="ENFERMERIA"&&dosis(p,e).some(function(x){return x.s==="pend"}))b=b.concat("VAC_PENDIENTE");
var v=e?vista(i,p,e,b):"";
return '<div class="pc"><b>'+esc(p.n||"Sin nombre")+'</b> <span class="m">· '+ed+'</span> <button data-d="'+i+'" style="float:right;padding:3px 9px">✕</button><div class="chips">'+chips(b)+'</div>'+v+'</div>'}).join(""):'<p class="m">Aún no hay miembros. Usa “Cargar ejemplo”.</p>'}
function rel(m){var d=new Date();d.setMonth(d.getMonth()-m);return d.toISOString().slice(0,10)}
function msg(t,ok){var m=$("msg");m.textContent=t;m.style.color=ok?"var(--ok)":"var(--bad)"}

// Guardado cifrado: clave -> PBKDF2 (250 000 vueltas) -> AES-GCM 256
function b64(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function unb64(s){var r=atob(s),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}
function kdf(pw,salt){return crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]).then(function(k){return crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:250000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])})}
function cifrar(pw,obj){var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
return kdf(pw,salt).then(function(k){return crypto.subtle.encrypt({name:"AES-GCM",iv:iv},k,new TextEncoder().encode(JSON.stringify(obj)))}).then(function(ct){return JSON.stringify({app:"ffd",v:1,salt:b64(salt),iv:b64(iv),data:b64(ct)})})}
function descifrar(pw,txt){var f=JSON.parse(txt);if(f.app!=="ffd")throw new Error("formato");
return kdf(pw,unb64(f.salt)).then(function(k){return crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(f.iv)},k,unb64(f.data))}).then(function(pt){return JSON.parse(new TextDecoder().decode(pt))})}
function limpiar(o){if(!o||!Array.isArray(o.p)||typeof o.h!=="object")throw new Error("datos");
var h=Object.assign({},H0,o.h);h.dorm=Math.max(1,+h.dorm||1);
var p=o.p.map(function(x){var v={};if(x.vac&&typeof x.vac==="object")Object.keys(x.vac).forEach(function(k){if(/^[a-z0-9]{2,8}$/.test(k)&&/^\d{4}-\d{2}-\d{2}$/.test(x.vac[k]))v[k]=x.vac[k]});
return{n:String(x.n||"").slice(0,80),fn:/^\d{4}-\d{2}-\d{2}$/.test(x.fn||"")?x.fn:"",ges:!!x.ges,lac:!!x.lac,cro:!!x.cro,dis:!!x.dis,esc:!!x.esc,vac:v}});
return{h:h,p:p}}
function claveOk(){var c=$("clave").value;if(!(window.crypto&&crypto.subtle)){msg("Este navegador o esta dirección no permite cifrar. Usa https.");return null}if(c.length<8){msg("La clave debe tener al menos 8 caracteres.");return null}return c}
function exportar(){var c=claveOk();if(!c)return;msg("Cifrando…",true);
cifrar(c,{h:S.h,p:S.p,fecha:new Date().toISOString()}).then(function(t){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"application/json"}));a.download="ficha-familiar-"+new Date().toISOString().slice(0,10)+".ffd";document.body.appendChild(a);a.click();a.remove();msg("Archivo cifrado descargado. Guarda tu clave: sin ella no se puede abrir.",true)}).catch(function(){msg("No se pudo cifrar.")})}
function importar(file){var c=claveOk();if(!c)return;var r=new FileReader();
r.onload=function(){descifrar(c,r.result).then(limpiar).then(function(d){if(!confirm("Se reemplazarán los datos de este dispositivo. ¿Continuar?")){msg("Importación cancelada.");return}S.h=d.h;S.p=d.p;save();draw();msg("Datos importados: "+d.p.length+" miembros.",true)}).catch(function(){msg("Clave incorrecta o archivo dañado.")})};
r.readAsText(file)}

document.addEventListener("click",function(ev){var t=ev.target;
if(t.dataset.p){S.perfil=t.dataset.p}else if(t.dataset.d){S.p.splice(+t.dataset.d,1)}
else if(t.id==="add"){S.p.push({n:$("nom").value.trim(),fn:$("fn").value,ges:$("ges").checked,lac:$("lac").checked,cro:$("cro").checked,dis:$("dis").checked,esc:$("esc").checked,vac:{}});["nom","fn"].forEach(function(k){$(k).value=""});["ges","lac","cro","dis","esc"].forEach(function(k){$(k).checked=false})}
else if(t.id==="demo"){S.h={agua:"pozo",san:"pozo_ciego",comb:"lenia_sin_chimenea",dorm:1,tratada:false,vect:true,mono:false};S.p=[{n:"Abuela Rosa",fn:rel(68*12),cro:true,vac:{}},{n:"Madre Ana",fn:rel(30*12),ges:true,vac:{}},{n:"Luis",fn:rel(14*12),esc:true,vac:{}},{n:"Camila",fn:rel(38),vac:{}},{n:"Bebé Mateo",fn:rel(5),vac:{}}]}
else if(t.id==="clr"){S.p=[];S.h=Object.assign({},H0)}
else if(t.id==="exp"){exportar();return}
else if(t.id==="imp"){$("arch").click();return}else return;
save();draw()});
document.addEventListener("change",function(ev){var t=ev.target;
if(t.dataset&&t.dataset.v){var p=S.p[+t.dataset.i];if(!p)return;p.vac=p.vac||{};if(t.checked)p.vac[t.dataset.v]=new Date().toISOString().slice(0,10);else delete p.vac[t.dataset.v];save();draw()}
else if(t.id==="arch"&&t.files[0]){importar(t.files[0]);t.value=""}});
["agua","san","comb","dorm","tratada","vect","mono"].forEach(function(k){$(k).addEventListener("change",function(){var el=$(k);S.h[k]=el.type==="checkbox"?el.checked:k==="dorm"?Math.max(1,+el.value||1):el.value;save();draw()})});
draw();
