let participants = [];

document.getElementById("file-input").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;

    const header = text.trim().split("\n")[0];
    if (header.includes("Target Email")) {
      loadFromSavedCSV(text); // resume from saved
    } else {
      loadFromRawCSV(text); // new game from sign-up
    }
  };
  reader.readAsText(file);
}

// Load initial sign-up CSV
function loadFromRawCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      timestamp: cols[0].trim(),
      first: cols[1].trim(),
      last: cols[2].trim(),
      email: cols[3].trim(),
      phone: cols[4].trim(),
      target: null
    });
  }

  // Shuffle and assign kill targets
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

// Load from saved game CSV
function loadFromSavedCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const newParticipants = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    newParticipants.push({
      timestamp: cols[0].trim(),
      first: cols[1].trim(),
      last: cols[2].trim(),
      email: cols[3].trim(),
      phone: cols[4].trim(),
      target: cols[5].trim()
    });
  }

  participants = newParticipants;
  updateUI();
}

// Kill a participant
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

// Download game state as CSV
function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Timestamp,First Name,Last Name,Email,Phone Number,Target Email\n";

  participants.forEach(p => {
    csvContent += `${p.timestamp},${p.first},${p.last},${p.email},${p.phone},${p.target || ""}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "updated_kill_chain.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// UI Rendering
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
  if (participants.length > 1) chainText += " -> " + `${participants[0].first} ${participants[0].last}`;
  chainDisplay.textContent = chainText;
}
