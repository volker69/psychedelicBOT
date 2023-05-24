import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import {
	Client,
	Emoji,
	GatewayIntentBits,
	GuildMember,
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	Partials,
	User,
	EmbedBuilder,
	TextChannel,
} from "discord.js";
import { CONSTANTS } from "../config/constants";
import axios from "axios";

dotenv.config();

export class DiscordServices {
	private client = new Client({
		partials: [Partials.Message, Partials.Reaction, Partials.Channel],
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMembers,
		],
	});

	private TOKEN = process.env.DISCORD_TOKEN;

	async alertLive() {
		this.client.on("ready", async (): Promise<any> => {
			const clientID: string = `${process.env.TWITCH_CLIENT_ID}`;
			const canalTws = "psychedelic_humor";
			const canalTxtDs = CONSTANTS.DISCORD_CHANNELS_ID.RULES;
			const tokenTws: string = `${process.env.TWITCH_TOKEN}`;
			this.sendLiveNotification(canalTxtDs, canalTws, clientID, tokenTws);
		});
	}

	async reactionRegister(botname: string) {
		this.client.on(
			"messageReactionAdd",
			async (
				reaction: MessageReaction | PartialMessageReaction,
				user: User | PartialUser
			) => {
				const emoji: Emoji = reaction.emoji;
				const strEmoji: string = emoji.toString();
				const mensajeID = CONSTANTS.DISCORD_MESSAGE_ID.REGLAS;
				const roleId = CONSTANTS.DISCORD_ROLES_ID.USERS;
				const prisma = new PrismaClient();
				console.log(`El emoji que es uso es ${emoji}`);
				if (reaction.message.id === mensajeID && strEmoji == "👍") {
					const guild: any = reaction.message.guild;
					const member = await guild.members.fetch(user.id);
					const role = guild.roles.cache.get(roleId);
					if (!role) {
						console.error(`❌ Role with ID ${roleId} not found`);
						return;
					}
					const userNameDc = user.username;
					const todayDate = new Date();
					const userPayload = {
						user_id_dc: `${user.id}`,
						user_name: `${userNameDc?.replace(/\s+/g, "_")}#${user.discriminator}`,
						user_note: "",
						user_token: "",
						cdcCreateDt: todayDate,
						cdcUpdateDt: todayDate,
						cdcCreateUser: botname,
						cdcUpdateUser: botname,
					};

					const dataExisist = await prisma.user.findFirst({
						where: {
							user_id_dc: userPayload.user_id_dc,
						},
					});
					const sendMsj: any = reaction.message.channel;
					try {
						if (dataExisist === null) {
							const result = await prisma.user.create({
								data: userPayload,
							});

							console.log(
								`✅ ${user.username}#${user.deleteDM}, has sido registrado con éxito. con los siguientes datos: \n  ${result}`
							);
							await sendMsj.send(`✅ Has sido registrado con exito  `);
						} else {
							console.log("⚠ Ya estas registrado");
							await sendMsj.send(`⚠ Ya estas registrado`);
						}
					} catch (error) {
						console.log("❌ error en el registro");
						await sendMsj.send(`❌ error en el registro"`);
						console.error(error);
					}

					member.roles.add(role).catch((error: any) => {
						console.error("❌ Error al asignar el rol:", error);
					});
				}
			}
		);
		this.client.login(this.TOKEN);
	}

	async welcomeServer() {
		this.client.on("guildMemberAdd", (member: GuildMember) => {
			const welcomeEmbed = new EmbedBuilder()
				.setTitle(`Bienvenido ${member.user.username}`)
				.setDescription(`¡Bienvenido a esta cagada de servidor, ${member}! `)
				.setColor("Green")
				.setImage(
					"https://usagif.com/wp-content/uploads/2021/4fh5wi/troll-face-44.gif"
				)
				.setThumbnail(member.user.displayAvatarURL({ size: 128 }));

			if (member.guild.banner) {
				welcomeEmbed.setDescription(
					`¡Bienvenido a nuestro servidor, ${member}!\n\n${
						member.guild.name
					} tiene un banner de servidor:\n${member.guild.bannerURL()}`
				);
			}

			const welcomeChannel: any = member.guild.channels.cache.find(
				(channel) => channel.name === "🏠welcome"
			);

			if (welcomeChannel) {
				welcomeChannel.send({ embeds: [welcomeEmbed] });
			}
		});
	}

	private async AlertLive(
		twichChannel: string,
		clientId: string,
		accessToken: string
	): Promise<any> {
		try {
			const response = await axios.get(
				`https://api.twitch.tv/helix/streams?user_login=${twichChannel}`,
				{
					headers: {
						"Client-ID": clientId,
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			const res: boolean = response.data.data.length > 0;
			return res;
		} catch (error) {
			console.error("Fallo el estado del canal", error);
		}
	}

	private async sendLiveNotification(
		channelID: string,
		TwitchChannel: string,
		clientId: string,
		accessToken: string
	) {
		const channel = this.client.channels.cache.get(channelID) as TextChannel;

		if (!channel) {
			console.error("El canal no Existe");
		}

		const isLive = await this.AlertLive(TwitchChannel, clientId, accessToken);

		if (isLive) {
			await channel.send(
				`@everyone, ${TwitchChannel} está transmitiendo en vivo ahora en Twitch! ¡No es que me importe si lo ves o no, pero aquí tienes el enlace: https://www.twitch.tv/${TwitchChannel}`
			);
		} else {
			console.log(`🔻 Canal apagado`);
		}
	}
}
