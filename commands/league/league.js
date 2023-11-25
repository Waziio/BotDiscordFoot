import axios from "axios";
import { competitions } from "../../utils/data.js";
import { apiKey } from "../../config.js";
import { formatDate } from "../../utils/utils.js";

async function getMatchesByCompetition(competitionId) {
  const url = `https://api.football-data.org/v4/matches/?competitions=${competitionId}`;
  const response = await axios.get(url, { headers: { "X-Auth-Token": apiKey } });
  return response.data.matches;
}

async function getAllMatches(message) {
  const compets = [
    { id: competitions.pl.id, name: competitions.pl.name, flag: competitions.pl.flag },
    { id: competitions.bundesliga.id, name: competitions.bundesliga.name, flag: competitions.bundesliga.flag },
    { id: competitions.liga.id, name: competitions.liga.name, flag: competitions.liga.flag },
    { id: competitions.ligue1.id, name: competitions.ligue1.name, flag: competitions.ligue1.flag },
    { id: competitions.seriea.id, name: competitions.seriea.name, flag: competitions.seriea.flag },
    { id: competitions.ldc.id, name: competitions.ldc.name, flag: competitions.ldc.flag },
  ];

  const allLeagues = await Promise.all(
    compets.map(async (compet) => {
      const matches = await getMatchesByCompetition(compet.id);
      return {
        id: compet.id,
        name: compet.name,
        flag: compet.flag,
        matches: matches,
      };
    })
  );

  let response = "";

  allLeagues.forEach((league) => {
    // If no matches
    if (league.matches.length == 0) {
      const title = `Pas de match aujourd'hui en **${league.name}**  ${league.flag}\n`;
      response += title;
    } else {
      const title = `Voici les matchs d'aujourd'hui en **${league.name}**  ${league.flag}\n`;
      response += title;
    }

    const matchesInPlay = league.matches.filter((match) => match.status === "IN_PLAY" || match.status === "PAUSED");
    const matchesFinished = league.matches.filter((match) => match.status === "FINISHED");
    const matchesScheduled = league.matches.filter((match) => match.status === "TIMED");

    let needSpace = false;

    if (matchesFinished.length > 0) {
      needSpace = true;
      response += "**Finis** : \n";
      matchesFinished.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const homeTeamScore = match.score.fullTime.home;
        const awayTeamScore = match.score.fullTime.away;
        response += `${homeTeam}\t**${homeTeamScore}** - **${awayTeamScore}**\t${awayTeam}\n`;
      });
    }

    if (matchesInPlay.length > 0) {
      response += needSpace ? "**En cours** : \n" : "**En cours** : \n";
      needSpace = true;
      matchesInPlay.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const homeTeamScore = match.score.fullTime.home;
        const awayTeamScore = match.score.fullTime.away;
        response += `${homeTeam}\t**${homeTeamScore}** - **${awayTeamScore}**\t${awayTeam}\n`;
      });
    }

    if (matchesScheduled.length > 0) {
      response += needSpace ? "**À venir** : \n" : "**À venir** : \n";
      matchesScheduled.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const { heure } = formatDate(match.utcDate.split("T"));
        response += `${homeTeam} - ${awayTeam} à **${heure}**\n`;
      });
    }

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

    const matches = (await axios.get(`https://api.football-data.org/v4/matches/?competitions=${id}`, { headers: { "X-Auth-Token": apiKey } })).data.matches;
    const matchesInPlay = matches.filter((match) => match.status === "IN_PLAY" || match.status === "PAUSED");
    const matchesFinished = matches.filter((match) => match.status === "FINISHED");
    const matchesScheduled = matches.filter((match) => match.status === "TIMED");

    let response = matches.length > 0 ? `Voici les matchs d'aujourd'hui en **${name}**  ${flag}\n\n` : `Pas de match aujourd'hui en **${name}**  ${flag}\n`;
    let needSpace = false;

    if (matchesFinished.length > 0) {
      needSpace = true;
      response += "\n**Finis** : \n";
      matchesFinished.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const homeTeamScore = match.score.fullTime.home;
        const awayTeamScore = match.score.fullTime.away;
        response += `${homeTeam}\t**${homeTeamScore}** - **${awayTeamScore}**\t${awayTeam}\n`;
      });
    }

    if (matchesInPlay.length > 0) {
      response += needSpace ? "\n**En cours** : \n" : "**En cours** : \n";
      needSpace = true;
      matchesInPlay.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const homeTeamScore = match.score.fullTime.home;
        const awayTeamScore = match.score.fullTime.away;
        response += `${homeTeam}\t**${homeTeamScore}** - **${awayTeamScore}**\t${awayTeam}\n`;
      });
    }

    if (matchesScheduled.length > 0) {
      response += needSpace ? "\n**À venir** : \n" : "**À venir** : \n";
      matchesScheduled.forEach((match) => {
        const homeTeam = match.homeTeam.shortName;
        const awayTeam = match.awayTeam.shortName;
        const { heure } = formatDate(match.utcDate.split("T"));
        response += `${homeTeam} - ${awayTeam} à **${heure}**\n`;
      });
    }

    message.reply(response);
  }
}

export default { getAllMatches, getMatchesByLeague };
