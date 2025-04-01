let participants = [];

// 📥 Load CSV from file input
document.getElementById("file-input").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;

    if (text.includes("TargetEmail")) {
      loadFromSavedCSV(text); // Resuming a saved game
    } else {
      loadFromRawCSV(text); // Starting a new game
    }
  };
  reader.readAsText(file);
}

// 🆕 Load raw CSV and assign kill chain
function loadFromRawCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const header = rows[0].split(",");
  const firstIdx = header.indexOf("First Name");
  const lastIdx = header.indexOf("Last Name");
  const emailIdx = header.indexOf("Email");
  const phoneIdx = header.indexOf("Phone Number");

  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      first: cols[firstIdx].trim(),
      last: cols[lastIdx].trim(),
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

// 🔁 Load saved state with target assignments
function loadFromSavedCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const header = rows[0].split(",");
  const firstIdx = header.indexOf("First");
  const lastIdx = header.indexOf("Last");
  const emailIdx = header.indexOf("Email");
  const targetIdx = header.indexOf("TargetEmail");

  const tempParticipants = [];
  const emailMap = {};

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    const p = {
      first: cols[firstIdx].trim(),
      last: cols[lastIdx].trim(),
      email: cols[emailIdx].trim(),
      target: cols[targetIdx].trim()
    };
    tempParticipants.push(p);
    emailMap[p.email] = p;
  }

  participants = tempParticipants;
  updateUI();
}

// 🔪 Kill a participant by first name
function killParticipant() {
  const selectedName = document.getElementById("kill-select").value;
  const victimIndex = participants.findIndex(p => p.first === selectedName);

  if (victimIndex === -1) {
    alert("Participant not found.");
    return;
  }

  const victim = participants[victimIndex];
  const assassinIndex = (victimIndex - 1 + participants.length) % participants.length;
  const assassin = participants[assassinIndex];

  // Reassign target
  assassin.target = victim.target;

  // Remove victim
  participants.splice(victimIndex, 1);

  // Check for winner
  if (participants.length === 1) {
    alert(`${participants[0].first} is the winner!`);
  }

  updateUI();
}

// 💾 Download current state to CSV
function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,First,Last,Email,Phone,TargetEmail\n";

  participants.forEach(p => {
    csvContent += `${p.first},${p.last},${p.email},${p.phone},${p.target}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "kill_chain_state.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 🔁 Update UI elements
function updateUI() {
  const select = document.getElementById("kill-select");
  const chainDisplay = document.getElementById("kill-chain");
  const countDisplay = document.getElementById("remaining-count");

  select.innerHTML = "";
  participants.forEach(p => {
    const option = document.createElement("option");
    option.value = p.first; // still uses first name to identify
    option.textContent = `${p.first} ${p.last}`; // shows full name
    select.appendChild(option);
  });

  countDisplay.textContent = participants.length;

  // Show full names in kill chain
  let chainText = participants.map(p => `${p.first} ${p.last}`).join(" -> ");
  if (participants.length > 1) chainText += " -> " + `${participants[0].first} ${participants[0].last}`;
  chainDisplay.textContent = chainText;
}

