import axios from "axios";
import { apiKey } from "../config.js";
import express from "express";

export function formatDate(utcDate) {
  let tabDate = utcDate[0].split("-");
  let utcHeure = utcDate[1].replace("Z", "");
  let tabHeure = utcHeure.split(":");
  let heureBis = parseInt(tabHeure[0]);
  heureBis += 2; // On ajoute une heure pour l'heure francaise
  let dateFormat = new Date(tabDate[0], tabDate[1] - 1, tabDate[2], heureBis, tabHeure[1], tabHeure[2]);
  let minutes = dateFormat.getMinutes() < 10 ? "0" + dateFormat.getMinutes() : dateFormat.getMinutes();
  let heure = dateFormat.getHours() + "h" + minutes;
  let currentDate = new Date();
  let date = dateFormat.getDate() === currentDate.getDate() ? "Aujourd'hui" : dateFormat.getDate() - 1 === currentDate.getDate() ? "Demain" : dateFormat.toLocaleDateString();
  return { date: date, heure: heure };
}

export function searchTeam(searchedTeam) {
  searchedTeam = searchedTeam.toLowerCase();
  return new Promise(async (resolve, reject) => {
    let res_team = {};
    // Search all teams
    let response = await axios.get("https://api.football-data.org/v4/teams?limit=1000&offset=0", { headers: { "X-Auth-Token": apiKey } });

    const teamsList = response.data.teams;
    for (let team of teamsList) {
      const name = team.name.toLowerCase();
      const shortname = team.shortName ? team.shortName.toLowerCase() : null;
      const tla = team.tla ? team.tla.toLowerCase() : null;
      if (name === searchedTeam || shortname === searchedTeam || tla === searchedTeam) {
        res_team["id"] = team.id;
        res_team["name"] = team.name;
        res_team["shortName"] = team.shortName ? team.shortName : "";
        res_team["stade"] = team.venue ? team.venue : "";
        break;
      }
    }

    if (res_team) {
      resolve(res_team);
    } else {
      reject("Je n'ai pas trouvé l'équipe ...");
    }
  });
}

// Fonction pour démarrer le serveur de contrôle de santé
export function startHealthCheckServer() {
  const app = express();
  const port = 8080; // Port de contrôle de santé

  // Health check endpoint
  app.get("/health", (req, res) => {
    if (client.isReady()) {
      res.status(200).send("Bot is healthy");
    } else {
      res.status(500).send("Bot is not healthy");
    }
  });

  app.listen(port, () => {
    console.log(`Serveur de contrôle de santé en cours d'exécution sur le port ${port}`);
  });
}
