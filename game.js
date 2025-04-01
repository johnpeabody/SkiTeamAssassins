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

// Initialize game
createKillChain();
updateUI();
