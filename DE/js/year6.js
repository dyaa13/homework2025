'use strict';

/* Year 6 configuration and question bank. */
YEAR_CONFIGS[6] = {"title":"Year 6 Rapid Fire Mental Maths","skillLabel":"Year 6 Skill","mixed":"Mixed Year 6 Skills","labels":{"addsub":"Addition & Subtraction","multdiv":"Multiplication & Division","order":"Order of Operations","factors":"Factors, Multiples & Primes","fractions":"Fractions","decimals":"Decimals","decimalShift":"Decimal Multiplication & Division","percentages":"Percentages","ratio":"Ratio & Proportion","negatives":"Negative Numbers","units":"Units & Time","mixed":"Mixed Year 6 Skills","review":"Mistake Review","placeRounding":"Place Value, Rounding & Estimation","inverseOperations":"Missing Numbers & Inverse Operations","fdpConversions":"Fraction, Decimal & Percentage Conversion","mixedFractions":"Mixed Numbers & Equivalent Fractions","equationsMachines":"Simple Equations & Function Machines","sequencesPatterns":"Sequences & Number Patterns","statistics":"Mean, Median, Mode & Range","perimeterAreaVolume":"Perimeter, Area & Volume","speedDistanceTime":"Speed, Distance & Time","probability":"Basic Probability"},"skills":["addsub","multdiv","order","factors","fractions","decimals","decimalShift","percentages","ratio","negatives","units","placeRounding","inverseOperations","fdpConversions","mixedFractions","equationsMachines","sequencesPatterns","statistics","perimeterAreaVolume","speedDistanceTime","probability"],"levels":[["starter","Starter — Year 5 Review"],["core","Core — Year 6"],["challenge","Challenge — Year 6+"]],"teacher":"Year 6 now includes 21 targeted banks, with a separate decimal multiplication and division section covering place-value shifts, decimal × decimal, and exact decimal ÷ decimal calculations."};
BASE_STORAGE_BY_YEAR[6] = {"stars":"dyaaY6RapidStars","hero":"dyaaY6RapidHero","best":"dyaaY6RapidBest","mistakes":"dyaaY6RapidMistakes"};

/* ===== YEAR 6 QUESTION GENERATORS ===== */

function y6GenAddSub(){
  if(state.level==='starter'){
    if(chance(.5)){const a=randInt(120,780),b=randInt(2,18)*10;return{operation:'addsub',text:`${a} + ${b} = ?`,answer:a+b,hint:'Add the tens first, then check the place values.'}}
    const a=randInt(260,950),b=randInt(3,18)*10;return{operation:'addsub',text:`${a} − ${b} = ?`,answer:a-b,hint:'Subtract the tens in parts.'}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const a=pick([298,398,498,598,698]),b=pick([105,205,304]);return{operation:'addsub',text:`${a} + ${b} = ?`,answer:a+b,hint:'Compensate to the nearest hundred.'}}
    if(type===2){const a=pick([1000,1200,1500,2000]),b=randInt(225,675);return{operation:'addsub',text:`${a} − ${b} = ?`,answer:a-b,hint:'Count up from the smaller number.'}}
    if(type===3){const a=randInt(350,850),b=randInt(125,300),c=randInt(20,90);return{operation:'addsub',text:`${a} − ${b} + ${c} = ?`,answer:a-b+c,hint:'Work from left to right.'}}
    const total=randInt(700,1600),known=randInt(220,total-120);return{operation:'addsub',text:`□ + ${known} = ${total}`,answer:total-known,hint:`Work backwards: ${total} − ${known}.`}
  }
  const type=randInt(1,4);
  if(type===1){const a=randInt(1200,4800),b=pick([198,299,398,499]);return{operation:'addsub',text:`${a} + ${b} = ?`,answer:a+b,hint:'Add the next hundred, then adjust.'}}
  if(type===2){const a=randInt(2000,7000),b=pick([499,798,999,1499]);return{operation:'addsub',text:`${a} − ${b} = ?`,answer:a-b,hint:'Subtract a nearby round number, then compensate.'}}
  if(type===3){const a=randInt(900,2200),b=randInt(250,650),c=randInt(140,480);return{operation:'addsub',text:`${a} − ${b} + ${c} = ?`,answer:a-b+c,hint:'Complete the subtraction before the addition.'}}
  const a=randInt(1200,3500),difference=randInt(350,950);return{operation:'addsub',text:`${a} − □ = ${difference}`,answer:a-difference,hint:'Find the difference between the result and the starting number.'}
}


function y6GenMultDiv(){
  const L=state.level;

  if(chance(.18)){
    if(L==='starter'||chance(.5)){
      const count=L==='starter'?pick([4,5,6]):pick([5,6,8,10]);
      const mean=L==='starter'?randInt(4,15):L==='core'?randInt(6,24):randInt(8,35);
      const total=count*mean;
      const context=pick([
        `The mean score of ${count} students is ${mean}. What is their total score?`,
        `${count} game scores have a mean of ${mean}. What is the total of the scores?`,
        `The average number of pages read by ${count} students is ${mean}. How many pages did they read altogether?`
      ]);
      return{
        operation:'multdiv',
        text:context,
        answer:total,
        hint:'Total = mean × number of values.'
      };
    }

    const count=L==='core'?pick([4,5]):pick([4,5,6]);
    const mean=L==='core'?randInt(8,20):randInt(10,30);
    const maximumChange=Math.min(6,mean-2);
    let change=randInt(-maximumChange,maximumChange);

    if(change===0){
      change=2;
    }

    const missing=mean+change;
    const known=[mean-change];

    while(known.length<count-1){
      known.push(mean);
    }

    for(let i=known.length-1;i>0;i--){
      const j=randInt(0,i);
      [known[i],known[j]]=[known[j],known[i]];
    }

    return{
      operation:'multdiv',
      text:`The mean of ${known.join(', ')} and one missing number is ${mean}. Find the missing number.`,
      answer:missing,
      hint:`First find the total: ${mean} × ${count}. Then subtract the known values.`
    };
  }

  if(state.level==='starter'){
    if(chance(.5)){const a=randInt(12,39),b=randInt(3,9);return{operation:'multdiv',text:`${a} × ${b} = ?`,answer:a*b,hint:`Partition ${a} into tens and ones.`}}
    const d=randInt(3,9),q=randInt(12,45);return{operation:'multdiv',text:`${d*q} ÷ ${d} = ?`,answer:q,hint:`Use ${d} × ? = ${d*q}.`}
  }
  if(state.level==='core'){
    const type=randInt(1,5);
    if(type===1){const a=pick([12,15,18,20,25,30,40,50]),b=pick([4,6,8,12,16]);return{operation:'multdiv',text:`${a} × ${b} = ?`,answer:a*b,hint:'Use doubling, halving or partitioning.'}}
    if(type===2){const a=pick([19,29,39,49,99]),b=randInt(3,9);return{operation:'multdiv',text:`${a} × ${b} = ?`,answer:a*b,hint:'Multiply the nearby round number, then adjust.'}}
    if(type===3){const divisor=pick([4,5,8,10,20,25]),q=randInt(4,36);return{operation:'multdiv',text:`${divisor*q} ÷ ${divisor} = ?`,answer:q,hint:'Use a known multiplication fact.'}}
    if(type===4){const n=randInt(12,89),m=pick([10,100,1000]);return{operation:'multdiv',text:`${n} × ${m} = ?`,answer:n*m,hint:'Shift every digit to a place with a value ten, hundred or thousand times greater.'}}
    const q=randInt(12,95),m=pick([10,100]);return{operation:'multdiv',text:`${q*m} ÷ ${m} = ?`,answer:q,hint:'Shift every digit to a place with a smaller value.'}
  }
  const type=randInt(1,5);
  if(type===1){const pair=pick([[25,24],[25,36],[125,8],[24,25],[48,25],[15,32]]);return{operation:'multdiv',text:`${pair[0]} × ${pair[1]} = ?`,answer:pair[0]*pair[1],hint:'Use quarters, doubles or a nearby round number.'}}
  if(type===2){const a=pick([98,99,101]),b=randInt(4,12);return{operation:'multdiv',text:`${a} × ${b} = ?`,answer:a*b,hint:'Use 100 × the number, then compensate.'}}
  if(type===3){const divisor=pick([12,15,16,20,24,25,40]),q=randInt(4,30);return{operation:'multdiv',text:`${divisor*q} ÷ ${divisor} = ?`,answer:q,hint:'Factor the divisor or use the inverse multiplication.'}}
  if(type===4){const q=randInt(12,80);return{operation:'multdiv',text:`${q*1000} ÷ 1000 = ?`,answer:q,hint:'Divide by one thousand using place value.'}}
  const a=pick([18,24,25,32,36,45]),b=pick([4,5,8,10,12]);const p=a*b;return{operation:'multdiv',text:`${a} × □ = ${p}`,answer:b,hint:`Use ${p} ÷ ${a}.`}
}


