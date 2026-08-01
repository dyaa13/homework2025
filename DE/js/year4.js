'use strict';

/* Year 4 configuration and question bank. */
YEAR_CONFIGS[4] = {"title":"Year 4 Rapid Fire Mental Maths","skillLabel":"Year 4 Skill","mixed":"Mixed Year 4 Skills","labels":{"addition":"Addition","subtraction":"Subtraction","multiplication":"Multiplication","division":"Division","placevalue":"Place Value","rounding":"Rounding & Estimation","missing":"Missing Numbers & Inverse Operations","doubles":"Doubles, Halves & Near Doubles","factors":"Factors, Multiples & Divisibility","fractions":"Fractions Basics","time":"Time","measurements":"Measurement Conversions","perimeterArea":"Perimeter & Area","sequences":"Sequences & Patterns","mixed":"Mixed Year 4 Skills","review":"Mistake Review"},"skills":["addition","subtraction","multiplication","division","placevalue","rounding","missing","doubles","factors","fractions","time","measurements","perimeterArea","sequences"],"levels":[["starter","Starter"],["core","Core"],["challenge","Challenge"]],"teacher":"Year 4 now includes 14 targeted banks: the four operations plus place value, rounding and estimation, inverse operations, doubles and halves, factors and divisibility, fractions, time, measurement, perimeter and area, and sequences."};
BASE_STORAGE_BY_YEAR[4] = {"stars":"dyaaRapidStars","hero":"dyaaRapidHero","best":"dyaaRapidBest","mistakes":"dyaaRapidMistakes"};

/* ===== YEAR 4 QUESTION GENERATORS ===== */

function y4GenAdd(){let a,b;if(state.level==='starter'){a=randInt(1,18);b=randInt(1,Math.min(10,20-a))}else if(state.level==='core'){a=randInt(12,79);b=randInt(3,Math.min(30,99-a))}else{a=randInt(18,78);b=randInt(12,Math.min(49,99-a))}return{operation:'addition',text:`${a} + ${b} = ?`,answer:a+b,hint:'Think: bridge to the next ten.'}}


function y4GenSub(){let a,b;if(state.level==='starter'){a=randInt(8,20);b=randInt(1,Math.min(10,a))}else if(state.level==='core'){a=randInt(25,99);b=randInt(3,Math.min(35,a-1))}else{a=randInt(45,99);b=randInt(12,Math.min(49,a-1))}return{operation:'subtraction',text:`${a} − ${b} = ?`,answer:a-b,hint:'Think: subtract tens, then subtract ones.'}}


function y4Facts(){return state.level==='starter'?[2,5,10]:state.level==='core'?[2,3,4,5,6,7,8,9,10]:[2,3,4,5,6,7,8,9,10,11,12]}


function y4GenMul(){const a=pick(y4Facts()),b=randInt(1,state.level==='challenge'?12:10),p=a*b;if(state.level==='challenge'&&Math.random()<.25)return{operation:'multiplication',text:`${a} × □ = ${p}`,answer:b,hint:`Use the inverse: ${p} ÷ ${a}.`};return{operation:'multiplication',text:`${a} × ${b} = ?`,answer:p,hint:`Recall the ${a} times table.`}}


function y4GenDiv(){const d=pick(y4Facts()),q=randInt(1,state.level==='challenge'?12:10),n=d*q;if(state.level==='challenge'&&Math.random()<.25)return{operation:'division',text:`□ ÷ ${d} = ${q}`,answer:n,hint:`Think: ${d} × ${q}.`};return{operation:'division',text:`${n} ÷ ${d} = ?`,answer:q,hint:`Think: ${d} × ? = ${n}.`}}


