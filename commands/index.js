import league from "./league/league.js";
import team from "./team/team.js";

const errorMessage = "Une erreur est survenue ...";

export async function commands(message) {

  if (message.content === "!goat") {
    message.reply("Le GOAT est Lionel Andrés Messi.");
  }

  if (message.content.startsWith("!match-")) {
    // Display the next match of the searched team
    try {
      team.getNextMatch(message);
    } catch (err) {
      message.reply(errorMessage);
    }
  }

  // List of matches by competition (today)
  if (message.content.startsWith("!compet-")) {
    try {
      league.getMatchesByLeague(message);
    } catch (err) {
      message.reply(errorMessage);
    }
  }

  // List of all matches of the 5 biggests leagues in Europe (today)
  if (message.content.toLowerCase() === "!compet") {
    try {
      league.getAllMatches(message);
    } catch (err) {
      message.reply(errorMessage);
    }
  }
}