function y6GenOrder(){
  if(state.level==='starter'){
    if(chance(.5)){const a=randInt(8,30),b=randInt(2,8),c=randInt(2,9);return{operation:'order',text:`${a} + ${b} × ${c} = ?`,answer:a+b*c,hint:'Multiply before adding.'}}
    const b=randInt(3,8),q=randInt(4,12),a=randInt(8,30);return{operation:'order',text:`${b*q} ÷ ${b} + ${a} = ?`,answer:q+a,hint:'Divide before adding.'}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const a=randInt(4,9),b=randInt(9,18),c=randInt(2,b-2);return{operation:'order',text:`${a} × (${b} − ${c}) = ?`,answer:a*(b-c),hint:'Complete the brackets first.'}}
    if(type===2){const d=randInt(3,8),q=randInt(5,12),a=randInt(25,70),m=randInt(2,5);return{operation:'order',text:`${a} − ${d*q} ÷ ${d} × ${m} = ?`,answer:a-q*m,hint:'Do division and multiplication from left to right.'}}
    if(type===3){const d=randInt(3,8),q=randInt(6,14),a=randInt(4,d*q-4),b=d*q-a,m=randInt(2,5);return{operation:'order',text:`(${a} + ${b}) ÷ ${d} × ${m} = ?`,answer:q*m,hint:'Brackets first, then work left to right.'}}
    const a=randInt(8,20),b=randInt(3,8),c=randInt(2,7),d=randInt(5,20);return{operation:'order',text:`${a} + ${b} × ${c} − ${d} = ?`,answer:a+b*c-d,hint:'Multiply before adding and subtracting.'}
  }
  const type=randInt(1,4);
  if(type===1){const a=randInt(3,9),b=randInt(12,24),c=randInt(3,10),d=randInt(4,20);return{operation:'order',text:`${a} × (${b} − ${c}) + ${d} = ?`,answer:a*(b-c)+d,hint:'Brackets, multiplication, then addition.'}}
  if(type===2){const d=randInt(3,8),q=randInt(8,16),a=randInt(30,80),m=randInt(2,6),add=randInt(5,20);return{operation:'order',text:`${a} − ${d*q} ÷ ${d} × ${m} + ${add} = ?`,answer:a-q*m+add,hint:'Do division and multiplication from left to right.'}}
  if(type===3){const divisor=randInt(3,8),q=randInt(8,16),x=randInt(5,divisor*q-5),y=divisor*q-x,m=randInt(3,7),sub=randInt(4,18);return{operation:'order',text:`(${x} + ${y}) ÷ ${divisor} × ${m} − ${sub} = ?`,answer:q*m-sub,hint:'Finish the brackets before division and multiplication.'}}
  const a=randInt(3,8),b=randInt(4,10),c=randInt(2,8),d=randInt(2,6);return{operation:'order',text:`${a} × (${b} + ${c}) ÷ ${d} = ?`,answer:a*(b+c)/d,hint:'Brackets first. The numbers are chosen to give an exact answer.'}
}


function y6GenFactors(){
  const type=state.level==='starter'?randInt(1,3):state.level==='core'?randInt(1,6):randInt(1,8);
  if(type===1){const a=pick([12,18,24,30,36,42]),b=pick([16,20,24,28,32,40]);return{operation:'factors',text:`HCF of ${a} and ${b} = ?`,answer:gcd(a,b),hint:'List common factors and choose the greatest.'}}
  if(type===2){const a=pick([3,4,5,6,8,9,10,12]),b=pick([4,5,6,8,10,12]);return{operation:'factors',text:`LCM of ${a} and ${b} = ?`,answer:lcm(a,b),hint:'Find the first common multiple.'}}
  if(type===3){const n=pick([19,23,29,31,37,41,43]);return{operation:'factors',text:`Next prime after ${n} = ?`,answer:nextPrime(n),hint:'Test the following numbers for divisibility.'}}
  if(type===4){const n=randInt(6,15);return{operation:'factors',text:`${n}² = ?`,answer:n*n,hint:'A square number is the number multiplied by itself.'}}
  if(type===5){const n=pick([12,18,20,24,28,30,36,40]);return{operation:'factors',text:`How many factors does ${n} have?`,answer:countFactors(n),hint:'Count every whole number that divides exactly.'}}
  if(type===6){const n=pick([42,54,66,70,78,84,90]);return{operation:'factors',text:`Smallest prime factor of ${n} = ?`,answer:smallestPrimeFactor(n),hint:'Test 2, then 3, then 5.'}}
  if(type===7){const n=randInt(3,9);return{operation:'factors',text:`${n}³ = ?`,answer:n*n*n,hint:'Multiply the number by itself three times.'}}
  const a=pick([18,24,30,36,42]),b=pick([24,32,40,48,54]);return{operation:'factors',text:`HCF(${a}, ${b}) + 2 = ?`,answer:gcd(a,b)+2,hint:'Find the HCF first, then add 2.'}
}


function y6GenFractions(){
  if(state.level!=='starter'&&chance(.2)){
    const pair=state.level==='core'
      ?pick([[2,3],[3,4],[2,5],[3,5],[5,6],[3,8]])
      :pick([[3,4],[5,6],[4,7],[5,8],[7,10],[7,12]]);
    const [num,den]=pair;
    const scale=state.level==='core'?randInt(4,15):randInt(6,24);
    const whole=den*scale;
    const part=num*scale;
    const scenario=pick([
      `${num}/${den} of a class is ${part} students. How many students are in the whole class?`,
      `${num}/${den} of a collection is ${part} items. How many items are there altogether?`,
      `${num}/${den} of a ribbon is ${part} cm. What is the full length of the ribbon?`,
      `${num}/${den} of a number is ${part}. What is the number?`
    ]);
    return{
      operation:'fractions',
      text:scenario,
      answer:whole,
      hint:`First find 1/${den}, then multiply by ${den}.`
    };
  }

  if(state.level==='starter'){
    const [num,den]=pick([[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5]]),k=randInt(3,14),whole=den*k;return{operation:'fractions',text:`${num}/${den} of ${whole} = ?`,answer:num*k,hint:`Divide ${whole} by ${den}, then multiply by ${num}.`}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const [num,den]=pick([[2,3],[3,4],[2,5],[3,5],[5,6],[3,8],[5,8]]),k=randInt(4,16),whole=den*k;return{operation:'fractions',text:`${num}/${den} of ${whole} = ?`,answer:num*k,hint:'Find one part first, then multiply.'}}
    if(type===2){const [n,d,m]=pick([[3,4,20],[2,3,18],[3,5,25],[5,6,24],[3,8,32]]);return{operation:'fractions',text:`${n}/${d} = ?/${m}`,answer:n*m/d,hint:'Multiply numerator and denominator by the same number.'}}
    if(type===3){const d=pick([4,5,6,8,10,12]),a=randInt(1,d-2),b=randInt(1,d-a);return{operation:'fractions',text:`${a}/${d} + ${b}/${d} = ?/${d}`,answer:a+b,hint:'Add the numerators because the denominators are equal.'}}
    const pair=pick([[1,2,1,4,4],[1,3,1,6,6],[1,4,3,8,8],[2,3,1,6,6]]);const [a,b,c,d,out]=pair;return{operation:'fractions',text:`${a}/${b} + ${c}/${d} = ?/${out}`,answer:a*out/b+c*out/d,hint:`Convert both fractions to denominator ${out}.`}
  }
  const type=randInt(1,5);
  if(type===1){const pair=pick([[1,3,1,4,12],[2,5,1,4,20],[3,8,1,4,8],[5,6,1,3,6]]);const [a,b,c,d,out]=pair;return{operation:'fractions',text:`${a}/${b} + ${c}/${d} = ?/${out}`,answer:a*out/b+c*out/d,hint:`Use denominator ${out}.`}}
  if(type===2){const pair=pick([[3,4,1,3,12],[5,6,1,4,12],[7,8,1,2,8],[4,5,3,10,10]]);const [a,b,c,d,out]=pair;return{operation:'fractions',text:`${a}/${b} − ${c}/${d} = ?/${out}`,answer:a*out/b-c*out/d,hint:`Convert both fractions to denominator ${out}.`}}
  if(type===3){const d=pick([4,5,6,8,10]),n=randInt(1,d-1),whole=randInt(2,4);return{operation:'fractions',text:`${whole} − ${n}/${d} = ?/${d}`,answer:whole*d-n,hint:`Write ${whole} as ${whole*d}/${d}.`}}
  if(type===4){const [n,d]=pick([[12,18],[15,25],[21,28],[24,36],[35,49]]),g=gcd(n,d);return{operation:'fractions',text:`${n}/${d} = ?/${d/g}`,answer:n/g,hint:'Divide the numerator and denominator by their HCF.'}}
  const [num,den]=pick([[5,6],[7,8],[3,5],[7,10]]),k=randInt(6,18),whole=den*k;return{operation:'fractions',text:`${num}/${den} of ${whole} = ?`,answer:num*k,hint:'Divide by the denominator, then multiply by the numerator.'}
}


