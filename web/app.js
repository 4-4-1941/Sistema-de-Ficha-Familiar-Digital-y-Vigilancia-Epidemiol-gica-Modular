// Ficha Familiar Digital - banderas, vacunas y guardado cifrado
// Los datos se guardan solo en este dispositivo (localStorage). Nada se envia a servidores.
var KEY="ffd-proto-1",PERF=[["ENFERMERIA","Enfermería"],["NUTRICION","Nutrición"],["PSICOLOGIA","Psicología"],["MEDICINA","Medicina"],["OBSTETRICIA","Obstetricia"],["ODONTOLOGIA","Odontología"]];
var H0={agua:"",san:"",comb:"",dorm:1,tratada:false,vect:false,mono:false};
var S={h:Object.assign({},H0),p:[],perfil:"ENFERMERIA"};
try{var j=localStorage.getItem(KEY);if(j)S=JSON.parse(j)}catch(e){}
S.vis=S.vis||[];S.pai=S.pai||[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var $=function(i){return document.getElementById(i)};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var L={LACTANTE:["Lactante (menor de 1 año)","a"],NINO_1_A_4:["Niño de 1 a 4 años","a"],NINO_5_A_11:["Niño de 5 a 11 años",""],ADOLESCENTE:["Adolescente","a"],JOVEN:["Joven",""],ADULTO:["Adulto",""],ADULTO_MAYOR:["Adulto mayor","a"],GESTANTE:["Gestante","r"],MADRE_LACTANTE:["Madre lactante","a"],CRONICO:["Crónico","a"],DISCAPACIDAD:["Discapacidad","a"],DESERCION_ESCOLAR:["Deserción escolar","r"],EDAD_FALTANTE:["Falta fecha de nacimiento","r"],HACINAMIENTO:["Hacinamiento","r"],AGUA_NO_SEGURA:["Agua no segura","r"],SIN_SANEAMIENTO:["Sin saneamiento","r"],HUMO:["Humo en la cocina","a"],VECTORIAL:["Riesgo vectorial","r"],MONOPARENTAL:["Monoparental","a"],VAC_PENDIENTE:["Vacunas pendientes","r"],CRED_PENDIENTE:["Control CRED pendiente","r"],VLE_PENDIENTE:["Vaso de Leche por inscribir","a"],PSI_PENDIENTE:["Tamizaje de salud mental pendiente","r"],MED_PENDIENTE:["Tamizaje de cáncer pendiente","r"],OBS_PENDIENTE:["Tamizaje de mama pendiente","r"],ODO_PENDIENTE:["Atención bucal pendiente","r"]};
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
if(pf==="ENFERMERIA")return panelVac(i,p,e)+panelCred(i,p,e);
if(pf==="NUTRICION")return panelVle(i,p,e);
if(pf==="PSICOLOGIA")return panelPsi(i,p,e);
if(pf==="MEDICINA"){if(p.cro||p.ges||p.dis||a>=60)t.push("Priorizar control: "+[p.cro&&"crónico",p.ges&&"gestante",p.dis&&"discapacidad",a>=60&&"adulto mayor"].filter(Boolean).join(", ")+" (criterio provisional)");else t.push("Sin prioridad por condición (criterio provisional)")}
return(PQT[pf]?panelPq(i,p,e,pf):"")+t.map(function(x){return '<div class="prog">'+x+'</div>'}).join("")}
// Fechas: se escribe dd/mm/aaaa (se guarda como aaaa-mm-dd). Alternativa: edad en años y meses (fecha estimada)
function fmtF(t){var d=t.replace(/\D/g,"").slice(0,8),r=d.slice(0,2);if(d.length>2)r+="/"+d.slice(2,4);if(d.length>4)r+="/"+d.slice(4);return r}
function parseF(t){var m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);if(!m)return"";var d=+m[1],mo=+m[2],y=+m[3],x=new Date(y,mo-1,d);if(x.getFullYear()!==y||x.getMonth()!==mo-1||x.getDate()!==d||y<1900||x>new Date())return"";return y+"-"+m[2]+"-"+m[1]}
function estF(a,m){var h=new Date(),dd=h.getDate();h.setDate(1);h.setMonth(h.getMonth()-(+m||0)-12*(+a||0));h.setDate(Math.min(dd,new Date(h.getFullYear(),h.getMonth()+1,0).getDate()));return h.getFullYear()+"-"+("0"+(h.getMonth()+1)).slice(-2)+"-"+("0"+h.getDate()).slice(-2)}
function mostrar(){var f=parseF($("fn").value)||(($("ea").value||$("em").value)?estF($("ea").value,$("em").value):""),e=edad(f);$("wges").hidden=$("wlac").hidden=$("sx").value!=="F";$("wesc").hidden=!(e&&e.a>=3&&e.a<=17)}
// Controles CRED (NTS 238-2025, numeral 6.4). [id, nombre, dia de vida en que inicia, dia en que termina]
var CR=[["cr01","Recién nacido: 1er control",0,7],["cr02","Recién nacido: 2º control",8,14],["cr03","Recién nacido: 3er control",15,21],["cr04","Control del mes 1",29,59],["cr05","Control del mes 2",60,89],["cr06","Control del mes 3",90,119],["cr07","Control del mes 4",120,149],["cr08","Control del mes 6",180,209],["cr09","Control del mes 7",210,239],["cr10","Control del mes 9",270,299],["cr11","Control de 12 meses",360,389],["cr12","Control de 15 meses",450,479],["cr13","Control de 18 meses",540,569],["cr14","Control de 21 meses",630,659]];
[24,30,36,42,48,54].forEach(function(m,i){CR.push(["cr"+(15+i),"Control de "+m+" meses",Math.round(m*30.4375),Math.round((m+6)*30.4375)-1])});
for(var y=5;y<=11;y++)CR.push(["cr"+(21+y-5),"Control anual de "+y+" años",Math.round(y*365.25),Math.round((y+1)*365.25)-1]);
function diaF(p,n){var d=new Date(p.fn+"T00:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function cred(p,e){if(e.m>=144)return null;var d=Math.floor((new Date()-new Date(p.fn+"T00:00:00"))/864e5);return{cur:CR.filter(function(c){return d>=c[2]&&d<=c[3]})[0],nx:CR.filter(function(c){return c[2]>d})[0]}}
function hechoP(p,id){return !!(p.vac&&p.vac[id])}
function vle(p,e){var a=e.a;if(a<=6||p.ges||p.lac)return"Prioridad 1 (niño de 0 a 6 años, gestante o madre lactante)";if(a<=13)return"Prioridad 2 (7 a 13 años)";if(a>=60)return"Prioridad 2 (adulto mayor; la edad de “anciano” falta confirmar)";return null}
function bPend(p,e){var b=[];if(dosis(p,e).some(function(x){return x.s==="pend"}))b.push("VAC_PENDIENTE");var c=cred(p,e);if(c&&c.cur&&!hechoP(p,c.cur[0]))b.push("CRED_PENDIENTE");if(vle(p,e)&&!hechoP(p,"vle1"))b.push("VLE_PENDIENTE");if(psi(p,e).some(function(x){return !hechoP(p,x[0])}))b.push("PSI_PENDIENTE");["MEDICINA","OBSTETRICIA","ODONTOLOGIA"].forEach(function(f){if(pqs(p,e,f).some(function(x){return !x.ok}))b.push(PQB[f])});return b}
function panelCred(i,p,e){var r=cred(p,e);if(!r)return"";var h="",pend=false;
if(r.cur){var c=r.cur,ok=hechoP(p,c[0]);pend=!ok;h+='<label class="dv '+(ok?"ok":"pend")+'"><input type="checkbox" data-v="'+c[0]+'" data-i="'+i+'"'+(ok?" checked":"")+'><span><b>'+c[1]+'</b><span class="m">'+(ok?"✓ "+p.vac[c[0]]:"Corresponde del "+fd(diaF(p,c[2]))+" al "+fd(diaF(p,c[3])))+'</span></span></label>'}
else h+='<p class="m">No hay control programado a esta edad.</p>';
if(r.nx)h+='<p class="m">Próximo: '+r.nx[1]+', desde el '+fd(diaF(p,r.nx[2]))+'.</p>';
return '<details'+(pend?" open":"")+'><summary>🩺 Control CRED · '+(pend?"pendiente":"al día")+'</summary>'+h+'<p class="m">El intervalo mínimo entre controles se cuenta desde el último control realizado (NTS 238-2025).</p></details>'}
function panelVle(i,p,e){var v=vle(p,e);if(!v)return '<div class="prog">Sin criterio de Vaso de Leche por edad o condición</div>';var ok=hechoP(p,"vle1");
return '<details open><summary>🥛 Vaso de Leche · '+(ok?"inscrito":"por inscribir")+'</summary><label class="dv '+(ok?"ok":"pend")+'"><input type="checkbox" data-v="vle1" data-i="'+i+'"'+(ok?" checked":"")+'><span><b>Inscrito en el padrón</b><span class="m">'+v+(ok?" · ✓ "+p.vac.vle1:"")+'</span></span></label><p class="m">Programa municipal (Ley 27470). Esta lista es de apoyo, no el padrón oficial.</p></details>'}
function psi(p,e){var a=e.a,r=[];if(a>=12)r.push(["psi1","Tamizaje de salud mental","Riesgo “sin tamizaje de salud mental” de la Ficha Familiar oficial. El instrumento y la frecuencia se definen con la norma vigente."]);if(a>=18)r.push(["psi2","Tamizaje de depresión","Guía de práctica clínica RM 136-2023-MINSA (mayores de 18 años, primer nivel). Frecuencia por confirmar."]);return r}
function panelPsi(i,p,e){var r=psi(p,e);if(!r.length)return '<div class="prog">Menor de 12 años: la ficha oficial pide evaluar el desarrollo psicosocial (norma por validar).</div>';var n=r.filter(function(x){return !hechoP(p,x[0])}).length;
return '<details'+(n?" open":"")+'><summary>🧠 Tamizajes · '+n+' pendiente'+(n===1?"":"s")+'</summary>'+r.map(function(x){var ok=hechoP(p,x[0]);return '<label class="dv '+(ok?"ok":"pend")+'"><input type="checkbox" data-v="'+x[0]+'" data-i="'+i+'"'+(ok?" checked":"")+'><span><b>'+x[1]+'</b><span class="m">'+(ok?"✓ "+p.vac[x[0]]:x[2])+'</span></span></label>'}).join("")+'<p class="m">Marca la casilla cuando el tamizaje esté hecho y registrado. Aquí no se guardan resultados clínicos, solo la fecha.</p></details>'}
// Atenciones por profesión (manuales HIS 2025 del MINSA). [id, perfiles, nombre, fuente, aplica(p,e), vigencia: "A" = año calendario o días]
var PQ=[
["md1",["MEDICINA"],"Tamizaje de cáncer de colon y recto (test inmunoquímico fecal)","Manual HIS Cáncer 2025: personas de 50 a 70 años, cada año",function(p,e){return e.a>=50&&e.a<=70},365],
["md2",["MEDICINA"],"Tamizaje de cáncer de piel (examen clínico)","Manual HIS Cáncer 2025: de 18 a 70 años, cada año",function(p,e){return e.a>=18&&e.a<=70},365],
["md3",["MEDICINA","OBSTETRICIA"],"Cáncer de mama: examen clínico de mamas","Manual HIS Cáncer 2025: mujeres de 40 a 69 años, cada año",function(p,e){return p.sx==="F"&&e.a>=40&&e.a<=69},365],
["md4",["MEDICINA","OBSTETRICIA"],"Cáncer de mama: mamografía","Manual HIS Cáncer 2025: mujeres de 40 a 69 años, cada 2 años",function(p,e){return p.sx==="F"&&e.a>=40&&e.a<=69},730],
["od1",["ODONTOLOGIA"],"Atención preventiva: 1ª entrega del año","Manual HIS Salud Bucal 2025: 2 entregas por año calendario (higiene oral, asesoría nutricional, flúor y profilaxis)",function(p,e){return e.m>=6},"A"],
["od2",["ODONTOLOGIA"],"Atención preventiva: 2ª entrega del año","Manual HIS Salud Bucal 2025: 2 entregas por año calendario (en niños de 2 a 11 años, hasta 4 sellantes)",function(p,e){return e.m>=6},"A"],
["og1",["ODONTOLOGIA"],"Gestante: 1ª cita odontológica","PP0002 en el manual de Salud Bucal 2025: mínimo 3 citas durante la gestación",function(p){return !!p.ges},300],
["og2",["ODONTOLOGIA"],"Gestante: 2ª cita odontológica","PP0002 en el manual de Salud Bucal 2025: mínimo 3 citas durante la gestación",function(p){return !!p.ges},300],
["og3",["ODONTOLOGIA"],"Gestante: 3ª cita odontológica","PP0002 en el manual de Salud Bucal 2025: mínimo 3 citas durante la gestación",function(p){return !!p.ges},300]];
var PQT={MEDICINA:"Tamizajes de cáncer",OBSTETRICIA:"Tamizajes de mama",ODONTOLOGIA:"Salud bucal"},PQI={MEDICINA:"🔎",OBSTETRICIA:"🤰",ODONTOLOGIA:"🦷"},PQB={MEDICINA:"MED_PENDIENTE",OBSTETRICIA:"OBS_PENDIENTE",ODONTOLOGIA:"ODO_PENDIENTE"};
function hechaV(p,id,vig){var v=p.vac&&p.vac[id];if(!v)return false;if(vig==="A")return v.slice(0,4)===String(new Date().getFullYear());return(new Date()-new Date(v+"T00:00:00"))/864e5<=vig}
function pqs(p,e,f){return PQ.filter(function(q){return q[1].indexOf(f)>-1&&q[4](p,e)}).map(function(q){return{id:q[0],n:q[2],f:q[3],ok:hechaV(p,q[0],q[5])}})}
function panelPq(i,p,e,f){var r=pqs(p,e,f),n=r.filter(function(x){return !x.ok}).length;if(!r.length)return '<div class="prog">Sin atenciones de '+PQT[f].toLowerCase()+' para este miembro según los manuales HIS 2025.</div>';
return '<details'+(n?" open":"")+'><summary>'+PQI[f]+' '+PQT[f]+' · '+n+' pendiente'+(n===1?"":"s")+'</summary>'+r.map(function(x){return '<label class="dv '+(x.ok?"ok":"pend")+'"><input type="checkbox" data-v="'+x.id+'" data-i="'+i+'"'+(x.ok?" checked":"")+'><span><b>'+x.n+'</b><span class="m">'+(x.ok?"✓ "+p.vac[x.id]:x.f)+'</span></span></label>'}).join("")+((f!=="ODONTOLOGIA"&&!p.sx&&e.a>=40&&e.a<=69)?'<p class="m">Indica el sexo para evaluar el tamizaje de mama.</p>':"")+'<p class="m">Al marcar se guarda solo la fecha, y se renueva según la frecuencia del manual.</p></details>'}
function draw(){var h=S.h;$("agua").value=h.agua;$("san").value=h.san;$("comb").value=h.comb;$("dorm").value=h.dorm;$("tratada").checked=h.tratada;$("vect").checked=h.vect;$("mono").checked=h.mono;
$("fh").innerHTML=chips(banH());
$("perfiles").innerHTML=PERF.map(function(x){return '<button data-p="'+x[0]+'" class="'+(S.perfil===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("");
$("cnt").textContent="("+S.p.length+")";
$("lista").innerHTML=S.p.length?S.p.map(function(p,i){var e=edad(p.fn),b=banP(p);var ed=(e?(e.a<5?e.a+" a "+(e.m%12)+" m":e.a+" años"):"sin fecha")+(p.fe?" · fecha estimada":"")+(p.sx==="F"?" · mujer":p.sx==="M"?" · varón":"");
if(e){var PF={ENFERMERIA:["VAC_PENDIENTE","CRED_PENDIENTE"],NUTRICION:["VLE_PENDIENTE"],PSICOLOGIA:["PSI_PENDIENTE"],MEDICINA:["MED_PENDIENTE"],OBSTETRICIA:["OBS_PENDIENTE"],ODONTOLOGIA:["ODO_PENDIENTE"]}[S.perfil]||[];b=b.concat(bPend(p,e).filter(function(c){return PF.indexOf(c)>-1}))}
var v=e?vista(i,p,e,b):"";
return '<div class="pc"><b>'+esc(p.n||"Sin nombre")+'</b> <span class="m">· '+ed+'</span> <button data-d="'+i+'" style="float:right;padding:3px 9px">✕</button><div class="chips">'+chips(b)+'</div>'+v+'</div>'}).join(""):'<p class="m">Aún no hay miembros. Usa “Cargar ejemplo”.</p>';drawVP()}
function hoy(){return new Date().toISOString().slice(0,10)}
function fd(d){return d?d.split("-").reverse().join("/"):"—"}
var RES={EJECUTADA:"Ejecutada",AUSENTE:"Ausente",RECHAZO:"Rechazo",ABANDONO:"Abandono"},EJE=["","Salud individual","Funciones de la familia","Condiciones materiales y entorno"],FD=/^\d{4}-\d{2}-\d{2}$/;
function estPai(){var n=S.vis.filter(function(v){return v.res==="EJECUTADA"}).length;if(!S.pai.length)return"Sin PAIFAM";var ok=S.pai.every(function(x){var l=x.seg[x.seg.length-1];return l&&l.ok});return n>=4&&ok?"PAIFAM ejecutado":n>=3?"PAIFAM en proceso":"PAIFAM elaborado"}
function genPai(){var ya=function(t){return S.pai.some(function(x){return x.p===t})},add=function(e,t){if(!ya(t))S.pai.push({e:e,p:t,a:"",r:"",seg:[]})};
S.p.forEach(function(p){var e=edad(p.fn);if(!e)return;var b=banP(p);bPend(p,e).filter(function(c){return c!=="VLE_PENDIENTE"}).forEach(function(c){b.push(c)});
b.forEach(function(c){if(["DESERCION_ESCOLAR","GESTANTE","CRONICO","DISCAPACIDAD","VAC_PENDIENTE","CRED_PENDIENTE","PSI_PENDIENTE","EDAD_FALTANTE"].indexOf(c)>-1)add(1,(p.n||"Sin nombre")+": "+L[c][0])})});
banH().forEach(function(c){if(c!=="MONOPARENTAL")add(3,L[c][0])})}
function drawVP(){$("vcnt").textContent="("+S.vis.length+")";
$("vlist").innerHTML=S.vis.length?S.vis.map(function(v,i){return '<div class="pc"><b>'+fd(v.f)+'</b> · '+RES[v.res]+' <button data-vd="'+i+'" style="float:right;padding:3px 9px">✕</button><span class="m">'+(v.resp?esc(v.resp)+" · ":"")+"Próxima: "+fd(v.prox)+'</span></div>'}).join(""):'<p class="m">Aún no hay visitas.</p>';
$("pst").textContent="· "+estPai();var h="";
[1,2,3].forEach(function(e){var it=S.pai.map(function(x,i){return[x,i]}).filter(function(z){return z[0].e===e});if(!it.length)return;
h+='<div class="pc"><b>'+EJE[e]+'</b>'+it.map(function(z){var x=z[0],i=z[1],l=x.seg[x.seg.length-1];
return '<div class="prog">'+esc(x.p)+(x.a?'<span class="m">Acuerdo: '+esc(x.a)+'</span>':"")+(x.r?'<span class="m">Responsable: '+esc(x.r)+'</span>':"")+'<span class="m">'+(l?(l.ok?"✓ Cumplido ":"✗ No cumplido ")+fd(l.f):"Sin seguimiento")+'</span><button data-ps="1" data-pi="'+i+'" style="padding:3px 9px">✓</button> <button data-ps="0" data-pi="'+i+'" style="padding:3px 9px">✗</button> <button data-pd="'+i+'" style="padding:3px 9px;float:right">Quitar</button></div>'}).join("")+'</div>'});
$("plist").innerHTML=h||'<p class="m">Aún no hay acuerdos.</p>'}
function limV(a){return(Array.isArray(a)?a:[]).map(function(v){return{f:FD.test(v.f||"")?v.f:hoy(),res:RES[v.res]?v.res:"EJECUTADA",resp:String(v.resp||"").slice(0,80),prox:FD.test(v.prox||"")?v.prox:""}})}
function limP(a){return(Array.isArray(a)?a:[]).map(function(x){return{e:[1,2,3].indexOf(+x.e)>-1?+x.e:1,p:String(x.p||"").slice(0,160),a:String(x.a||"").slice(0,160),r:String(x.r||"").slice(0,80),seg:(Array.isArray(x.seg)?x.seg:[]).map(function(q){return{f:FD.test(q.f||"")?q.f:hoy(),ok:!!q.ok}})}})}
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
return{n:String(x.n||"").slice(0,80),fn:/^\d{4}-\d{2}-\d{2}$/.test(x.fn||"")?x.fn:"",sx:/^[FM]$/.test(x.sx||"")?x.sx:"",fe:!!x.fe,ges:!!x.ges,lac:!!x.lac,cro:!!x.cro,dis:!!x.dis,esc:!!x.esc,vac:v}});
return{h:h,p:p,vis:limV(o.vis),pai:limP(o.pai)}}
function claveOk(){var c=$("clave").value;if(!(window.crypto&&crypto.subtle)){msg("Este navegador o esta dirección no permite cifrar. Usa https.");return null}if(c.length<8){msg("La clave debe tener al menos 8 caracteres.");return null}return c}
function exportar(){var c=claveOk();if(!c)return;msg("Cifrando…",true);
cifrar(c,{h:S.h,p:S.p,vis:S.vis,pai:S.pai,fecha:new Date().toISOString()}).then(function(t){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"application/json"}));a.download="ficha-familiar-"+new Date().toISOString().slice(0,10)+".ffd";document.body.appendChild(a);a.click();a.remove();msg("Archivo cifrado descargado. Guarda tu clave: sin ella no se puede abrir.",true)}).catch(function(){msg("No se pudo cifrar.")})}
function importar(file){var c=claveOk();if(!c)return;var r=new FileReader();
r.onload=function(){descifrar(c,r.result).then(limpiar).then(function(d){if(!confirm("Se reemplazarán los datos de este dispositivo. ¿Continuar?")){msg("Importación cancelada.");return}S.h=d.h;S.p=d.p;S.vis=d.vis;S.pai=d.pai;save();draw();msg("Datos importados: "+d.p.length+" miembros.",true)}).catch(function(){msg("Clave incorrecta o archivo dañado.")})};
r.readAsText(file)}