function y4GenPlaceValue(){
  const L=state.level;
  const t=L==='starter'?randInt(1,3):L==='core'?randInt(1,5):randInt(1,7);

  if(t===1){
    const max=L==='starter'?999:L==='core'?9999:99999;
    const min=L==='starter'?100:L==='core'?1000:10000;
    const n=randInt(min,max);
    const places=L==='starter'?[1,10,100]:L==='core'?[1,10,100,1000]:[1,10,100,1000,10000];
    const place=pick(places);
    const digit=Math.floor(n/place)%10;
    const name={1:'ones',10:'tens',100:'hundreds',1000:'thousands',10000:'ten-thousands'}[place];
    return q('placevalue',`In ${n}, the value of the ${name} digit is ?`,digit*place,'Digit value = digit × place value.');
  }

  if(t===2){
    const thousands=L==='starter'?0:randInt(1,L==='core'?9:40);
    const hundreds=randInt(0,9),tens=randInt(0,9),ones=randInt(0,9);
    const n=thousands*1000+hundreds*100+tens*10+ones;
    const parts=[];
    if(thousands)parts.push(`${thousands*1000}`);
    if(hundreds)parts.push(`${hundreds*100}`);
    if(tens)parts.push(`${tens*10}`);
    if(ones||!parts.length)parts.push(`${ones}`);
    return q('placevalue',`${parts.join(' + ')} = ?`,n,'Add the place-value parts.');
  }

  if(t===3){
    const max=L==='starter'?999:L==='core'?9999:99999;
    const min=L==='starter'?100:L==='core'?1000:10000;
    const n=randInt(min,max);
    const place=L==='starter'?pick([1,10,100]):L==='core'?pick([1,10,100,1000]):pick([1,10,100,1000,10000]);
    const digit=Math.floor(n/place)%10;
    const name={1:'ones',10:'tens',100:'hundreds',1000:'thousands',10000:'ten-thousands'}[place];
    return q('placevalue',`What digit is in the ${name} place of ${n}?`,digit,'Read the digit in the named place.');
  }

  if(t===4){
    const thousands=randInt(1,L==='core'?9:30),hundreds=randInt(0,9),tens=randInt(0,9),ones=randInt(0,9);
    return q('placevalue',`${thousands} thousands + ${hundreds} hundreds + ${tens} tens + ${ones} ones = ?`,thousands*1000+hundreds*100+tens*10+ones,'Build the number from each place.');
  }

  if(t===5){
    const n=randInt(1000,L==='core'?9999:49999);
    const step=pick([10,100,1000]);
    const add=chance(.5);
    return q('placevalue',`${n} ${add?'plus':'minus'} ${step} = ?`,add?n+step:n-step,'Only the matching place-value digit changes, unless regrouping is needed.');
  }

  if(t===6){
    const a=randInt(1,9),b=randInt(0,9),c=randInt(0,9),d=randInt(0,9);
    const n=a*1000+b*100+c*10+d;
    const swapped=a*1000+c*100+b*10+d;
    return q('placevalue',`Swap the hundreds and tens digits in ${n}. New number = ?`,swapped,'Exchange only the hundreds and tens digits.');
  }

  const n=randInt(10000,99999);
  return q('placevalue',`Number immediately after ${n} = ?`,n+1,'Add 1 and regroup if needed.');
}


