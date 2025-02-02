package dungeon.warrior;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Game {

    private BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    private boolean astronautsAlive = false;
    private boolean monsterAlive = true;
    private int room = 1;
    private int playerHits = 0;    // Times player has been hit
    private int monsterHits = 0;   // Times monster has been hit
    private boolean hasSword = false;
    private boolean swordAvailable = true;  // Changed to true at start
    private boolean hasMace = false;
    private boolean maceAvailable = true;

    public static void main(String[] args) throws IOException {
        Game game = new Game();
        game.play();
    }

    private void play() throws IOException {
        boolean forever = true;
        String command;

        System.out.println();
        System.out.println("Uvod");
        System.out.println();
        System.out.println("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod " +
                "napao tvoj svemirski brod. Pokusao si da izadjes iz sobe za motore, ali tacno na izlazu si pao u nesvijest. ");
        System.out.println("Probudio si se. Svemirski brod je bio potpuno unisten.");

        while (forever) {
            if (room == 1) {
                room1();
            } else if (room == 2) {
                room2();
            } else if (room == 3) {
                room3();
            } else if (room == 4) {
                room4();
            }
        }
    }

    private void respawn() {
        System.out.println("Umro si...");
        System.out.println("Probudio si se ponovo na pocetku.");
        room = 1;
        playerHits = 0;    // Only reset hits, keep sword status
    }

    private void room1() throws IOException {
        System.out.println("Nalazis se u prostoriji za motore. Vrata su na zapadu.");

        if (astronautsAlive) {
            System.out.println("Tu se nalaze astronauti u zelenim odijelima. Imaju zelene kacige sa narandzastim staklom.");
        }

        String command = in.readLine();

        if (command.equals("zapad")) {
            room = 2;
        }
    }

    private void room2() throws IOException {
        System.out.println("Nalazis se u hodniku. Prostorija za motore je na istoku. Polu-unistena plava vrata su na jugu.");
        
        if (maceAvailable && !hasMace) {
            System.out.println("U uglu hodnika vidis teški buzdovan!");
        }

        String command = in.readLine();

        if (command.equals("jug")) {
            room = 3;
        } else if (command.equals("istok")) {
            room = 1;
        } else if (command.equals("uzmi buzdovan") && maceAvailable && !hasMace) {
            System.out.println("Uzeo si buzdovan! Ovo je mnogo jače oružje!");
            hasMace = true;
            maceAvailable = false;
        }
    }

    private void room3() throws IOException {
        System.out.println("Nalazis se u sobi koja je zapravo raskrsnica. Osjecas da se nesto trese u blizini. " +
                "Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.");
        
        if (swordAvailable && !hasSword) {
            System.out.println("Na podu vidis sjajan mac!");
        }

        String command = in.readLine();

        if (command.equals("zapad")) {
            System.out.println("Vrata ne mogu da se otvore.");
        } else if (command.equals("istok")) {
            room = 4;
        } else if (command.equals("sjever")) {
            room = 2;
        } else if (command.equals("uzmi mac") && swordAvailable && !hasSword) {
            System.out.println("Uzeo si mac! Sada si jaci!");
            hasSword = true;
            swordAvailable = false;
        }
    }

    private void room4() throws IOException {
        System.out.println("Nalazis se u biblioteci. Svijetla trepere. Cujes jako lupanje. Na zapadu je raskrsnica.");
        
        if (monsterAlive) {
            System.out.println("U cosku biblioteke stoji cudoviste. Ima velike kandze i oci koje svijetle u mraku.");
            System.out.println("Cudoviste je primilo " + monsterHits + " udaraca.");
            System.out.println("Ti si primio " + playerHits + " udaraca.");
        }

        String command = in.readLine();

        if (command.equals("zapad")) {
            room = 3;
        } else if (command.equals("napadni") && monsterAlive) {
            if (hasMace) {
                monsterHits += 5;  // Mace deals 5 damage
            } else {
                monsterHits += (hasSword ? 2 : 1); // Sword deals 2, fists deal 1
            }
            
            if (monsterHits >= 10) {
                System.out.println("Pobijedio si cudoviste!");
                monsterAlive = false;
            } else {
                System.out.println(hasMace ? 
                    "Udario si cudoviste buzdovanom! Ono uzvraća udarac!" :
                    hasSword ? 
                        "Udario si cudoviste macem! Ono uzvraća udarac!" :
                        "Udario si cudoviste! Ono uzvraća udarac!");
                playerHits++;
                if (playerHits >= 3) {
                    respawn();
                }
            }
        }
    }

}
