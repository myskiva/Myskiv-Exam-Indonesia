const f=(v,d=2)=>v==null?'—':(+v).toFixed(d).replace('.',',');
const avg=v=>{const a=v.filter(x=>x!=null);return a.reduce((p,c)=>p+c,0)/a.length};
const COL=['#2c5282','#7a8ba0','#a3492f'];
function reg(ys,vs){const p=ys.map((y,i)=>[y,vs[i]]).filter(q=>q[1]!=null),n=p.length;let sx=0,sy=0,sxy=0,sxx=0;
p.forEach(([x,y])=>{sx+=x;sy+=y;sxy+=x*y;sxx+=x*x});const b=(n*sxy-sx*sy)/(n*sxx-sx*sx),a=(sy-b*sx)/n;return{b,l:ys.map(x=>+(a+b*x).toFixed(3))}}
const el=(h)=>{const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild};
document.getElementById('legend').innerHTML=Object.values(ST).map(s=>`<span><i style="background:${s[1]}"></i>${s[0]}</span>`).join('');
const pos=[],neg=[];
const root=document.getElementById('root'),rows=[];
DATA.forEach((sec,si)=>{
const S=el(`<section class="sec" id="s${si}"><h2>${sec.t}</h2></section>`);
sec.b.forEach((b,bi)=>{
const vis=b.s.filter(x=>!x[2]),main=vis[0],m=avg(main[1]),r=reg(b.y,main[1]),up=r.b>0,id=`c${si}_${bi}`;
const st=b.st&&ST[b.st],per=b.per||`${b.y[0]}–${b.y[b.y.length-1]}`;
let h=`<article class="card"><h3>${b.t}${st?`<span class="badge" style="background:${st[1]}">${st[0]}</span>`:''}</h3>
<div class="cv"><canvas id="${id}" role="img" aria-label="Графік: ${b.t}"></canvas></div>
<div class="tw"><table><thead><tr><th>Показник</th>${b.y.map(y=>`<th>${y}</th>`).join('')}<th>Середнє</th></tr></thead><tbody>`;
b.s.forEach(x=>{h+=`<tr><td>${x[0]}</td>${x[1].map(v=>`<td>${f(v)}</td>`).join('')}<td class="av">${f(avg(x[1]))}</td></tr>`});
h+=`</tbody></table></div>`;
if(st)h+=`<p>Економічна безпека Індонезії в період ${per} знаходилася <strong>${st[2]}</strong>, бо середнє значення (${f(m)}) було в інтервалі ${b.rng}.</p>
<p>Лінія тренду показує ${up?'зростання':'спадання'}, тобто тенденція <strong>${b.good?'позитивна':'негативна'}</strong>.</p>`;
else h+=`<p>Лінія тренду показує ${up?'зростання':'спадання'} співвідношення; середнє значення — ${f(m)}.</p>`;
S.appendChild(el(h+'</article>'));
if(st){(b.good?pos:neg).push(b.t);rows.push(`<tr><td>${b.t}</td><td>${per}</td><td>${f(m)}</td><td>${b.rng}</td><td><span class="badge" style="background:${st[1]};margin:0">${st[0]}</span></td><td>${up?'Зростання':'Спадання'}, ${b.good?'позитивна':'негативна'}</td></tr>`)}
b._id=id;b._r=r;b._v=vis;
});
S.appendChild(el(`<div class="concl"><strong>Висновок.</strong> ${sec.c}</div>`));
root.appendChild(S)});
document.getElementById('sumtab').innerHTML=`<table><thead><tr><th>Показник</th><th>Період</th><th>Фактичне середнє</th><th>Порогове значення рівня</th><th>Рівень безпеки</th><th>Тренд</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
document.getElementById('trends').innerHTML=`<p><strong>Безпечні (позитивні) тенденції:</strong> ${pos.join('; ')}.</p><p><strong>Небезпечні (негативні) тенденції:</strong> ${neg.join('; ')}. Борг зростає — це ризик для бюджету.</p>`;
const bandPlugin={id:'bands',beforeDatasetsDraw(c){const bs=c.config.options.bands;if(!bs)return;const{ctx,chartArea:r,scales:{y}}=c;
bs.forEach(b=>{if(b.hi<y.min||b.lo>y.max)return;const t=y.getPixelForValue(Math.min(b.hi,y.max)),u=y.getPixelForValue(Math.max(b.lo,y.min));
ctx.save();ctx.fillStyle=ST[b.st][1]+'33';ctx.fillRect(r.left,t,r.right-r.left,u-t);ctx.fillStyle=ST[b.st][1];ctx.font='600 12px sans-serif';
ctx.fillText(ST[b.st][0],r.left+6,t+15);ctx.restore()})}};
Chart.register(bandPlugin);
Chart.defaults.font.family="'Source Sans 3',sans-serif";
DATA.forEach(sec=>sec.b.forEach(b=>{
const ds=b._v.map((x,i)=>({label:x[0],data:x[1],borderColor:COL[i],backgroundColor:COL[i],tension:.2,pointRadius:4,spanGaps:false}));
ds.push({label:'Лінія тренду',data:b._r.l,borderColor:'#1c2736',borderDash:[6,5],pointRadius:0,borderWidth:2});
new Chart(document.getElementById(b._id),{type:'line',data:{labels:b.y,datasets:ds},options:{bands:b.bands,responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}})}));
