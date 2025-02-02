export class Game {
  constructor() {
    this.astronautsAlive = false;
    this.monsterAlive = true;
    this.room = 1;
    this.playerHits = 0;
    this.monsterHits = 0;
    this.hasSword = false;
    this.swordAvailable = true;
    this.hasMace = false;
    this.maceAvailable = true;
    this.gameOver = false;
  }
  
  output(msg) {
    const container = document.getElementById("game");
    container.innerHTML += `<p>${msg}</p>`;
  }
  
  start() {
    this.output("");
    this.output("Uvod");
    this.output("");
    this.output("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod napao tvoj svemirski brod. Pokušao si da izađeš iz sobe za motore, ali tačno na izlazu si pao u nesvijest.");
    this.output("Probudio si se. Svemirski brod je bio potpuno uništen.");
    this.render();
  }
  
  render() {
    if (this.room === 1) {
      this.output("Nalaziš se u prostoriji za motore. Vrata su na zapadu.");
      if (this.astronautsAlive) {
        this.output("Tu se nalaze astronauti u zelenim odijelima. Imaju zelene kacige sa narandžastim staklom.");
      }
    } else if (this.room === 2) {
      this.output("Nalaziš se u hodniku. Prostorija za motore je na istoku. Polu-uništena plava vrata su na jugu.");
      if (this.maceAvailable && !this.hasMace) {
        this.output("U uglu hodnika vidiš teški buzdovan!");
      }
    } else if (this.room === 3) {
      this.output("Nalaziš se u sobi koja je zapravo raskrsnica. Osjećaš da se nešto trese u blizini. Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.");
      if (this.swordAvailable && !this.hasSword) {
        this.output("Na podu vidiš sjajan mač!");
      }
    } else if (this.room === 4) {
      this.output("Nalaziš se u biblioteci. Svjetla trepere. Čuješ jako lupanje. Na zapadu je raskrsnica.");
      if (this.monsterAlive) {
        this.output("U ćosku biblioteke stoji čudovište. Ima velike kandže i oči koje svijetle u mraku.");
        this.output("Čudovište je primilo " + this.monsterHits + " udaraca.");
        this.output("Ti si primio " + this.playerHits + " udaraca.");
      }
    }
  }
  
  processCommand(command) {
    if (this.gameOver) return;
    if (this.room === 1) {
      if (command === "zapad") {
        this.room = 2;
        this.render();
      } else {
        this.output("Nevažeća komanda.");
      }
    } else if (this.room === 2) {
      if (command === "jug") {
        this.room = 3;
        this.render();
      } else if (command === "istok") {
        this.room = 1;
        this.render();
      } else if (command === "uzmi buzdovan" && this.maceAvailable && !this.hasMace) {
        this.output("Uzeo si buzdovan! Ovo je mnogo jače oružje!");
        this.hasMace = true;
        this.maceAvailable = false;
      } else {
        this.output("Nevažeća komanda.");
      }
    } else if (this.room === 3) {
      if (command === "zapad") {
        this.output("Vrata ne mogu da se otvore.");
      } else if (command === "istok") {
        this.room = 4;
        this.render();
      } else if (command === "sjever") {
        this.room = 2;
        this.render();
      } else if (command === "uzmi mac" && this.swordAvailable && !this.hasSword) {
        this.output("Uzeo si mač! Sada si jači!");
        this.hasSword = true;
        this.swordAvailable = false;
      } else {
        this.output("Nevažeća komanda.");
      }
    } else if (this.room === 4) {
      if (command === "zapad") {
        this.room = 3;
        this.render();
      } else if (command === "napadni" && this.monsterAlive) {
        if (this.hasMace) {
          this.monsterHits += 5;
        } else {
          this.monsterHits += (this.hasSword ? 2 : 1);
        }
        if (this.monsterHits >= 10) {
          this.output("Pobijedio si čudovište!");
          this.output("Završio si Dungeon Warrior! Aj zdravo!");
          this.monsterAlive = false;
          this.gameOver = true;
        } else {
          this.output(this.hasMace ?
            "Udario si čudovište buzdovanom! Ono uzvraća udarac!" :
            this.hasSword ?
              "Udario si čudovište mačem! Ono uzvraća udarac!" :
              "Udario si čudovište! Ono uzvraća udarac!");
          this.playerHits++;
          if (this.playerHits >= 3) {
            this.respawn();
          }
        }
      } else {
        this.output("Nevažeća komanda.");
      }
    }
  }
  
  respawn() {
    this.output("Umro si...");
    this.output("Probudio si se ponovo na početku.");
    this.room = 1;
    this.playerHits = 0; // Only reset hits, keep weapon status
    this.render();
  }
}