function y4GenRounding(){
  const L=state.level;
  const t=L==='starter'?randInt(1,3):L==='core'?randInt(1,5):randInt(1,7);

  if(t===1){
    const n=randInt(11,L==='starter'?999:4999);
    return q('rounding',`Round ${n} to the nearest 10.`,Math.round(n/10)*10,'Look at the ones digit.');
  }

  if(t===2){
    const n=randInt(101,L==='starter'?999:9999);
    return q('rounding',`Round ${n} to the nearest 100.`,Math.round(n/100)*100,'Look at the tens digit.');
  }

  if(t===3){
    const a=randInt(120,490),b=randInt(110,480);
    const ans=Math.round(a/100)*100+Math.round(b/100)*100;
    return q('rounding',`Estimate ${a} + ${b} by rounding both numbers to the nearest 100.`,ans,'Round each number first, then add.');
  }

  if(t===4){
    const a=randInt(420,990),b=randInt(110,Math.min(480,a-20));
    const ans=Math.round(a/100)*100-Math.round(b/100)*100;
    return q('rounding',`Estimate ${a} − ${b} by rounding both numbers to the nearest 100.`,ans,'Round each number first, then subtract.');
  }

  if(t===5){
    const n=randInt(1001,9999);
    return q('rounding',`Round ${n} to the nearest 1000.`,Math.round(n/1000)*1000,'Look at the hundreds digit.');
  }

  if(t===6){
    const a=randInt(21,89),b=randInt(2,9);
    return q('rounding',`Estimate ${a} × ${b} by rounding ${a} to the nearest 10.`,Math.round(a/10)*10*b,'Round the two-digit factor, then multiply.');
  }

  const n=randInt(1000,9999),target=pick([10,100,1000]);
  return q('rounding',`Round ${n} to the nearest ${target}.`,Math.round(n/target)*target,'Check the digit immediately to the right of the rounding place.');
}


function y4GenMissing(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);

  if(t===1){
    const x=randInt(2,L==='starter'?40:120),b=randInt(2,L==='starter'?30:90);
    return q('missing',`□ + ${b} = ${x+b}`,x,'Use subtraction to undo addition.');
  }

  if(t===2){
    const x=randInt(2,L==='starter'?50:140),b=randInt(2,L==='starter'?30:90);
    return q('missing',`${x+b} − □ = ${b}`,x,'Find the difference between the starting number and the result.');
  }

  if(t===3){
    const a=pick(L==='starter'?[2,5,10]:[2,3,4,5,6,7,8,9,10,11,12]),x=randInt(2,12);
    return q('missing',`${a} × □ = ${a*x}`,x,'Use the inverse division fact.');
  }

  if(t===4){
    const d=pick(L==='starter'?[2,5,10]:[2,3,4,5,6,7,8,9,10,11,12]),x=randInt(2,12);
    return q('missing',`${d*x} ÷ □ = ${x}`,d,'Use the related multiplication fact.');
  }

  if(t===5){
    const x=randInt(2,80),b=randInt(2,60);
    return q('missing',`□ − ${b} = ${x}`,x+b,'Undo subtraction by adding.');
  }

  if(t===6){
    const d=randInt(2,10),x=randInt(2,15);
    return q('missing',`□ ÷ ${d} = ${x}`,d*x,'Multiply the divisor by the quotient.');
  }

  if(t===7){
    const a=randInt(2,8),x=randInt(2,12),b=randInt(1,9);
    return q('missing',`${a} × □ + ${b} = ${a*x+b}`,x,'Subtract the final amount, then divide.');
  }

  const d=pick([2,4,5,8,10]),x=randInt(2,12),start=randInt(x*d+15,x*d+60);
  return q('missing',`${start} − □ ÷ ${d} = ${start-x}`,x*d,'Find the amount subtracted, then multiply by the divisor.');
}


function y4GenDoubles(){
  const L=state.level;
  const t=L==='starter'?randInt(1,3):L==='core'?randInt(1,5):randInt(1,7);

  if(t===1){
    const n=randInt(2,L==='starter'?50:L==='core'?150:300);
    return q('doubles',`Double ${n} = ?`,n*2,'Add the number to itself.');
  }

  if(t===2){
    const half=randInt(2,L==='starter'?50:L==='core'?150:300);
    return q('doubles',`Half of ${half*2} = ?`,half,'Split the number into two equal parts.');
  }

  if(t===3){
    const n=randInt(5,L==='starter'?45:L==='core'?120:250);
    return q('doubles',`${n} + ${n+1} = ?`,n*2+1,'Use double the smaller number, then add 1.');
  }

  if(t===4){
    const n=randInt(10,150);
    return q('doubles',`${n} + ${n-1} = ?`,n*2-1,'Use double the larger number, then subtract 1.');
  }

  if(t===5){
    const n=randInt(20,180),add=randInt(2,20);
    return q('doubles',`Double ${n}, then add ${add}.`,n*2+add,'Double first, then add.');
  }

  if(t===6){
    const half=randInt(30,240),sub=randInt(2,Math.min(25,half-1));
    return q('doubles',`Half of ${half*2}, then subtract ${sub}.`,half-sub,'Find half first, then subtract.');
  }

  const n=randInt(20,200),offset=pick([2,3,4,5]);
  return q('doubles',`${n-offset} + ${n+offset} = ?`,2*n,'The equal offsets cancel, leaving double the middle number.');
}


