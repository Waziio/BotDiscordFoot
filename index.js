const jsonTeams = require("./teams.json");
const axios = require("axios");
const apiKey = "2325cbb19bfc4e9e992bce59eb31aa5b";
const { Client, GatewayIntentBits, Message } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const token = "OTE0NTcwOTQzMzE2MjM4MzM2.GoYeTL.IwiBVYts7ABlZzIJsjcbvHxcy0v_6_hQHJX-N4";

client.once("ready", () => {
  console.log("Bot lancé");
});

client.on("messageCreate", (message) => {
  if (message.content.toLowerCase() === "et tout le virage chante") {
    message.reply("AAAAARBITREEEEE ENCULÉÉÉÉÉÉÉÉÉ");
  }

  if (message.content === "!goat") {
    message.reply("Le GOAT est Lionel Andrés Messi.");
  }

  if (message.content.startsWith("!match")) {
    let temp = message.content.split(" ");
    let equipe = temp[1].toLowerCase();
    let nomEquipe = equipe === "barca" ? jsonTeams.barca.name : equipe === "psg" ? jsonTeams.psg.name : jsonTeams.nantes.name;
    let idTeam = equipe === "barca" ? jsonTeams.barca.id : equipe === "psg" ? jsonTeams.psg.id : jsonTeams.nantes.id;
    let stade = equipe === "barca" ? jsonTeams.barca.stade : equipe === "psg" ? jsonTeams.psg.stade : jsonTeams.nantes.stade;

    axios.get()
  }

  // if (message.content.startsWith("!match")) {
  //   let temp = message.content.split("-");
  //   let equipe = temp[1];
  //   let nomEquipe = equipe === "barca" ? jsonTeams.barca.name : equipe === "psg" ? jsonTeams.psg.name : jsonTeams.nantes.name;
  //   let idTeam = equipe === "barca" ? jsonTeams.barca.id : equipe === "psg" ? jsonTeams.psg.id : jsonTeams.nantes.id;
  //   let stade = equipe === "barca" ? jsonTeams.barca.stade : equipe === "psg" ? jsonTeams.psg.stade : jsonTeams.nantes.stade;

  //   axios
  //     .get(`https://api.football-data.org/v4/teams/${idTeam}/matches?status=SCHEDULED`, {
  //       headers: {
  //         "X-Auth-Token": apiKey,
  //       },
  //     })
  //     .then((response) => {
  //       let homeTeam = response.data.matches[0].homeTeam.name;
  //       let awayTeam = response.data.matches[0].awayTeam.name;
  //       let domicile = homeTeam == nomEquipe ? `:round_pushpin: ${stade}` : ":airplane: Extérieur";
  //       let utcDate = response.data.matches[0].utcDate.split("T");
  //       console.log(utcDate)
  //       let tabDate = utcDate[0].split("-");
  //       console.log(tabDate)
  //       let utcHeure = utcDate[1].replace("Z", "");
  //       let tabHeure = utcHeure.split(":");
  //       let heureBis = parseInt(tabHeure[0]);
  //       heureBis++; // On ajoute une heure pour l'heure francaise
  //       let dateFormat = new Date(tabDate[0], tabDate[1] - 1, tabDate[2], heureBis, tabHeure[1], tabHeure[2]);
  //       console.log(dateFormat)
  //       let minutes = dateFormat.getMinutes() < 10 ? "0" + dateFormat.getMinutes() : dateFormat.getMinutes();
  //       let heure = dateFormat.getHours() + "h" + minutes;
  //       let currentDate = new Date();
  //       console.log(currentDate)
  //       let date = dateFormat.getDate() === currentDate.getDate() ? "Aujourd'hui" : dateFormat.getDate() - 1 === currentDate.getDate() ? "Demain" :  dateFormat.toLocaleDateString();
  //       console.log(date + "a")

  //       message.reply("Le prochain match du " + nomEquipe + " : \n\n:soccer: " + homeTeam + " - " + awayTeam + "\n\n:calendar: " + date + " à " + heure + "\n\n" + domicile);
  //     });
  // }
});

client.login(token);
