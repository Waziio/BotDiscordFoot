import axios from "axios";
import { competitions } from "../../utils/data.js";
import { apiKey } from "../../config.js";
import { formatDate } from "../../utils/utils.js";

async function getAllMatches(message) {
  let response = "";
  const id_pl = competitions.pl.id;
  const id_bundes = competitions.bundes.id;
  const id_liga = competitions.liga.id;
  const id_ligue1 = competitions.ligue1.id;
  const id_seria = competitions.seriea.id;

  const matches_pl = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_pl}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_bundes = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_bundes}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_liga = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_liga}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_ligue1 = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_ligue1}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
  const matches_seria = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id_seria}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;

  const allLeagues = [
    { name: "Premier League", matches: matches_pl, flag: ":england:" },
    { name: "Bundesliga", matches: matches_bundes, flag: ":flag_de:" },
    { name: "Liga", matches: matches_liga, flag: ":flag_es:" },
    { name: "Ligue 1", matches: matches_ligue1, flag: ":flag_fr:" },
    { name: "Serie A", matches: matches_seria, flag: ":flag_it:" },
  ];

  allLeagues.forEach((league) => {
    const title = `Voici les matchs d'aujourd'hui en **${league.name}**  ${league.flag}\n\n`;
    response += title;
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
