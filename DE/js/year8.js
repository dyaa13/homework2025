'use strict';

/* Year 8 configuration and question bank. */
YEAR_CONFIGS[8] = {"title":"Year 8 Rapid Fire Mental Maths","skillLabel":"Year 8 Skill","mixed":"Mixed Year 8 Skills","labels":{"rational":"Rational Numbers","order":"Order of Operations","powers":"Powers & Scientific Notation","factors":"Prime Factors, HCF & LCM","fractions":"Fractions","decimals":"Decimals & Rounding","percentages":"Percentages","ratio":"Ratio, Proportion & Rates","algebra":"Algebra Expressions","equations":"Linear Equations","inequalities":"Inequalities","sequences":"Sequences","coordinates":"Coordinates & Straight Lines","geometry":"Geometry & Measurement","statistics":"Statistics & Probability","mixed":"Mixed Year 8 Skills","review":"Mistake Review","reversePercentages":"Reverse Percentages","percentageChange":"Percentage Change","profitLossDiscount":"Profit, Loss & Discount","directInverseProportion":"Direct & Inverse Proportion","primeFactorisation":"Prime Factorisation","hcfLcmProblems":"HCF & LCM Problems","expandCoefficients":"Expanding Brackets & Coefficients","factorCommon":"Factorising Common Factors","bothSidesEquations":"Equations with Unknowns on Both Sides","inequalityBoundaries":"Inequality Boundary Values","gradientMidpoint":"Gradient & Midpoint","polygonAngles":"Polygon Angles","pythagorasFocused":"Pythagoras","missingStatistics":"Missing Statistics Data","twoStepProbability":"Two-Step Probability","fdpConversions":"Fraction–Decimal–Percentage Conversion","fdpComparison":"Fraction–Decimal–Percentage Comparison","fdpOperations":"Mixed Fraction, Decimal & Percentage Operations"},"skills":["rational","order","powers","factors","fractions","decimals","percentages","fdpConversions","fdpComparison","fdpOperations","ratio","algebra","equations","inequalities","sequences","coordinates","geometry","statistics","reversePercentages","percentageChange","profitLossDiscount","directInverseProportion","primeFactorisation","hcfLcmProblems","expandCoefficients","factorCommon","bothSidesEquations","inequalityBoundaries","gradientMidpoint","polygonAngles","pythagorasFocused","missingStatistics","twoStepProbability"],"levels":[["starter","Starter"],["core","Core"],["challenge","Challenge"]],"teacher":"Year 8 contains 33 skill banks: the original broad banks, 15 focused Year 8 banks, and three dedicated fraction–decimal–percentage banks for conversion, comparison and mixed operations."};
BASE_STORAGE_BY_YEAR[8] = {"stars":"dyaaY8Stars","hero":"dyaaY8Hero","best":"dyaaY8Best","mistakes":"dyaaY8Mistakes"};

/* ===== YEAR 8 QUESTION GENERATORS ===== */

function y8GenRational(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(-20,20),b=randInt(-20,20);return q('rational',`${a} + (${b}) = ?`,a+b,'Add signed numbers using the number line or sign rules.')}
  if(t===2){const a=randInt(-18,22),b=randInt(-18,22);return q('rational',`${a} − (${b}) = ?`,a-b,'Subtracting a negative is the same as adding.')}
  if(t===3){const a=randInt(-12,-2),b=randInt(2,12);return q('rational',`${a} × ${b} = ?`,a*b,'A negative times a positive is negative.')}
  if(t===4){const d=randInt(2,10),ans=randInt(-12,12);return q('rational',`${d*ans} ÷ ${d} = ?`,ans,'Use multiplication facts and the sign of the dividend.')}
  if(t===5){const [a,b,c,d]=pick([[-1,2,3,4],[-3,4,1,2],[-2,3,5,6],[-5,6,1,3]]);return qFrac('rational',`${a}/${b} + ${c}/${d} = ?`,a/b+c/d,'Use a common denominator and keep the signs.')}
  if(t===6){const a=-randInt(12,65)/10,b=randInt(8,75)/10;return q('rational',`${fmt(a)} + ${fmt(b)} = ?`,roundTo(a+b),'Line up decimal places and compare the signs.')}
  if(t===7){const a=randInt(-12,12),b=randInt(-10,10),c=randInt(-8,8);return q('rational',`${a} − (${b} − (${c})) = ?`,a-(b-c),'Work from the innermost brackets.')}
  const [a,b,c,d]=pick([[-3,4,-2,3],[-5,8,-6,10],[-7,10,-3,4],[-1,2,-45,100]]);const v1=a/b,v2=c/d;return q('rational',`Which is greater? Enter 1 for ${a}/${b}, or 2 for ${c}/${d}.`,v1>v2?1:2,'Convert both values to decimals or use a common denominator.')}


function y8GenOrder(){const L=state.level,t=L==='starter'?randInt(1,3):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(8,35),b=randInt(2,9),c=randInt(2,9);return q('order',`${a} + ${b} × ${c} = ?`,a+b*c,'Multiply before adding.')}
  if(t===2){const a=randInt(2,9),b=randInt(8,20),c=randInt(2,7);return q('order',`${a} × (${b} − ${c}) = ?`,a*(b-c),'Brackets first.')}
  if(t===3){const a=randInt(2,9),b=randInt(2,8),c=randInt(2,8);return q('order',`${a}² + ${b} × ${c} = ?`,a*a+b*c,'Powers first, then multiplication.')}
  if(t===4){const a=randInt(-10,12),b=randInt(2,8),c=randInt(-6,7);return q('order',`${a} − ${b} × (${c}) = ?`,a-b*c,'Multiply first, including the sign.')}
  if(t===5){const d=pick([2,3,4,5]),k=randInt(5,15),a=randInt(2,d*k-2),b=d*k-a,c=randInt(2,10);return q('order',`(${a} + ${b}) ÷ ${d} + ${c} = ?`,k+c,'Brackets, division, then addition.')}
  if(t===6){const a=randInt(18,45),b=randInt(2,7),c=randInt(4,12),d=randInt(1,c-1);return q('order',`${a} − ${b} × (${c} − ${d}) = ?`,a-b*(c-d),'Brackets before multiplication.')}
  if(t===7){const a=randInt(3,8),b=randInt(2,6),c=randInt(3,9),d=randInt(1,4);return q('order',`${a}² − ${b} × (${c} − ${d}) = ?`,a*a-b*(c-d),'Powers and brackets come first.')}
  const a=randInt(2,6),b=randInt(3,8),c=randInt(1,5),d=pick([2,4]);const top=(a+b)*(c+d);return q('order',`(${a} + ${b}) × (${c} + ${d}) ÷ ${d} = ?`,top/d,'Evaluate both brackets, then work left to right.')}


function y8GenPowers(){const L=state.level,t=L==='starter'?randInt(1,3):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const n=randInt(3,18);return q('powers',`${n}² = ?`,n*n,'Square the number.')}
  if(t===2){const n=pick([8,27,64,125,216,343]);return q('powers',`Cube root of ${n} = ?`,Math.round(Math.cbrt(n)),'Find the number whose cube gives the value.')}
  if(t===3){const b=pick([2,3,5]),a=randInt(1,4),c=randInt(1,4);return q('powers',`${b}^${a} × ${b}^${c} = ${b}^?`,a+c,'Same base: add the exponents.')}
  if(t===4){const b=pick([2,3,5,7]),a=randInt(4,8),c=randInt(1,a-1);return q('powers',`${b}^${a} ÷ ${b}^${c} = ${b}^?`,a-c,'Same base: subtract the exponents.')}
  if(t===5){const b=pick([2,3,4,5]),a=randInt(2,4),c=randInt(2,3);return q('powers',`(${b}^${a})^${c} = ${b}^?`,a*c,'A power raised to a power multiplies exponents.')}
  if(t===6){const b=randInt(2,20);return q('powers',`${b}^0 = ?`,1,'Any non-zero number to the power zero equals 1.')}
  if(t===7){const coefficient=pick([1.2,2.5,3.6,4.2,5.8,7.5]),exp=randInt(2,5);return q('powers',`${fmt(coefficient)} × 10^${exp} = ?`,coefficient*10**exp,'Move the decimal point to the right by the exponent.')}
  const a=pick([4,6,8]),b=pick([2,4]),m=randInt(3,5),n=randInt(1,m-1);return q('powers',`(${a} × 10^${m}) ÷ (${b} × 10^${n}) = ?`,a/b*10**(m-n),'Divide coefficients and subtract powers of 10.')}