function y4GenFactors(){
  const L=state.level;
  const t=L==='starter'?randInt(1,3):L==='core'?randInt(1,6):randInt(1,8);

  if(t===1){
    const base=randInt(2,L==='starter'?10:12),k=randInt(2,10),n=base*k;
    return q('factors',`Is ${n} a multiple of ${base}? Enter 1 for Yes, 0 for No.`,1,'A multiple divides exactly by the given number.');
  }

  if(t===2){
    const base=randInt(2,L==='starter'?10:12),k=randInt(2,10),n=base*k+1;
    return q('factors',`Is ${n} a multiple of ${base}? Enter 1 for Yes, 0 for No.`,0,'Check whether division leaves a remainder.');
  }

  if(t===3){
    const base=randInt(2,L==='starter'?10:12),k=randInt(1,8);
    return q('factors',`Next multiple of ${base} after ${base*k} = ?`,base*(k+1),'Add one more group of the base number.');
  }

  if(t===4){
    const n=pick([12,16,18,20,24,28,30,32,36,40,42,48]);
    const factor=pick(Array.from({length:n},(_,i)=>i+1).filter(v=>n%v===0));
    return q('factors',`Is ${factor} a factor of ${n}? Enter 1 for Yes, 0 for No.`,1,'A factor divides the number exactly.');
  }

  if(t===5){
    const n=pick([12,16,18,20,24,28,30,32,36,40,42,48]);
    const pairs=[];
    for(let i=1;i*i<=n;i++)if(n%i===0)pairs.push(i);
    return q('factors',`How many factor pairs does ${n} have?`,pairs.length,'List pairs whose product is the number.');
  }

  if(t===6){
    const divisor=pick([2,5,10]),n=randInt(10,99);
    return q('factors',`Is ${n} divisible by ${divisor}? Enter 1 for Yes, 0 for No.`,n%divisor===0?1:0,divisor===2?'Check whether the last digit is even.':'Check the last digit.');
  }

  if(t===7){
    const divisor=pick([3,4,6,9]),n=randInt(20,150);
    return q('factors',`Is ${n} divisible by ${divisor}? Enter 1 for Yes, 0 for No.`,n%divisor===0?1:0,'Use a known divisibility rule or divide mentally.');
  }

  const base=randInt(3,12),threshold=randInt(3,10)*base+randInt(1,base-1);
  return q('factors',`Smallest multiple of ${base} greater than ${threshold} = ?`,Math.ceil((threshold+1)/base)*base,'Move to the next exact multiple.');
}


