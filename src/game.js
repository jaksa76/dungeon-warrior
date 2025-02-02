// New base Room class encapsulating room properties and basic logic.
class Room {
  constructor(id, description, exits) {
    this.id = id;
    this.description = description;
    this.exits = exits; // e.g. { "zapad": 2 }
  }
  render(game) {
    game.output(this.description);
    // List available exits.
    const availableExits = Object.keys(this.exits).join(', ');
    game.output("Izlazi: " + availableExits);
  }
  processCommand(command, game) {
    if (this.exits[command]) {
      game.transitionTo(this.exits[command]);
    } else {
      game.output("Nevažeća komanda.");
    }
  }
}

// Individual room classes with room-specific text and logic.
class EngineRoom extends Room {
  constructor() {
    super(1, "Nalaziš se u prostoriji za motore. Vrata su na zapadu.", { "zapad": 2 });
  }
  render(game) {
    game.output("");
    game.output("Uvod");
    game.output("");
    game.output("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod napao tvoj brod. Pokušao si da izađeš, ali si pao u nesvijest.");
    game.output("Probudio si se. Svemirski brod je bio potpuno uništen.");
    game.output(this.description);
    if (game.astronautsAlive) {
      game.output("Tu se nalaze astronauti u zelenim odijelima. Imaju zelene kacige sa narandžastim staklom.");
    }
  }
}

class Hallway extends Room {
  constructor() {
    super(2, "Nalaziš se u hodniku. Prostorija za motore je na istoku. Polu-uništena plava vrata su na jugu.", { "jug": 3, "istok": 1 });
  }
  render(game) {
    game.output(this.description);
    if (game.maceAvailable && !game.hasMace) {
      game.output("U uglu hodnika vidiš teški buzdovan!");
    }
  }
  processCommand(command, game) {
    if (command === "uzmi buzdovan" && game.maceAvailable && !game.hasMace) {
      game.output("Uzeo si buzdovan! Ovo je mnogo jače oružje!");
      game.hasMace = true;
      game.maceAvailable = false;
    } else {
      super.processCommand(command, game);
    }
  }
}

class Crossroads extends Room {
  constructor() {
    super(3, "Nalaziš se u sobi koja je zapravo raskrsnica. Osjećaš da se nešto trese u blizini. Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.", { "istok": 4, "sjever": 2 });
  }
  render(game) {
    game.output(this.description);
    if (game.swordAvailable && !game.hasSword) {
      game.output("Na podu vidiš sjajan mač!");
    }
  }
  processCommand(command, game) {
    if (command === "zapad") {
      game.output("Vrata ne mogu da se otvore.");
    } else if (command === "uzmi mac" && game.swordAvailable && !game.hasSword) {
      game.output("Uzeo si mač! Sada si jači!");
      game.hasSword = true;
      game.swordAvailable = false;
    } else {
      super.processCommand(command, game);
    }
  }
}

class Library extends Room {
  constructor() {
    super(4, "Nalaziš se u biblioteci. Svjetla trepere. Čuješ jako lupanje. Na zapadu je raskrsnica.", { "zapad": 3 });
  }
  render(game) {
    game.output(this.description);
    if (game.monsterAlive) {
      game.output("U ćosku biblioteke stoji čudovište. Ima velike kandže i oči koje svijetle u mraku.");
      game.output("Čudovište je primilo " + game.monsterHits + " udaraca.");
      game.output("Ti si primio " + game.playerHits + " udaraca.");
    }
  }
  processCommand(command, game) {
    if (command === "napadni" && game.monsterAlive) {
      if (game.hasMace) {
        game.monsterHits += 5;
      } else {
        game.monsterHits += (game.hasSword ? 2 : 1);
      }
      if (game.monsterHits >= 10) {
        game.output("Pobijedio si čudovište!");
        game.output("Završio si Dungeon Warrior! Aj zdravo!");
        game.monsterAlive = false;
        game.gameOver = true;
      } else {
        game.output(game.hasMace ?
          "Udario si čudovište buzdovanom! Ono uzvraća udarac!" :
          game.hasSword ?
            "Udario si čudovište mačem! Ono uzvraća udarac!" :
            "Udario si čudovište! Ono uzvraća udarac!");
        game.playerHits++;
        if (game.playerHits >= 3) {
          game.respawn();
          return;
        }
      }
    } else {
      super.processCommand(command, game);
    }
  }
}

// Updated Game class using room objects for state management.
export class Game {
  constructor(outputHandler) {
    this.outputHandler = outputHandler || ((msg) => console.log(msg));
    this.astronautsAlive = false;
    this.monsterAlive = true;
    this.playerHits = 0;
    this.monsterHits = 0;
    this.hasSword = false;
    this.swordAvailable = true;
    this.hasMace = false;
    this.maceAvailable = true;
    this.gameOver = false;
    // Room map with room objects.
    this.rooms = {
      1: new EngineRoom(),
      2: new Hallway(),
      3: new Crossroads(),
      4: new Library()
    };
    this.room = 1;
  }
  
  output(msg) {
    this.outputHandler(msg);
  }
  
  start() {
    this.render();
  }
  
  render() {
    const currentRoom = this.rooms[this.room];
    currentRoom.render(this);
  }
  
  processCommand(command) {
    if (this.gameOver) return;
    const currentRoom = this.rooms[this.room];
    currentRoom.processCommand(command, this);
  }
  
  transitionTo(roomId) {
    this.room = roomId;
    this.render();
  }
  
  respawn() {
    this.output("Umro si...");
    this.output("Probudio si se ponovo na početku.");
    this.room = 1;
    this.playerHits = 0; // Reset only hits—weapon statuses remain.
    this.render();
  }
}