function y8GenFactors(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=pick([24,36,42,48,54,60,72]),b=pick([30,40,45,56,60,72,84]);return q('factors',`HCF of ${a} and ${b} = ?`,gcd(a,b),'Use common prime factors or factor lists.')}
  if(t===2){const a=pick([6,8,9,10,12,15,18]),b=pick([8,10,12,14,15,18,20]);return q('factors',`LCM of ${a} and ${b} = ?`,lcm(a,b),'Use the highest required powers of each prime.')}
  if(t===3){const e2=randInt(1,5),e3=randInt(1,3),n=2**e2*3**e3;return q('factors',`In the prime factorisation of ${n}, the exponent of 2 is ?`,e2,'Repeatedly divide by 2.')}
  if(t===4){const n=pick([66,78,84,90,98,102,114,126]);return q('factors',`Smallest prime factor of ${n} = ?`,primeFactors(n)[0],'Test 2, 3, 5 and 7 in order.')}
  if(t===5){const n=pick([24,30,36,40,48,54,60,72]);return q('factors',`How many positive factors does ${n} have?`,countFactors(n),'Use factor pairs or prime exponents.')}
  if(t===6){const n=pick([12,18,20,24,45,50,72,75]);return q('factors',`Smallest integer that makes ${n} × □ a perfect square = ?`,squareMultiplier(n),'Every prime exponent must become even.')}
  if(t===7){const n=pick([60,72,84,90,120,126,150]);return q('factors',`How many distinct prime factors does ${n} have?`,new Set(primeFactors(n)).size,'Count each different prime once.')}
  const a=pick([72,96,108,120]),b=pick([84,126,144,180]);return q('factors',`HCF of ${a} and ${b} = ?`,gcd(a,b),'Compare prime factors and use the smaller exponents.')}


function y8GenFractions(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const [a,b,c,d]=pick([[3,4,5,12],[5,6,1,4],[7,10,3,5],[2,3,5,8]]);return qFrac('fractions',`${a}/${b} + ${c}/${d} = ?`,a/b+c/d,'Find a common denominator.')}
  if(t===2){const [a,b,c,d]=pick([[5,6,3,8],[7,8,5,12],[9,10,2,5],[11,12,1,3]]);return qFrac('fractions',`${a}/${b} − ${c}/${d} = ?`,a/b-c/d,'Use a common denominator before subtracting.')}
  if(t===3){const [a,b,c,d]=pick([[2,3,9,10],[5,6,3,5],[7,8,4,7],[3,4,10,9]]);return qFrac('fractions',`${a}/${b} × ${c}/${d} = ?`,a/b*c/d,'Cancel common factors before multiplying.')}
  if(t===4){const [a,b,c,d]=pick([[3,4,1,2],[5,8,1,4],[7,10,7,20],[2,3,4,9]]);return qFrac('fractions',`${a}/${b} ÷ ${c}/${d} = ?`,(a/b)/(c/d),'Multiply by the reciprocal.')}
  if(t===5){const whole=randInt(1,3),[a,b,c,d]=pick([[1,2,3,4],[2,3,5,6],[3,5,7,10]]);return qFrac('fractions',`${whole} ${a}/${b} + ${c}/${d} = ?`,whole+a/b+c/d,'Convert the mixed number or add whole and fractional parts.')}
  if(t===6){const [a,b,c,d]=pick([[-3,4,5,6],[-5,8,1,2],[-2,3,7,12]]);return qFrac('fractions',`${a}/${b} + ${c}/${d} = ?`,a/b+c/d,'Use a common denominator and keep the negative sign.')}
  if(t===7){const [a,b,c,d]=pick([[3,4,2,5],[5,6,3,7],[7,8,4,9]]);return qFrac('fractions',`${a}/${b} of ${c}/${d} = ?`,a/b*c/d,'“Of” means multiply.')}
  const [a,b,c,d,e,f]=pick([[1,2,3,4,2,3],[2,3,5,6,3,5],[3,4,1,2,5,6]]);return qFrac('fractions',`${a}/${b} + ${c}/${d} × ${e}/${f} = ?`,a/b+c/d*e/f,'Multiply before adding.')}


function y8GenDecimals(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(125,875)/100,b=randInt(25,325)/100;return q('decimals',`${fmt(a)} + ${fmt(b)} = ?`,roundTo(a+b),'Align decimal places.')}
  if(t===2){const a=randInt(500,999)/100,b=randInt(25,Math.floor(a*100)-25)/100;return q('decimals',`${fmt(a)} − ${fmt(b)} = ?`,roundTo(a-b),'Align decimal places and subtract.')}
  if(t===3){const a=randInt(12,85)/10,b=pick([0.2,0.5,1.5,2.5]);return q('decimals',`${fmt(a)} × ${fmt(b)} = ?`,roundTo(a*b),'Use place value or a related fraction.')}
  if(t===4){const divisor=pick([0.2,0.4,0.5,0.7]),ans=randInt(2,15),dividend=roundTo(divisor*ans);return q('decimals',`${fmt(dividend)} ÷ ${fmt(divisor)} = ?`,ans,'Scale both numbers to remove the decimal divisor.')}
  if(t===5){const n=randInt(10001,99999)/10000,dp=pick([1,2,3]);return q('decimals',`Round ${fmt(n)} to ${dp} decimal place${dp===1?'':'s'}`,roundTo(n,dp),'Look at the next digit.')}
  if(t===6){const n=pick([0.07846,0.004372,12.846,384.72,6.995]),sig=pick([2,3]);return q('decimals',`Round ${fmt(n)} to ${sig} significant figures`,roundSig(n,sig),'Start counting from the first non-zero digit.')}
  if(t===7){const a=randInt(145,255)/10,b=randInt(26,44)/10;return q('decimals',`Estimate ${fmt(a)} × ${fmt(b)} by rounding both to whole numbers`,Math.round(a)*Math.round(b),'Round each factor first.')}
  const a=pick([3.6,4.8,7.2,8.4,9.6]),b=pick([0.2,0.4,0.6,0.8]);return q('decimals',`${fmt(a)} ÷ ${fmt(b)} = ?`,roundTo(a/b),'Multiply both numbers by 10, then divide.')}


function y8GenPercentages(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const p=pick([10,15,20,25,30,35,40,60,75]),base=pick([40,60,80,100,120,160,200,240,300]);return q('percentages',`${p}% of ${base} = ?`,base*p/100,'Build the percentage from 10%, 5%, 25% or 50%.')}
  if(t===2){const price=pick([60,80,120,160,200,240]),p=pick([10,15,20,25,30]);return q('percentages',`original price $${price} after ${p}% off = $?`,roundTo(price*(1-p/100)),'Find the discount, then subtract it.')}
  if(t===3){const n=pick([40,60,80,120,160,200]),p=pick([10,15,20,25]);const up=chance(.5);return q('percentages',`${up?'Increase':'Decrease'} ${n} by ${p}%`,roundTo(n*(up?1+p/100:1-p/100)),'Find the percentage change, then add or subtract.')}
  if(t===4){const old=pick([40,50,80,100,120]),p=pick([10,15,20,25,30]);const neu=roundTo(old*(1+p/100));return q('percentages',`${old} increases to ${fmt(neu)}. Percentage increase = ?%`,p,'Change ÷ original × 100.')}
  if(t===5){const original=pick([40,50,60,80,100,120]),p=pick([10,20,25,50]),final=roundTo(original*(1+p/100));return q('percentages',`A number increases by ${p}% to ${fmt(final)}. Original number = ?`,original,'Divide by the multiplier 1 + percentage.')}
  if(t===6){const original=pick([60,80,100,120,160,200]),p=pick([10,20,25]),sale=roundTo(original*(1-p/100));return q('percentages',`After a ${p}% discount, a price is $${fmt(sale)}. Original price = $?`,original,'Divide the sale price by the remaining percentage.')}
  if(t===7){const cost=pick([40,50,60,80,100]),p=pick([10,20,25,30]);return q('percentages',`An item costs $${cost} and is sold for ${p}% profit. Selling price = $?`,cost*(1+p/100),'Profit is a percentage of the cost price.')}
  const d=pick([0.125,0.24,0.375,0.48,0.625,0.72,0.875]);return q('percentages',`${fmt(d)} = ?%`,d*100,'Multiply the decimal by 100.')}


