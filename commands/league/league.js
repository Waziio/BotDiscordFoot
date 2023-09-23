import axios from "axios";
import { competitions } from "../../utils/data.js";
import { apiKey } from "../../config.js";
import { formatDate } from "../../utils/utils.js";

async function getAllMatches(message) {
  let response = "";
  const id_pl = competitions.pl.id;
  const id_bundes = competitions.bundesliga.id;
  const id_liga = competitions.liga.id;
  const id_ligue1 = competitions.ligue1.id;
  const id_seria = competitions.seriea.id;
  const id_ldc = competitions.ldc.id;

  const matches_pl = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_pl}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_bundes = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_bundes}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_liga = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_liga}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_ligue1 = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_ligue1}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_seria = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_seria}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_ldc = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_ldc}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;

  const allLeagues = [
    { name: competitions.pl.name, matches: matches_pl, flag: competitions.pl.flag },
    { name: competitions.bundesliga.name, matches: matches_bundes, flag: competitions.bundesliga.flag },
    { name: competitions.liga.name, matches: matches_liga, flag: competitions.liga.flag },
    { name: competitions.ligue1.name, matches: matches_ligue1, flag: competitions.ligue1.flag },
    { name: competitions.seriea.name, matches: matches_seria, flag: competitions.seriea.flag },
    { name: competitions.ldc.name, matches: matches_ldc, flag: competitions.ldc.flag },
  ];

  allLeagues.forEach((league) => {
    // If no matches
    if (league.matches.length == 0) {
      const title = `Pas de match aujourd'hui en **${league.name}**  ${league.flag}\n\n`;
      response += title;
    } else {
      const title = `Voici les matchs d'aujourd'hui en **${league.name}**  ${league.flag}\n\n`;
      response += title;
    }

    // Display matches
    league.matches.forEach((match) => {
      const homeTeam = match.homeTeam.shortName;
      const awayTeam = match.awayTeam.shortName;
      const { heure } = formatDate(match.utcDate.split("T"));
      response += `${homeTeam} - ${awayTeam} à **${heure}**\n`;
    });
    response += "\n";
  });

  message.reply(response);
}

async function getMatchesByLeague(message) {
  const temp = message.content.split("-");
  const compet = competitions[temp[1].replace(" ", "").toLowerCase()];

  // If competition not found
  if (!compet) {
    message.reply("Je n'ai pas trouvé le championnat ...");
  } else {
    const { id, name, flag } = compet;
    let response = `Voici les matchs d'aujourd'hui en **${name}**  ${flag}\n\n`;

    const matches = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;

    matches.forEach((match) => {
      const homeTeam = match.homeTeam.shortName;
      const awayTeam = match.awayTeam.shortName;
      const { heure } = formatDate(match.utcDate.split("T"));
      response += `${homeTeam} - ${awayTeam} à **${heure}**\n`;
    });

    message.reply(response);
  }
}

export default { getAllMatches, getMatchesByLeague };
