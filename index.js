import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const token = process.env.BOT_TOKEN;

client.once("ready", () => {
  console.log("Bot lancé");
});

client.on("messageCreate", commands);

client.login(token);

const app = express();
const port = 8000; // Port de contrôle de santé

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