function y8GenRatio(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(2,9),b=randInt(2,10),k=randInt(2,8);return qRatio('ratio',`Simplify ${a*k}:${b*k}`,simplifyRatio(a,b),'Divide both parts by their HCF.')}
  if(t===2){const a=randInt(2,8),b=randInt(3,10),k=randInt(2,7);return q('ratio',`${a}:${b} = ${a*k}:?`,b*k,'Multiply both parts by the same scale factor.')}
  if(t===3){const a=randInt(2,6),b=randInt(3,8),one=randInt(4,12),total=(a+b)*one;return q('ratio',`Share $${total} in the ratio ${a}:${b}. Smaller share = $?`,Math.min(a,b)*one,'Find one ratio part first.')}
  if(t===4){const items=randInt(3,9),unit=randInt(4,15),cost=items*unit;return q('ratio',`${items} items cost $${cost}. Cost per item = $?`,unit,'Divide total cost by the number of items.')}
  if(t===5){const a=randInt(3,8),b=randInt(4,10),k=randInt(2,7);return q('ratio',`${a} workers complete ${b} units. At the same rate, ${a*k} workers complete ? units.`,b*k,'Use direct proportion.')}
  if(t===6){const speed=pick([45,50,60,70,80,90]),time=pick([1.5,2,2.5,3]);return q('ratio',`${speed} km/h for ${time} h = ? km`,speed*time,'Distance = speed × time.')}
  if(t===7){const a=randInt(2,6),b=randInt(3,9),red=a*randInt(4,10);return q('ratio',`Red:Blue = ${a}:${b}. If red = ${red}, blue = ?`,red/a*b,'Find the scale factor.')}
  const scale=pick([2,5,10,20]),cm=randInt(3,12);return q('ratio',`Map scale: 1 cm represents ${scale} km. ${cm} cm represents ? km`,scale*cm,'Multiply the map length by the scale rate.')}


function y8GenAlgebra(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const x=randInt(-6,12),a=randInt(2,8),b=randInt(-12,14);return q('algebra',`If x=${x}, find ${a}x ${b>=0?'+':'−'} ${Math.abs(b)}.`,a*x+b,'Substitute the value of x.')}
  if(t===2){const a=randInt(2,9),b=randInt(2,9),c=randInt(1,Math.min(a+b-1,7));return q('algebra',`Coefficient of x after simplifying ${a}x + ${b}x − ${c}x = ?`,a+b-c,'Combine like terms.')}
  if(t===3){const a=randInt(2,7),b=randInt(2,9);return q('algebra',`Coefficient of x after expanding ${a}(2x − ${b}) = ?`,2*a,'Multiply every term inside the bracket.')}
  if(t===4){const a=randInt(2,7),b=randInt(2,9),c=randInt(-8,8);return q('algebra',`Constant term after expanding ${a}(x − ${b}) ${c>=0?'+':'−'} ${Math.abs(c)} = ?`,-a*b+c,'Expand the bracket, then combine constants.')}
  if(t===5){const a=pick([4,6,8,10,12]),b=pick([6,9,12,15,18]);return q('algebra',`Greatest numerical factor of ${a}x + ${b} = ?`,gcd(a,b),'Find the HCF of the coefficients.')}
  if(t===6){const x=randInt(-4,8),y=randInt(-5,7),a=randInt(2,5),b=randInt(2,5);return q('algebra',`If x=${x}, y=${y}, find ${a}x² − ${b}y.`,a*x*x-b*y,'Square x before multiplying.')}
  if(t===7){const x=randInt(2,10),a=randInt(2,6),b=a*randInt(1,5);return q('algebra',`If x=${x}, find (${a}x + ${b}) ÷ ${a}.`,(a*x+b)/a,'Substitute first, then divide.')}
  const x=randInt(-5,8),a=randInt(2,6),b=randInt(1,6),c=randInt(-8,8);return q('algebra',`If x=${x}, find ${a}(x − ${b}) ${c>=0?'+':'−'} ${Math.abs(c)}.`,a*(x-b)+c,'Expand or evaluate the bracket first.')}


function y8GenEquations() {
  const L = state.level;
  const t = L === 'starter'
    ? randInt(1, 4)
    : L === 'core'
      ? randInt(1, 6)
      : randInt(1, 8);
  const x = randInt(L === 'challenge' ? -8 : 1, 15);

  if (t === 1) {
    const a = randInt(2, 8);
    const b = randInt(2, 15);
    return q('equations', `${a}x + ${b} = ${a * x + b}Then x = ?`, x, 'Undo addition, then divide.');
  }

  if (t === 2) {
    const a = randInt(3, 9);
    const b = randInt(2, 14);
    return q('equations', `${a}x − ${b} = ${a * x - b}Then x = ?`, x, 'Undo subtraction, then divide.');
  }

  if (t === 3) {
    const a = randInt(2, 6);
    const b = randInt(1, 8);
    return q('equations', `${a}(x − ${b}) = ${a * (x - b)}Then x = ?`, x, 'Divide first, then add.');
  }

  if (t === 4) {
    const divisor = randInt(2, 7);
    const quotient = randInt(L === 'challenge' ? -8 : 1, 15);
    const b = randInt(1, 10);
    const dividend = divisor * quotient;
    return q(
      'equations',
      `x ÷ ${divisor} + ${b} = ${quotient + b}Then x = ?`,
      dividend,
      'Subtract, then multiply by the divisor.'
    );
  }

  if (t === 5) {
    const a = randInt(3, 8);
    const c = randInt(1, a - 1);
    const b = randInt(1, 12);
    const d = a * x + b - c * x;
    return q('equations', `${a}x + ${b} = ${c}x + ${d}Then x = ?`, x, 'Collect x terms on one side and constants on the other.');
  }

  if (t === 6) {
    const a = pick([0.5, 1.5, 2.5]);
    const b = randInt(2, 12);
    const rhs = a * x + b;
    return q('equations', `${fmt(a)}x + ${b} = ${fmt(rhs)}Then x = ?`, x, 'Undo the constant, then divide by the decimal coefficient.');
  }

  if (t === 7) {
    const a = randInt(2, 6);
    const b = randInt(1, 7);
    const c = randInt(1, 7);
    const rhs = a * (x - b) + c;
    return q('equations', `${a}(x − ${b}) + ${c} = ${rhs}Then x = ?`, x, 'Undo the outside constant, divide, then add.');
  }

  const a = randInt(2, 6);
  const b = randInt(1, 10);
  const c = randInt(1, a - 1);
  const d = a * x - b - c * x;
  return q('equations', `${a}x − ${b} = ${c}x + ${d}Then x = ?`, x, 'Move x terms together, then solve.');
}