function y4GenFractions(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);

  if(t===1){
    const [n,d]=pick(L==='starter'?[[1,2],[1,3],[1,4],[1,5]]:[[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5]]),k=randInt(2,L==='starter'?10:15);
    return q('fractions',`${n}/${d} of ${d*k} = ?`,n*k,'Divide by the denominator, then multiply by the numerator.');
  }

  if(t===2){
    const d=pick([4,5,6,8,10]),n=randInt(1,d-1);
    return q('fractions',`${n}/${d} + ?/${d} = 1. Missing numerator = ?`,d-n,'One whole is denominator over denominator.');
  }

  if(t===3){
    const d=pick([5,6,7,8,9,10]),a=randInt(1,d-2),b=randInt(a+1,d-1);
    return q('fractions',`Which is larger? Enter 1 for ${a}/${d}, or 2 for ${b}/${d}.`,2,'With equal denominators, compare the numerators.');
  }

  if(t===4){
    const d=pick([5,6,7,8,9,10]),a=randInt(1,d-2),b=randInt(1,d-a);
    return qFrac('fractions',`${a}/${d} + ${b}/${d} = ?`,(a+b)/d,'Add the numerators because the denominators are equal.');
  }

  if(t===5){
    const d=pick([5,6,7,8,9,10]),a=randInt(2,d-1),b=randInt(1,a-1);
    return qFrac('fractions',`${a}/${d} − ${b}/${d} = ?`,(a-b)/d,'Subtract the numerators because the denominators are equal.');
  }

  if(t===6){
    const d=pick([2,3,4,5]),n=randInt(1,d-1),scale=pick([2,3,4]);
    return q('fractions',`${n}/${d} = ?/${d*scale}. Missing numerator = ?`,n*scale,'Multiply numerator and denominator by the same number.');
  }

  if(t===7){
    const pairs=pick([[[1,2],[2,4]],[[1,3],[2,6]],[[2,3],[4,6]],[[3,4],[6,8]],[[2,5],[4,10]]]);
    const first=chance(.5)?pairs[0]:pairs[1],second=first===pairs[0]?pairs[1]:pairs[0];
    return q('fractions',`Are ${first[0]}/${first[1]} and ${second[0]}/${second[1]} equivalent? Enter 1 for Yes, 0 for No.`,1,'Equivalent fractions have the same value.');
  }

  if(t===8){
    const d=pick([3,4,5,6,8]),n=randInt(1,d-1),whole=randInt(2,3);
    return qFrac('fractions',`${whole} − ${n}/${d} = ?`,whole-n/d,'Write the whole number using the same denominator.');
  }

  const d=pick([4,5,6,8,10]),a=randInt(1,d-1);let b=randInt(1,d-1);
  while(b===a)b=randInt(1,d-1);
  return q('fractions',`Which is smaller? Enter 1 for ${a}/${d}, or 2 for ${b}/${d}.`,a<b?1:2,'With equal denominators, compare the numerators.');
}


function y4GenTime(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);

  if(t===1){
    const hours=randInt(1,L==='starter'?5:10);
    return q('time',`${hours} hour${hours===1?'':'s'} = ? minutes`,hours*60,'Each hour has 60 minutes.');
  }

  if(t===2){
    const minutes=pick(L==='starter'?[30,60,90,120,150,180]:[30,60,90,120,150,180,210,240]);
    return q('time',`${minutes} minutes = ? hours`,minutes/60,'Divide the number of minutes by 60.');
  }

  if(t===3){
    const hour=randInt(1,11),minute=pick([0,15,30,45]),add=pick([15,30,45,60]);
    const total=hour*60+minute+add,newHour=Math.floor(total/60)%12||12,newMinute=total%60;
    return q('time',`${hour}:${String(minute).padStart(2,'0')} plus ${add} minutes. Enter as HHMM without a colon (for example 0730); a colon is also accepted.`,newHour*100+newMinute,'Add minutes and regroup 60 minutes as 1 hour.');
  }

  if(t===4){
    const startH=randInt(1,10),startM=pick([0,15,30,45]),elapsed=pick([15,30,45,60,75,90]);
    const end=startH*60+startM+elapsed,endH=Math.floor(end/60),endM=end%60;
    return q('time',`From ${startH}:${String(startM).padStart(2,'0')} to ${endH}:${String(endM).padStart(2,'0')} = ? minutes`,elapsed,'Count through the next hour if needed.');
  }

  if(t===5){
    const hour=randInt(2,11),minute=pick([0,10,15,20,30,40,45,50]),sub=pick([10,15,20,30,40,45]);
    const start=hour*60+minute;
    if(start<=sub)return y4GenTime();
    const end=start-sub,endH=Math.floor(end/60),endM=end%60;
    return q('time',`${hour}:${String(minute).padStart(2,'0')} minus ${sub} minutes. Enter as HHMM without a colon (for example 0730); a colon is also accepted.`,endH*100+endM,'Count backwards, crossing the hour if needed.');
  }

  if(t===6){
    const hours=randInt(1,4),extra=pick([15,30,45]);
    return q('time',`${hours} hour${hours===1?'':'s'} ${extra} minutes = ? minutes`,hours*60+extra,'Convert the hours to minutes, then add.');
  }

  if(t===7){
    const startH=randInt(8,15),startM=pick([5,10,15,20,25,30,35,40,45,50]),elapsed=pick([35,45,50,55,65,75,85,95]);
    const end=startH*60+startM+elapsed,endH=Math.floor(end/60),endM=end%60;
    return q('time',`A lesson starts at ${startH}:${String(startM).padStart(2,'0')} and lasts ${elapsed} minutes. Enter as HHMM without a colon (for example 0730); a colon is also accepted.`,endH*100+endM,'Add the duration to the start time.');
  }

  const startH=randInt(8,14),startM=pick([5,10,20,25,35,40,50]),elapsed=pick([45,55,65,75,85,95]);
  const end=startH*60+startM+elapsed,endH=Math.floor(end/60),endM=end%60;
  return q('time',`How many minutes from ${startH}:${String(startM).padStart(2,'0')} to ${endH}:${String(endM).padStart(2,'0')}?`,elapsed,'Bridge to the next hour, then count the rest.');
}