document.addEventListener("click",function(ev){var t=ev.target;
if(t.dataset.p){S.perfil=t.dataset.p}else if(t.dataset.d){S.p.splice(+t.dataset.d,1)}
else if(t.id==="add"){var tx=$("fn").value.trim(),f=parseF(tx),fe=false;if(tx&&!f){$("fmsg").textContent="La fecha no es válida. Escribe dd/mm/aaaa.";return}
if(!f&&($("ea").value||$("em").value)){f=estF($("ea").value,$("em").value);fe=true}$("fmsg").textContent="";
S.p.push({n:$("nom").value.trim(),sx:$("sx").value,fn:f,fe:fe,ges:!$("wges").hidden&&$("ges").checked,lac:!$("wlac").hidden&&$("lac").checked,cro:$("cro").checked,dis:$("dis").checked,esc:!$("wesc").hidden&&$("esc").checked,vac:{}});["nom","fn","ea","em"].forEach(function(k){$(k).value=""});$("sx").value="";["ges","lac","cro","dis","esc"].forEach(function(k){$(k).checked=false});mostrar()}
else if(t.id==="demo"){S.h={agua:"pozo",san:"pozo_ciego",comb:"lenia_sin_chimenea",dorm:1,tratada:false,vect:true,mono:false};S.p=[{n:"Abuela Rosa",sx:"F",fn:rel(68*12),cro:true,vac:{}},{n:"Madre Ana",sx:"F",fn:rel(30*12),ges:true,vac:{}},{n:"Luis",sx:"M",fn:rel(14*12),esc:true,vac:{}},{n:"Camila",sx:"F",fn:rel(38),vac:{}},{n:"Bebé Mateo",sx:"M",fn:rel(5),vac:{}}]}
else if(t.id==="clr"){S.p=[];S.vis=[];S.pai=[];S.h=Object.assign({},H0)}
else if(t.id==="vadd"){S.vis.push({f:$("vf").value||hoy(),res:$("vr").value,resp:$("vp").value.trim().slice(0,80),prox:$("vx").value});["vf","vp","vx"].forEach(function(k){$(k).value=""})}
else if(t.dataset.vd){S.vis.splice(+t.dataset.vd,1)}
else if(t.id==="padd"){var pp=$("pp").value.trim();if(!pp)return;S.pai.push({e:+$("pe").value,p:pp.slice(0,160),a:$("pa").value.trim().slice(0,160),r:$("pr").value.trim().slice(0,80),seg:[]});["pp","pa","pr"].forEach(function(k){$(k).value=""})}
else if(t.id==="pgen"){genPai()}
else if(t.dataset.pd){S.pai.splice(+t.dataset.pd,1)}
else if(t.dataset.ps){var q=S.pai[+t.dataset.pi];if(q)q.seg.push({f:hoy(),ok:t.dataset.ps==="1"})}
else if(t.id==="exp"){exportar();return}
else if(t.id==="imp"){$("arch").click();return}else return;
save();draw()});
document.addEventListener("change",function(ev){var t=ev.target;
if(t.dataset&&t.dataset.v){var p=S.p[+t.dataset.i];if(!p)return;p.vac=p.vac||{};if(t.checked)p.vac[t.dataset.v]=new Date().toISOString().slice(0,10);else delete p.vac[t.dataset.v];save();draw()}
else if(t.id==="arch"&&t.files[0]){importar(t.files[0]);t.value=""}});
["agua","san","comb","dorm","tratada","vect","mono"].forEach(function(k){$(k).addEventListener("change",function(){var el=$(k);S.h[k]=el.type==="checkbox"?el.checked:k==="dorm"?Math.max(1,+el.value||1):el.value;save();draw()})});
$("fn").addEventListener("input",function(){this.value=fmtF(this.value);mostrar()});["sx","ea","em"].forEach(function(k){$(k).addEventListener("input",mostrar)});
draw();mostrar();
