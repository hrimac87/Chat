const chatDiv = document.getElementById("chat");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const participantsDiv = document.getElementById("participants");

const channelID = "AL49hU5yNcaqEW70";
const drone = new ScaleDrone(channelID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});
let lastMessageSide = "other-message";
let room;
const participants = {};

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Connected to Scaledrone");
  room = drone.subscribe("observable-room", { historyCount: 10 });
  room.on("data", (text, member) => {
    if (member.clientId !== drone.clientId) {
      appendMessage(
        `${member.clientData.name}: ${text}`,
        member.clientData.color
      );
    }
  });

  room.on("members", (members) => {
    participantsDiv.innerHTML = "";
    for (const member of members) {
      participants[member.id] = member.clientData.name;
      updateParticipantsList();
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function getRandomName() {
  return "Korisnik" + Math.floor(Math.random() * 100);
}

function getRandomColor() {
  const colors = [
    "#FF5733",
    "#008080",
    "#3388FF",
    "#FF33FF",
    "#FF0000",
    "#8B0000",
    "#0000CD",
    "#000000",
    "#FF69B4",
    "#FF00FF",
    "#00FA9A",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    drone.publish({ room: "observable-room", message });
    messageInput.value = "";
  }
}

function appendMessage(message, color) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<div class="message" style="color: ${color}">${message}</div>`;
  chatDiv.appendChild(messageDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function updateParticipantsList() {
  participantsDiv.innerHTML =
    "Online: " + Object.values(participants).join(", ");
}

function appendMessage(message, color) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<div class="message ${lastMessageSide}" style="color: ${color}">${message}</div>`;
  chatDiv.appendChild(messageDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  lastMessageSide =
    lastMessageSide === "other-message" ? "own-message" : "other-message";
}
