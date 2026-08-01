'use strict';

/* Year 5 configuration and question bank. */
YEAR_CONFIGS[5] = {"title":"Year 5 Rapid Fire Mental Maths","skillLabel":"Year 5 Skill","mixed":"Mixed Year 5 Skills","labels":{"addition":"Addition","subtraction":"Subtraction","multiplication":"Multiplication","twoDigitMultiplication":"Two-Digit × Two-Digit","division":"Division","placevalue":"×/÷ 10, 100, 1000, 0.1, 0.01 & 0.001","doubles":"Doubles & Halves","fractions":"Fractions of Quantities","decimals":"Decimal Mental Maths","decimalShift":"Decimal Multiplication & Division","rounding":"Place Value & Rounding","missing":"Missing Numbers & Inverse Operations","factorsDivisibility":"Factors, Multiples & Divisibility","fractionCompare":"Fraction Equivalence & Comparison","fractionAddSub":"Fraction Addition & Subtraction","basicPercentages":"Basic Percentages","time":"Time","measurements":"Measurement Conversions","perimeterArea":"Perimeter & Area","sequences":"Sequences","mixed":"Mixed Year 5 Skills","review":"Mistake Review"},"skills":["addition","subtraction","multiplication","twoDigitMultiplication","division","placevalue","doubles","fractions","decimals","decimalShift","rounding","missing","factorsDivisibility","fractionCompare","fractionAddSub","basicPercentages","time","measurements","perimeterArea","sequences"],"levels":[["starter","Starter — Year 4 Review"],["core","Core — Year 5"],["challenge","Challenge — Year 5+"]],"teacher":"Year 5 now includes 20 targeted banks, including a separate two-digit multiplication section and a decimal multiplication and division section covering powers of 10, simple decimal × decimal questions, and exact decimal ÷ decimal questions."};
BASE_STORAGE_BY_YEAR[5] = {"stars":"dyaaY5RapidStars","hero":"dyaaY5RapidHero","best":"dyaaY5RapidBest","mistakes":"dyaaY5RapidMistakes"};

/* ===== YEAR 5 QUESTION GENERATORS ===== */

function y5GenAdd(){
  let a,b;
  if(state.level==='starter'){
    a=randInt(25,99);b=randInt(6,Math.min(55,150-a));
  }else if(state.level==='core'){
    if(chance(.55)){a=randInt(120,780);b=randInt(2,18)*10;if(a+b>999)b=990-a}
    else{a=randInt(45,189);b=randInt(25,110);}
  }else{
    a=randInt(145,699);b=randInt(105,Math.min(300,999-a));
  }
  const total=a+b;
  if(state.level==='challenge'&&chance(.22))return{operation:'addition',text:`□ + ${b} = ${total}`,answer:a,hint:`Work backwards: ${total} − ${b}.`};
  return{operation:'addition',text:`${a} + ${b} = ?`,answer:total,hint:'Partition hundreds, tens and ones.'}
}


function y5GenSub(){
  let a,b;
  if(state.level==='starter'){a=randInt(55,150);b=randInt(6,Math.min(60,a-1))}
  else if(state.level==='core'){a=randInt(180,899);b=chance(.55)?randInt(2,18)*10:randInt(25,160);if(b>=a)b=a-randInt(10,60)}
  else{a=randInt(420,999);b=randInt(120,a-40)}
  if(state.level==='challenge'&&chance(.2)){const answer=a-b;return{operation:'subtraction',text:`${a} − □ = ${answer}`,answer:b,hint:`Find the difference between ${answer} and ${a}.`}}
  return{operation:'subtraction',text:`${a} − ${b} = ?`,answer:a-b,hint:'Subtract in parts or count up.'}
}


function y5BaseFacts(){return state.level==='starter'?[2,3,4,5,6,8,10]:[2,3,4,5,6,7,8,9,10,11,12]}


function y5GenMul(){
  if(state.level==='starter'){
    const a=pick(y5BaseFacts()),b=randInt(2,12),p=a*b;return{operation:'multiplication',text:`${a} × ${b} = ?`,answer:p,hint:`Recall the ${a} times table.`}
  }
  let a,b;
  if(state.level==='core'){
    if(chance(.25)){a=pick([20,30,40,50,60,70,80,90]);b=randInt(3,9)}else{a=randInt(11,29);b=randInt(2,9)}
  }else{
    a=randInt(16,49);b=randInt(3,9);
  }
  const p=a*b;
  if(chance(state.level==='challenge'?.28:.12))return{operation:'multiplication',text:`${a} × □ = ${p}`,answer:b,hint:`Use division: ${p} ÷ ${a}.`};
  return{operation:'multiplication',text:`${a} × ${b} = ?`,answer:p,hint:`Partition ${a} into tens and ones.`}
}


function y5GenTwoDigitMultiplication() {
  const L = state.level;
  let first;
  let second;

  if (L === 'starter') {
    first = randInt(11, 25);
    second = pick([10, 11, 12, 15, 20]);
  } else if (L === 'core') {
    first = randInt(11, 29);
    second = randInt(11, 19);
  } else {
    first = randInt(12, 39);
    second = randInt(12, 29);

    while (first * second > 999) {
      first = randInt(12, 35);
      second = randInt(12, 27);
    }
  }

  if (chance(0.5)) {
    [first, second] = [second, first];
  }

  return q(
    'twoDigitMultiplication',
    `${first} × ${second} = ?`,
    first * second,
    `Partition ${second} into tens and ones, then add the two partial products.`
  );
}


function y5GenDiv(){
  let divisor,quotient;
  if(state.level==='starter'){divisor=pick(y5BaseFacts());quotient=randInt(2,12)}
  else if(state.level==='core'){divisor=randInt(2,10);quotient=randInt(11,39)}
  else{divisor=randInt(3,12);quotient=randInt(14,75);while(divisor*quotient>900)quotient=randInt(14,60)}
  const dividend=divisor*quotient;
  if(state.level==='challenge'&&chance(.22))return{operation:'division',text:`□ ÷ ${divisor} = ${quotient}`,answer:dividend,hint:`Multiply ${divisor} by ${quotient}.`};
  return{operation:'division',text:`${dividend} ÷ ${divisor} = ?`,answer:quotient,hint:`Use multiplication to check the quotient.`}
}


