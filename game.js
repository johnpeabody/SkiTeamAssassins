// Initial list of participants (mocked as if read from your CSV)
let participants = [
  { first: "Alice", last: "Smith" },
  { first: "Bob", last: "Jones" },
  { first: "Charlie", last: "Brown" },
  { first: "Dana", last: "White" },
  { first: "Eli", last: "Green" },
];

// Shuffle the participants and assign targets in a circular chain
function createKillChain() {
  for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }

  // Assign targets in a circular loop
  for (let i = 0; i < participants.length; i++) {
    participants[i].target = participants[(i + 1) % participants.length].first;
  }
}

// Render the current state
function updateUI() {
  const select = document.getElementById("kill-select");
  const chainDisplay = document.getElementById("kill-chain");
  const countDisplay = document.getElementById("remaining-count");

  // Clear dropdown
  select.innerHTML = "";
  participants.forEach(p => {
    const option = document.createElement("option");
    option.value = p.first;
    option.textContent = `${p.first} ${p.last}`;
    select.appendChild(option);
  });

  // Update remaining count
  countDisplay.textContent = participants.length;

  // Update kill chain text
  let chain = participants.map(p => p.first).join(" -> ");
  if (participants.length > 1) chain += " -> " + participants[0].first;
  chainDisplay.textContent = chain;
}

function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,First,Last,Target\n";

  participants.forEach(p => {
    const target = participants.find(t => t.first === p.target);
    const targetName = target ? target.first + " " + target.last : "";
    csvContent += `${p.first},${p.last},${targetName}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "kill_chain_state.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simulate a kill
function killParticipant() {
  const selectedName = document.getElementById("kill-select").value;
  const victimIndex = participants.findIndex(p => p.first === selectedName);

  if (victimIndex === -1) {
    alert("Participant not found.");
    return;
  }

  // Find the assassin (the person targeting the victim)
  const victim = participants[victimIndex];
  const assassinIndex = (victimIndex - 1 + participants.length) % participants.length;
  const assassin = participants[assassinIndex];

  // Assassin now targets the victim's target
  assassin.target = victim.target;

  // Remove the victim
  participants.splice(victimIndex, 1);

  // If only one remains, declare winner
  if (participants.length === 1) {
    alert(`${participants[0].first} is the winner!`);
  }

  updateUI();
}

document.getElementById("file-input").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    loadFromCSV(text);
  };
  reader.readAsText(file);
}

function loadFromCSV(csvText) {
  const rows = csvText.trim().split("\n").slice(1); // skip header
  const newParticipants = [];

  for (const row of rows) {
    const [first, last, targetName] = row.split(",");

    newParticipants.push({
      first: first.trim(),
      last: last.trim(),
      targetName: targetName.trim()
    });
  }

  // Link targets by first name
  newParticipants.forEach(p => {
    const target = newParticipants.find(t => `${t.first} ${t.last}` === p.targetName);
    p.target = target ? target.first : null;
    delete p.targetName; // clean up
  });

  participants = newParticipants;
  updateUI();
}


// Initialize game
createKillChain();
updateUI();
