const $ = (id) => document.getElementById(id);
const MAX_N = 170; // 171! overflows Number to Infinity

// Factorial: while loop
function factorial(n) {
  let result = 1;
  let i = n;
  while (i > 1) {
    result *= i;
    i--;
  }
  return result;
}

// Sum of first N natural numbers: do...while loop
function sum(n) {
  let total = 0;
  let i = 1;
  do {
    total += i;
    i++;
  } while (i <= n);
  return total;
}

// Average of first N natural numbers: for loop
function average(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total / n;
}

function fmt(x) {
  return x <= Number.MAX_SAFE_INTEGER
    ? x.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : x.toExponential(6);
}

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = $("n").value.trim();
  const n = Number(raw);

  if (raw === "" || !Number.isInteger(n) || n < 1 || n > MAX_N) {
    $("error").textContent = `Enter a whole number from 1 to ${MAX_N}.`;
    return;
  }

  $("error").textContent = "";
  $("fact").textContent = fmt(factorial(n));
  $("sum").textContent = fmt(sum(n));
  $("avg").textContent = fmt(average(n));
});