function y6GenDecimals(){
  if(state.level==='starter'){
    if(chance(.5)){const a=randInt(10,89)/10,b=randInt(1,30)/10;return{operation:'decimals',text:`${fmt(a)} + ${fmt(b)} = ?`,answer:round2(a+b),hint:'Line up the decimal points.'}}
    const a=randInt(35,99)/10,b=randInt(1,Math.floor(a*10)-1)/10;return{operation:'decimals',text:`${fmt(a)} − ${fmt(b)} = ?`,answer:round2(a-b),hint:'Subtract tenths from tenths.'}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const a=randInt(120,850)/100,b=randInt(15,250)/100;return{operation:'decimals',text:`${fmt(a)} + ${fmt(b)} = ?`,answer:round2(a+b),hint:'Line up the decimal points.'}}
    if(type===2){const a=randInt(400,999)/100,b=randInt(10,Math.floor(a*100)-10)/100;return{operation:'decimals',text:`${fmt(a)} − ${fmt(b)} = ?`,answer:round2(a-b),hint:'Use place value carefully.'}}
    if(type===3){const n=randInt(12,999)/100,m=pick([10,100]);return{operation:'decimals',text:`${fmt(n)} × ${m} = ?`,answer:round2(n*m),hint:'Move each digit one or two places to the left.'}}
    const n=randInt(12,999),m=pick([10,100]);return{operation:'decimals',text:`${n} ÷ ${m} = ?`,answer:round2(n/m),hint:'Move each digit one or two places to the right.'}
  }
  const type=randInt(1,5);
  if(type===1){const a=randInt(150,850)/100,b=randInt(25,250)/100,c=randInt(5,90)/100;return{operation:'decimals',text:`${fmt(a)} + ${fmt(b)} − ${fmt(c)} = ?`,answer:round2(a+b-c),hint:'Work from left to right and line up decimal points.'}}
  if(type===2){const n=randInt(10,99)/100;return{operation:'decimals',text:`${fmt(n)} + □ = 1`,answer:round2(1-n),hint:'Find the complement to 1.'}}
  if(type===3){const n=randInt(101,899)/100;return{operation:'decimals',text:`${fmt(n)} + □ = 10`,answer:round2(10-n),hint:'Find the complement to 10.'}}
  if(type===4){const n=randInt(120,999)/100;return{operation:'decimals',text:`${fmt(n)} × 100 = ?`,answer:round2(n*100),hint:'Use place value, not a decimal-point shortcut.'}}
  const a=randInt(250,950)/100,b=pick([.25,.5,.75,1.25]);return{operation:'decimals',text:`${fmt(a)} + ${fmt(b)} = ?`,answer:round2(a+b),hint:'Use quarters and halves where helpful.'}
}


