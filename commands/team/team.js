import axios from "axios";
import { formatDate, searchTeam } from "../../utils/utils.js";
import { apiKey } from "../../config.js";

async function getNextMatch(message) {
  const team = message.content.split("-")[1].trim();
  const { id, name, shortName, stade } = await searchTeam(team);
  const response = await axios.get(`https://api.football-data.org/v4/teams/${id}/matches?status=SCHEDULED`, { headers: { "X-Auth-Token": apiKey } });
  let homeTeam = response.data.matches[0].homeTeam.name;
  let awayTeam = response.data.matches[0].awayTeam.name;
  let domicile = homeTeam == name ? `:round_pushpin:\t${stade}` : ":airplane: \tExtérieur";
  let utcDate = response.data.matches[0].utcDate.split("T");
  let { date, heure } = formatDate(utcDate);
  message.reply("Le prochain match du **" + shortName + "** : \n\n:soccer:\t" + homeTeam + " - " + awayTeam + "\n\n:calendar:\t" + date + " à **" + heure + "**\n\n" + domicile);
}

export default { getNextMatch };
