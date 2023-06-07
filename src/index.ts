import app from "./app";
import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { ComandosDS } from "./command/comandosDS";
import { DiscordServices } from "./service/discord.service";
import { CONSTANTS } from "./config/constants";

dotenv.config();
const TOKEN: string = `${process.env.DISCORD_TOKEN}`;
const client: any = new Client({
	intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds],
});
const comandoDs = new ComandosDS();
const serviceDC = new DiscordServices();

console.log(CONSTANTS.MESSAGES.ART1);

client.once(Events.ClientReady, async (c: any) => {
	console.log(`🟢 bot iniciado como ${c.user.tag}!`);
	await comandoDs.RegisterBuidCommands();
	await comandoDs.ResgisterAdmin();
	await comandoDs.sendRules();
	await serviceDC.reactionRegister(c.user.tag);
	await serviceDC.welcomeServer();
	await serviceDC.alertLive();
	await serviceDC.registerServers(c.user.tag);
	//await serviceDC.deleteServers
});
console.log(`🚀 EL SERVIDOR ESTA CORRIENDO EN EL PUERTO : ${app.get("port")}`);
app.listen(app.get("port"));

client.login(TOKEN);
