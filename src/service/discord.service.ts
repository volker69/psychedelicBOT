import { IUser } from "../interface/interface.user";
import * as UserData from "../data/user.data";
import { User } from "discord.js";
import * as dotenv from "dotenv";
import { Client, GatewayIntentBits, Interaction } from "discord.js";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
export async function userResgister(botName: string):Promise<any> {
	client.on("interactionCreate", async function (interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;
		if (interaction.commandName === "register") {
			const userData = new UserData.User();
			const userDc: User = interaction.user;
			const userPayload: IUser = {
				user_id_dc: userDc.id,
				user_name: `${userDc.username}#${userDc.discriminator}`,
				user_note: `${userDc.avatar}`,
				user_token: "",
				cdcCreateDt: userData.FECHA,
				cdcUpdateDt: userData.FECHA,
				cdcCreateUser: botName,
				cdcUpdateUser: botName,
			};
			const result = await userData.postUser(userPayload);
			if (result.status) {
				await interaction.reply("✅ Has sido registrado con exito ");
			} else {
				await interaction.reply("❌ error en el registro");
				console.error(result.data);
			}
		}
	});
	client.login(TOKEN);
}
