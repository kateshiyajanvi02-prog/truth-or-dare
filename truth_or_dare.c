#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#define MAX_NAME 50
#define MAX_PLAYERS 10
#define MIN_PLAYERS 2
#define DEFAULT_PLAYERS 2
#define DEFAULT_ROUNDS 5
#define MAX_ROUNDS 20
#define MAX_CUSTOM_QUESTIONS 100
#define MAX_QUESTION_LEN 300

typedef struct {
    char name[MAX_NAME];
    int score;
} Player;

/* Built-in static truths (preserved by default) */
const char *truths[] = {
    // STUDENT LIFE 🎓
    "Have you ever attended class without completing your homework?",
    "What is your funniest college memory?",
    "Have you ever studied only the night before an exam?",
    "Which subject do you find the most difficult?",
    "Have you ever pretended to understand something in class?",
    "What is your dream job after graduation?",
    "Have you ever forgotten about an assignment deadline?",
    "Who is the funniest person in your class?",
    "What is your biggest fear about exams?",
    "If you could change one thing about college, what would it be?",

    // COURSE & CAREER 💻
    "Why did you choose your current course?",
    "Which programming language do you like the most?",
    "What is your dream company to work for?",
    "Would you prefer a high salary or a job you love?",
    "What new technical skill do you want to learn?",
    "Where do you see yourself five years from now?",
    "Which is harder for you: coding, theory, or practicals?",
    "Would you like to work abroad someday?",
    "What is your biggest career goal?",
    "If you could create any app, what would it do?",

    // FRIENDSHIP 👫
    "Who was your first best friend?",
    "What makes someone a true friend?",
    "Have you ever laughed at a completely wrong moment?",
    "What is your favourite memory with your friends?",
    "What is one thing you appreciate about your best friend?",
    "Would you forgive a friend who broke your trust?",

    // FUNNY & PERSONAL 😂
    "What is the most embarrassing thing you have done?",
    "What is your weirdest habit?",
    "What is the funniest nickname someone has given you?",
    "What is one thing you are secretly proud of?",
    "If you could become invisible for a day, what would you do?",
    "What is the silliest thing you are afraid of?",
    "If you won a million rupees, what would you buy first?",
    "What is one thing people often misunderstand about you?",
    "What is your favourite song that you never get tired of?",
    "If your life were a movie, what would its title be?"
};

/* Built-in static dares (preserved by default) */
const char *dares[] = {
    // FUNNY DARES 😂
    "Dance for 15 seconds without music.",
    "Make your funniest face for 10 seconds.",
    "Act like a robot for 20 seconds.",
    "Speak like a news reporter for 30 seconds.",
    "Tell a joke and try to make everyone laugh.",
    "Pretend to be a teacher taking attendance.",
    "Sing one line of your favourite song.",
    "Walk like a model for 15 seconds.",

    // STUDENT & COLLEGE DARES 🎓
    "Act like your favourite teacher for 20 seconds.",
    "Explain your course in 15 seconds.",
    "Pretend you are giving a speech on your first day of college.",
    "Name five subjects or topics in 10 seconds.",
    "Give a motivational speech before an exam.",
    "Spell your college name backwards if you can.",

    // COURSE & TECH DARES 💻
    "Explain what a computer is in 15 seconds.",
    "Name five programming languages in 10 seconds.",
    "Explain your favourite app in three sentences.",
    "Pretend you are interviewing for your dream job.",
    "Describe your dream project in 30 seconds.",

    // FRIENDSHIP DARES 👫
    "Give the other player three genuine compliments.",
    "Invent a funny superhero name for your friend.",
    "Say three things that make a good friendship.",
    "Make up a short rap about college life.",
    "Tell the other player a funny, harmless joke.",

    // CREATIVE DARES ✨
    "Act like a famous actor for 15 seconds.",
    "Tell a short story using the words love, college, and computer.",
    "Speak in a funny accent for 20 seconds.",
    "Hum a song and let the other player guess it.",
    "Describe your dream holiday in 20 seconds.",
    "Try saying a tongue twister three times."
};

/* Dynamic question storage */
char custom_truths[MAX_CUSTOM_QUESTIONS][MAX_QUESTION_LEN];
int custom_truth_count = 0;

char custom_dares[MAX_CUSTOM_QUESTIONS][MAX_QUESTION_LEN];
int custom_dare_count = 0;

const char *getRandomTruth(void) {
    int static_count = (int)(sizeof(truths) / sizeof(truths[0]));
    int total = static_count + custom_truth_count;
    int idx = rand() % total;

    if (idx < static_count) {
        return truths[idx];
    } else {
        return custom_truths[idx - static_count];
    }
}