function y8GenInequalities(){const L=state.level,t=L==='starter'?randInt(1,3):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(2,12),boundary=randInt(-5,15);return q('inequalities',`x + ${a} > ${boundary+a}. Boundary value = ?`,boundary,'Subtract the constant from both sides.')}
  if(t===2){const a=randInt(2,8),limit=randInt(2,12);return q('inequalities',`${a}x ≤ ${a*limit}. Greatest integer solution = ?`,limit,'Divide by the positive coefficient.')}
  if(t===3){const limit=randInt(-8,4),a=randInt(2,6);return q('inequalities',`-${a}x < ${-a*limit}. Smallest integer solution = ?`,limit+1,'Dividing by a negative reverses the inequality.')}
  if(t===4){const boundary=randInt(2,7);return q('inequalities',`How many integers from 0 to 10 satisfy x ≥ ${boundary}?`,11-boundary,'Count the integers including the boundary.')}
  if(t===5){const a=randInt(2,6),b=randInt(-8,8),x=randInt(-5,10),rhs=a*randInt(-3,8)+b;const yes=a*x+b>=rhs;return q('inequalities',`Does x=${x} satisfy ${a}x ${b>=0?'+':'−'} ${Math.abs(b)} ≥ ${rhs}? Enter 1 for Yes, 0 for No.`,yes?1:0,'Substitute the value and compare both sides.')}
  if(t===6){const a=randInt(2,6),boundary=randInt(-4,10),b=randInt(1,12);return q('inequalities',`${a}x + ${b} < ${a*boundary+b}. Boundary value = ?`,boundary,'Subtract the constant and divide by the positive coefficient.')}
  if(t===7){const low=randInt(-6,0),high=randInt(2,8);return q('inequalities',`How many integers satisfy ${low} ≤ x < ${high}?`,high-low,'List the integers from the lower bound up to one less than the upper bound.')}
  const a=randInt(2,6),boundary=randInt(-8,5);return q('inequalities',`-${a}x ≥ ${-a*boundary}. Greatest integer solution = ?`,boundary,'Reverse the sign when dividing by the negative coefficient.')}


function y8GenSequences(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(-10,20),d=randInt(2,10);return q('sequences',`${a}, ${a+d}, ${a+2*d}, ${a+3*d}, ... next = ?`,a+4*d,'Add the common difference.')}
  if(t===2){const a=randInt(1,10),d=randInt(2,9),n=randInt(6,15);return q('sequences',`Sequence starts ${a} and increases by ${d}. Term ${n} = ?`,a+(n-1)*d,'Use first term + (n−1) × difference.')}
  if(t===3){const a=randInt(1,8),d=randInt(2,8),n=randInt(5,12),term=a+(n-1)*d;return q('sequences',`In ${a}, ${a+d}, ${a+2*d}, ... which term equals ${term}?`,n,'Solve a + (n−1)d = the given term.')}
  if(t===4){const a=randInt(1,5),r=pick([2,3,-2]);return q('sequences',`${a}, ${a*r}, ${a*r*r}, ${a*r*r*r}, ... next = ?`,a*r**4,'Multiply by the common ratio.')}
  if(t===5){const n=randInt(4,12),a=randInt(2,7),b=randInt(-6,9);return q('sequences',`Tₙ = ${a}n ${b>=0?'+':'−'} ${Math.abs(b)}. T${n} = ?`,a*n+b,'Substitute the term number.')}
  if(t===6){const a=randInt(-12,5),d=randInt(3,9);return q('sequences',`${a}, ${a+d}, □, ${a+3*d}. Missing term = ?`,a+2*d,'The difference stays constant.')}
  if(t===7){return q('sequences','2, 6, 12, 20, ... next = ?',30,'First differences increase by 2.')}
  const a=randInt(1,4),b=randInt(0,5),n=randInt(4,9);return q('sequences',`Tₙ = ${a}n² ${b?`+ ${b}`:''}. T${n} = ?`,a*n*n+b,'Square n first, then multiply and add.')}


function y8GenCoordinates(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const x=pick([-6,-5,-4,-3,3,4,5,6]),y=pick([-7,-5,-3,3,5,7]);const quadrant=x>0&&y>0?1:x<0&&y>0?2:x<0&&y<0?3:4;return q('coordinates',`Point (${x}, ${y}) is in which quadrant? Enter 1, 2, 3 or 4.`,quadrant,'Use the signs of x and y.')}
  if(t===2){const horizontal=chance(.5),a=randInt(-8,4),b=randInt(a+2,10),fixed=randInt(-6,6);return q('coordinates',horizontal?`Distance between (${a}, ${fixed}) and (${b}, ${fixed}) = ?`:`Distance between (${fixed}, ${a}) and (${fixed}, ${b}) = ?`,b-a,'Subtract the matching coordinates.')}
  if(t===3){const x1=randInt(-8,4),x2=x1+2*randInt(1,6),y1=randInt(-8,4),y2=y1+2*randInt(1,6);const askX=chance(.5);return q('coordinates',`Midpoint of (${x1}, ${y1}) and (${x2}, ${y2}). ${askX?'x':'y'}-coordinate = ?`,askX?(x1+x2)/2:(y1+y2)/2,'Average the matching coordinates.')}
  if(t===4){const m=pick([-3,-2,-1,1,2,3,4]),x1=randInt(-4,4),y1=randInt(-5,5),dx=pick([1,2,3]),x2=x1+dx,y2=y1+m*dx;return q('coordinates',`Slope through (${x1}, ${y1}) and (${x2}, ${y2}) = ?`,m,'Slope = change in y ÷ change in x.')}
  if(t===5){const m=pick([-4,-3,-2,2,3,4]),c=randInt(-8,8),x=randInt(-5,7);return q('coordinates',`For y = ${m}x ${c>=0?'+':'−'} ${Math.abs(c)}, find y when x=${x}.`,m*x+c,'Substitute the x-coordinate.')}
  if(t===6){const m=pick([-5,-3,-2,2,3,5]),c=randInt(-12,12);return q('coordinates',`y = ${m}x ${c>=0?'+':'−'} ${Math.abs(c)}. y-intercept = ?`,c,'The y-intercept is the constant term.')}
  if(t===7){const m=pick([2,3,4,5]),c=randInt(-8,8),x=randInt(-4,8),y=m*x+c;return q('coordinates',`On y = ${m}x ${c>=0?'+':'−'} ${Math.abs(c)}, y=${y}Then x = ?`,x,'Subtract the intercept, then divide by the slope.')}
  const x=randInt(-8,8),y=randInt(-8,8),dx=randInt(-5,5),dy=randInt(-5,5),askX=chance(.5);return q('coordinates',`Translate (${x}, ${y}) by (${dx}, ${dy}). New ${askX?'x':'y'}-coordinate = ?`,askX?x+dx:y+dy,'Add the translation vector to the point.')}


function y8GenGeometry(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const a=randInt(25,85),b=randInt(25,Math.min(95,170-a));return q('geometry',`Triangle angles are ${a}° and ${b}°. Third angle = ?°`,180-a-b,'Angles in a triangle total 180°.')}
  if(t===2){const sides=pick([5,6,7,8,9,10]);return q('geometry',`Interior angle sum of a ${sides}-sided polygon = ?°`,(sides-2)*180,'Use (n−2) × 180°.')}
  if(t===3){const b=randInt(5,20),h=randInt(4,16),kind=chance(.5);return q('geometry',`${kind?'Parallelogram':'Triangle'} base ${b} cm, height ${h} cm. Area = ? cm²`,kind?b*h:b*h/2,kind?'Area = base × height.':'Area = 1/2 × base × height.')}
  if(t===4){const l=randInt(3,12),w=randInt(3,10),h=randInt(2,8);return q('geometry',`Cuboid ${l} cm × ${w} cm × ${h} cm. Volume = ? cm³`,l*w*h,'Volume = length × width × height.')}
  if(t===5){const triple=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17],[7,24,25]]);return q('geometry',`Right triangle legs ${triple[0]} cm and ${triple[1]} cm. Hypotenuse = ? cm`,triple[2],'Use a² + b² = c².')}
  if(t===6){const r=pick([2,3,4,5,10]);return q('geometry',`Circle radius ${r} cm. Circumference = ?π cm. Enter the coefficient of π.`,2*r,'Circumference = 2πr, so enter 2r.')}
  if(t===7){const r=pick([2,3,4,5,10]);return q('geometry',`Circle radius ${r} cm. Area = ?π cm². Enter the coefficient of π.`,r*r,'Area = πr², so enter r².')}
  const area=randInt(12,60),scale=pick([2,3,4]);return q('geometry',`A shape has area ${area} cm² and is enlarged by scale factor ${scale}. New area = ? cm²`,area*scale*scale,'Area is multiplied by the square of the scale factor.')}