function y5GenPlaceValue() {
  const L = state.level;
  const operationType = randInt(1, 4);
  const places = randInt(1, 3);
  const wholeFactor = 10 ** places;
  const decimalFactor = 1 / wholeFactor;

  function makePracticeNumber() {
    if (L === 'starter') {
      return randInt(1, 99);
    }

    if (L === 'core') {
      const decimalPlaces = pick([0, 1]);
      return randInt(1, 999) / (10 ** decimalPlaces);
    }

    const decimalPlaces = pick([0, 1, 2]);
    return randInt(1, 9999) / (10 ** decimalPlaces);
  }

  if (operationType === 1) {
    const number = makePracticeNumber();

    return q(
      'placevalue',
      `${fmt(number)} × ${wholeFactor} = ?`,
      number * wholeFactor,
      `Multiplying by ${wholeFactor} moves every digit ${places} place${places === 1 ? '' : 's'} to the left.`
    );
  }

  if (operationType === 2) {
    const number = makePracticeNumber();

    return q(
      'placevalue',
      `${fmt(number)} ÷ ${wholeFactor} = ?`,
      number / wholeFactor,
      `Dividing by ${wholeFactor} moves every digit ${places} place${places === 1 ? '' : 's'} to the right.`
    );
  }

  if (operationType === 3) {
    const number = makePracticeNumber();

    return q(
      'placevalue',
      `${fmt(number)} × ${fmt(decimalFactor)} = ?`,
      number * decimalFactor,
      `Multiplying by ${fmt(decimalFactor)} is the same as dividing by ${wholeFactor}. Move every digit ${places} place${places === 1 ? '' : 's'} to the right.`
    );
  }

  let number;

  if (L === 'starter') {
    number = randInt(1, 99) / wholeFactor;
  } else if (L === 'core') {
    number = randInt(1, 999) / wholeFactor;
  } else {
    const extraDecimalPlaces = pick([0, 1, 2]);
    number = randInt(1, 9999) / (wholeFactor * (10 ** extraDecimalPlaces));
  }

  return q(
    'placevalue',
    `${fmt(number)} ÷ ${fmt(decimalFactor)} = ?`,
    number / decimalFactor,
    `Dividing by ${fmt(decimalFactor)} is the same as multiplying by ${wholeFactor}. Move every digit ${places} place${places === 1 ? '' : 's'} to the left.`
  );
}

function y5GenDoubles(){
  if(state.level==='starter'){
    if(chance(.5)){const n=randInt(12,60);return{operation:'doubles',text:`Double ${n}`,answer:n*2,hint:`Add ${n} to itself.`}}
    const half=randInt(10,70),n=half*2;return{operation:'doubles',text:`Half of ${n}`,answer:half,hint:'Split the number into two equal parts.'}
  }
  if(state.level==='core'){
    if(chance(.5)){const n=randInt(35,250);return{operation:'doubles',text:`Double ${n}`,answer:n*2,hint:'Double the hundreds, tens and ones.'}}
    const half=randInt(30,250),n=half*2;return{operation:'doubles',text:`Half of ${n}`,answer:half,hint:'Halve each place-value part.'}
  }
  if(chance(.5)){const n=randInt(45,180),add=randInt(5,30);return{operation:'doubles',text:`Double ${n}, then add ${add}`,answer:n*2+add,hint:'Double first, then add.'}}
  const half=randInt(60,300),n=half*2,sub=randInt(5,35);return{operation:'doubles',text:`Half of ${n}, then subtract ${sub}`,answer:half-sub,hint:'Find half first, then subtract.'}
}


