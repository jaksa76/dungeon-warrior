// New base Room class encapsulating room properties and basic logic.
class Room {
  constructor(id, description, exits) {
    this.id = id;
    this.description = description;
    this.exits = exits; // e.g. { "zapad": "hallway" }
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

// New Enemy class representing game enemies.
class Enemy {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }
  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }
}

// New Player class representing the player.
class Player {
  constructor() {
    this.health = 3;
    this.hasSword = false;
    this.hasMace = false;
  }
  takeDamage(amount) {
    this.health -= amount;
  }
}

// Individual room classes with room-specific text and logic.
class EngineRoom extends Room {
  constructor() {
    super("engine", "Nalaziš se u prostoriji za motore. Vrata su na zapadu.", { "zapad": "hallway" });
  }
  render(game) {
    game.output(this.description);
  }
}

// Modified Hallway room with its own maceAvailable property.
class Hallway extends Room {
  constructor() {
    super("hallway", "Nalaziš se u hodniku. Prostorija za motore je na istoku. Polu-uništena plava vrata su na jugu.", { "jug": "crossroads", "istok": "engine" });
    this.maceAvailable = true; // moved here from Game
  }
  render(game) {
    game.output(this.description);
    if (this.maceAvailable && !game.player.hasMace) {
      game.output("U uglu hodnika vidiš teški buzdovan!");
    }
  }
  processCommand(command, game) {
    if (command === "uzmi buzdovan" && this.maceAvailable && !game.player.hasMace) {
      game.output("Uzeo si buzdovan! Ovo je mnogo jače oružje!");
      game.player.hasMace = true;
      this.maceAvailable = false;
    } else {
      super.processCommand(command, game);
    }
  }
}

// Modified Crossroads room with its own swordAvailable property.
class Crossroads extends Room {
  constructor() {
    super("crossroads", "Nalaziš se u sobi koja je zapravo raskrsnica. Osjećaš da se nešto trese u blizini. Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.", { "istok": "library", "sjever": "hallway" });
    this.swordAvailable = true; // moved here from Game
  }
  render(game) {
    game.output(this.description);
    if (this.swordAvailable && !game.player.hasSword) {
      game.output("Na podu vidiš sjajan mač!");
    }
  }
  processCommand(command, game) {
    if (command === "zapad") {
      game.output("Vrata ne mogu da se otvore.");
    } else if (command === "uzmi mac" && this.swordAvailable && !game.player.hasSword) {
      game.output("Uzeo si mač! Sada si jači!");
      game.player.hasSword = true;
      this.swordAvailable = false;
    } else {
      super.processCommand(command, game);
    }
  }
}

// New Combat class for encapsulating enemy fighting logic.
class Combat {
  static attackEnemy(library, game) {
    const damage = game.player.hasMace ? 5 : (game.player.hasSword ? 2 : 1);
    library.monster.takeDamage(damage);
    if (library.monster.health <= 0) {
      game.output("Pobijedio si čudovište!");
      game.output("Završio si Dungeon Warrior! Aj zdravo!");
      game.output(`Trenutni HP - Ti: ${game.player.health}, Čudovište: ${library.monster.health}`);
      game.gameOver = true;
    } else {
      game.output(
        game.player.hasMace ?
          "Udario si čudovište buzdovanom! Ono uzvraća udarac!" :
          game.player.hasSword ?
            "Udario si čudovište mačem! Ono uzvraća udarac!" :
            "Udario si čudovište! Ono uzvraća udarac!"
      );
      game.player.takeDamage(1);
      if (game.player.health <= 0) {
        game.output(`Trenutni HP - Ti: ${game.player.health}, Čudovište: ${library.monster.health}`);
        game.respawn();
        return;
      }
      game.output(`Trenutni HP - Ti: ${game.player.health}, Čudovište: ${library.monster.health}`);
    }
  }
}

// Modified Library room with its own monster property.
class Library extends Room {
  constructor() {
    super("library", "Nalaziš se u biblioteci. Svjetla trepere. Čuješ jako lupanje. Na zapadu je raskrsnica.", { "zapad": "crossroads" });
    this.monster = new Enemy("Čudovište", 10); // moved here from Game
  }
  render(game) {
    game.output(this.description);
    if (this.monster.health > 0) {
      game.output("U ćosku biblioteke stoji čudovište. Ima velike kandže i oči koje svijetle u mraku.");
      game.output("Čudovište ima " + this.monster.health + " HP.");
      game.output("Ti imaš " + game.player.health + " HP preostalo.");
    }
  }
  processCommand(command, game) {
    if (command === "napadni" && this.monster.health > 0) {
      Combat.attackEnemy(this, game);
    } else {
      super.processCommand(command, game);
    }
  }
}

// Updated Game class using room objects for state management.
export class Game {
  constructor(outputHandler) {
    this.outputHandler = outputHandler || ((msg) => console.log(msg));
    this.gameOver = false;
    this.player = new Player();
    // Room map with room objects.
    this.rooms = {
      "engine": new EngineRoom(),
      "hallway": new Hallway(),
      "crossroads": new Crossroads(),
      "library": new Library()
    };
    this.room = "engine";
  }
  
  output(msg) {
    this.outputHandler(msg);
  }
  

  displayIntro() {
    this.output("");
    this.output("Uvod");
    this.output("");
    this.output("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod napao tvoj brod. Pokušao si da izađeš, ali si pao u nesvijest.");
    this.output("Probudio si se. Svemirski brod je bio potpuno uništen.");
    this.output("Koristi naredbe za kretanje i borbu.");
    this.output("Naredbe: sjever, jug, istok, zapad, uzmi, napadni");
    this.output("Srećno!");
  }
  
  start() {
    this.displayIntro();
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
    this.room = "engine";
    this.player = new Player();
    // Reinitialize the Library room to reset its monster.
    this.rooms["library"] = new Library();
    this.render();
  }
}
