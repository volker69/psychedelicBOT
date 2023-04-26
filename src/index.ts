import app from "./app";
import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { RegisterCmd } from "./command/register";
import { DiscordServices } from "./service/discord.service";

import './config/mongo.conexion';


dotenv.config();
const TOKEN:string = `${process.env.DISCORD_TOKEN}`;
const client: any = new Client({ intents: [GatewayIntentBits.GuildPresences,GatewayIntentBits.Guilds] });
const registerCmd = new RegisterCmd();
const serviceDC = new DiscordServices();
 client.once(Events.ClientReady, async (c:any) => {
  console.log(`🟢 bot iniciado como ${c.user.tag}!`);
  await registerCmd.RegisterBuidCommands();
  await registerCmd.ResgisterAdmin();
  await serviceDC.reactionRegister(c.user.tag);
  await serviceDC.welcomeServer();
});


console.log(`🚀 EL SERVIDOR ESTA CORRIENDO EN EL PUERTO : ${app.get("port")}`);
app.listen(app.get("port"));

client.login(TOKEN);