function y6GenDecimalShift() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 6)
    : L === 'core'
      ? randInt(1, 10)
      : randInt(1, 12);

  if (type === 1) {
    const number = randInt(1, L === 'starter' ? 999 : 9999) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} × 10 = ?`,
      number * 10,
      'Move every digit 1 place to the left.'
    );
  }

  if (type === 2) {
    const number = randInt(1, L === 'starter' ? 999 : 9999) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} ÷ 10 = ?`,
      number / 10,
      'Move every digit 1 place to the right.'
    );
  }

  if (type === 3) {
    const number = randInt(1, L === 'starter' ? 999 : 9999) / 100;

    return q(
      'decimalShift',
      `${fmt(number)} × 100 = ?`,
      number * 100,
      'Move every digit 2 places to the left.'
    );
  }

  if (type === 4) {
    const number = randInt(1, L === 'starter' ? 9999 : 99999) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} ÷ 100 = ?`,
      number / 100,
      'Move every digit 2 places to the right.'
    );
  }

  if (type === 5) {
    const number = randInt(1, 999) / 100;
    const factor = pick([0.1, 0.01]);

    return q(
      'decimalShift',
      `${fmt(number)} × ${fmt(factor)} = ?`,
      number * factor,
      factor === 0.1
        ? 'Multiplying by 0.1 moves every digit 1 place to the right.'
        : 'Multiplying by 0.01 moves every digit 2 places to the right.'
    );
  }

  if (type === 6) {
    const number = randInt(1, 999) / 100;
    const divisor = pick([0.1, 0.01]);

    return q(
      'decimalShift',
      `${fmt(number)} ÷ ${fmt(divisor)} = ?`,
      number / divisor,
      divisor === 0.1
        ? 'Dividing by 0.1 moves every digit 1 place to the left.'
        : 'Dividing by 0.01 moves every digit 2 places to the left.'
    );
  }

  if (type === 7) {
    const first = randInt(11, 99) / 10;
    const second = randInt(2, 9) / 10;

    return q(
      'decimalShift',
      `${fmt(first)} × ${fmt(second)} = ?`,
      first * second,
      'Multiply as whole numbers, then count 2 decimal places altogether.'
    );
  }

  if (type === 8) {
    const divisorTenths = randInt(2, 9);
    const quotient = randInt(2, 20);
    const divisor = divisorTenths / 10;
    const dividend = divisorTenths * quotient / 10;

    return q(
      'decimalShift',
      `${fmt(dividend)} ÷ ${fmt(divisor)} = ?`,
      quotient,
      'Multiply both numbers by 10 to make the divisor a whole number.'
    );
  }

  if (type === 9) {
    const first = randInt(11, 999) / 100;
    const second = randInt(2, 9) / 10;

    return q(
      'decimalShift',
      `${fmt(first)} × ${fmt(second)} = ?`,
      first * second,
      'Multiply the digits first, then count all decimal places.'
    );
  }

  if (type === 10) {
    const divisorHundredths = randInt(2, 9);
    const quotient = randInt(2, 25);
    const divisor = divisorHundredths / 100;
    const dividend = divisorHundredths * quotient / 100;

    return q(
      'decimalShift',
      `${fmt(dividend)} ÷ ${fmt(divisor)} = ?`,
      quotient,
      'Multiply both numbers by 100 to make the divisor a whole number.'
    );
  }

  if (type === 11) {
    const first = randInt(11, 99) / 10;
    const second = pick([0.02, 0.03, 0.04, 0.05]);

    return q(
      'decimalShift',
      `${fmt(first)} × ${fmt(second)} = ?`,
      first * second,
      'Multiply as whole numbers, then count all decimal places in both factors.'
    );
  }

  const divisorHundredths = randInt(2, 12);
  const quotientTenths = randInt(2, 20);
  const divisor = divisorHundredths / 100;
  const quotient = quotientTenths / 10;
  const dividend = divisorHundredths * quotientTenths / 1000;

  return q(
    'decimalShift',
    `${fmt(dividend)} ÷ ${fmt(divisor)} = ?`,
    quotient,
    'Multiply both numbers by 100, then complete the division.'
  );
}

function y6GenPercentages(){
  if(state.level==='starter'){
    const percent=pick([10,25,50]),base=percent===25?pick([20,40,60,80,100,120]):percent===10?randInt(2,30)*10:randInt(2,30)*2;return{operation:'percentages',text:`${percent}% of ${base} = ?`,answer:base*percent/100,hint:percent===10?'Divide by 10.':percent===50?'Find one half.':'Find one quarter.'}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const percent=pick([10,20,25,50,75]),base=pick([40,60,80,100,120,160,200,240,300]);return{operation:'percentages',text:`${percent}% of ${base} = ?`,answer:base*percent/100,hint:'Use 10%, one quarter or one half as a building block.'}}
    if(type===2){const decimal=pick([.1,.2,.25,.4,.5,.6,.75,.8]);return{operation:'percentages',text:`${fmt(decimal)} = ?%`,answer:decimal*100,hint:'Multiply the decimal by 100.'}}
    if(type===3){const [n,d]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5]]);return{operation:'percentages',text:`${n}/${d} = ?%`,answer:n/d*100,hint:'Convert the fraction to an equivalent fraction out of 100.'}}
    const price=pick([40,60,80,100,120,200]),discount=pick([10,20,25]);return{operation:'percentages',text:`$${price} after ${discount}% off = $?`,answer:price*(1-discount/100),hint:'Find the discount, then subtract it from the price.'}
  }
  const type=randInt(1,5);
  if(type===1){const percent=pick([5,15,30,35,60,70]),base=pick([40,60,80,100,120,160,200,240]);return{operation:'percentages',text:`${percent}% of ${base} = ?`,answer:base*percent/100,hint:'Build the percentage from 10%, 5%, 25% or 50%.'}}
  if(type===2){const price=pick([60,80,120,160,200,240]),discount=pick([15,20,25,30]);return{operation:'percentages',text:`$${price} after ${discount}% off = $?`,answer:round2(price*(1-discount/100)),hint:'Find the percentage discount before subtracting.'}}
  if(type===3){const n=pick([40,60,80,120,160,200]),increase=pick([10,20,25]);return{operation:'percentages',text:`Increase ${n} by ${increase}%`,answer:n*(1+increase/100),hint:'Find the increase, then add it.'}}
  if(type===4){const decimal=pick([.35,.45,.65,.85,.125]);return{operation:'percentages',text:`${fmt(decimal)} = ?%`,answer:decimal*100,hint:'Multiply by 100.'}}
  const part=pick([12,15,18,20,24,25,30]),whole=pick([40,50,60,80,100,120]);if(part>=whole)return y6GenPercentages();return{operation:'percentages',text:`${part} is what % of ${whole}?`,answer:round2(part/whole*100),hint:'Divide the part by the whole, then multiply by 100.'}
}


function y6GenRatio(){
  if(state.level==='starter'){
    const a=randInt(2,6),b=randInt(3,8),k=randInt(2,6);return{operation:'ratio',text:`${a}:${b} = ${a*k}:?`,answer:b*k,hint:`Both parts are multiplied by ${k}.`}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const a=randInt(2,7),b=randInt(3,9),k=randInt(2,8);return{operation:'ratio',text:`${a}:${b} = ${a*k}:?`,answer:b*k,hint:'Scale both parts by the same factor.'}}
    if(type===2){const a=randInt(2,5),b=randInt(3,7),k=randInt(3,9);return{operation:'ratio',text:`Red:Blue = ${a}:${b}. Red = ${a*k}. Blue = ?`,answer:b*k,hint:`The scale factor is ${k}.`}}
    if(type===3){const items=pick([3,4,5,6]),unit=pick([2,3,4,5,6]),cost=items*unit;return{operation:'ratio',text:`${items} pens cost $${cost}. 1 pen costs $?`,answer:unit,hint:'Divide the total cost by the number of pens.'}}
    const a=randInt(2,5),b=randInt(2,6),k=randInt(3,8),total=(a+b)*k;return{operation:'ratio',text:`Ratio ${a}:${b}, total ${total}. Larger share = ?`,answer:Math.max(a,b)*k,hint:'Find one part, then multiply by the larger ratio number.'}
  }
  const type=randInt(1,4);
  if(type===1){const a=randInt(2,7),b=randInt(3,9),x=randInt(3,10)*a;return{operation:'ratio',text:`${a}:${b} = ${x}:?`,answer:x/a*b,hint:'Find the scale factor from the first pair.'}}
  if(type===2){const a=randInt(2,5),b=randInt(3,7),k=randInt(4,12),total=(a+b)*k;return{operation:'ratio',text:`Ratio ${a}:${b}, total ${total}. Smaller share = ?`,answer:Math.min(a,b)*k,hint:'Divide the total by the total number of ratio parts.'}}
  if(type===3){const recipe=pick([[3,5],[2,7],[4,9]]),scale=randInt(3,8);return{operation:'ratio',text:`Flour:Sugar = ${recipe[0]}:${recipe[1]}. Flour ${recipe[0]*scale} cups. Sugar = ?`,answer:recipe[1]*scale,hint:'Use the same scale factor for both ingredients.'}}
  const distance=pick([60,80,90,120,150]),hours=pick([2,3,4,5]);return{operation:'ratio',text:`${distance} km in ${hours} h. km per hour = ?`,answer:distance/hours,hint:'Divide the distance by the time.'}
}


function y6GenNegatives(){
  if(state.level==='starter'){
    if(chance(.5)){const a=randInt(1,9),b=randInt(a+1,15);return{operation:'negatives',text:`−${a} + ${b} = ?`,answer:b-a,hint:'Move right from the negative number.'}}
    const a=randInt(1,10),b=randInt(a+1,15);return{operation:'negatives',text:`${a} − ${b} = ?`,answer:a-b,hint:'The result crosses zero.'}
  }
  if(state.level==='core'){
    const type=randInt(1,4);
    if(type===1){const a=randInt(2,15),b=randInt(2,15);return{operation:'negatives',text:`−${a} + ${b} = ?`,answer:b-a,hint:'Compare the distances from zero.'}}
    if(type===2){const a=randInt(2,15),b=randInt(2,15);return{operation:'negatives',text:`−${a} − ${b} = ?`,answer:-a-b,hint:'Subtracting a positive number moves further left.'}}
    if(type===3){const start=-randInt(2,10),rise=randInt(4,16);return{operation:'negatives',text:`${start}°C rises by ${rise}°. New temperature = ?`,answer:start+rise,hint:'Add the rise to the starting temperature.'}}
    const low=-randInt(3,12),high=randInt(2,14);return{operation:'negatives',text:`Difference between ${low} and ${high} = ?`,answer:high-low,hint:'Count the distance across zero.'}
  }
  const type=randInt(1,4);
  if(type===1){const a=randInt(3,15),b=randInt(2,12),c=randInt(2,10);return{operation:'negatives',text:`−${a} + ${b} − ${c} = ?`,answer:-a+b-c,hint:'Work from left to right on a number line.'}}
  if(type===2){const a=randInt(2,12),b=randInt(3,15);return{operation:'negatives',text:`−${a} − (−${b}) = ?`,answer:-a+b,hint:'Subtracting a negative is the same as adding.'}}
  if(type===3){const start=-randInt(2,12),rise=randInt(5,20),fall=randInt(2,10);return{operation:'negatives',text:`${start}°C rises ${rise}°, then falls ${fall}°. Final = ?`,answer:start+rise-fall,hint:'Apply the rise, then the fall.'}}
  const low=-randInt(8,20),high=randInt(5,18);return{operation:'negatives',text:`How far from ${low} to ${high}?`,answer:high-low,hint:'Find the distance between the two integers.'}
}


function y6GenUnits(){
  const L=state.level;

  if(chance(.28)){
    const newTypes=L==='starter'
      ?['rectangleArea','squarePerimeter','elapsed']
      :L==='core'
        ?['rectangleArea','squarePerimeter','rectanglePerimeter','elapsed','speed']
        :['rectangleArea','squarePerimeter','rectanglePerimeter','elapsed','speed'];

    const newType=pick(newTypes);

    if(newType==='rectangleArea'){
      const width=L==='starter'?randInt(2,9):L==='core'?randInt(3,15):randInt(4,24);
      const length=L==='starter'?randInt(width+1,width+7):L==='core'?randInt(width+2,width+14):randInt(width+3,width+24);
      const area=length*width;
      const scenario=pick([
        `A rectangular floor has an area of ${area} m² and a length of ${length} m. What is its width?`,
        `A rectangular garden has an area of ${area} m². Its length is ${length} m. Find its width.`,
        `A rectangular card has an area of ${area} cm² and a length of ${length} cm. How wide is it?`,
        `A rectangle has an area of ${area} cm² and a length of ${length} cm. What is its width?`
      ]);
      return{
        operation:'units',
        text:scenario,
        answer:width,
        hint:'Width = area ÷ length.'
      };
    }

    if(newType==='squarePerimeter'){
      const side=L==='starter'?randInt(2,12):L==='core'?randInt(4,20):randInt(6,35);
      const perimeter=side*4;
      const scenario=pick([
        `A square garden has a perimeter of ${perimeter} m. What is the length of one side?`,
        `A square playground has a perimeter of ${perimeter} m. Find the side length.`,
        `A square picture frame has a perimeter of ${perimeter} cm. How long is each side?`,
        `A square tile has a perimeter of ${perimeter} cm. What is its side length?`
      ]);
      return{
        operation:'units',
        text:scenario,
        answer:side,
        hint:'A square has 4 equal sides. Side length = perimeter ÷ 4.'
      };
    }

    if(newType==='rectanglePerimeter'){
      const width=L==='core'?randInt(3,14):randInt(5,24);
      const length=L==='core'?randInt(width+2,width+14):randInt(width+3,width+24);
      const perimeter=2*(length+width);
      const scenario=pick([
        `A rectangular garden has a perimeter of ${perimeter} m and a length of ${length} m. What is its width?`,
        `A rectangular playground is ${length} m long. Its perimeter is ${perimeter} m. How wide is it?`,
        `A rectangular frame has a perimeter of ${perimeter} cm and a length of ${length} cm. Find its width.`,
        `A rectangular noticeboard is ${length} cm long and has a perimeter of ${perimeter} cm. What is its width?`
      ]);
      return{
        operation:'units',
        text:scenario,
        answer:width,
        hint:'Width = perimeter ÷ 2 − length.'
      };
    }

    if(newType==='elapsed'){
      const startHour=L==='starter'?randInt(9,14):L==='core'?randInt(8,15):randInt(7,20);
      const startMinute=L==='starter'?pick([0,15,30,45]):pick([5,10,15,20,25,30,35,40,45,50]);
      const elapsed=L==='starter'?pick([15,30,45,60]):L==='core'?pick([25,35,45,50,65,75,85]):pick([45,55,65,75,85,95,110,125]);
      const startTotal=startHour*60+startMinute;
      const endTotal=startTotal+elapsed;
      const endHour24=Math.floor(endTotal/60)%24;
      const endMinute=endTotal%60;
      const displayHour=h=>h===0?12:h>12?h-12:h;
      const ampm=h=>h<12?'am':'pm';
      return{
        operation:'units',
        text:`A lesson starts at ${displayHour(startHour)}:${String(startMinute).padStart(2,'0')} ${ampm(startHour)} and ends at ${displayHour(endHour24)}:${String(endMinute).padStart(2,'0')} ${ampm(endHour24)}. How many minutes does it last?`,
        answer:elapsed,
        hint:'Count to the next hour, then add the remaining minutes.'
      };
    }

    const questionKind=pick(['distance','speed','time']);

    if(questionKind==='distance'){
      const speed=L==='core'?pick([12,15,18,20,24,30,40,50,60]):pick([18,24,30,36,45,50,60,72,80]);
      const time=L==='core'?randInt(2,5):randInt(2,7);
      return{
        operation:'units',
        text:`A cyclist travels at ${speed} km/h for ${time} hours. How far does the cyclist travel?`,
        answer:speed*time,
        hint:'Distance = speed × time.'
      };
    }

    if(questionKind==='speed'){
      const speed=L==='core'?pick([20,30,40,50,60]):pick([24,36,45,50,60,72,80]);
      const time=L==='core'?randInt(2,5):randInt(2,7);
      const distance=speed*time;
      return{
        operation:'units',
        text:`A vehicle travels ${distance} km in ${time} hours. What is its average speed in km/h?`,
        answer:speed,
        hint:'Speed = distance ÷ time.'
      };
    }

    const time=L==='core'?randInt(2,5):randInt(2,7);
    const speed=L==='core'?pick([20,30,40,50,60]):pick([24,36,45,50,60,72,80]);
    const distance=speed*time;
    return{
      operation:'units',
      text:`A bus travels ${distance} km at ${speed} km/h. How many hours does the journey take?`,
      answer:time,
      hint:'Time = distance ÷ speed.'
    };
  }

  const simple=[
    ()=>{const n=randInt(2,9);return{operation:'units',text:`${n} m = ? cm`,answer:n*100,hint:'1 m = 100 cm.'}},
    ()=>{const n=randInt(2,9);return{operation:'units',text:`${n} kg = ? g`,answer:n*1000,hint:'1 kg = 1000 g.'}},
    ()=>{const n=randInt(2,9);return{operation:'units',text:`${n} L = ? mL`,answer:n*1000,hint:'1 L = 1000 mL.'}},
    ()=>{const n=pick([90,120,150,180,210]);return{operation:'units',text:`${n} minutes = ? hours`,answer:n/60,hint:'Divide the minutes by 60.'}}
  ];
  if(state.level==='starter')return pick(simple)();
  if(state.level==='core'){
    const type=randInt(1,5);
    if(type===1){const n=randInt(12,95)/10;return{operation:'units',text:`${fmt(n)} m = ? cm`,answer:n*100,hint:'Multiply metres by 100.'}}
    if(type===2){const n=randInt(12,95)/10;return{operation:'units',text:`${fmt(n)} kg = ? g`,answer:n*1000,hint:'Multiply kilograms by 1000.'}}
    if(type===3){const n=randInt(12,95)/10;return{operation:'units',text:`${fmt(n)} L = ? mL`,answer:n*1000,hint:'Multiply litres by 1000.'}}
    if(type===4){const startH=randInt(1,4),startM=pick([0,5,10,15,20,25,30,35,40]),elapsed=pick([25,35,45,50,65,75]);const endTotal=startH*60+startM+elapsed,endH=Math.floor(endTotal/60),endM=endTotal%60;return{operation:'units',text:`${startH}:${String(startM).padStart(2,'0')} to ${endH}:${String(endM).padStart(2,'0')} = ? min`,answer:elapsed,hint:'Count to the next hour, then add the remaining minutes.'}}
    const cm=pick([150,225,250,375,480,650]);return{operation:'units',text:`${cm} cm = ? m`,answer:cm/100,hint:'Divide centimetres by 100.'}
  }
  const type=randInt(1,6);
  if(type===1){const g=pick([1250,1750,2250,3500,4750]);return{operation:'units',text:`${g} g = ? kg`,answer:g/1000,hint:'Divide grams by 1000.'}}
  if(type===2){const ml=pick([1250,1750,2250,3500,4750]);return{operation:'units',text:`${ml} mL = ? L`,answer:ml/1000,hint:'Divide millilitres by 1000.'}}
  if(type===3){const startH=randInt(8,11),startM=pick([5,10,15,20,25,35,40,45]),elapsed=pick([45,55,65,75,85,95]);const endTotal=startH*60+startM+elapsed,endH=Math.floor(endTotal/60),endM=endTotal%60;return{operation:'units',text:`${startH}:${String(startM).padStart(2,'0')} to ${endH}:${String(endM).padStart(2,'0')} = ? min`,answer:elapsed,hint:'Bridge through the hour.'}}
  if(type===4){const mins=pick([135,150,165,195,210]);return{operation:'units',text:`${mins} minutes = ? hours`,answer:mins/60,hint:'Divide by 60. A half hour is 0.5.'}}
  if(type===5){const km=pick([1.2,1.5,2.4,3.25,4.5]);return{operation:'units',text:`${fmt(km)} km = ? m`,answer:km*1000,hint:'Multiply kilometres by 1000.'}}
  const m=pick([1.25,1.75,2.4,3.6]);return{operation:'units',text:`${fmt(m)} m + 75 cm = ? cm`,answer:m*100+75,hint:'Convert metres to centimetres before adding.'}
}





/* ===== YEAR 6 ADDED FOCUSED QUESTION GENERATORS ===== */

function y6GenPlaceRounding(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const n=randInt(1000,99999),place=pick([10,100,1000]);return q('placeRounding',`Round ${n} to the nearest ${place}.`,Math.round(n/place)*place,'Look at the digit immediately to the right of the rounding place.');}
  if(t===2){const n=randInt(1000,99999),place=pick([10,100,1000,10000]),digit=Math.floor(n/place)%10;return q('placeRounding',`What is the value of the digit ${digit} in ${n}, when it is in the ${place===10?'tens':place===100?'hundreds':place===1000?'thousands':'ten-thousands'} place?`,digit*place,'Digit value = digit × place value.');}
  if(t===3){const a=randInt(145,895),b=randInt(105,495);return q('placeRounding',`Estimate ${a} + ${b} by rounding each number to the nearest 100.`,Math.round(a/100)*100+Math.round(b/100)*100,'Round both numbers before adding.');}
  if(t===4){const a=randInt(245,995),b=randInt(105,495);return q('placeRounding',`Estimate ${a} − ${b} by rounding each number to the nearest 100.`,Math.round(a/100)*100-Math.round(b/100)*100,'Round both numbers before subtracting.');}
  if(t===5){const n=randInt(1001,9999)/1000,dp=pick([1,2]);return q('placeRounding',`Round ${fmt(n)} to ${dp} decimal place${dp===1?'':'s'}.`,roundTo(n,dp),'Check the next decimal digit.');}
  if(t===6){const a=randInt(31,89),b=randInt(12,48);return q('placeRounding',`Estimate ${a} × ${b} by rounding both numbers to the nearest 10.`,Math.round(a/10)*10*Math.round(b/10)*10,'Round each factor, then multiply.');}
  if(t===7){const divisor=pick([4,5,8,10]),qv=randInt(25,95),friendly=divisor*qv,offset=pick([-3,-2,-1,1,2,3]);return q('placeRounding',`Estimate ${friendly+offset} ÷ ${divisor} using the nearby compatible number ${friendly}.`,qv,'Use the compatible number given.');}
  if(t===8){const n=randInt(10001,999999),place=pick([1000,10000,100000]);return q('placeRounding',`Round ${n} to the nearest ${place}.`,Math.round(n/place)*place,'Use the digit to the right of the target place.');}
  const n=randInt(10001,99999)/1000;return q('placeRounding',`Round ${fmt(n)} to the nearest whole number.`,Math.round(n),'Tenths of 5 or more round up.');
}

function y6GenInverseOperations(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const x=randInt(25,450),a=randInt(20,300);return q('inverseOperations',`□ + ${a} = ${x+a}`,x,'Subtract the known addend from the total.');}
  if(t===2){const x=randInt(25,450),a=randInt(20,300);return q('inverseOperations',`${x+a} − □ = ${a}`,x,'Find the difference between the starting number and the result.');}
  if(t===3){const x=randInt(12,80),a=randInt(3,12);return q('inverseOperations',`${a} × □ = ${a*x}`,x,'Use the inverse division.');}
  if(t===4){const x=randInt(12,80),a=randInt(3,12);return q('inverseOperations',`□ ÷ ${a} = ${x}`,a*x,'Multiply the quotient by the divisor.');}
  if(t===5){const x=randInt(3,30),a=randInt(2,9),b=randInt(2,20);return q('inverseOperations',`${a} × □ + ${b} = ${a*x+b}`,x,'Subtract the constant, then divide.');}
  if(t===6){const x=randInt(3,30),a=randInt(2,9),b=randInt(2,20);return q('inverseOperations',`${a} × □ − ${b} = ${a*x-b}`,x,'Add the constant, then divide.');}
  if(t===7){const divisor=randInt(2,9),x=randInt(4,30),b=randInt(1,10);return q('inverseOperations',`□ ÷ ${divisor} + ${b} = ${x+b}`,x*divisor,'Subtract first, then multiply by the divisor.');}
  if(t===8){const divisor=randInt(2,9),x=randInt(4,30),b=randInt(1,10);return q('inverseOperations',`${x*divisor} ÷ □ − ${b} = ${x-b}`,divisor,'Undo the subtraction, then identify the divisor.');}
  const x=randInt(3,25),a=randInt(2,7),b=randInt(2,8);return q('inverseOperations',`${a}(□ + ${b}) = ${a*(x+b)}`,x,'Divide by the outside factor, then subtract.');
}

function y6GenFDPConversions(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  const simple=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10],[7,10]]);
  if(t===1){const [n,d]=simple;return q('fdpConversions',`${n}/${d} as a decimal = ?`,n/d,'Divide the numerator by the denominator.');}
  if(t===2){const [n,d]=simple;return q('fdpConversions',`${n}/${d} as a percentage = ?%`,n/d*100,'Convert to a decimal, then multiply by 100.');}
  if(t===3){const p=pick([10,20,25,40,50,60,75,80,90]);return q('fdpConversions',`${p}% as a decimal = ?`,p/100,'Divide the percentage by 100.');}
  if(t===4){const d=pick([0.1,0.2,0.25,0.4,0.5,0.6,0.75,0.8,0.9]);return q('fdpConversions',`${fmt(d)} as a percentage = ?%`,d*100,'Multiply the decimal by 100.');}
  if(t===5){const [n,d]=pick([[1,8],[3,8],[5,8],[7,8],[1,20],[3,20],[7,20],[9,20]]);return q('fdpConversions',`${n}/${d} as a percentage = ?%`,n/d*100,'Use an equivalent fraction out of 100 or convert to a decimal.');}
  if(t===6){const v=pick([0.125,0.2,0.25,0.375,0.4,0.5,0.625,0.75,0.8,0.875]);return qFrac('fdpConversions',`${fmt(v)} as a simplest fraction = ?`,v,'Write the decimal over a power of 10 and simplify.');}
  if(t===7){const p=pick([12.5,20,25,37.5,40,50,62.5,75,80,87.5]);return qFrac('fdpConversions',`${fmt(p)}% as a simplest fraction = ?`,p/100,'Write the percentage over 100 and simplify.');}
  if(t===8){const a=pick([0.35,0.45,0.55,0.65,0.75]),[n,d]=pick([[1,3],[2,5],[1,2],[3,5],[2,3]]);return q('fdpConversions',`Which is larger? Enter 1 for ${fmt(a)}, or 2 for ${n}/${d}.`,a>n/d?1:2,'Convert both numbers to the same form.');}
  const vals=pick([[0.6,5,8],[0.4,3,8],[0.75,4,5],[0.35,1,3]]);return q('fdpConversions',`Which is larger? Enter 1 for ${fmt(vals[0])}, or 2 for ${vals[1]}/${vals[2]}.`,vals[0]>vals[1]/vals[2]?1:2,'Compare using decimals or percentages.');
}

function y6GenMixedFractions(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const d=randInt(2,9),whole=randInt(1,5),rem=randInt(1,d-1),num=whole*d+rem;return q('mixedFractions',`${num}/${d} = ${whole} ?/${d}. Missing numerator = ?`,rem,'Divide the numerator by the denominator and use the remainder.');}
  if(t===2){const whole=randInt(1,5),d=randInt(2,9),n=randInt(1,d-1);return q('mixedFractions',`${whole} ${n}/${d} as an improper fraction. Numerator = ?`,whole*d+n,'Multiply the whole number by the denominator, then add the numerator.');}
  if(t===3){const [n,d]=pick([[6,8],[9,12],[10,15],[12,18],[14,21],[15,25],[18,24]]);return qFrac('mixedFractions',`Simplify ${n}/${d}.`,n/d,'Divide numerator and denominator by their HCF.');}
  if(t===4){const [n,d,m]=pick([[1,2,8],[1,3,12],[2,3,15],[3,4,20],[2,5,25]]);return q('mixedFractions',`${n}/${d} = ?/${m}`,n*m/d,'Multiply numerator and denominator by the same factor.');}
  if(t===5){const whole=randInt(1,3),[n,d]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),[a,b]=pick([[1,2],[1,3],[1,4]]);return qFrac('mixedFractions',`${whole} ${n}/${d} + ${a}/${b} = ?`,whole+n/d+a/b,'Convert to compatible fractions, then add.');}
  if(t===6){const whole=randInt(2,5),[n,d]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]);return qFrac('mixedFractions',`${whole} − ${n}/${d} = ?`,whole-n/d,'Write the whole number as an equivalent fraction.');}
  if(t===7){const a=randInt(1,3),[n,d]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),b=randInt(1,a),[m,k]=pick([[1,2],[1,3],[1,4]]);return qFrac('mixedFractions',`${a} ${n}/${d} − ${b} ${m}/${k} = ?`,a+n/d-b-m/k,'Convert to improper fractions or subtract whole and fractional parts carefully.');}
  if(t===8){const [n,d]=pick([[7,4],[11,5],[13,6],[17,8],[19,7]]);return q('mixedFractions',`For ${n}/${d}, what is the whole-number part?`,Math.floor(n/d),'Divide the numerator by the denominator.');}
  const whole=randInt(1,4),d=randInt(3,10),n=randInt(1,d-1);return q('mixedFractions',`${whole} ${n}/${d} as an improper fraction. Denominator = ?`,d,'The denominator stays unchanged.');
}

function y6GenEquationsMachines(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9),x=randInt(1,20);
  if(t===1){const a=randInt(3,20);return q('equationsMachines',`x + ${a} = ${x+a}. Find x.`,x,'Subtract the constant.');}
  if(t===2){const a=randInt(2,10);return q('equationsMachines',`${a}x = ${a*x}. Find x.`,x,'Divide both sides by the coefficient.');}
  if(t===3){const a=randInt(2,8),b=randInt(2,15);return q('equationsMachines',`${a}x + ${b} = ${a*x+b}. Find x.`,x,'Subtract, then divide.');}
  if(t===4){const a=randInt(2,8),b=randInt(2,15);return q('equationsMachines',`${a}x − ${b} = ${a*x-b}. Find x.`,x,'Add, then divide.');}
  if(t===5){const input=randInt(2,20),a=randInt(2,8),b=randInt(1,12);return q('equationsMachines',`Function machine: ×${a}, then +${b}. Input ${input}. Output = ?`,input*a+b,'Apply the operations in order.');}
  if(t===6){const input=randInt(2,20),a=randInt(2,8),b=randInt(1,12),output=input*a+b;return q('equationsMachines',`Function machine: ×${a}, then +${b}. Output ${output}. Input = ?`,input,'Reverse the machine: subtract, then divide.');}
  if(t===7){const a=randInt(2,8),b=randInt(1,10);return q('equationsMachines',`${a}(x + ${b}) = ${a*(x+b)}. Find x.`,x,'Divide first, then subtract.');}
  if(t===8){const a=randInt(2,7),b=randInt(2,12),c=randInt(1,8);return q('equationsMachines',`${a}x + ${b} = ${a*x+b}. Find ${x+c===0?'x':`x + ${c}`}.`,x+c,'Solve x first, then evaluate the requested expression.');}
  const a=randInt(2,8),b=randInt(1,10),output=(x+b)*a;return q('equationsMachines',`A machine adds ${b}, then multiplies by ${a}. Output ${output}. Input = ?`,x,'Reverse multiplication first, then subtraction.');
}

function y6GenSequencesPatterns(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const a=randInt(-10,30),d=randInt(2,10);return q('sequencesPatterns',`${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ... next = ?`,a+4*d,'Add the common difference.');}
  if(t===2){const a=randInt(30,120),d=randInt(2,12);return q('sequencesPatterns',`${a}, ${a-d}, ${a-2*d}, ${a-3*d}, ... next = ?`,a-4*d,'Subtract the common difference.');}
  if(t===3){const a=randInt(1,8),r=pick([2,3,4]);return q('sequencesPatterns',`${a}, ${a*r}, ${a*r*r}, ${a*r*r*r}, ... next = ?`,a*r**4,'Multiply by the common ratio.');}
  if(t===4){const a=randInt(1,15),d=randInt(2,9),n=randInt(5,12);return q('sequencesPatterns',`A sequence starts at ${a} and increases by ${d}. Term ${n} = ?`,a+(n-1)*d,'Use first term + (n−1) × difference.');}
  if(t===5){const a=randInt(-8,20),d=randInt(2,9);return q('sequencesPatterns',`${a}, ${a+d}, □, ${a+3*d}. Missing term = ?`,a+2*d,'The difference is constant.');}
  if(t===6){const n=randInt(4,12),a=randInt(2,7),b=randInt(-5,8);return q('sequencesPatterns',`Tₙ = ${a}n ${b>=0?'+':'−'} ${Math.abs(b)}. Find T${n}.`,a*n+b,'Substitute the term number.');}
  if(t===7){const a=randInt(1,8),d=randInt(2,8),n=randInt(5,12),term=a+(n-1)*d;return q('sequencesPatterns',`In ${a}, ${a+d}, ${a+2*d}, ... which term equals ${term}?`,n,'Solve first term + (n−1) × difference = target.');}
  if(t===8){const a=randInt(1,6),r=pick([-2,2,3]);return q('sequencesPatterns',`${a}, ${a*r}, ${a*r*r}, ${a*r*r*r}, ... next = ?`,a*r**4,'Multiply by the same signed number.');}
  return q('sequencesPatterns','1, 4, 9, 16, 25, ... next = ?',36,'These are square numbers.');
}

function y6GenStatistics(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const count=pick([4,5,6]),mean=randInt(5,18),vals=Array(count-1).fill(mean),change=randInt(1,Math.min(4,mean-1));vals[0]=mean-change;vals[1]=mean+change;return q('statistics',`Mean of ${vals.join(', ')}, ${mean} = ?`,mean,'Add all values and divide by the number of values.');}
  if(t===2){const vals=Array.from({length:5},()=>randInt(1,25));return q('statistics',`Median of ${vals.join(', ')} = ?`,median(vals),'Order the values and select the middle one.');}
  if(t===3){const mode=randInt(3,15),vals=[mode,mode,mode,mode+1,mode+3,mode+5];for(let i=vals.length-1;i>0;i--){const j=randInt(0,i);[vals[i],vals[j]]=[vals[j],vals[i]];}return q('statistics',`Mode of ${vals.join(', ')} = ?`,mode,'Find the value that appears most often.');}
  if(t===4){const low=randInt(1,15),high=randInt(low+6,low+25),vals=[low,randInt(low,high),randInt(low,high),randInt(low,high),high];return q('statistics',`Range of ${vals.join(', ')} = ?`,high-low,'Range = maximum − minimum.');}
  if(t===5){const count=pick([4,5,6]),mean=randInt(6,20);return q('statistics',`${count} values have a mean of ${mean}. Their total = ?`,count*mean,'Total = mean × number of values.');}
  if(t===6){const count=pick([4,5,6]),mean=randInt(7,18),missing=randInt(3,22);let known=[];let remaining=count*mean-missing;for(let i=0;i<count-2;i++){const v=Math.max(1,Math.floor(remaining/(count-1-i)));known.push(v);remaining-=v;}known.push(remaining);return q('statistics',`${count} numbers have mean ${mean}. Known values: ${known.join(', ')}. Missing value = ?`,missing,'Find the total, then subtract the known values.');}
  if(t===7){const vals=Array.from({length:6},()=>randInt(2,20));return q('statistics',`After adding 5 to every value, by how much does the mean increase?`,5,'Adding the same amount to every value changes the mean by that amount.');}
  if(t===8){const a=randInt(5,15),b=randInt(5,15),c=randInt(5,15),d=4*randInt(7,16)-a-b-c;return q('statistics',`The mean of ${a}, ${b}, ${c}, and one missing number is ${(a+b+c+d)/4}. Missing number = ?`,d,'Mean × 4 gives the total.');}
  const vals=[randInt(2,8),randInt(9,14),randInt(15,20),randInt(21,27)];return q('statistics',`Median of the ordered values ${vals.join(', ')} = ?`,(vals[1]+vals[2])/2,'For an even number of values, average the two middle values.');
}

function y6GenPerimeterAreaVolume(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const l=randInt(5,25),w=randInt(3,18);return q('perimeterAreaVolume',`Rectangle ${l} cm by ${w} cm. Perimeter = ? cm`,2*(l+w),'Perimeter = 2(length + width).');}
  if(t===2){const l=randInt(5,25),w=randInt(3,18);return q('perimeterAreaVolume',`Rectangle ${l} cm by ${w} cm. Area = ? cm²`,l*w,'Area = length × width.');}
  if(t===3){const l=randInt(5,20),w=randInt(3,15),area=l*w;return q('perimeterAreaVolume',`A rectangle has area ${area} cm² and length ${l} cm. Width = ? cm`,w,'Width = area ÷ length.');}
  if(t===4){const s=randInt(3,18);return q('perimeterAreaVolume',`A square has perimeter ${4*s} cm. Side length = ? cm`,s,'Divide the perimeter by 4.');}
  if(t===5){const b=randInt(4,20),h=randInt(3,16);return q('perimeterAreaVolume',`Triangle base ${b} cm, height ${h} cm. Area = ? cm²`,b*h/2,'Area = 1/2 × base × height.');}
  if(t===6){const l=randInt(3,12),w=randInt(2,10),h=randInt(2,8);return q('perimeterAreaVolume',`Cuboid ${l} cm × ${w} cm × ${h} cm. Volume = ? cm³`,l*w*h,'Volume = length × width × height.');}
  if(t===7){const l=randInt(3,12),w=randInt(2,10),h=randInt(2,8),v=l*w*h;return q('perimeterAreaVolume',`A cuboid has volume ${v} cm³, length ${l} cm and width ${w} cm. Height = ? cm`,h,'Height = volume ÷ (length × width).');}
  if(t===8){const l=randInt(5,20),w=randInt(3,15),p=2*(l+w);return q('perimeterAreaVolume',`A rectangle has perimeter ${p} cm and length ${l} cm. Width = ? cm`,w,'Width = perimeter ÷ 2 − length.');}
  const s=randInt(3,20);return q('perimeterAreaVolume',`A square has area ${s*s} cm². Side length = ? cm`,s,'Take the square root of the area.');
}

function y6GenSpeedDistanceTime(){
  const L=state.level,t=L==='starter'?randInt(1,3):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const speed=pick([20,30,40,50,60,70,80]),time=randInt(2,5);return q('speedDistanceTime',`${speed} km/h for ${time} hours. Distance = ? km`,speed*time,'Distance = speed × time.');}
  if(t===2){const speed=pick([20,30,40,50,60,75,80]),time=randInt(2,5),distance=speed*time;return q('speedDistanceTime',`${distance} km in ${time} hours. Speed = ? km/h`,speed,'Speed = distance ÷ time.');}
  if(t===3){const speed=pick([20,30,40,50,60,75,80]),time=randInt(2,5),distance=speed*time;return q('speedDistanceTime',`${distance} km at ${speed} km/h. Time = ? hours`,time,'Time = distance ÷ speed.');}
  if(t===4){const speed=pick([40,50,60,80]),time=pick([0.5,1.5,2.5]);return q('speedDistanceTime',`${speed} km/h for ${time} hours. Distance = ? km`,speed*time,'Multiply speed by time, including the half hour.');}
  if(t===5){const speed=pick([30,40,50,60]),mins=pick([30,60,90,120]),hours=mins/60;return q('speedDistanceTime',`${speed} km/h for ${mins} minutes. Distance = ? km`,speed*hours,'Convert minutes to hours first.');}
  if(t===6){const distance=pick([90,120,150,180,210,240]),speed=pick([30,40,50,60]);if(distance%speed!==0)return y6GenSpeedDistanceTime();return q('speedDistanceTime',`${distance} km at ${speed} km/h. Time = ? hours`,distance/speed,'Divide distance by speed.');}
  if(t===7){const d1=randInt(20,60),d2=randInt(20,60),time=2;return q('speedDistanceTime',`A trip covers ${d1} km, then ${d2} km, in ${time} hours. Average speed = ? km/h`,(d1+d2)/time,'Total distance ÷ total time.');}
  const speed=pick([24,36,48,60,72]),time=pick([1.5,2.5]);return q('speedDistanceTime',`${speed} km/h for ${time} hours. Distance = ? km`,speed*time,'Use distance = speed × time.');
}

function y6GenProbability(){
  const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,7):randInt(1,9);
  if(t===1){const red=randInt(1,8),blue=randInt(1,8);return qFrac('probability',`A bag has ${red} red and ${blue} blue counters. P(red) = ?`,red/(red+blue),'Probability = favourable outcomes ÷ total outcomes.');}
  if(t===2){const favourable=pick([1,2,3,4,5]);return qFrac('probability',`A fair six-sided die is rolled. P(rolling one of ${favourable} selected faces) = ?`,favourable/6,'There are 6 equally likely outcomes.');}
  if(t===3){const p=pick([0.1,0.2,0.25,0.35,0.4,0.6,0.75,0.8]);return q('probability',`P(event) = ${fmt(p)}. P(not event) = ?`,1-p,'Complementary probabilities add to 1.');}
  if(t===4){const shaded=randInt(1,7),total=pick([8,10,12]);return qFrac('probability',`A fair spinner has ${total} equal sections, ${shaded} shaded. P(shaded) = ?`,shaded/total,'Use shaded sections ÷ total sections.');}
  if(t===5){return qFrac('probability','A fair coin is tossed twice. P(two heads) = ?',1/4,'Multiply 1/2 × 1/2.');}
  if(t===6){return qFrac('probability','A fair coin is tossed twice. P(exactly one head) = ?',1/2,'The favourable outcomes are HT and TH.');}
  if(t===7){const p1=pick([1/2,1/3,1/4]),p2=pick([1/2,1/3,1/4]);return qFrac('probability',`Two independent events have probabilities ${toFraction(p1)} and ${toFraction(p2)}. P(both) = ?`,p1*p2,'For independent events, multiply the probabilities.');}
  if(t===8){const red=randInt(2,6),blue=randInt(2,6),total=red+blue;return qFrac('probability',`A counter is chosen from ${red} red and ${blue} blue, replaced, then chosen again. P(two red) = ?`,(red/total)**2,'Replacement keeps the probability the same.');}
  return qFrac('probability','A fair die is rolled twice. P(rolling a 6 both times) = ?',1/36,'Multiply 1/6 × 1/6.');
}

YEAR_BANKS[6] = {
  "addsub": y6GenAddSub,
  "multdiv": y6GenMultDiv,
  "order": y6GenOrder,
  "factors": y6GenFactors,
  "fractions": y6GenFractions,
  "decimals": y6GenDecimals,
  "decimalShift": y6GenDecimalShift,
  "percentages": y6GenPercentages,
  "ratio": y6GenRatio,
  "negatives": y6GenNegatives,
  "units": y6GenUnits,
  "placeRounding": y6GenPlaceRounding,
  "inverseOperations": y6GenInverseOperations,
  "fdpConversions": y6GenFDPConversions,
  "mixedFractions": y6GenMixedFractions,
  "equationsMachines": y6GenEquationsMachines,
  "sequencesPatterns": y6GenSequencesPatterns,
  "statistics": y6GenStatistics,
  "perimeterAreaVolume": y6GenPerimeterAreaVolume,
  "speedDistanceTime": y6GenSpeedDistanceTime,
  "probability": y6GenProbability
};