const char *getRandomDare(void) {
    int static_count = (int)(sizeof(dares) / sizeof(dares[0]));
    int total = static_count + custom_dare_count;
    int idx = rand() % total;

    if (idx < static_count) {
        return dares[idx];
    } else {
        return custom_dares[idx - static_count];
    }
}

void readLine(char text[], int size) {
    if (fgets(text, size, stdin) != NULL) {
        size_t len = strlen(text);

        if (len > 0 && text[len - 1] == '\n') {
            text[len - 1] = '\0';
        } else {
            int ch;
            while ((ch = getchar()) != '\n' && ch != EOF) {
                /* Clear extra input. */
            }
        }
    } else {
        text[0] = '\0';
    }
}

int getIntInput(int min_val, int max_val, int default_val) {
    char buf[64];
    while (1) {
        readLine(buf, sizeof(buf));
        if (buf[0] == '\0') {
            return default_val;
        }

        char *endptr;
        long val = strtol(buf, &endptr, 10);
        while (isspace((unsigned char)*endptr)) {
            endptr++;
        }

        if (endptr != buf && *endptr == '\0' && val >= min_val && val <= max_val) {
            return (int)val;
        }

        printf("Invalid input. Please enter a number between %d and %d [Default: %d]: ",
               min_val, max_val, default_val);
    }
}