function y8GenStatistics(){const L=state.level,t=L==='starter'?randInt(1,4):L==='core'?randInt(1,6):randInt(1,8);
  if(t===1){const values=[randInt(3,12),randInt(3,12),randInt(3,12),randInt(3,12),randInt(3,12)];const sum=values.reduce((a,b)=>a+b,0),rem=sum%5;if(rem)values[4]+=5-rem;return q('statistics',`Mean of ${values.join(', ')} = ?`,values.reduce((a,b)=>a+b,0)/5,'Add the values and divide by 5.')}
  if(t===2){const values=[randInt(1,15),randInt(1,15),randInt(1,15),randInt(1,15),randInt(1,15)];return q('statistics',`Median of ${values.join(', ')} = ?`,median(values),'Order the values and choose the middle one.')}
  if(t===3){const mode=randInt(3,12),others=[mode+1,mode+2,mode+4];const values=[mode,mode,...others];return q('statistics',`Mode of ${values.join(', ')} = ?`,mode,'Find the value that appears most often.')}
  if(t===4){const low=randInt(1,10),high=randInt(low+5,25),values=[low,randInt(low,high),randInt(low,high),randInt(low,high),high];return q('statistics',`Range of ${values.join(', ')} = ?`,high-low,'Range = maximum − minimum.')}
  if(t===5){const count=pick([4,5,6]),mean=randInt(6,15);let known,missing;do{known=Array.from({length:count-1},()=>randInt(2,18));missing=mean*count-known.reduce((a,b)=>a+b,0)}while(missing<0||missing>25);return q('statistics',`${count} numbers have mean ${mean}. Known values: ${known.join(', ')}. Missing value = ?`,missing,'Total = mean × number of values.')}
  if(t===6){const red=randInt(2,8),blue=randInt(2,8);return qFrac('statistics',`Bag: ${red} red and ${blue} blue. P(red) = ?`,red/(red+blue),'Probability = favourable outcomes ÷ total outcomes.')}
  if(t===7){const p=pick([0.15,0.25,0.35,0.4,0.65,0.8]);return q('statistics',`P(event) = ${p}. P(not event) = ?`,1-p,'Complementary probabilities add to 1.')}
  return qFrac('statistics','A fair coin is tossed twice. P(two heads) = ?',1/4,'There are four equally likely outcomes: HH, HT, TH, TT.')}

/* ===== ADDED FOCUSED YEAR 8 QUESTION GENERATORS ===== */

function y8GenReversePercentages() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const percentage = pick(L === 'starter' ? [10, 20, 25, 50] : [10, 20, 25, 40, 50, 60]);

  if (t === 1) {
    const original = randInt(2, 15) * 20;
    const sale = original * (100 - percentage) / 100;
    return q('reversePercentages', `After a ${percentage}% discount, a price is $${fmt(sale)}. Original price = $?`, original, 'Divide the sale price by the percentage that remains.');
  }

  if (t === 2) {
    const original = randInt(2, 15) * 20;
    const finalValue = original * (100 + percentage) / 100;
    return q('reversePercentages', `A value increases by ${percentage}% to ${fmt(finalValue)}. Original value = ?`, original, 'The final value represents more than 100% of the original.');
  }

  if (t === 3) {
    const original = randInt(2, 18) * 20;
    const finalValue = original * (100 - percentage) / 100;
    return q('reversePercentages', `A value decreases by ${percentage}% to ${fmt(finalValue)}. Original value = ?`, original, 'The final value is the remaining percentage of the original.');
  }

  if (t === 4) {
    const remaining = pick([60, 70, 75, 80, 90]);
    const original = randInt(3, 18) * 20;
    const finalValue = original * remaining / 100;
    return q('reversePercentages', `${remaining}% of a number is ${fmt(finalValue)}. The whole number = ?`, original, 'Divide by the decimal form of the percentage.');
  }

  if (t === 5) {
    const original = randInt(4, 20) * 25;
    const finalValue = original * 1.25;
    return q('reversePercentages', `After a 25% increase, an amount is ${fmt(finalValue)}. Find the original amount.`, original, 'The final amount is 125% of the original.');
  }

  const original = randInt(4, 20) * 25;
  const finalValue = original * 0.75;
  return q('reversePercentages', `After a 25% decrease, an amount is ${fmt(finalValue)}. Find the original amount.`, original, 'The final amount is 75% of the original.');
}

function y8GenPercentageChange() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const percentage = pick(L === 'starter' ? [10, 20, 25, 50] : [5, 10, 15, 20, 25, 40, 50]);
  const original = randInt(2, 18) * 20;

  if (t === 1) {
    const newValue = original * (100 + percentage) / 100;
    return q('percentageChange', `Increase ${original} by ${percentage}%.`, newValue, 'Find the percentage amount, then add it.');
  }

  if (t === 2) {
    const newValue = original * (100 - percentage) / 100;
    return q('percentageChange', `Decrease ${original} by ${percentage}%.`, newValue, 'Find the percentage amount, then subtract it.');
  }

  if (t === 3) {
    const change = original * percentage / 100;
    return q('percentageChange', `${original} increases to ${fmt(original + change)}. Percentage increase = ?%`, percentage, 'Change ÷ original × 100.');
  }

  if (t === 4) {
    const change = original * percentage / 100;
    return q('percentageChange', `${original} decreases to ${fmt(original - change)}. Percentage decrease = ?%`, percentage, 'Change ÷ original × 100.');
  }

  if (t === 5) {
    const first = pick([10, 20, 25]);
    const second = pick([10, 20, 25]);
    const after = original * (100 + first) / 100 * (100 - second) / 100;
    return q('percentageChange', `${original} increases by ${first}% then decreases by ${second}%. Final value = ?`, after, 'Apply each multiplier in order.');
  }

  const first = pick([10, 20, 25]);
  const second = pick([10, 20, 25]);
  const after = original * (100 - first) / 100 * (100 + second) / 100;
  return q('percentageChange', `${original} decreases by ${first}% then increases by ${second}%. Final value = ?`, after, 'Successive percentage changes are applied one after the other.');
}

function y8GenProfitLossDiscount() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 3) : L === 'core' ? randInt(1, 5) : randInt(1, 7);

  if (t === 1) {
    const cost = randInt(4, 20) * 10;
    const profit = randInt(1, 8) * 5;
    return q('profitLossDiscount', `An item costs $${cost} and sells for $${cost + profit}. Profit = $?`, profit, 'Selling price minus cost price.');
  }

  if (t === 2) {
    const cost = randInt(5, 20) * 10;
    const loss = randInt(1, 8) * 5;
    return q('profitLossDiscount', `An item costs $${cost} and sells for $${cost - loss}. Loss = $?`, loss, 'Cost price minus selling price.');
  }

  if (t === 3) {
    const original = randInt(3, 18) * 20;
    const discount = pick([10, 20, 25, 50]);
    return q('profitLossDiscount', `A $${original} item is discounted by ${discount}%. Sale price = $?`, original * (100 - discount) / 100, 'Subtract the discount from the original price.');
  }

  if (t === 4) {
    const cost = randInt(2, 15) * 20;
    const rate = pick([10, 20, 25, 50]);
    return q('profitLossDiscount', `Cost price $${cost}. Profit is ${rate}% of cost. Selling price = $?`, cost * (100 + rate) / 100, 'Add the profit to the cost price.');
  }

  if (t === 5) {
    const cost = randInt(2, 15) * 20;
    const rate = pick([10, 20, 25, 50]);
    return q('profitLossDiscount', `Cost price $${cost}. Loss is ${rate}% of cost. Selling price = $?`, cost * (100 - rate) / 100, 'Subtract the loss from the cost price.');
  }

  if (t === 6) {
    const cost = randInt(3, 15) * 20;
    const rate = pick([10, 20, 25, 50]);
    const sale = cost * (100 + rate) / 100;
    return q('profitLossDiscount', `An item costs $${cost} and sells for $${fmt(sale)}. Profit percentage = ?%`, rate, 'Profit ÷ cost × 100.');
  }

  const marked = randInt(4, 18) * 20;
  const discount = pick([10, 20, 25, 50]);
  const sale = marked * (100 - discount) / 100;
  return q('profitLossDiscount', `A sale price is $${fmt(sale)} after a ${discount}% discount. Marked price = $?`, marked, 'Use the percentage of the marked price that remains.');
}