function y4GenMeasurements(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);

  if(t===1){const n=randInt(1,L==='starter'?9:25);return q('measurements',`${n} m = ? cm`,n*100,'1 m = 100 cm.');}
  if(t===2){const n=randInt(1,L==='starter'?8:15);return q('measurements',`${n} km = ? m`,n*1000,'1 km = 1000 m.');}
  if(t===3){const n=randInt(1,L==='starter'?8:15);return q('measurements',`${n} kg = ? g`,n*1000,'1 kg = 1000 g.');}
  if(t===4){const n=randInt(1,L==='starter'?8:15);return q('measurements',`${n} L = ? mL`,n*1000,'1 L = 1000 mL.');}
  if(t===5){const m=randInt(1,9),cm=pick([10,20,25,30,40,50,60,75,80,90]);return q('measurements',`${m} m ${cm} cm = ? cm`,m*100+cm,'Convert metres to centimetres, then add.');}
  if(t===6){const kg=randInt(1,8),g=pick([100,200,250,300,400,500,600,750,800,900]);return q('measurements',`${kg} kg ${g} g = ? g`,kg*1000+g,'Convert kilograms to grams, then add.');}
  if(t===7){const l=randInt(1,8),ml=pick([100,200,250,300,400,500,600,750,800,900]);return q('measurements',`${l} L ${ml} mL = ? mL`,l*1000+ml,'Convert litres to millilitres, then add.');}
  if(t===8){const km=randInt(1,6),m=pick([100,200,250,300,400,500,600,750,800,900]);return q('measurements',`${km} km ${m} m = ? m`,km*1000+m,'Convert kilometres to metres, then add.');}
  const units=pick([[100,'cm','m'],[1000,'m','km'],[1000,'g','kg'],[1000,'mL','L']]),whole=randInt(2,12);
  return q('measurements',`${whole*units[0]} ${units[1]} = ? ${units[2]}`,whole,`Divide by ${units[0]}.`);
}