function y5GenFractions(){
  const sets={starter:[[1,2],[1,4],[1,5],[1,10]],core:[[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[1,10]],challenge:[[2,3],[3,4],[2,5],[3,5],[5,6],[3,8],[5,8],[7,10]]};
  const [num,den]=pick(sets[state.level]);
  const maxK=state.level==='starter'?12:state.level==='core'?20:25;
  const k=randInt(state.level==='starter'?2:4,maxK),quantity=den*k;
  return{operation:'fractions',text:`${num}/${den} of ${quantity} = ?`,answer:num*k,hint:`Find 1/${den} first, then multiply by ${num}.`}
}


function y5GenDecimals(){
  let a,b,text,answer;
  if(state.level==='starter'){
    if(chance(.5)){a=randInt(11,89)/10;b=randInt(1,6);text=`${fmt(a)} + ${b} = ?`;answer=a+b}
    else{a=randInt(25,99)/10;b=randInt(1,Math.max(1,Math.floor(a)));text=`${fmt(a)} − ${b} = ?`;answer=a-b}
  }else if(state.level==='core'){
    if(chance(.5)){a=randInt(12,95)/10;b=randInt(11,70)/10;text=`${fmt(a)} + ${fmt(b)} = ?`;answer=a+b}
    else{a=randInt(45,150)/10;b=randInt(11,Math.max(12,Math.floor(a*10)-5))/10;if(b>=a)b=round2(a-0.5);text=`${fmt(a)} − ${fmt(b)} = ?`;answer=a-b}
  }else{
    if(chance(.5)){a=randInt(25,999)/100;b=randInt(15,500)/100;text=`${fmt(a)} + ${fmt(b)} = ?`;answer=a+b}
    else{a=randInt(300,1500)/100;b=randInt(25,Math.max(30,Math.floor(a*100)-10))/100;if(b>=a)b=round2(a-0.25);text=`${fmt(a)} − ${fmt(b)} = ?`;answer=a-b}
  }
  return{operation:'decimals',text,answer:round2(answer),hint:'Line up tenths and hundredths mentally.'}
}


function y5GenDecimalShift() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 6)
    : L === 'core'
      ? randInt(1, 10)
      : randInt(1, 12);

  if (type === 1) {
    const number = randInt(1, L === 'starter' ? 99 : 999) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} × 10 = ?`,
      number * 10,
      'Move every digit 1 place to the left.'
    );
  }

  if (type === 2) {
    const number = randInt(1, L === 'starter' ? 999 : 9999);

    return q(
      'decimalShift',
      `${number} ÷ 10 = ?`,
      number / 10,
      'Move every digit 1 place to the right.'
    );
  }

  if (type === 3) {
    const number = randInt(1, L === 'starter' ? 9 : 999) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} × 100 = ?`,
      number * 100,
      'Move every digit 2 places to the left.'
    );
  }

  if (type === 4) {
    const number = randInt(1, L === 'starter' ? 99 : 999) * 10;

    return q(
      'decimalShift',
      `${number} ÷ 100 = ?`,
      number / 100,
      'Move every digit 2 places to the right.'
    );
  }

  if (type === 5) {
    const number = randInt(1, 99) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} × 0.1 = ?`,
      number / 10,
      'Multiplying by 0.1 is the same as dividing by 10.'
    );
  }

  if (type === 6) {
    const number = randInt(1, 99) / 10;

    return q(
      'decimalShift',
      `${fmt(number)} ÷ 0.1 = ?`,
      number * 10,
      'Dividing by 0.1 is the same as multiplying by 10.'
    );
  }

  if (type === 7) {
    const first = randInt(11, 99) / 10;
    const second = randInt(2, 9) / 10;

    return q(
      'decimalShift',
      `${fmt(first)} × ${fmt(second)} = ?`,
      first * second,
      'Multiply as whole numbers, then place 2 decimal digits in the answer.'
    );
  }

  if (type === 8) {
    const divisorTenths = randInt(2, 9);
    const quotient = randInt(2, 12);
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
    const first = randInt(1, 99) / 100;
    const second = pick([0.2, 0.3, 0.4, 0.5]);

    return q(
      'decimalShift',
      `${fmt(first)} × ${fmt(second)} = ?`,
      first * second,
      'Multiply the whole-number digits, then count all decimal places.'
    );
  }

  if (type === 10) {
    const divisorHundredths = randInt(2, 9);
    const quotient = randInt(2, 15);
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
    const number = randInt(1, 999) / 1000;

    return q(
      'decimalShift',
      `${fmt(number)} × 1000 = ?`,
      number * 1000,
      'Move every digit 3 places to the left.'
    );
  }

  const number = randInt(1, 9999);

  return q(
    'decimalShift',
    `${number} ÷ 1000 = ?`,
    number / 1000,
    'Move every digit 3 places to the right.'
  );
}

function y5GenPlaceValueRounding() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 6)
      : randInt(1, 8);

  if (type === 1) {
    const number = L === 'starter'
      ? randInt(100, 9999)
      : randInt(1000, 99999);
    const places = number < 1000
      ? [[100, 'hundreds'], [10, 'tens'], [1, 'ones']]
      : number < 10000
        ? [[1000, 'thousands'], [100, 'hundreds'], [10, 'tens'], [1, 'ones']]
        : [[10000, 'ten-thousands'], [1000, 'thousands'], [100, 'hundreds'], [10, 'tens'], [1, 'ones']];
    const [place, placeName] = pick(places);
    const digit = Math.floor(number / place) % 10;

    return q(
      'rounding',
      `What is the value of the ${placeName} digit in ${number.toLocaleString('en-NZ')}?`,
      digit * place,
      `Find the digit in the ${placeName} place, then write its value.`
    );
  }

  if (type === 2) {
    const number = randInt(100, L === 'starter' ? 999 : 9999);

    return q(
      'rounding',
      `Round ${number} to the nearest 10.`,
      Math.round(number / 10) * 10,
      'Look at the ones digit.'
    );
  }

  if (type === 3) {
    const number = randInt(100, L === 'starter' ? 1999 : 9999);

    return q(
      'rounding',
      `Round ${number} to the nearest 100.`,
      Math.round(number / 100) * 100,
      'Look at the tens digit.'
    );
  }

  if (type === 4) {
    const number = randInt(1000, 9999);

    return q(
      'rounding',
      `Round ${number} to the nearest 1000.`,
      Math.round(number / 1000) * 1000,
      'Look at the hundreds digit.'
    );
  }

  if (type === 5) {
    let number = randInt(11, 999) / 10;

    while (Number.isInteger(number)) {
      number = randInt(11, 999) / 10;
    }

    return q(
      'rounding',
      `Round ${fmt(number)} to the nearest whole number.`,
      Math.round(number),
      'Look at the tenths digit.'
    );
  }

  if (type === 6) {
    const a = randInt(145, 849);
    const b = randInt(125, 649);
    const estimate = Math.round(a / 100) * 100 + Math.round(b / 100) * 100;

    return q(
      'rounding',
      `Estimate ${a} + ${b} by rounding each number to the nearest 100.`,
      estimate,
      'Round both numbers first, then add.'
    );
  }

  if (type === 7) {
    const a = randInt(240, 950);
    const b = randInt(110, Math.min(750, a - 20));
    const estimate = Math.round(a / 100) * 100 - Math.round(b / 100) * 100;

    return q(
      'rounding',
      `Estimate ${a} − ${b} by rounding each number to the nearest 100.`,
      estimate,
      'Round both numbers first, then subtract.'
    );
  }

  const a = randInt(21, 69);
  const b = randInt(3, 9);
  const estimate = Math.round(a / 10) * 10 * b;

  return q(
    'rounding',
    `Estimate ${a} × ${b} by rounding ${a} to the nearest 10.`,
    estimate,
    'Round the two-digit number first, then multiply.'
  );
}


function y5GenMissingNumbers() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 7)
      : randInt(1, 9);

  if (type === 1) {
    const missing = randInt(5, L === 'starter' ? 80 : 250);
    const known = randInt(5, L === 'starter' ? 60 : 180);

    return q(
      'missing',
      `□ + ${known} = ${missing + known}. Find □.`,
      missing,
      'Use subtraction to undo addition.'
    );
  }

  if (type === 2) {
    const missing = randInt(5, L === 'starter' ? 80 : 250);
    const subtract = randInt(3, Math.min(60, missing - 1));

    return q(
      'missing',
      `□ − ${subtract} = ${missing - subtract}. Find □.`,
      missing,
      'Use addition to undo subtraction.'
    );
  }

  if (type === 3) {
    const factor = randInt(2, L === 'starter' ? 10 : 12);
    const missing = randInt(2, L === 'starter' ? 12 : 25);

    return q(
      'missing',
      `${factor} × □ = ${factor * missing}. Find □.`,
      missing,
      'Use division to undo multiplication.'
    );
  }

  if (type === 4) {
    const divisor = randInt(2, L === 'starter' ? 10 : 12);
    const quotient = randInt(2, L === 'starter' ? 12 : 30);

    return q(
      'missing',
      `□ ÷ ${divisor} = ${quotient}. Find □.`,
      divisor * quotient,
      'Use multiplication to undo division.'
    );
  }

  if (type === 5) {
    const start = randInt(60, 300);
    const result = randInt(10, start - 10);

    return q(
      'missing',
      `${start} − □ = ${result}. Find □.`,
      start - result,
      'Find the difference between the starting number and the result.'
    );
  }

  if (type === 6) {
    const dividend = randInt(2, 12) * randInt(3, 20);
    const quotient = pick(primeFactors(dividend).filter(value => value <= 12));

    return q(
      'missing',
      `${dividend} ÷ □ = ${dividend / quotient}. Find □.`,
      quotient,
      'Use divisor × quotient = dividend.'
    );
  }

  if (type === 7) {
    const missing = randInt(3, 30);
    const multiplier = randInt(2, 9);
    const add = randInt(2, 20);

    return q(
      'missing',
      `□ × ${multiplier} + ${add} = ${missing * multiplier + add}. Find □.`,
      missing,
      'Undo the addition first, then divide.'
    );
  }

  if (type === 8) {
    const missing = randInt(5, 40);
    const add = randInt(2, 15);
    const multiplier = randInt(2, 6);

    return q(
      'missing',
      `(□ + ${add}) × ${multiplier} = ${(missing + add) * multiplier}. Find □.`,
      missing,
      'Divide first, then subtract.'
    );
  }

  const missing = randInt(5, 50);
  const double = missing * 2;
  const subtract = randInt(3, 20);

  return q(
    'missing',
    `Double □, then subtract ${subtract}, gives ${double - subtract}. Find □.`,
    missing,
    'Add back the subtraction, then halve.'
  );
}


function y5GenFactorsDivisibility() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 7)
      : randInt(1, 9);

  if (type === 1) {
    const divisor = randInt(2, 12);
    const start = randInt(10, 90);
    const next = (Math.floor(start / divisor) + 1) * divisor;

    return q(
      'factorsDivisibility',
      `What is the first multiple of ${divisor} greater than ${start}?`,
      next,
      'Continue the multiples until you pass the given number.'
    );
  }

  if (type === 2) {
    const number = pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 48, 50, 54, 60]);

    return q(
      'factorsDivisibility',
      `How many positive factors does ${number} have?`,
      countFactors(number),
      'List factor pairs and count every factor.'
    );
  }

  if (type === 3) {
    const number = pick([18, 21, 25, 27, 33, 35, 39, 45, 49, 55, 63, 75]);

    return q(
      'factorsDivisibility',
      `Smallest factor of ${number} greater than 1 = ?`,
      smallestPrimeFactor(number),
      'Test 2, then 3, then 5, then 7.'
    );
  }

  if (type === 4) {
    const divisor = pick([2, 3, 4, 5, 6, 8, 9, 10]);
    const shouldDivide = chance(0.5);
    let number;

    if (shouldDivide) {
      number = divisor * randInt(3, 30);
    } else {
      number = divisor * randInt(3, 30) + randInt(1, divisor - 1);
    }

    return q(
      'factorsDivisibility',
      `Is ${number} divisible by ${divisor}? Enter 1 for Yes, 0 for No.`,
      shouldDivide ? 1 : 0,
      'Use a divisibility rule or divide to check.'
    );
  }

  if (type === 5) {
    const a = pick([12, 18, 20, 24, 30, 36, 40, 42, 48]);
    const b = pick([16, 20, 24, 28, 30, 32, 36, 40, 54]);

    return q(
      'factorsDivisibility',
      `HCF of ${a} and ${b} = ?`,
      gcd(a, b),
      'List common factors and choose the greatest.'
    );
  }

  if (type === 6) {
    const a = pick([3, 4, 5, 6, 8, 9, 10, 12]);
    const b = pick([4, 5, 6, 8, 10, 12]);

    return q(
      'factorsDivisibility',
      `LCM of ${a} and ${b} = ?`,
      lcm(a, b),
      'Find the first number in both multiple lists.'
    );
  }

  if (type === 7) {
    const first = pick([3, 4, 5, 6]);
    const second = pick([4, 5, 6, 8]);
    const start = randInt(15, 90);
    const common = lcm(first, second);
    const next = Math.ceil((start + 1) / common) * common;

    return q(
      'factorsDivisibility',
      `First number greater than ${start} divisible by both ${first} and ${second} = ?`,
      next,
      'Find a common multiple greater than the starting number.'
    );
  }

  if (type === 8) {
    const number = randInt(100, 999);
    const options = [2, 3, 5, 9, 10];
    const divisibleCount = options.filter(divisor => number % divisor === 0).length;

    return q(
      'factorsDivisibility',
      `How many of 2, 3, 5, 9 and 10 divide ${number} exactly?`,
      divisibleCount,
      'Apply each divisibility rule separately.'
    );
  }

  const base = pick([6, 8, 10, 12, 15]);
  const factor = randInt(2, 8);
  const number = base * factor;

  return q(
    'factorsDivisibility',
    `${number} is the ${factor}th positive multiple of ${base}. What is the previous positive multiple?`,
    number - base,
    'Subtract one group of the base number.'
  );
}


function y5GenFractionCompare() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 6)
      : randInt(1, 8);

  if (type === 1) {
    const denominator = pick([2, 3, 4, 5, 6, 8, 10]);
    const numerator = randInt(1, denominator - 1);
    const scale = randInt(2, L === 'starter' ? 5 : 9);

    return q(
      'fractionCompare',
      `${numerator}/${denominator} = ?/${denominator * scale}`,
      numerator * scale,
      'Multiply numerator and denominator by the same number.'
    );
  }

  if (type === 2) {
    const denominator = pick([2, 3, 4, 5, 6, 8]);
    const numerator = randInt(1, denominator - 1);
    const scale = randInt(2, L === 'starter' ? 5 : 9);

    return q(
      'fractionCompare',
      `${numerator}/${denominator} = ${numerator * scale}/?`,
      denominator * scale,
      'Use the same scale factor in the denominator.'
    );
  }

  if (type === 3) {
    const denominator = pick([4, 5, 6, 8, 10, 12]);
    const numerator = randInt(1, denominator - 1);
    const scale = randInt(2, 5);
    const top = numerator * scale;
    const bottom = denominator * scale;

    return qFrac(
      'fractionCompare',
      `Simplify ${top}/${bottom}.`,
      numerator / denominator,
      'Divide numerator and denominator by their common factor.'
    );
  }

  if (type === 4) {
    const pair = pick([
      [1, 2, 2, 5],
      [2, 3, 3, 5],
      [3, 4, 5, 8],
      [2, 5, 3, 8],
      [4, 5, 7, 10],
      [3, 8, 2, 5]
    ]);
    const [a, b, c, d] = pair;

    return q(
      'fractionCompare',
      `Which is larger? Enter 1 for ${a}/${b}, or 2 for ${c}/${d}.`,
      a / b > c / d ? 1 : 2,
      'Use a common denominator or compare with a benchmark such as 1/2.'
    );
  }

  if (type === 5) {
    const denominator = pick([4, 5, 8, 10, 12, 20]);
    const numerator = randInt(1, denominator - 1);
    const target = pick([20, 40, 60]);
    const adjustedTarget = target % denominator === 0
      ? target
      : denominator * randInt(2, 6);

    return q(
      'fractionCompare',
      `How many ${adjustedTarget}ths are equal to ${numerator}/${denominator}?`,
      numerator * adjustedTarget / denominator,
      'Find the factor used to change the denominator.'
    );
  }

  if (type === 6) {
    const denominator = pick([4, 5, 6, 8, 10, 12]);
    const numerator = randInt(1, denominator - 1);

    return q(
      'fractionCompare',
      `${numerator}/${denominator} + □/${denominator} = 1. Find the missing numerator.`,
      denominator - numerator,
      'The numerators must add to the denominator.'
    );
  }

  if (type === 7) {
    const [a, b, c, d, e, f] = pick([
      [1, 2, 2, 3, 3, 4],
      [2, 5, 1, 2, 3, 5],
      [1, 4, 3, 8, 1, 2],
      [3, 10, 2, 5, 7, 10]
    ]);
    const values = [a / b, c / d, e / f];
    const largestIndex = values.indexOf(Math.max(...values)) + 1;

    return q(
      'fractionCompare',
      `Which is largest? Enter 1 for ${a}/${b}, 2 for ${c}/${d}, or 3 for ${e}/${f}.`,
      largestIndex,
      'Compare all three fractions using common denominators or benchmarks.'
    );
  }

  const [a, b] = pick([[1, 2], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10]]);

  return q(
    'fractionCompare',
    `${a}/${b} = ? tenths`,
    a * 10 / b,
    'Write the equivalent fraction with denominator 10.'
  );
}


function y5GenFractionAddSub() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 3)
    : L === 'core'
      ? randInt(1, 6)
      : randInt(1, 8);

  if (type === 1) {
    const denominator = pick([4, 5, 6, 7, 8, 9, 10, 12]);
    const a = randInt(1, denominator - 2);
    const b = randInt(1, denominator - a - 1);

    return qFrac(
      'fractionAddSub',
      `${a}/${denominator} + ${b}/${denominator} = ?`,
      (a + b) / denominator,
      'The denominators are equal, so add the numerators.'
    );
  }

  if (type === 2) {
    const denominator = pick([4, 5, 6, 7, 8, 9, 10, 12]);
    const a = randInt(2, denominator - 1);
    const b = randInt(1, a - 1);

    return qFrac(
      'fractionAddSub',
      `${a}/${denominator} − ${b}/${denominator} = ?`,
      (a - b) / denominator,
      'The denominators are equal, so subtract the numerators.'
    );
  }

  if (type === 3) {
    const denominator = pick([4, 5, 6, 8, 10, 12]);
    const numerator = randInt(1, denominator - 1);

    return qFrac(
      'fractionAddSub',
      `1 − ${numerator}/${denominator} = ?`,
      1 - numerator / denominator,
      `Write 1 as ${denominator}/${denominator}.`
    );
  }

  if (type === 4) {
    const [a, b, c, d] = pick([
      [1, 2, 1, 4],
      [1, 3, 1, 6],
      [1, 4, 3, 8],
      [2, 3, 1, 6],
      [2, 5, 1, 10]
    ]);

    return qFrac(
      'fractionAddSub',
      `${a}/${b} + ${c}/${d} = ?`,
      a / b + c / d,
      'Convert to a common denominator before adding.'
    );
  }

  if (type === 5) {
    const [a, b, c, d] = pick([
      [3, 4, 1, 2],
      [5, 6, 1, 3],
      [7, 8, 1, 4],
      [4, 5, 3, 10],
      [2, 3, 1, 6]
    ]);

    return qFrac(
      'fractionAddSub',
      `${a}/${b} − ${c}/${d} = ?`,
      a / b - c / d,
      'Convert to a common denominator before subtracting.'
    );
  }

  if (type === 6) {
    const [a, b] = pick([[1, 2], [1, 3], [1, 4], [2, 5], [3, 5]]);
    const whole = randInt(2, 4);

    return qFrac(
      'fractionAddSub',
      `${whole} − ${a}/${b} = ?`,
      whole - a / b,
      'Regroup one whole into fractional parts.'
    );
  }

  if (type === 7) {
    const [a, b, c, d] = pick([
      [1, 2, 1, 4],
      [2, 3, 1, 6],
      [3, 4, 1, 8],
      [2, 5, 3, 10]
    ]);

    return qFrac(
      'fractionAddSub',
      `1 ${a}/${b} + ${c}/${d} = ?`,
      1 + a / b + c / d,
      'Add the fractional parts, then include the whole number.'
    );
  }

  const [a, b, c, d] = pick([
    [2, 3, 1, 4],
    [3, 4, 1, 3],
    [2, 5, 1, 4],
    [5, 6, 1, 4]
  ]);

  return qFrac(
    'fractionAddSub',
    `${a}/${b} + ${c}/${d} = ?`,
    a / b + c / d,
    'Find the lowest common denominator, then add and simplify.'
  );
}


function y5GenBasicPercentages() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 3)
    : L === 'core'
      ? randInt(1, 6)
      : randInt(1, 8);

  if (type === 1) {
    const base = randInt(2, L === 'starter' ? 20 : 40) * 10;

    return q(
      'basicPercentages',
      `10% of ${base} = ?`,
      base / 10,
      'Divide by 10.'
    );
  }

  if (type === 2) {
    const base = randInt(2, L === 'starter' ? 30 : 60) * 2;

    return q(
      'basicPercentages',
      `50% of ${base} = ?`,
      base / 2,
      '50% means one half.'
    );
  }

  if (type === 3) {
    const base = randInt(2, L === 'starter' ? 25 : 50) * 4;

    return q(
      'basicPercentages',
      `25% of ${base} = ?`,
      base / 4,
      '25% means one quarter.'
    );
  }

  if (type === 4) {
    const base = randInt(2, 30) * 4;

    return q(
      'basicPercentages',
      `75% of ${base} = ?`,
      base * 3 / 4,
      '75% means three quarters.'
    );
  }

  if (type === 5) {
    const [numerator, denominator] = pick([
      [1, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5]
    ]);

    return q(
      'basicPercentages',
      `${numerator}/${denominator} = ?%`,
      numerator / denominator * 100,
      'Convert the fraction to an equivalent fraction out of 100.'
    );
  }

  if (type === 6) {
    const decimal = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);

    return q(
      'basicPercentages',
      `${fmt(decimal)} = ?%`,
      decimal * 100,
      'Multiply the decimal by 100.'
    );
  }

  if (type === 7) {
    const percent = pick([20, 40, 60, 80]);
    const base = randInt(2, 20) * 5;

    return q(
      'basicPercentages',
      `${percent}% of ${base} = ?`,
      base * percent / 100,
      'Use 10%, 20% or a fraction equivalent.'
    );
  }

  const whole = pick([40, 60, 80, 100, 120, 160, 200]);
  const percent = pick([10, 20, 25, 50, 75]);
  const part = whole * percent / 100;

  return q(
    'basicPercentages',
    `${part} is what percentage of ${whole}?`,
    percent,
    'Compare the part with the whole using a familiar fraction.'
  );
}


function y5ClockText(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalised = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour24 = Math.floor(normalised / 60);
  const minute = normalised % 60;
  const suffix = hour24 < 12 ? 'am' : 'pm';
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}


function y5GenTime() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 7)
      : randInt(1, 9);

  if (type === 1) {
    const hours = randInt(2, 8);

    return q(
      'time',
      `${hours} hours = ? minutes`,
      hours * 60,
      'Each hour contains 60 minutes.'
    );
  }

  if (type === 2) {
    const halfHours = randInt(3, 12);
    const minutes = halfHours * 30;

    return q(
      'time',
      `${minutes} minutes = ? hours`,
      minutes / 60,
      'Divide the minutes by 60.'
    );
  }

  if (type === 3) {
    const startHour = randInt(8, 18);
    const startMinute = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    const duration = pick([10, 15, 20, 25, 30, 35, 40, 45]);
    const start = startHour * 60 + startMinute;
    const end = start + duration;

    return q(
      'time',
      `${y5ClockText(start)} plus ${duration} minutes. Enter 24-hour time as HHMM without a colon (for example 0730); a colon is also accepted.`,
      (Math.floor(end / 60) % 24) * 100 + end % 60,
      'Add the minutes and regroup 60 minutes as one hour.'
    );
  }

  if (type === 4) {
    const startHour = randInt(8, 16);
    const startMinute = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);
    const duration = pick([20, 25, 30, 35, 40, 45, 50, 55, 60]);
    const start = startHour * 60 + startMinute;
    const end = start + duration;

    return q(
      'time',
      `How many minutes from ${y5ClockText(start)} to ${y5ClockText(end)}?`,
      duration,
      'Count to the next hour, then add the remaining minutes.'
    );
  }

  if (type === 5) {
    const hour24 = randInt(13, 23);
    const minute = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);

    return q(
      'time',
      `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')} in 12-hour time. Enter as HHMM without a colon (for example 0730); a colon is also accepted.`,
      (hour24 - 12) * 100 + minute,
      'Subtract 12 from an afternoon or evening hour.'
    );
  }

  if (type === 6) {
    const hour12 = randInt(1, 11);
    const minute = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);

    return q(
      'time',
      `${hour12}:${String(minute).padStart(2, '0')} pm in 24-hour time. Enter as HHMM without a colon (for example 0730); a colon is also accepted.`,
      (hour12 + 12) * 100 + minute,
      'Add 12 to the hour for a pm time, except 12 pm.'
    );
  }

  if (type === 7) {
    const startHour = randInt(7, 15);
    const startMinute = pick([5, 10, 15, 20, 25, 35, 40, 45, 50]);
    const duration = pick([65, 70, 75, 80, 85, 90, 95, 105]);
    const start = startHour * 60 + startMinute;
    const end = start + duration;

    return q(
      'time',
      `A lesson starts at ${y5ClockText(start)} and lasts ${duration} minutes. Enter 24-hour time as HHMM without a colon (for example 0730); a colon is also accepted.`,
      (Math.floor(end / 60) % 24) * 100 + end % 60,
      'Add one hour first, then add the remaining minutes.'
    );
  }

  if (type === 8) {
    const startHour = randInt(7, 14);
    const startMinute = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    const duration = pick([70, 80, 90, 100, 110, 125]);
    const start = startHour * 60 + startMinute;
    const end = start + duration;

    return q(
      'time',
      `How many minutes from ${y5ClockText(start)} to ${y5ClockText(end)}?`,
      duration,
      'Break the interval into full hours and remaining minutes.'
    );
  }

  const hours = randInt(1, 5);
  const minutes = pick([10, 15, 20, 25, 30, 35, 40, 45, 50]);

  return q(
    'time',
    `${hours} hours ${minutes} minutes = ? minutes`,
    hours * 60 + minutes,
    'Convert the hours to minutes, then add the extra minutes.'
  );
}


