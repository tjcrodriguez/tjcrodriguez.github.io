const $ = (id) => document.getElementById(id);

const modes = {
  c2f:  { from: "°C", to: "°F", formula: "°C × 9/5 + 32",   fn: (v) => (v * 9) / 5 + 32 },
  f2c:  { from: "°F", to: "°C", formula: "(°F − 32) × 5/9", fn: (v) => ((v - 32) * 5) / 9 },
  m2ft: { from: "m",  to: "ft", formula: "m × 3.28084",     fn: (v) => v * 3.28084 },
  ft2m: { from: "ft", to: "m",  formula: "ft ÷ 3.28084",    fn: (v) => v / 3.28084 },
};

let mode = "c2f";
const buttons = document.querySelectorAll("[data-mode]");

function setMode(next) {
  mode = next;
  buttons.forEach((b) => {
    const on = b.dataset.mode === next;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  });
  $("label").textContent = `Value in ${modes[next].from}`;
  $("value").value = "";
  $("result").textContent = "-";
  $("formula").textContent = "";
  $("error").textContent = "";
}

buttons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = $("value").value.trim();
  const value = Number(raw);

  if (raw === "" || !Number.isFinite(value)) {
    $("error").textContent = "Enter a valid number.";
    $("result").textContent = "-";
    return;
  }

  const m = modes[mode];
  $("error").textContent = "";
  $("result").textContent = `${m.fn(value).toFixed(2)} ${m.to}`;
  $("formula").textContent = m.formula;
});