function y8GenDirectInverseProportion() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);

  if (t === 1) {
    const unit = randInt(2, 12);
    const first = randInt(2, 8);
    const second = randInt(3, 12);
    return q('directInverseProportion', `${first} identical items cost $${first * unit}. ${second} items cost $?`, second * unit, 'Find the unit cost, then multiply.');
  }

  if (t === 2) {
    const k = randInt(2, 12);
    const x = randInt(2, 10);
    return q('directInverseProportion', `y is directly proportional to x and y = ${k * x} when x = ${x}. Find y when x = ${x + 3}.`, k * (x + 3), 'For direct proportion, y = kx.');
  }

  if (t === 3) {
    const workers1 = pick([2, 3, 4, 6]);
    const workers2 = pick([2, 3, 4, 6, 8, 12]);
    const constant = lcm(workers1, workers2) * randInt(2, 6);
    return q('directInverseProportion', `${workers1} workers take ${constant / workers1} hours. At the same rate, ${workers2} workers take ? hours.`, constant / workers2, 'Workers × time stays constant.');
  }

  if (t === 4) {
    const x1 = pick([2, 3, 4, 5, 6]);
    const x2 = pick([2, 3, 4, 5, 6, 8, 10]);
    const k = lcm(x1, x2) * randInt(2, 8);
    return q('directInverseProportion', `y is inversely proportional to x. If y = ${k / x1} when x = ${x1}, find y when x = ${x2}.`, k / x2, 'For inverse proportion, xy is constant.');
  }

  if (t === 5) {
    const x = randInt(2, 10);
    const k = randInt(2, 12);
    return q('directInverseProportion', `y ∝ x and y = ${k * x} when x = ${x}. Constant of proportionality k = ?`, k, 'Divide y by x.');
  }

  const x = pick([2, 3, 4, 5, 6, 8]);
  const k = x * randInt(3, 12);
  return q('directInverseProportion', `y ∝ 1/x and y = ${k / x} when x = ${x}. Constant xy = ?`, k, 'Multiply x and y.');
}

function y8GenPrimeFactorisation() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 3) : L === 'core' ? randInt(1, 5) : randInt(1, 7);
  const numbers = L === 'starter' ? [12, 18, 20, 24, 28, 30, 36, 40, 42, 45] : [48, 54, 60, 72, 75, 84, 90, 96, 108, 120, 126, 144];
  const n = pick(numbers);
  const factors = primeFactors(n);

  if (t === 1) {
    return q('primeFactorisation', `Largest prime factor of ${n} = ?`, Math.max(...factors), 'Use a factor tree or repeated division.');
  }

  if (t === 2) {
    return q('primeFactorisation', `Smallest prime factor of ${n} = ?`, Math.min(...factors), 'Test divisibility by small primes first.');
  }

  if (t === 3) {
    return q('primeFactorisation', `How many prime factors does ${n} have, counting repeats?`, factors.length, 'Count every prime in the prime factorisation.');
  }

  if (t === 4) {
    const p = pick([...new Set(factors)]);
    return q('primeFactorisation', `In the prime factorisation of ${n}, the exponent of ${p} is ?`, factors.filter(value => value === p).length, 'Count how many times that prime occurs.');
  }

  if (t === 5) {
    const p = pick([2, 3, 5]);
    const exponent = factors.filter(value => value === p).length;
    return q('primeFactorisation', `In ${n} = prime factors, how many times does ${p} divide ${n}?`, exponent, 'Repeatedly divide by the given prime.');
  }

  if (t === 6) {
    const p = pick([...new Set(factors)]);
    const exponent = factors.filter(value => value === p).length;
    const otherProduct = factors.filter(value => value !== p).reduce((a, b) => a * b, 1);
    return q('primeFactorisation', `${n} = ${p}^? × ${otherProduct}. Find ?.`, exponent, 'The exponent counts repeated copies of the prime.');
  }

  return q('primeFactorisation', `Number of different prime factors of ${n} = ?`, new Set(factors).size, 'Count distinct primes only.');
}

function y8GenHcfLcmProblems() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const pairs = L === 'starter'
    ? [[8, 12], [9, 15], [10, 15], [12, 18], [14, 21], [15, 20], [16, 24], [18, 27], [20, 30], [21, 28], [24, 36], [25, 35]]
    : [[18, 30], [20, 32], [24, 40], [27, 45], [28, 42], [30, 48], [32, 56], [36, 48], [40, 60], [45, 60], [54, 72], [63, 84]];
  const [a, b] = pick(pairs);

  if (t === 1) {
    return q('hcfLcmProblems', `HCF of ${a} and ${b} = ?`, gcd(a, b), 'The HCF is the greatest shared factor.');
  }

  if (t === 2) {
    return q('hcfLcmProblems', `LCM of ${a} and ${b} = ?`, lcm(a, b), 'The LCM is the first common multiple.');
  }

  if (t === 3) {
    return q('hcfLcmProblems', `Two lights flash every ${a} seconds and ${b} seconds. They flash together again after ? seconds.`, lcm(a, b), 'Use the lowest common multiple.');
  }

  if (t === 4) {
    return q('hcfLcmProblems', `${a} red beads and ${b} blue beads are split into the greatest possible number of identical groups. Number of groups = ?`, gcd(a, b), 'Use the highest common factor.');
  }

  if (t === 5) {
    const groups = gcd(a, b);
    return q('hcfLcmProblems', `${a} apples and ${b} oranges are shared equally into the greatest number of bags. Items in each bag = ?`, a / groups + b / groups, 'Find the number of bags first, then total items per bag.');
  }

  const c = pick([6, 8, 9, 10, 12]);
  return q('hcfLcmProblems', `The LCM of ${a} and ${c} is ?`, lcm(a, c), 'List multiples or use prime factors.');
}

function y8GenExpandCoefficients() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const a = randInt(2, 7);
  const b = randInt(2, 8);
  const c = randInt(1, 6);

  if (t === 1) {
    return q('expandCoefficients', `In ${a}(${b}x + ${c}), the coefficient of x after expanding is ?`, a * b, 'Multiply the outside number by the x coefficient.');
  }

  if (t === 2) {
    return q('expandCoefficients', `In ${a}(x + ${b}), the constant term after expanding is ?`, a * b, 'Multiply the outside number by the constant.');
  }

  if (t === 3) {
    const d = randInt(1, 8);
    return q('expandCoefficients', `After simplifying ${a}(${b}x + ${c}) + ${d}x, coefficient of x = ?`, a * b + d, 'Expand, then combine like terms.');
  }

  if (t === 4) {
    const d = randInt(1, 6);
    return q('expandCoefficients', `After simplifying ${a}(${b}x − ${c}) − ${d}x, coefficient of x = ?`, a * b - d, 'Expand both x terms and combine them.');
  }

  if (t === 5) {
    const d = randInt(1, 6);
    const e = randInt(1, 7);
    return q('expandCoefficients', `In (${a}x + ${b})(${d}x + ${e}), coefficient of x = ?`, a * e + b * d, 'The x terms come from the outer and inner products.');
  }

  const d = randInt(1, 6);
  const e = randInt(1, 7);
  return q('expandCoefficients', `In (${a}x − ${b})(${d}x + ${e}), coefficient of x = ?`, a * e - b * d, 'Combine the two products that contain one x.');
}

function y8GenFactorCommon() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const g = randInt(2, 9);
  const a = randInt(2, 8);
  const b = randInt(2, 9);

  if (t === 1) {
    return q('factorCommon', `Greatest numerical common factor of ${g * a}x and ${g * b} = ?`, g, 'Find the HCF of the coefficients.');
  }

  if (t === 2) {
    return q('factorCommon', `${g * a}x + ${g * b} = ${g}(?x + ${b}). Find ?.`, a, 'Divide the x coefficient by the common factor.');
  }

  if (t === 3) {
    return q('factorCommon', `${g * a}x − ${g * b} = ${g}(?x − ${b}). Find ?.`, a, 'Divide every term by the common factor.');
  }

  if (t === 4) {
    const p = randInt(2, 4);
    const qPower = randInt(1, p);
    return q('factorCommon', `Highest common power of x in ${g * a}x^${p} + ${g * b}x^${qPower} is x^?.`, Math.min(p, qPower), 'Use the smaller exponent shared by both terms.');
  }

  if (t === 5) {
    const c = randInt(2, 8);
    return q('factorCommon', `After factorising ${g * a}x^2 + ${g * b}x, the coefficient of x inside the bracket is ?`, a, `Factor out ${g}x.`);
  }

  const c = randInt(2, 6);
  return q('factorCommon', `Greatest numerical common factor of ${g * a}x^2, ${g * b}x and ${g * c} = ?`, gcd(g * a, gcd(g * b, g * c)), 'Find the HCF of all three coefficients.');
}