function y5GenMeasurements() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 5)
    : L === 'core'
      ? randInt(1, 8)
      : randInt(1, 13);

  if (type === 1) {
    const metres = randInt(2, L === 'starter' ? 20 : 80);

    return q('measurements', `${metres} m = ? cm`, metres * 100, '1 m = 100 cm.');
  }

  if (type === 2) {
    const kilometres = randInt(2, L === 'starter' ? 12 : 30);

    return q('measurements', `${kilometres} km = ? m`, kilometres * 1000, '1 km = 1000 m.');
  }

  if (type === 3) {
    const kilograms = randInt(2, L === 'starter' ? 12 : 30);

    return q('measurements', `${kilograms} kg = ? g`, kilograms * 1000, '1 kg = 1000 g.');
  }

  if (type === 4) {
    const litres = randInt(2, L === 'starter' ? 12 : 30);

    return q('measurements', `${litres} L = ? mL`, litres * 1000, '1 L = 1000 mL.');
  }

  if (type === 5) {
    const centimetres = randInt(2, 30) * 10;

    return q('measurements', `${centimetres} cm = ? m`, centimetres / 100, 'Divide centimetres by 100.');
  }

  if (type === 6) {
    const metres = randInt(12, 95) / 10;

    return q('measurements', `${fmt(metres)} m = ? cm`, metres * 100, 'Multiply metres by 100.');
  }

  if (type === 7) {
    const grams = pick([1250, 1500, 1750, 2250, 2500, 3250, 4500, 5750]);

    return q('measurements', `${grams} g = ? kg`, grams / 1000, 'Divide grams by 1000.');
  }

  if (type === 8) {
    const millilitres = pick([1250, 1500, 1750, 2250, 2500, 3250, 4500, 5750]);

    return q('measurements', `${millilitres} mL = ? L`, millilitres / 1000, 'Divide millilitres by 1000.');
  }

  if (type === 9) {
    const metres = randInt(1, 8);
    const centimetres = randInt(1, 9) * 10;

    return q(
      'measurements',
      `${metres} m ${centimetres} cm = ? cm`,
      metres * 100 + centimetres,
      'Convert the metres to centimetres, then add.'
    );
  }

  if (type === 10) {
    const litres = randInt(1, 5);
    const extra = pick([125, 250, 375, 500, 750]);

    return q(
      'measurements',
      `${litres} L + ${extra} mL = ? mL`,
      litres * 1000 + extra,
      'Convert litres to millilitres before adding.'
    );
  }

  if (type === 11) {
    const wholeMetres = randInt(1, 8);
    const extraCentimetres = pick([10, 20, 25, 40, 50, 60, 75, 80, 90]);
    const metres = wholeMetres + extraCentimetres / 100;

    return q(
      'measurements',
      `${fmt(metres)} m = ${wholeMetres} m and ? cm`,
      extraCentimetres,
      'The whole-number part is metres. Convert the decimal part to centimetres by multiplying by 100.'
    );
  }

  if (type === 12) {
    const wholeLitres = randInt(1, 8);
    const extraMillilitres = pick([100, 125, 200, 250, 375, 500, 600, 750, 800, 900]);
    const litres = wholeLitres + extraMillilitres / 1000;

    return q(
      'measurements',
      `${fmt(litres)} L = ${wholeLitres} L and ? mL`,
      extraMillilitres,
      'The whole-number part is litres. Convert the decimal part to millilitres by multiplying by 1000.'
    );
  }

  const wholeKilograms = randInt(1, 8);
  const extraGrams = pick([100, 125, 200, 250, 375, 500, 600, 750, 800, 900]);
  const kilograms = wholeKilograms + extraGrams / 1000;

  return q(
    'measurements',
    `${fmt(kilograms)} kg = ${wholeKilograms} kg and ? g`,
    extraGrams,
    'The whole-number part is kilograms. Convert the decimal part to grams by multiplying by 1000.'
  );
}


