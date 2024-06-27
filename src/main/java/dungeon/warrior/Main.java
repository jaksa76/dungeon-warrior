package dungeon.warrior;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        boolean astronautsAlive;
        boolean forever;
        int room = 1;
        String command;

        forever = true;
        astronautsAlive = false;

        System.out.println();
        System.out.println("Uvod");
        System.out.println();
        System.out.println("Bio si u svemirskom brodu i provjeravao si motore, kad odjednom je drugi svemirski brod " +
                "napao tvoj svemirski brod. Pokusao si da izadjes iz sobe za motore, ali tacno na izlazu si pao u nesvijest. ");
        System.out.println("Probudio si se. Svemirski brod je bio potpuno unisten.");

        while (forever) {
            if (room == 1) {
                System.out.println("Nalazis se u prostoriji za motore. Vrata su na zapadu.");

                if (astronautsAlive) {
                    System.out.println("Tu se nalaze astronauti u zelenim odijelima. Imaju zelene kacige sa narandzastim staklom.");
                }

                command = in.readLine();

                if (command.equals("zapad")) {
                    room = 2;
                }
            } else if (room == 2) {
                System.out.println("Nalazis se u hodniku. Prostorija za motore je na istoku. Polu-unistena plava vrata su na jugu.");

                command = in.readLine();

                if (command.equals("jug")) {
                    room = 3;
                } else if (command.equals("istok")) {
                    room = 1;
                }
            } else if (room == 3) {
                System.out.println("Nalazis se u sobi koja je zapravo raskrsnica. Osjecas da se nesto trese zau blizini. Na zapadu su vrata prekrivena krvlju. Na istoku je velika biblioteka. Na sjeveru je hodnik.");

                command = in.readLine();

                if (command.equals("zapad")) {
                    System.out.println("Vrata ne mogu da se otvore.");
                } else if (command.equals("istok")) {
                    room = 4;
                } else if (command.equals("sjever")) {
                    room = 2;
                }
            } else if (room == 4) {
                System.out.println("Nalazis se u biblioteci. Svijetla trepere. Cujes jako lupanje. Na zapadu je raskrsnica.");

                command = in.readLine();

                if (command.equals("zapad")) {
                    room = 3;
                }
            }
        }
    }
}
