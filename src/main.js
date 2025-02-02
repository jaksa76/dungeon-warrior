import { Game } from "./game.js";

const container = document.getElementById("game");
const game = new Game((msg) => {
  container.innerHTML += `<p>${msg}</p>`;
});
game.start();

const commandInput = document.getElementById("command");
commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = commandInput.value.trim();
    // Add the command to the container using the CSS class for styling
    container.innerHTML += `<p class="command-message">${command}</p>`;
    game.processCommand(command);
    commandInput.value = "";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});
