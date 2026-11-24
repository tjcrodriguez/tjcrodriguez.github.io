const $ = (id) => document.getElementById(id);
const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
const STORAGE_KEY = "payroll.list";

let employees = load();

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)); } catch { /* storage unavailable */ }
}

function cell(text, label, numeric) {
  const td = document.createElement("td");
  td.dataset.label = label;
  if (numeric) td.className = "num";
  td.textContent = text;
  return td;
}

function render() {
  const tbody = $("payroll-body");
  tbody.replaceChildren();

  if (employees.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "empty";
    td.textContent = "No employees yet. Add one to start the list.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  employees.forEach((emp, i) => {
    const gross = emp.days * emp.rate;   // Gross Pay = Days Worked * Daily Rate
    const net = gross - emp.deduction;   // Net Pay = Gross Pay - Deduction Amount
    const tr = document.createElement("tr");
    tr.append(
      cell(i + 1, "No."),
      cell(emp.name, "Employee Name"),
      cell(emp.days, "Days Worked", true),
      cell(peso.format(emp.rate), "Daily Rate", true),
      cell(peso.format(gross), "Gross Pay", true),
      cell(peso.format(emp.deduction), "Deduction Amount", true),
      cell(peso.format(net), "Net Pay", true)
    );
    tbody.appendChild(tr);
  });
}

$("add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const days = Number($("days").value);
  const rate = Number($("rate").value);
  const deduction = Number($("deduction").value);
  const filled = ["days", "rate", "deduction"].every((id) => $(id).value.trim() !== "");

  if (!name || !filled || [days, rate, deduction].some((n) => !Number.isFinite(n) || n < 0)) {
    $("add-error").textContent = "Fill every field with valid values (numbers 0 or more).";
    return;
  }
  if (deduction > days * rate) {
    $("add-error").textContent = "Deduction cannot be more than gross pay.";
    return;
  }

  employees.push({ name, days, rate, deduction });
  save();
  render();
  $("add-error").textContent = "";
  e.target.reset();
  $("name").focus();
});

$("delete-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = $("line").value.trim();
  const line = Number(raw);

  if (raw === "" || !Number.isInteger(line) || line < 1 || line > employees.length) {
    $("delete-error").textContent = employees.length
      ? `Enter a line number from 1 to ${employees.length}.`
      : "The list is empty.";
    return;
  }

  employees.splice(line - 1, 1); // remaining rows renumber on render
  save();
  render();
  $("delete-error").textContent = "";
  e.target.reset();
});

render();
