const $ = (id) => document.getElementById(id);
const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
const pesoWhole = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

// Income Tax = base + rate * (income - over)
const brackets = [
  { over: 0,       upTo: 250000,   base: 0,       rate: 0 },
  { over: 250000,  upTo: 400000,   base: 0,       rate: 0.20 },
  { over: 400000,  upTo: 800000,   base: 30000,   rate: 0.25 },
  { over: 800000,  upTo: 2000000,  base: 130000,  rate: 0.30 },
  { over: 2000000, upTo: 8000000,  base: 490000,  rate: 0.32 },
  { over: 8000000, upTo: Infinity, base: 2410000, rate: 0.35 },
];

function ruleText(b) {
  if (b.rate === 0) return "0%";
  const base = b.base ? `${pesoWhole.format(b.base)} + ` : "";
  return `${base}${Math.round(b.rate * 100)}% of the excess over ${pesoWhole.format(b.over)}`;
}

function computeTax(income) {
  const bracket = brackets.find((b) => income <= b.upTo);
  return { bracket, tax: bracket.base + (income - bracket.over) * bracket.rate };
}

function cell(text, label) {
  const td = document.createElement("td");
  td.dataset.label = label;
  td.textContent = text;
  return td;
}

// Reference table is built from the same data used for computing
const tbody = $("table-body");
brackets.forEach((b) => {
  const tr = document.createElement("tr");
  tr.append(
    cell(b.over === 0 ? "-" : pesoWhole.format(b.over), "Over"),
    cell(b.upTo === Infinity ? "-" : pesoWhole.format(b.upTo), "But not over"),
    cell(ruleText(b), "Basic tax + rate")
  );
  tbody.appendChild(tr);
});

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = $("income").value.trim();
  const income = Number(raw);

  if (raw === "" || !Number.isFinite(income) || income < 0) {
    $("error").textContent = "Enter a valid taxable income (0 or more).";
    return;
  }

  const { bracket, tax } = computeTax(income);
  $("error").textContent = "";
  $("bracket").textContent = bracket.upTo === Infinity
    ? `Over ${pesoWhole.format(bracket.over)}`
    : `${pesoWhole.format(bracket.over)} - ${pesoWhole.format(bracket.upTo)}`;
  $("rule").textContent = ruleText(bracket);
  $("tax").textContent = peso.format(tax);
  $("monthly").textContent = `Monthly: ${peso.format(tax / 12)}`;
});