function y5GenPerimeterArea() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 7)
      : randInt(1, 9);

  if (type === 1) {
    const length = randInt(4, L === 'starter' ? 15 : 30);
    const width = randInt(2, Math.min(length - 1, L === 'starter' ? 10 : 20));

    return q(
      'perimeterArea',
      `Rectangle ${length} cm by ${width} cm. Perimeter = ? cm`,
      2 * (length + width),
      'Perimeter = 2 × (length + width).'
    );
  }

  if (type === 2) {
    const length = randInt(4, L === 'starter' ? 15 : 30);
    const width = randInt(2, Math.min(length - 1, L === 'starter' ? 10 : 20));

    return q(
      'perimeterArea',
      `Rectangle ${length} cm by ${width} cm. Area = ? cm²`,
      length * width,
      'Area = length × width.'
    );
  }

  if (type === 3) {
    const side = randInt(3, L === 'starter' ? 15 : 30);

    return q(
      'perimeterArea',
      `Square side ${side} cm. Perimeter = ? cm`,
      side * 4,
      'A square has four equal sides.'
    );
  }

  if (type === 4) {
    const side = randInt(3, L === 'starter' ? 15 : 25);

    return q(
      'perimeterArea',
      `Square side ${side} cm. Area = ? cm²`,
      side * side,
      'Area of a square = side × side.'
    );
  }

  if (type === 5) {
    const side = randInt(4, 30);

    return q(
      'perimeterArea',
      `A square has perimeter ${side * 4} cm. Side length = ? cm`,
      side,
      'Divide the perimeter by 4.'
    );
  }

  if (type === 6) {
    const length = randInt(5, 25);
    const width = randInt(3, 18);

    return q(
      'perimeterArea',
      `A rectangle has area ${length * width} cm² and length ${length} cm. Width = ? cm`,
      width,
      'Width = area ÷ length.'
    );
  }

  if (type === 7) {
    const length = randInt(6, 30);
    const width = randInt(3, Math.min(20, length - 1));
    const perimeter = 2 * (length + width);

    return q(
      'perimeterArea',
      `A rectangle has perimeter ${perimeter} cm and length ${length} cm. Width = ? cm`,
      width,
      'Width = perimeter ÷ 2 − length.'
    );
  }

  if (type === 8) {
    const side = randInt(4, 25);

    return q(
      'perimeterArea',
      `A square has area ${side * side} cm². Side length = ? cm`,
      side,
      'Find the number multiplied by itself to make the area.'
    );
  }

  const length = randInt(8, 25);
  const width = randInt(4, length - 2);
  const increase = randInt(2, 6);

  return q(
    'perimeterArea',
    `A ${length} cm by ${width} cm rectangle has its length increased by ${increase} cm. New area = ? cm²`,
    (length + increase) * width,
    'Find the new length, then multiply by the unchanged width.'
  );
}


