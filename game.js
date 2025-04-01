let participants = [];

// 🕒 This matches the comment timestamp above
const lastUpdated = "2025-04-01 320 PM";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version-info").textContent = lastUpdated;
});

document.getElementById("file-input").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;

    const header = text.trim().split("\n")[0];
    if (header.includes("Target Email")) {
      loadFromSavedCSV(text);
    } else {
      loadFromRawCSV(text);
    }
  };
  reader.readAsText(file);
}

// Load initial sign-up CSV
function loadFromRawCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const headers = rows[0].split(",");
  const tsIdx = headers.indexOf("Timestamp");
  const fnIdx = headers.indexOf("First Name");
  const lnIdx = headers.indexOf("Last Name");
  const emailIdx = headers.indexOf("Email");
  const phoneIdx = headers.indexOf("Phone Number");

  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      timestamp: cols[tsIdx].trim(),
      first: cols[fnIdx].trim(),
      last: cols[lnIdx].trim(),
      email: cols[emailIdx].trim(),
      phone: cols[phoneIdx].trim(),
      target: null
    });
  }

  // Shuffle and assign targets
  for (let i = newParticipants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newParticipants[i], newParticipants[j]] = [newParticipants[j], newParticipants[i]];
  }
  for (let i = 0; i < newParticipants.length; i++) {
    newParticipants[i].target = newParticipants[(i + 1) % newParticipants.length].email;
  }

  participants = newParticipants;
  updateUI();
}

// Load saved CSV with target assignments
function loadFromSavedCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const headers = rows[0].split(",");
  const tsIdx = headers.indexOf("Timestamp");
  const fnIdx = headers.indexOf("First Name");
  const lnIdx = headers.indexOf("Last Name");
  const emailIdx = headers.indexOf("Email");
  const phoneIdx = headers.indexOf("Phone Number");
  const targetIdx = headers.indexOf("Target Email");

  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      timestamp: cols[tsIdx].trim(),
      first: cols[fnIdx].trim(),
      last: cols[lnIdx].trim(),
      email: cols[emailIdx].trim(),
      phone: cols[phoneIdx].trim(),
      target: cols[targetIdx].trim()
    });
  }

  participants = newParticipants;
  updateUI();
}

// Kill a participant by full name
function killParticipant() {
  const selectedName = document.getElementById("kill-select").value;
  const victimIndex = participants.findIndex(p => `${p.first} ${p.last}` === selectedName);

  if (victimIndex === -1) {
    alert("Participant not found.");
    return;
  }

  const victim = participants[victimIndex];
  const assassinIndex = (victimIndex - 1 + participants.length) % participants.length;
  const assassin = participants[assassinIndex];

  assassin.target = victim.target;
  participants.splice(victimIndex, 1);

  if (participants.length === 1) {
    alert(`${participants[0].first} ${participants[0].last} is the winner!`);
  }

  updateUI();
}

// Save the current game state to CSV
function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Timestamp,First Name,Last Name,Email,Phone Number,Target Email\n";

  participants.forEach(p => {
    csvContent += `${p.timestamp},${p.first},${p.last},${p.email},${p.phone},${p.target || ""}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "kill_chain_state.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Update UI
function updateUI() {
  const select = document.getElementById("kill-select");
  const chainDisplay = document.getElementById("kill-chain");
  const countDisplay = document.getElementById("remaining-count");

  select.innerHTML = "";
  participants.forEach(p => {
    const option = document.createElement("option");
    option.value = `${p.first} ${p.last}`;
    option.textContent = `${p.first} ${p.last}`;
    select.appendChild(option);
  });

  countDisplay.textContent = participants.length;

  let chainText = participants.map(p => `${p.first} ${p.last}`).join(" -> ");
  if (participants.length > 1) {
    chainText += " -> " + `${participants[0].first} ${participants[0].last}`;
  }
  chainDisplay.textContent = chainText;
}
