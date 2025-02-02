const readlineSync = require('readline-sync');

class Game {
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
	}
	
	play() {
		console.log();
		console.log("Uvod");
		console.log();
		console.log("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod " +
					"napao tvoj svemirski brod. Pokusao si da izadjes iz sobe za motore, ali tacno na izlazu si pao u nesvijest. ");
		console.log("Probudio si se. Svemirski brod je bio potpuno unisten.");
		
		while (true) {
			if (this.room === 1) {
				this.room1();
			} else if (this.room === 2) {
				this.room2();
			} else if (this.room === 3) {
				this.room3();
			} else if (this.room === 4) {
				this.room4();
			}
		}
	}
	
	respawn() {
		console.log("Umro si...");
		console.log("Probudio si se ponovo na pocetku.");
		this.room = 1;
		this.playerHits = 0; // Only reset hits, keep sword status
	}
	
	room1() {
		console.log("Nalazis se u prostoriji za motore. Vrata su na zapadu.");
		if (this.astronautsAlive) {
			console.log("Tu se nalaze astronauti u zelenim odijelima. Imaju zelene kacige sa narandzastim staklom.");
		}
		
		let command = readlineSync.question('');
		
		if (command === "zapad") {
			this.room = 2;
		}
	}
	
	room2() {
		console.log("Nalazis se u hodniku. Prostorija za motore je na istoku. Polu-unistena plava vrata su na jugu.");
		if (this.maceAvailable && !this.hasMace) {
			console.log("U uglu hodnika vidis teški buzdovan!");
		}
		
		let command = readlineSync.question('');
		
		if (command === "jug") {
			this.room = 3;
		} else if (command === "istok") {
			this.room = 1;
		} else if (command === "uzmi buzdovan" && this.maceAvailable && !this.hasMace) {
			console.log("Uzeo si buzdovan! Ovo je mnogo jače oružje!");
			this.hasMace = true;
			this.maceAvailable = false;
		}
	}
	
	room3() {
		console.log("Nalazis se u sobi koja je zapravo raskrsnica. Osjecas da se nesto trese u blizini. " +
					"Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.");
		if (this.swordAvailable && !this.hasSword) {
			console.log("Na podu vidis sjajan mac!");
		}
		
		let command = readlineSync.question('');
		
		if (command === "zapad") {
			console.log("Vrata ne mogu da se otvore.");
		} else if (command === "istok") {
			this.room = 4;
		} else if (command === "sjever") {
			this.room = 2;
		} else if (command === "uzmi mac" && this.swordAvailable && !this.hasSword) {
			console.log("Uzeo si mac! Sada si jaci!");
			this.hasSword = true;
			this.swordAvailable = false;
		}
	}
	
	room4() {
		console.log("Nalazis se u biblioteci. Svijetla trepere. Cujes jako lupanje. Na zapadu je raskrsnica.");
		if (this.monsterAlive) {
			console.log("U cosku biblioteke stoji cudoviste. Ima velike kandze i oci koje svijetle u mraku.");
			console.log("Cudoviste je primilo " + this.monsterHits + " udaraca.");
			console.log("Ti si primio " + this.playerHits + " udaraca.");
		}
		
		let command = readlineSync.question('');
		
		if (command === "zapad") {
			this.room = 3;
		} else if (command === "napadni" && this.monsterAlive) {
			if (this.hasMace) {
				this.monsterHits += 5;
			} else {
				this.monsterHits += (this.hasSword ? 2 : 1);
			}
			
			if (this.monsterHits >= 10) {
				console.log("Pobijedio si cudoviste!");
				console.log("Zavrsio si Dungeon Warrior! Aj zdravo!");
				process.exit(0);
				this.monsterAlive = false;
			} else {
				console.log(this.hasMace ? 
					"Udario si cudoviste buzdovanom! Ono uzvraća udarac!" :
					this.hasSword ? 
						"Udario si cudoviste macem! Ono uzvraća udarac!" :
						"Udario si cudoviste! Ono uzvraća udarac!");
				this.playerHits++;
				if (this.playerHits >= 3) {
					this.respawn();
				}
			}
		}
	}
}

const game = new Game();
game.play();