function y5GenSequences() {
  const L = state.level;
  const type = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 7)
      : randInt(1, 9);

  if (type === 1) {
    const first = randInt(1, 30);
    const difference = randInt(2, L === 'starter' ? 8 : 15);

    return q(
      'sequences',
      `${first}, ${first + difference}, ${first + 2 * difference}, ${first + 3 * difference}, ... next = ?`,
      first + 4 * difference,
      'Add the same difference again.'
    );
  }

  if (type === 2) {
    const first = randInt(40, 120);
    const difference = randInt(2, L === 'starter' ? 8 : 15);

    return q(
      'sequences',
      `${first}, ${first - difference}, ${first - 2 * difference}, ${first - 3 * difference}, ... next = ?`,
      first - 4 * difference,
      'Subtract the same difference again.'
    );
  }

  if (type === 3) {
    const first = randInt(1, 25);
    const difference = randInt(2, 10);

    return q(
      'sequences',
      `${first}, ${first + difference}, □, ${first + 3 * difference}, ${first + 4 * difference}. Missing term = ?`,
      first + 2 * difference,
      'The difference between consecutive terms stays the same.'
    );
  }

  if (type === 4) {
    const first = randInt(1, 8);
    const ratio = pick([2, 3]);

    return q(
      'sequences',
      `${first}, ${first * ratio}, ${first * ratio ** 2}, ${first * ratio ** 3}, ... next = ?`,
      first * ratio ** 4,
      'Multiply by the same number each time.'
    );
  }

  if (type === 5) {
    const first = randInt(1, 20);
    const difference = randInt(2, 10);
    const termNumber = randInt(5, 12);

    return q(
      'sequences',
      `A sequence starts at ${first} and increases by ${difference}. Term ${termNumber} = ?`,
      first + (termNumber - 1) * difference,
      'There are term number minus one jumps from the first term.'
    );
  }

  if (type === 6) {
    const first = randInt(1, 12);
    const difference = randInt(2, 9);
    const termNumber = randInt(5, 12);
    const target = first + (termNumber - 1) * difference;

    return q(
      'sequences',
      `In ${first}, ${first + difference}, ${first + 2 * difference}, ... which term equals ${target}?`,
      termNumber,
      'Count how many equal jumps are needed, then add 1.'
    );
  }

  if (type === 7) {
    const input = randInt(2, 15);
    const multiply = randInt(2, 5);
    const add = randInt(1, 10);

    return q(
      'sequences',
      `Rule: multiply by ${multiply}, then add ${add}. Input ${input} gives output ?`,
      input * multiply + add,
      'Follow the operations in the stated order.'
    );
  }

  if (type === 8) {
    const first = randInt(2, 8);
    const increase = randInt(2, 5);
    const terms = [first];

    for (let index = 1; index < 5; index++) {
      terms.push(terms[index - 1] + increase * index);
    }

    return q(
      'sequences',
      `${terms[0]}, ${terms[1]}, ${terms[2]}, ${terms[3]}, ... next = ?`,
      terms[4],
      `The additions are ${increase}, ${increase * 2}, ${increase * 3}, then ${increase * 4}.`
    );
  }

  const first = randInt(2, 12);
  const difference = randInt(3, 10);
  const termNumber = randInt(8, 15);

  return q(
    'sequences',
    `Term rule: ${difference}n + ${first - difference}. Find term ${termNumber}.`,
    difference * termNumber + first - difference,
    'Substitute the term number for n.'
  );
}

YEAR_BANKS[5] = {
  "addition": y5GenAdd,
  "subtraction": y5GenSub,
  "multiplication": y5GenMul,
  "twoDigitMultiplication": y5GenTwoDigitMultiplication,
  "division": y5GenDiv,
  "placevalue": y5GenPlaceValue,
  "doubles": y5GenDoubles,
  "fractions": y5GenFractions,
  "decimals": y5GenDecimals,
  "decimalShift": y5GenDecimalShift,
  "rounding": y5GenPlaceValueRounding,
  "missing": y5GenMissingNumbers,
  "factorsDivisibility": y5GenFactorsDivisibility,
  "fractionCompare": y5GenFractionCompare,
  "fractionAddSub": y5GenFractionAddSub,
  "basicPercentages": y5GenBasicPercentages,
  "time": y5GenTime,
  "measurements": y5GenMeasurements,
  "perimeterArea": y5GenPerimeterArea,
  "sequences": y5GenSequences
};
