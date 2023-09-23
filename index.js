import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import { formatDate, searchTeam } from "./utils/utils.js";
import { competitions, teams } from "./utils/data.js";
import { apiKey } from "./config.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const token = "OTE0NTcwOTQzMzE2MjM4MzM2.GoYeTL.IwiBVYts7ABlZzIJsjcbvHxcy0v_6_hQHJX-N4";

client.once("ready", () => {
  console.log("Bot lancé");
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "et tout le virage chante") {
    message.reply("AAAAARBITREEEEE ENCULÉÉÉÉÉÉÉÉÉ");
  }

  if (message.content === "!goat") {
    message.reply("Le GOAT est Lionel Andrés Messi.");
  }

  if (message.content.startsWith("!search")) {
    let temp = message.content.split("-");
    let searchedTeam = temp[1].toLowerCase();
    let id;
    // Search all teams
    axios
      .get("https://api.football-data.org/v4/teams?limit=1000&offset=0", {
        headers: {
          "X-Auth-Token": apiKey,
        },
      })
      .then((res) => {
        const teamsList = res.data.teams;
        for (let team of teamsList) {
          const name = team.name.toLowerCase();
          const shortname = team.shortName ? team.shortName.toLowerCase() : null;
          if (name === searchedTeam || shortname === searchedTeam) {
            id = team.id;
            break;
          }
        }

        if (id) {
          message.reply("Id de l'équipe : " + id);
        } else {
          message.reply("J'ai pas trouvé l'id de l'équipe");
        }
      });
  }

  if (message.content.startsWith("!match")) {
    try {
      const team = message.content.split("-")[1].trim();
      const { id, name, shortName, stade } = await searchTeam(team);
      const response = await axios.get(`https://api.football-data.org/v4/teams/${id}/matches?status=SCHEDULED`, { headers: { "X-Auth-Token": apiKey } });
      let homeTeam = response.data.matches[0].homeTeam.name;
      let awayTeam = response.data.matches[0].awayTeam.name;
      let domicile = homeTeam == name ? `:round_pushpin:\t${stade}` : ":airplane: \tExtérieur";
      let utcDate = response.data.matches[0].utcDate.split("T");
      let { date, heure } = formatDate(utcDate);
      message.reply("Le prochain match du **" + shortName + "** : \n\n:soccer:\t" + homeTeam + " - " + awayTeam + "\n\n:calendar:\t" + date + " à **" + heure + "**\n\n" + domicile);
    } catch (err) {
      message.reply("Une erreur est survenue ...");
    }
  }

  // List of matches (today) by competition
  if (message.content.startsWith("!compet")) {
    const temp = message.content.split("-");
    const compet = competitions[temp[1].replace(" ", "").toLowerCase()];

    // If competition not found
    if (!compet) {
      message.reply("Je n'ai pas trouvé le championnat ...");
    } else {
      const { id, name, flag } = compet;
      let response = `Voici les matchs d'aujourd'hui en **${name}**  ${flag}\n\n`;

      const res = await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id}`, { headers: { "X-Auth-Token": apiKey } });

      const matches = res.data.matches;

      matches.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const { heure } = formatDate(match.utcDate.split("T"));
        response += `${homeTeam} - ${awayTeam} à **${heure}**\n`;
      });

      message.reply(response);
    }
  }
});

client.login(token);
