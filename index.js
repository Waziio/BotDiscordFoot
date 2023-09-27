import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const token = "OTE0NTcwOTQzMzE2MjM4MzM2.GoYeTL.IwiBVYts7ABlZzIJsjcbvHxcy0v_6_hQHJX-N4";

client.once("ready", () => {
  console.log("Bot lancé");
});

client.on("messageCreate", commands);

client.login(token);

// Health check endpoint
setInterval(() => {
  if (client.isReady()) {
    console.log("Bot is healthy");
  } else {
    console.log("Bot is not healthy");
  }
}, 30000); // Check health every 30 seconds
