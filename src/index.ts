import app from "./app";
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { userResgister } from "./service/discord.service";

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN;
const client: any = new Client({ intents: [GatewayIntentBits.GuildPresences] });

 client.on('ready', async () => {
    console.log(`Logged como  ${client.user.tag}!`);
    let botName:string = client.user.tag;
    await userResgister(botName);

});

console.log(`THE SERVER IS RUNNING IN PORT : ${app.get("port")}`);
app.listen(app.get("port"));

client.login(TOKEN);