function y4GenPerimeterArea(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);

  if(t===1){const l=randInt(3,L==='starter'?12:20),w=randInt(2,Math.min(l-1,L==='starter'?9:15));return q('perimeterArea',`Rectangle ${l} cm by ${w} cm. Perimeter = ? cm`,2*(l+w),'Perimeter = 2 × (length + width).');}
  if(t===2){const l=randInt(3,L==='starter'?12:20),w=randInt(2,Math.min(l-1,L==='starter'?9:15));return q('perimeterArea',`Rectangle ${l} cm by ${w} cm. Area = ? cm²`,l*w,'Area = length × width.');}
  if(t===3){const s=randInt(2,L==='starter'?12:20);return q('perimeterArea',`Square side ${s} cm. Perimeter = ? cm`,4*s,'A square has four equal sides.');}
  if(t===4){const s=randInt(2,L==='starter'?12:20);return q('perimeterArea',`Square side ${s} cm. Area = ? cm²`,s*s,'Square area = side × side.');}
  if(t===5){const s=randInt(3,20);return q('perimeterArea',`A square has perimeter ${4*s} cm. Side length = ? cm`,s,'Divide the perimeter by 4.');}
  if(t===6){const l=randInt(4,18),w=randInt(2,l-1);return q('perimeterArea',`Rectangle area ${l*w} cm² and length ${l} cm. Width = ? cm`,w,'Width = area ÷ length.');}
  if(t===7){const l=randInt(6,24),w=randInt(3,l-2),p=2*(l+w);return q('perimeterArea',`Rectangle perimeter ${p} cm and length ${l} cm. Width = ? cm`,w,'Width = perimeter ÷ 2 − length.');}
  const s=randInt(3,20);return q('perimeterArea',`A square has area ${s*s} cm². Side length = ? cm`,s,'Find the number multiplied by itself to make the area.');
}


function y4GenSequences(){
  const L=state.level;
  const t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);

  if(t===1){const a=randInt(1,30),d=randInt(2,L==='starter'?8:12);return q('sequences',`${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ... next = ?`,a+4*d,'Add the same amount each time.');}
  if(t===2){const d=randInt(2,L==='starter'?8:12),a=randInt(4*d+5,100);return q('sequences',`${a}, ${a-d}, ${a-2*d}, ${a-3*d}, ... next = ?`,a-4*d,'Subtract the same amount each time.');}
  if(t===3){const a=randInt(1,20),d=randInt(2,9);return q('sequences',`${a}, ${a+d}, □, ${a+3*d}, ${a+4*d}. Missing term = ?`,a+2*d,'The difference between consecutive terms stays the same.');}
  if(t===4){const a=randInt(1,8),r=pick([2,3]);return q('sequences',`${a}, ${a*r}, ${a*r*r}, ${a*r*r*r}, ... next = ?`,a*r**4,'Multiply by the same number each time.');}
  if(t===5){const a=randInt(1,15),d=randInt(2,8),n=randInt(5,10);return q('sequences',`Sequence starts at ${a} and increases by ${d}. Term ${n} = ?`,a+(n-1)*d,'Add the step (n−1) times.');}
  if(t===6){const input=randInt(2,15),mult=randInt(2,5),add=randInt(1,9);return q('sequences',`Rule: ×${mult}, then +${add}. Input ${input}. Output = ?`,input*mult+add,'Follow the operations in order.');}
  if(t===7){const a=randInt(1,10),d=randInt(2,8),n=randInt(5,12),term=a+(n-1)*d;return q('sequences',`In ${a}, ${a+d}, ${a+2*d}, ... which term equals ${term}?`,n,'Count how many equal steps are needed from the first term.');}
  const a=randInt(1,5),b=randInt(2,8);return q('sequences',`${a}, ${a+b}, ${a+b+1}, ${a+2*b+1}, ${a+2*b+3}, ... next = ?`,a+3*b+3,'The additions alternate between a fixed jump and growing small jumps.');
}

YEAR_BANKS[4] = {
  "addition": y4GenAdd,
  "subtraction": y4GenSub,
  "multiplication": y4GenMul,
  "division": y4GenDiv,
  "placevalue": y4GenPlaceValue,
  "rounding": y4GenRounding,
  "missing": y4GenMissing,
  "doubles": y4GenDoubles,
  "factors": y4GenFactors,
  "fractions": y4GenFractions,
  "time": y4GenTime,
  "measurements": y4GenMeasurements,
  "perimeterArea": y4GenPerimeterArea,
  "sequences": y4GenSequences
};
