// Student Score Book
// The data is stored in two parallel arrays:
// names[i] and scores[i] always belong to the same student.

const STORE_KEY = "score-book-v1";
const SAMPLE_NAMES = ["Ama", "Kwame", "Esi", "Kofi", "Abena"];
const SAMPLE_SCORES = [78, 45, 92, 60, 55];

let names = SAMPLE_NAMES.slice();
let scores = SAMPLE_SCORES.slice();
let passMark = 50;

// ---------- Saving (keeps the data after a page refresh) ----------
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ names, scores, passMark }));
  } catch (e) { /* storage not available, app still works */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    const valid = Array.isArray(d.names) && Array.isArray(d.scores) &&
      d.names.length === d.scores.length &&
      d.scores.every(n => Number.isInteger(n) && n >= 0 && n <= 100);
    if (!valid) return;
    names = d.names.map(String);
    scores = d.scores.slice();
    if (Number.isInteger(d.passMark) && d.passMark >= 0 && d.passMark <= 100) passMark = d.passMark;
  } catch (e) { /* ignore bad saved data */ }
}

// ---------- Array operations ----------
function addStudent(name, score) {
  names.push(name);
  scores.push(score);
}

function removeStudent(index) {
  names.splice(index, 1);
  scores.splice(index, 1);
}

// Bubble sort (high to low). Both arrays are swapped together.
function sortHighToLow() {
  for (let pass = 0; pass < scores.length - 1; pass++) {
    for (let j = 0; j < scores.length - 1 - pass; j++) {
      if (scores[j] < scores[j + 1]) {
        [scores[j], scores[j + 1]] = [scores[j + 1], scores[j]];
        [names[j], names[j + 1]] = [names[j + 1], names[j]];
      }
    }
  }
}

// Linear search: check each name in turn.
function findStudents(query) {
  const found = [];
  const q = query.trim().toLowerCase();
  if (q === "") return found;
  for (let i = 0; i < names.length; i++) {
    if (names[i].toLowerCase().includes(q)) found.push(i);
  }
  return found;
}

// One loop visits every score and builds all the results.
function computeStats() {
  let total = 0, passed = 0, highestIndex = 0, lowestIndex = 0;
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
    if (scores[i] > scores[highestIndex]) highestIndex = i;
    if (scores[i] < scores[lowestIndex]) lowestIndex = i;
    if (scores[i] >= passMark) passed++;
  }
  return {
    count: scores.length,
    average: scores.length ? total / scores.length : 0,
    highestIndex,
    lowestIndex,
    passed,
    failed: scores.length - passed
  };
}

// ---------- Display ----------
const $ = id => document.getElementById(id);

function cell(tag, text, className) {
  const c = document.createElement(tag);
  c.textContent = text;
  if (className) c.className = className;
  return c;
}

function renderTable() {
  const body = $("student-rows");
  body.textContent = "";

  if (names.length === 0) {
    const tr = document.createElement("tr");
    const td = cell("td", "No students yet. Add a student above.", "empty");
    td.colSpan = 5;
    tr.appendChild(td);
    body.appendChild(tr);
    return [];
  }

  const matches = findStudents($("search-input").value);

  for (let i = 0; i < names.length; i++) {
    const tr = document.createElement("tr");
    if (matches.includes(i)) tr.className = "match";

    tr.appendChild(cell("td", String(i + 1)));
    tr.appendChild(cell("td", names[i]));
    tr.appendChild(cell("td", String(scores[i]), "num"));

    const passed = scores[i] >= passMark;
    tr.appendChild(cell("td", passed ? "Pass" : "Fail", passed ? "pass" : "fail"));

    const actionCell = document.createElement("td");
    const btn = cell("button", "Remove", "btn-remove");
    btn.type = "button";
    btn.setAttribute("aria-label", "Remove " + names[i]);
    btn.addEventListener("click", () => {
      const removedName = names[i];
      removeStudent(i);
      update("Removed " + removedName + ".");
    });
    actionCell.appendChild(btn);
    tr.appendChild(actionCell);

    body.appendChild(tr);
  }
  return matches;
}

function renderSummary() {
  const body = $("summary-rows");
  body.textContent = "";
  const addRow = (label, value) => {
    const tr = document.createElement("tr");
    tr.appendChild(cell("th", label));
    tr.lastChild.scope = "row";
    tr.appendChild(cell("td", value));
    body.appendChild(tr);
  };

  if (scores.length === 0) {
    addRow("Number of students", "0");
    addRow("Average score", "-");
    addRow("Highest score", "-");
    addRow("Lowest score", "-");
    addRow("Passed", "-");
    addRow("Failed", "-");
    return;
  }

  const s = computeStats();
  addRow("Number of students", String(s.count));
  addRow("Average score", s.average.toFixed(1));
  addRow("Highest score", scores[s.highestIndex] + " (" + names[s.highestIndex] + ")");
  addRow("Lowest score", scores[s.lowestIndex] + " (" + names[s.lowestIndex] + ")");
  addRow("Passed", String(s.passed));
  addRow("Failed", String(s.failed));
}

function update(message) {
  save();
  const matches = renderTable();
  renderSummary();

  const q = $("search-input").value.trim();
  if (message !== undefined) {
    $("message").textContent = message;
  } else if (q !== "") {
    $("message").textContent = matches.length
      ? matches.length + (matches.length === 1 ? " student found." : " students found.")
      : "No student found.";
  }
}

// ---------- Events ----------
$("add-form").addEventListener("submit", e => {
  e.preventDefault();
  const nameInput = $("name-input");
  const scoreInput = $("score-input");
  const name = nameInput.value.trim();
  const raw = scoreInput.value.trim();
  const score = Number(raw);

  if (name === "") {
    $("message").textContent = "Please enter the student's name.";
    nameInput.focus();
    return;
  }
  if (raw === "" || !Number.isInteger(score) || score < 0 || score > 100) {
    $("message").textContent = "Please enter a whole number score from 0 to 100.";
    scoreInput.focus();
    return;
  }

  addStudent(name, score);
  nameInput.value = "";
  scoreInput.value = "";
  update("Added " + name + ".");
  nameInput.focus();
});

$("sort-btn").addEventListener("click", () => {
  if (names.length < 2) {
    $("message").textContent = "Add at least two students to sort.";
    return;
  }
  sortHighToLow();
  update("Sorted from highest to lowest score.");
});

$("sample-btn").addEventListener("click", () => {
  names = SAMPLE_NAMES.slice();
  scores = SAMPLE_SCORES.slice();
  passMark = 50;
  $("pass-input").value = "50";
  update("Sample data restored.");
});

$("clear-btn").addEventListener("click", () => {
  names = [];
  scores = [];
  update("All students cleared.");
});

$("search-input").addEventListener("input", () => {
  if ($("search-input").value.trim() === "") $("message").textContent = "";
  update();
});

$("pass-input").addEventListener("change", e => {
  let value = Math.round(Number(e.target.value));
  if (!Number.isFinite(value)) value = 50;
  value = Math.min(100, Math.max(0, value));
  passMark = value;
  e.target.value = String(value);
  update("Pass mark set to " + value + ".");
});

// ---------- Start ----------
load();
$("pass-input").value = String(passMark);
update();
