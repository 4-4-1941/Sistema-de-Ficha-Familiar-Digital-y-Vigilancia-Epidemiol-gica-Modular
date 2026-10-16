// Ficha Familiar Digital - reglas de banderas y vistas por perfil
// Los datos se guardan solo en este dispositivo (localStorage).
var KEY="ffd-proto-1",PERF=[["ENFERMERIA","Enfermería"],["NUTRICION","Nutrición"],["PSICOLOGIA","Psicología"],["MEDICINA","Medicina"]];
var S={h:{agua:"",san:"",comb:"",dorm:1,tratada:false,vect:false,mono:false},p:[],perfil:"ENFERMERIA"};
try{var j=localStorage.getItem(KEY);if(j)S=JSON.parse(j)}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var $=function(i){return document.getElementById(i)};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var L={LACTANTE:["Lactante (menor de 1 año)","a"],NINO_1_A_4:["Niño de 1 a 4 años","a"],NINO_5_A_11:["Niño de 5 a 11 años",""],ADOLESCENTE:["Adolescente","a"],JOVEN:["Joven",""],ADULTO:["Adulto",""],ADULTO_MAYOR:["Adulto mayor","a"],GESTANTE:["Gestante","r"],MADRE_LACTANTE:["Madre lactante","a"],CRONICO:["Crónico","a"],DISCAPACIDAD:["Discapacidad","a"],DESERCION_ESCOLAR:["Deserción escolar","r"],EDAD_FALTANTE:["Falta fecha de nacimiento","r"],HACINAMIENTO:["Hacinamiento","r"],AGUA_NO_SEGURA:["Agua no segura","r"],SIN_SANEAMIENTO:["Sin saneamiento","r"],HUMO:["Humo en la cocina","a"],VECTORIAL:["Riesgo vectorial","r"],MONOPARENTAL:["Monoparental","a"]};
function chips(a){return a.length?a.map(function(c){var l=L[c]||[c,""];return '<span class="f '+l[1]+'">'+l[0]+'</span>'}).join(""):'<span class="f v">Sin banderas</span>'}
function edad(f){if(!f)return null;var n=new Date(),b=new Date(f+"T00:00:00");var m=(n.getFullYear()-b.getFullYear())*12+n.getMonth()-b.getMonth();if(n.getDate()<b.getDate())m--;return m<0?null:{m:m,a:Math.floor(m/12)}}
function banP(p){var e=edad(p.fn),b=[];if(!e)return["EDAD_FALTANTE"];var a=e.a;
b.push(a<1?"LACTANTE":a<=4?"NINO_1_A_4":a<=11?"NINO_5_A_11":a<=17?"ADOLESCENTE":a<=29?"JOVEN":a<=59?"ADULTO":"ADULTO_MAYOR");
if(a>=3&&a<=17&&p.esc)b.push("DESERCION_ESCOLAR");if(p.ges)b.push("GESTANTE");if(p.lac)b.push("MADRE_LACTANTE");if(p.cro)b.push("CRONICO");if(p.dis)b.push("DISCAPACIDAD");return b}
var AG=["pilon","pozo","rio","acequia","lluvia","camion","manantial"],HU=["lenia_sin_chimenea","bosta","carbon"];
function banH(){var h=S.h,b=[],n=S.p.length;if(n&&h.dorm>0&&n/h.dorm>3)b.push("HACINAMIENTO");
if(AG.indexOf(h.agua)>-1||(h.agua&&h.agua!=="red_domiciliaria"&&!h.tratada))b.push("AGUA_NO_SEGURA");
if(["pozo_ciego","rio","no_tiene"].indexOf(h.san)>-1)b.push("SIN_SANEAMIENTO");if(HU.indexOf(h.comb)>-1)b.push("HUMO");if(h.vect)b.push("VECTORIAL");if(h.mono)b.push("MONOPARENTAL");return b}
var VAC=[[0,"BCG, hepatitis B y anticuerpo VRS (recién nacido)"],[2,"1ª dosis: penta/hexavalente, IPV, rotavirus, neumococo"],[4,"2ª dosis: penta/hexavalente, IPV, rotavirus, neumococo"],[6,"3ª dosis penta/hexavalente e IPV · influenza 1ª"],[7,"Influenza 2ª"],[12,"SPR 1ª, neumococo 3ª, varicela 1ª, influenza"],[15,"Antiamarílica y hepatitis A"],[18,"1er refuerzo DPT + IPV · SPR 2ª"],[24,"Influenza · varicela 2ª (incorporación progresiva)"],[36,"Influenza adulto (dosis única)"],[48,"2º refuerzo DPT y APO"]];
function vac(p,e){var a=e.a,t=[];
if(e.m<60){var pas=VAC.filter(function(v){return v[0]<=e.m}),sig=VAC.filter(function(v){return v[0]>e.m})[0];if(pas.length)t.push("Le correspondía hasta hoy: "+pas[pas.length-1][1]);if(sig)t.push("Próximo hito (a los "+(sig[0]<24?sig[0]+" meses":sig[0]/12+" años")+"): "+sig[1])}
if(a>=5&&a<=11)t.push("SR/SPR dosis única si no tiene esquema (zonas de brote)");if(a>=9&&a<=11)t.push("VPH dosis única (9 a 11 años)");
if(a>=12&&a<=17)t.push("Influenza anual, dT y hepatitis B (3 dosis), antiamarílica, VPH dosis única; Tdap de 14 a 17 en brotes");
if(a>=18&&a<=59)t.push((a===18?"VPH dosis única a los 18 años · ":"")+"Influenza anual, dT y hepatitis B (3 dosis), antiamarílica; Tdap y SR/SPR en brotes");
if(a>=60)t.push("Influenza anual y neumococo (dosis única)");
if(p.ges)t.push("Gestante: Tdap (20-36 sem), VRS (32-36 sem), influenza, hepatitis B si esquema incompleto");return t}
function vista(p,e,b){var t=[],a=e.a,pf=S.perfil;
if(pf==="ENFERMERIA")t=vac(p,e);
if(pf==="NUTRICION"){if(a<=6||p.ges||p.lac)t.push("Vaso de Leche: prioridad 1 (niño de 0 a 6 años, gestante o madre lactante)");else if(a<=13)t.push("Vaso de Leche: prioridad 2 (7 a 13 años)");else if(a>=60)t.push("Vaso de Leche: prioridad 2 (adulto mayor; edad de anciano por confirmar)");else t.push("Sin criterio de Vaso de Leche por edad o condición")}
if(pf==="PSICOLOGIA"){if(b.indexOf("ADOLESCENTE")>-1||b.indexOf("ADULTO_MAYOR")>-1||p.ges||p.lac)t.push("Priorizar tamizaje (criterio provisional)");else t.push("Sin prioridad por etapa (criterio provisional)")}
if(pf==="MEDICINA"){if(p.cro||p.ges||p.dis||a>=60)t.push("Priorizar control: "+[p.cro&&"crónico",p.ges&&"gestante",p.dis&&"discapacidad",a>=60&&"adulto mayor"].filter(Boolean).join(", ")+" (criterio provisional)");else t.push("Sin prioridad por condición (criterio provisional)")}
return t}
function draw(){var h=S.h;$("agua").value=h.agua;$("san").value=h.san;$("comb").value=h.comb;$("dorm").value=h.dorm;$("tratada").checked=h.tratada;$("vect").checked=h.vect;$("mono").checked=h.mono;
$("fh").innerHTML=chips(banH());
$("perfiles").innerHTML=PERF.map(function(x){return '<button data-p="'+x[0]+'" class="'+(S.perfil===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("");
$("cnt").textContent="("+S.p.length+")";
$("lista").innerHTML=S.p.length?S.p.map(function(p,i){var e=edad(p.fn),b=banP(p);var ed=e?(e.a<5?e.a+" a "+(e.m%12)+" m":e.a+" años"):"sin fecha";
var v=e?vista(p,e,b).map(function(x){return '<div class="prog">'+x+'</div>'}).join(""):"";
return '<div class="pc"><b>'+esc(p.n||"Sin nombre")+'</b> <span class="m">· '+ed+'</span> <button data-d="'+i+'" style="float:right;padding:3px 9px">✕</button><div class="chips">'+chips(b)+'</div>'+v+'</div>'}).join(""):'<p class="m">Aún no hay miembros. Usa “Cargar ejemplo”.</p>'}
function rel(m){var d=new Date();d.setMonth(d.getMonth()-m);return d.toISOString().slice(0,10)}
document.addEventListener("click",function(ev){var t=ev.target;
if(t.dataset.p){S.perfil=t.dataset.p}else if(t.dataset.d){S.p.splice(+t.dataset.d,1)}
else if(t.id==="add"){S.p.push({n:$("nom").value.trim(),fn:$("fn").value,ges:$("ges").checked,lac:$("lac").checked,cro:$("cro").checked,dis:$("dis").checked,esc:$("esc").checked});["nom","fn"].forEach(function(k){$(k).value=""});["ges","lac","cro","dis","esc"].forEach(function(k){$(k).checked=false})}
else if(t.id==="demo"){S.h={agua:"pozo",san:"pozo_ciego",comb:"lenia_sin_chimenea",dorm:1,tratada:false,vect:true,mono:false};S.p=[{n:"Abuela Rosa",fn:rel(68*12),cro:true},{n:"Madre Ana",fn:rel(30*12),ges:true},{n:"Luis",fn:rel(14*12),esc:true},{n:"Camila",fn:rel(38)},{n:"Bebé Mateo",fn:rel(5)}]}
else if(t.id==="clr"){S.p=[];S.h={agua:"",san:"",comb:"",dorm:1,tratada:false,vect:false,mono:false}}else return;
save();draw()});
["agua","san","comb","dorm","tratada","vect","mono"].forEach(function(k){$(k).addEventListener("change",function(){var el=$(k);S.h[k]=el.type==="checkbox"?el.checked:k==="dorm"?Math.max(1,+el.value||1):el.value;save();draw()})});
draw();