function y8GenBothSidesEquations() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const x = randInt(L === 'challenge' ? -8 : 1, 12);
  let a = randInt(3, 9);
  let c = randInt(1, a - 1);
  const b = randInt(-10, 15);
  const d = (a - c) * x + b;
  const signed = n => n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`;

  if (t === 1) {
    return q('bothSidesEquations', `${a}x ${signed(b)} = ${c}x ${signed(d)}. Find x.`, x, 'Collect x terms on one side and constants on the other.');
  }

  if (t === 2) {
    const positiveB = randInt(1, 12);
    const right = (a - c) * x + positiveB;
    return q('bothSidesEquations', `${a}x + ${positiveB} = ${c}x + ${right}. Find x.`, x, 'Subtract the smaller x term first.');
  }

  if (t === 3) {
    const p = randInt(2, 6);
    const qv = randInt(1, 8);
    const rightConst = p * qv + (p - c) * x;
    return q('bothSidesEquations', `${p}(x + ${qv}) = ${c}x + ${rightConst}. Find x.`, x, 'Expand the bracket, then collect like terms.');
  }

  if (t === 4) {
    const p = randInt(2, 6);
    const qv = randInt(1, 8);
    const rightConst = -p * qv + (p - c) * x;
    return q('bothSidesEquations', `${p}(x − ${qv}) = ${c}x ${signed(rightConst)}. Find x.`, x, 'Expand carefully before rearranging.');
  }

  if (t === 5) {
    a = randInt(4, 10);
    c = randInt(1, a - 1);
    const leftConst = randInt(-12, 12);
    const rightConst = (a - c) * x + leftConst;
    return q('bothSidesEquations', `${a}x ${signed(leftConst)} = ${c}x ${signed(rightConst)}. Find x.`, x, 'Move variable terms and constants in opposite directions.');
  }

  const p = randInt(2, 6);
  const r = randInt(1, p - 1);
  const qv = randInt(1, 7);
  const sv = p * (x + qv) - r * x;
  return q('bothSidesEquations', `${p}(x + ${qv}) = ${r}x + ${sv}. Find x.`, x, 'Expand, collect x terms, then divide.');
}

function y8GenInequalityBoundaries() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);
  const a = randInt(2, 8);
  const boundary = randInt(-5, 12);
  const b = randInt(-8, 12);

  if (t === 1) {
    const c = a * (boundary + 1) + b;
    return q('inequalityBoundaries', `Greatest integer satisfying ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} < ${c} is ?`, boundary, 'Solve the inequality, then choose the greatest integer below the boundary.');
  }

  if (t === 2) {
    const c = a * boundary + b;
    return q('inequalityBoundaries', `Smallest integer satisfying ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} ≥ ${c} is ?`, boundary, 'Solve for x and include the boundary.');
  }

  if (t === 3) {
    const c = a * boundary + b;
    return q('inequalityBoundaries', `Boundary value of ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} ≤ ${c} is x = ?`, boundary, 'Replace the inequality sign with equals to find the boundary.');
  }

  if (t === 4) {
    const lower = randInt(-8, 2);
    const upper = lower + randInt(3, 10);
    return q('inequalityBoundaries', `How many integers satisfy ${lower} < x ≤ ${upper}?`, upper - lower, 'List the integers greater than the lower bound up to and including the upper bound.');
  }

  if (t === 5) {
    const c = -a * boundary + b;
    return q('inequalityBoundaries', `Boundary value of −${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} > ${c} is x = ?`, boundary, 'Find the equality boundary; remember the sign reverses when dividing by a negative.');
  }

  const lower = randInt(-10, 0);
  const upper = lower + randInt(4, 12);
  return q('inequalityBoundaries', `How many integers satisfy ${lower} ≤ x < ${upper}?`, upper - lower, 'Include the lower bound but exclude the upper bound.');
}

function y8GenGradientMidpoint() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);

  if (t === 1) {
    const x1 = randInt(-5, 5);
    const dx = randInt(1, 5);
    const m = randInt(-4, 5);
    const y1 = randInt(-8, 8);
    return q('gradientMidpoint', `Gradient of the line through (${x1}, ${y1}) and (${x1 + dx}, ${y1 + m * dx}) = ?`, m, 'Change in y ÷ change in x.');
  }

  if (t === 2) {
    const mx = randInt(-5, 8);
    const my = randInt(-5, 8);
    const dx = randInt(1, 6);
    const dy = randInt(1, 6);
    return q('gradientMidpoint', `The midpoint of (${mx - dx}, ${my - dy}) and (${mx + dx}, ${my + dy}) has x-coordinate ?`, mx, 'Average the two x-coordinates.');
  }

  if (t === 3) {
    const mx = randInt(-5, 8);
    const my = randInt(-5, 8);
    const dx = randInt(1, 6);
    const dy = randInt(1, 6);
    return q('gradientMidpoint', `The midpoint of (${mx - dx}, ${my - dy}) and (${mx + dx}, ${my + dy}) has y-coordinate ?`, my, 'Average the two y-coordinates.');
  }

  if (t === 4) {
    const m = randInt(-5, 5);
    const c = randInt(-10, 10);
    return q('gradientMidpoint', `For y = ${m}x ${c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`}, the y-intercept is ?`, c, 'The y-intercept is the constant term.');
  }

  if (t === 5) {
    const m = randInt(-6, 6);
    return q('gradientMidpoint', `A line parallel to y = ${m}x + 7 has gradient ?`, m, 'Parallel lines have equal gradients.');
  }

  const x1 = randInt(-5, 5);
  const dx = randInt(1, 5);
  const m = randInt(-4, 5);
  const y1 = randInt(-8, 8);
  return q('gradientMidpoint', `A line has gradient ${m} and passes through (${x1}, ${y1}). When x = ${x1 + dx}, y = ?`, y1 + m * dx, 'Use the gradient as change in y per unit change in x.');
}

function y8GenPolygonAngles() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 3) : L === 'core' ? randInt(1, 5) : randInt(1, 7);

  if (t === 1) {
    const a = randInt(25, 80);
    const b = randInt(25, 80);
    return q('polygonAngles', `Two angles of a triangle are ${a}° and ${b}°. Third angle = ?°`, 180 - a - b, 'Angles in a triangle total 180°.');
  }

  if (t === 2) {
    const a = randInt(60, 120);
    const b = randInt(60, 120);
    const c = randInt(60, 120);
    return q('polygonAngles', `Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. Fourth angle = ?°`, 360 - a - b - c, 'Angles in a quadrilateral total 360°.');
  }

  if (t === 3) {
    const n = randInt(5, L === 'starter' ? 8 : 12);
    return q('polygonAngles', `Interior angle sum of a ${n}-sided polygon = ?°`, (n - 2) * 180, 'Use (n − 2) × 180°.');
  }

  if (t === 4) {
    const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
    return q('polygonAngles', `Each exterior angle of a regular ${n}-gon = ?°`, 360 / n, 'Exterior angles of any polygon total 360°.');
  }

  if (t === 5) {
    const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
    return q('polygonAngles', `Each interior angle of a regular ${n}-gon = ?°`, 180 - 360 / n, 'Interior and exterior angles on a straight line total 180°.');
  }

  if (t === 6) {
    const exterior = pick([30, 36, 40, 45, 60, 72, 90, 120]);
    return q('polygonAngles', `A regular polygon has exterior angle ${exterior}°. Number of sides = ?`, 360 / exterior, 'Number of sides = 360 ÷ exterior angle.');
  }

  const angle = randInt(35, 145);
  return q('polygonAngles', `Two parallel lines are cut by a transversal. An alternate interior angle is ${angle}°. The matching alternate angle = ?°`, angle, 'Alternate interior angles are equal.');
}

