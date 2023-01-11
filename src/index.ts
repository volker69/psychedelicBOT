import app from "./app";
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.DISCORD_TOKEN;
const client: any = new Client({ intents: [GatewayIntentBits.GuildPresences] });

/* client.on('ready', async () => {
    console.log(`Logged como  ${client.user.tag}!`);
    const list = client.guilds.cache.get("991570302167429170"); 
    console.log(list);
    let {guild} = list;
    console.log(guild);


}); */

console.log(`THE SERVER IS RUNNING IN PORT : ${app.get("port")}`);
app.listen(app.get("port"));

client.login(TOKEN);
