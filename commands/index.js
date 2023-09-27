import league from "./league/league.js";
import team from "./team/team.js";

const errorMessage = "Une erreur est survenue ...";

export async function commands(message) {
  if (message.content.toLowerCase() === "et tout le virage chante") {
    message.reply("AAAAARBITREEEEE ENCULÉÉÉÉÉÉÉÉÉ");
  }

  if (message.content.includes("ravus")) {
    if (!message.author.bot) {
      message.reply("https://tenor.com/view/ravusssss-ravus-ravusss-atroce-effrayant-gif-3982462483753468734");
    }
  }

  if (message.content.includes("samuel")) {
    if (!message.author.bot) {
      message.reply("https://tenor.com/view/samuel-funny-dog-smile-happy-gif-17384183");
    }
  }

  if (message.content === "!goat") {
    message.reply("Le GOAT est Lionel Andrés Messi.");
  }

  if (message.author.username === "fuckkdiscoord") {
    const insults = ["Enculé", "tg", "ntm", "fdp"];
    const randomIndex = Math.floor(Math.random() * insults.length);
    message.reply(insults[randomIndex]);
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
      console.log(err.message);
      message.reply(errorMessage);
    }
  }

  // List of all matches of the 5 biggests leagues in Europe (today)
  if (message.content.toLowerCase() === "!compet") {
    try {
      league.getAllMatches(message);
    } catch (err) {
      console.log(err.message);
      message.reply(errorMessage);
    }
  }
}