function y8GenPythagorasFocused() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 3) : randInt(1, 5);
  const triples = L === 'starter'
    ? [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [10, 24, 26], [12, 16, 20], [15, 20, 25]]
    : [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [10, 24, 26], [12, 16, 20], [15, 20, 25]];
  const [a, b, c] = pick(triples);

  if (t === 1) {
    return q('pythagorasFocused', `Right triangle legs ${a} cm and ${b} cm. Hypotenuse = ? cm`, c, 'Use a² + b² = c².');
  }

  if (t === 2) {
    return q('pythagorasFocused', `Right triangle hypotenuse ${c} cm and one leg ${a} cm. Other leg = ? cm`, b, 'Subtract the square of the known leg from the hypotenuse squared.');
  }

  if (t === 3) {
    const scale = randInt(2, 4);
    return q('pythagorasFocused', `A right triangle has legs ${a * scale} cm and ${b * scale} cm. Hypotenuse = ? cm`, c * scale, 'Recognise a scaled Pythagorean triple.');
  }

  if (t === 4) {
    return q('pythagorasFocused', `A rectangle is ${a} cm by ${b} cm. Its diagonal = ? cm`, c, 'The diagonal is the hypotenuse of a right triangle.');
  }

  const shownC = chance(0.5) ? c : c + pick([1, 2]);
  const isRight = a * a + b * b === shownC * shownC ? 1 : 0;
  return q('pythagorasFocused', `Do side lengths ${a}, ${b}, ${shownC} form a right triangle? Enter 1 for yes or 0 for no.`, isRight, 'Check whether the two smaller squares add to the largest square.');
}

function y8GenMissingStatistics() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 2) : L === 'core' ? randInt(1, 4) : randInt(1, 6);

  if (t === 1) {
    const count = randInt(4, 7);
    const meanValue = randInt(6, 20);
    const total = meanValue * count;
    const missing = randInt(2, Math.max(2, Math.min(meanValue * 2, total - 2 * (count - 1))));
    const known = [];
    let remaining = total - missing;

    for (let i = 0; i < count - 2; i++) {
      const placesLeft = count - 2 - i;
      const maximum = remaining - 2 * placesLeft;
      const value = randInt(2, Math.max(2, Math.min(maximum, meanValue * 2)));
      known.push(value);
      remaining -= value;
    }

    known.push(remaining);
    return q('missingStatistics', `The mean of ${known.join(', ')}, x is ${meanValue}. Find x.`, missing, 'Total = mean × number of values.');
  }

  if (t === 2) {
    const count = randInt(4, 8);
    const meanValue = randInt(5, 20);
    return q('missingStatistics', `${count} values have mean ${meanValue}. Their total = ?`, count * meanValue, 'Total = mean × number of values.');
  }

  if (t === 3) {
    const count = randInt(3, 7);
    const oldMean = randInt(5, 15);
    const newMean = oldMean + randInt(1, 4);
    const added = newMean * (count + 1) - oldMean * count;
    return q('missingStatistics', `${count} values have mean ${oldMean}. After adding ${added}, the new mean = ?`, newMean, 'Add the new value to the old total, then divide by the new count.');
  }

  if (t === 4) {
    const count = randInt(4, 8);
    const oldMean = randInt(8, 20);
    const newMean = oldMean + pick([-2, -1, 1, 2]);
    const removed = oldMean * count - newMean * (count - 1);
    return q('missingStatistics', `${count} values have mean ${oldMean}. One value, ${removed}, is removed. New mean = ?`, newMean, 'Subtract the removed value from the total, then divide by one fewer value.');
  }

  if (t === 5) {
    const minimum = randInt(2, 20);
    const range = randInt(5, 25);
    return q('missingStatistics', `A data set has minimum ${minimum} and range ${range}. Maximum = ?`, minimum + range, 'Maximum = minimum + range.');
  }

  const middle1 = randInt(5, 18);
  const middle2 = middle1 + pick([2, 4, 6, 8]);
  const values = [randInt(1, middle1), middle1, middle2, randInt(middle2, middle2 + 12)].sort((a, b) => a - b);
  return q('missingStatistics', `For ordered data ${values.join(', ')}, median = ?`, (values[1] + values[2]) / 2, 'For four values, average the middle two.');
}

function y8GenTwoStepProbability() {
  const L = state.level;
  const t = L === 'starter' ? randInt(1, 3) : L === 'core' ? randInt(1, 5) : randInt(1, 7);

  if (t === 1) {
    const target = pick(['two heads', 'two tails']);
    return qFrac('twoStepProbability', `A fair coin is tossed twice. Probability of ${target} = ?`, 1 / 4, 'Multiply 1/2 by 1/2.');
  }

  if (t === 2) {
    return qFrac('twoStepProbability', 'A fair coin is tossed twice. Probability of one head and one tail, in any order = ?', 1 / 2, 'There are two successful outcomes out of four equally likely outcomes.');
  }

  if (t === 3) {
    const successful = randInt(1, 5);
    const total = randInt(successful + 1, 8);
    return qFrac('twoStepProbability', `A spinner has ${total} equal sections, ${successful} are blue. It is spun twice. Probability of blue both times = ?`, (successful / total) ** 2, 'Multiply the probability of blue by itself.');
  }

  if (t === 4) {
    const red = randInt(1, 5);
    const blue = randInt(1, 5);
    const total = red + blue;
    return qFrac('twoStepProbability', `A bag has ${red} red and ${blue} blue counters. Two draws are made with replacement. Probability of two red counters = ?`, (red / total) ** 2, 'With replacement, multiply the same probability twice.');
  }

  if (t === 5) {
    const red = randInt(2, 6);
    const blue = randInt(1, 5);
    const total = red + blue;
    return qFrac('twoStepProbability', `A bag has ${red} red and ${blue} blue counters. Two draws are made without replacement. Probability of two red counters = ?`, red / total * (red - 1) / (total - 1), 'The total and red count both decrease after the first red draw.');
  }

  if (t === 6) {
    const face = randInt(1, 6);
    return qFrac('twoStepProbability', `A fair dice is rolled twice. Probability of getting ${face} both times = ?`, 1 / 36, 'Multiply 1/6 by 1/6.');
  }

  const failNumerator = pick([1, 2, 3]);
  const denominator = pick([4, 5, 6]);
  const fail = failNumerator / denominator;
  return qFrac('twoStepProbability', `The probability of failure on one independent attempt is ${failNumerator}/${denominator}. Probability of at least one success in two attempts = ?`, 1 - fail ** 2, 'Use 1 − P(two failures).');
}

YEAR_BANKS[8] = {
    rational: y8GenRational,
    order: y8GenOrder,
    powers: y8GenPowers,
    factors: y8GenFactors,
    fractions: y8GenFractions,
    decimals: y8GenDecimals,
    percentages: y8GenPercentages,
    ratio: y8GenRatio,
    algebra: y8GenAlgebra,
    equations: y8GenEquations,
    inequalities: y8GenInequalities,
    sequences: y8GenSequences,
    coordinates: y8GenCoordinates,
    geometry: y8GenGeometry,
    statistics: y8GenStatistics,
    reversePercentages: y8GenReversePercentages,
    percentageChange: y8GenPercentageChange,
    profitLossDiscount: y8GenProfitLossDiscount,
    directInverseProportion: y8GenDirectInverseProportion,
    primeFactorisation: y8GenPrimeFactorisation,
    hcfLcmProblems: y8GenHcfLcmProblems,
    expandCoefficients: y8GenExpandCoefficients,
    factorCommon: y8GenFactorCommon,
    bothSidesEquations: y8GenBothSidesEquations,
    inequalityBoundaries: y8GenInequalityBoundaries,
    gradientMidpoint: y8GenGradientMidpoint,
    polygonAngles: y8GenPolygonAngles,
    pythagorasFocused: y8GenPythagorasFocused,
    missingStatistics: y8GenMissingStatistics,
    twoStepProbability: y8GenTwoStepProbability,
    fdpConversions: sharedGenFDPConversions,
    fdpComparison: sharedGenFDPComparison,
    fdpOperations: sharedGenFDPOperations
  };
