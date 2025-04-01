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
      loadFromSavedCSV(text); // resume game
    } else {
      loadFromRawCSV(text); // start new game
    }
  };
  reader.readAsText(file);
}

// 🆕 Load raw CSV and assign kill chain
function loadFromRawCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      first: cols[1].trim(),         // First Name
      last: cols[2].trim(),          // Last Name
      email: cols[3].trim(),         // Email
      phone: cols[4].trim(),         // Phone Number
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

// 🔁 Load saved state with assigned targets
function loadFromSavedCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const tempParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    const p = {
      first: cols[0].trim(),          // First
      last: cols[1].trim(),           // Last
      email: cols[2].trim(),          // Email
      phone: cols[3].trim(),          // Phone
      target: cols[4].trim()          // TargetEmail
    };
    tempParticipants.push(p);
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

  assassin.target = victim.target;

  participants.splice(victimIndex, 1);

  if (participants.length === 1) {
    alert(`${participants[0].first} is the winner!`);
  }

  updateUI();
}

// 💾 Save current state as downloadable CSV
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

// 🔁 UI Updates
function updateUI() {
  const select = document.getElementById("kill-select");
  const chainDisplay = document.getElementById("kill-chain");
  const countDisplay = document.getElementById("remaining-count");

  select.innerHTML = "";
  participants.forEach(p => {
    const option = document.createElement("option");
    option.value = p.first;
    option.textContent = `${p.first} ${p.last}`;
    select.appendChild(option);
  });

  countDisplay.textContent = participants.length;

  let chainText = participants.map(p => `${p.first} ${p.last}`).join(" -> ");
  if (participants.length > 1) chainText += " -> " + `${participants[0].first} ${participants[0].last}`;
  chainDisplay.textContent = chainText;
}
