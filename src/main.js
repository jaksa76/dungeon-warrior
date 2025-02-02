import { Game } from "./game.js";

const game = new Game();
game.start();

const commandInput = document.getElementById("command");
commandInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = commandInput.value.trim();
    game.processCommand(command);
    commandInput.value = "";
  }
});