int main(void) {
    Player players[MAX_PLAYERS] = {0};
    int num_players, rounds, round, i, choice;
    char response[MAX_QUESTION_LEN];

    srand((unsigned int)time(NULL));

    printf("====================================\n");
    printf("      TRUTH OR DARE CHALLENGE       \n");
    printf("        MULTIPLAYER EDITION         \n");
    printf("====================================\n\n");

    /* 1. Multiple Players Setup */
    printf("Enter number of players (2-%d) [Default: %d]: ", MAX_PLAYERS, DEFAULT_PLAYERS);
    num_players = getIntInput(MIN_PLAYERS, MAX_PLAYERS, DEFAULT_PLAYERS);

    printf("\n--- Player Names ---\n");
    for (i = 0; i < num_players; i++) {
        printf("Enter Player %d name: ", i + 1);
        readLine(players[i].name, MAX_NAME);

        if (players[i].name[0] == '\0') {
            sprintf(players[i].name, "Player %d", i + 1);
        }
    }

    /* 2. Rounds Setup */
    printf("\nEnter number of rounds (1-%d) [Default: %d]: ", MAX_ROUNDS, DEFAULT_ROUNDS);
    rounds = getIntInput(1, MAX_ROUNDS, DEFAULT_ROUNDS);

    /* 3. Question Mode Setup */
    printf("\n--- Question Mode ---\n");
    printf("1. Dynamic Mode (Players can enter custom questions each turn, or press Enter for default static) [Default]\n");
    printf("2. Auto Static Mode (Always automatically picks from the fixed default questions)\n");
    printf("Choose mode (1 or 2) [Default: 1]: ");
    int mode = getIntInput(1, 2, 1);

    /* 4. Optional Pre-game Custom Question Pool Addition */
    printf("\nDo you want to add custom questions to the default pool before starting? (Y/N) [Default: N]: ");
    readLine(response, sizeof(response));
    if (tolower((unsigned char)response[0]) == 'y') {
        printf("\nHow many custom Truth questions to add? (0-20) [Default: 0]: ");
        int add_t = getIntInput(0, 20, 0);
        for (i = 0; i < add_t; i++) {
            printf("Enter Custom Truth #%d: ", i + 1);
            readLine(custom_truths[custom_truth_count], MAX_QUESTION_LEN);
            if (custom_truths[custom_truth_count][0] != '\0') {
                custom_truth_count++;
            }
        }

        printf("\nHow many custom Dare challenges to add? (0-20) [Default: 0]: ");
        int add_d = getIntInput(0, 20, 0);
        for (i = 0; i < add_d; i++) {
            printf("Enter Custom Dare #%d: ", i + 1);
            readLine(custom_dares[custom_dare_count], MAX_QUESTION_LEN);
            if (custom_dares[custom_dare_count][0] != '\0') {
                custom_dare_count++;
            }
        }

        if (custom_truth_count > 0 || custom_dare_count > 0) {
            printf("\nSuccessfully added %d custom truth(s) and %d custom dare(s) to the pool!\n",
                   custom_truth_count, custom_dare_count);
        }
    }

    printf("\n====================================\n");
    printf("         GAME STARTING NOW!         \n");
    printf("====================================\n");

    /* Main Game Loop */
    for (round = 1; round <= rounds; round++) {
        printf("\n====================================\n");
        printf("              ROUND %d              \n", round);
        printf("====================================\n");

        for (i = 0; i < num_players; i++) {
            printf("\n------------------------------------\n");
            printf(">> %s's turn! (Current Score: %d)\n", players[i].name, players[i].score);
            printf("------------------------------------\n");
            printf("1. Truth\n");
            printf("2. Dare\n");
            printf("Choose 1 or 2 [Default: 1]: ");

            while (1) {
                readLine(response, sizeof(response));
                if (response[0] == '\0' || strcmp(response, "1") == 0) {
                    choice = 1;
                    break;
                } else if (strcmp(response, "2") == 0) {
                    choice = 2;
                    break;
                }
                printf("Invalid choice. Enter 1 for Truth or 2 for Dare [Default: 1]: ");
            }

            if (mode == 1) {
                /* Dynamic Mode: The previous player in the circle asks, or defaults on Enter */
                const char *asker = players[(i == 0) ? num_players - 1 : i - 1].name;
                char dynamic_q[MAX_QUESTION_LEN] = {0};

                if (choice == 1) {
                    printf("\n%s, type a TRUTH question for %s\n(or press Enter to use a default static question): ",
                           asker, players[i].name);
                    readLine(dynamic_q, sizeof(dynamic_q));

                    if (dynamic_q[0] != '\0') {
                        printf("\nTRUTH QUESTION (Asked by %s):\n\"%s\"\n", asker, dynamic_q);
                    } else {
                        printf("\nTRUTH QUESTION (Default):\n\"%s\"\n", getRandomTruth());
                    }
                } else {
                    printf("\n%s, type a DARE challenge for %s\n(or press Enter to use a default static dare): ",
                           asker, players[i].name);
                    readLine(dynamic_q, sizeof(dynamic_q));

                    if (dynamic_q[0] != '\0') {
                        printf("\nDARE CHALLENGE (Asked by %s):\n\"%s\"\n", asker, dynamic_q);
                    } else {
                        printf("\nDARE CHALLENGE (Default):\n\"%s\"\n", getRandomDare());
                    }
                }
            } else {
                /* Auto Static Mode: always use fixed default questions */
                if (choice == 1) {
                    printf("\nTRUTH QUESTION (Default):\n\"%s\"\n", getRandomTruth());
                } else {
                    printf("\nDARE CHALLENGE (Default):\n\"%s\"\n", getRandomDare());
                }
            }

            printf("\nComplete the challenge? (Y/N) [Default: Y]: ");

            while (1) {
                readLine(response, sizeof(response));

                if (response[0] == '\0' || tolower((unsigned char)response[0]) == 'y') {
                    players[i].score += 10;
                    printf("Great job, %s! You earned 10 points!\n", players[i].name);
                    break;
                }

                if (tolower((unsigned char)response[0]) == 'n') {
                    printf("Challenge skipped. No points awarded this turn.\n");
                    break;
                }

                printf("Please enter Y or N [Default: Y]: ");
            }

            printf("Current score: %s = %d points\n", players[i].name, players[i].score);
        }

        /* Standings at the end of each round */
        if (round < rounds) {
            printf("\n--- Standings after Round %d ---\n", round);
            for (i = 0; i < num_players; i++) {
                printf("  %-15s: %d pts\n", players[i].name, players[i].score);
            }
        }
    }

    /* Final Results */
    printf("\n====================================\n");
    printf("           FINAL RESULTS            \n");
    printf("====================================\n");

    int max_score = -1;
    for (i = 0; i < num_players; i++) {
        printf("%-15s: %d points\n", players[i].name, players[i].score);
        if (players[i].score > max_score) {
            max_score = players[i].score;
        }
    }

    /* Winner Determination (handles single winner and multi-way ties) */
    int winner_count = 0;
    int winner_indices[MAX_PLAYERS];
    for (i = 0; i < num_players; i++) {
        if (players[i].score == max_score) {
            winner_indices[winner_count++] = i;
        }
    }

    if (winner_count == 1) {
        printf("\nWINNER: %s with %d points!\n",
               players[winner_indices[0]].name, max_score);
    } else {
        printf("\nIT IS A TIE! Winners with %d points: ", max_score);
        for (i = 0; i < winner_count; i++) {
            printf("%s%s", players[winner_indices[i]].name,
                   (i == winner_count - 1) ? "!\n" : ", ");
        }
    }

    printf("\nThanks for playing Truth or Dare!\n");
    return 0;
}
