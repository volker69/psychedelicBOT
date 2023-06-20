import {
	ApplicationCommandOptionType,
	Client,
	GatewayIntentBits,
	Guild,
	Interaction,
	Partials,
	REST,
	Routes,
	TextChannel,
	User,
} from "discord.js";
import { ICommand } from "../interface/interface.command";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../interface/interface.user";

import { CONSTANTS } from "../config/constants";
import { IChannelDS } from "../interface/interface.channelDS";
dotenv.config();

export class ComandosDS {
	private TOKEN: any = process.env.DISCORD_TOKEN;
	private server_id: any = process.env.DC_SERVER_ID;
	private CLIENT_ID: any = process.env.CLIENT_ID;
	private client = new Client({
		partials: [Partials.Message, Partials.Reaction, Partials.Channel],
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMembers,
		],
	});
	private commands: Array<ICommand> = [
		{
			name: "register",
			description: "Este comando permite registrar al usuario al servidor de BD",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "nickname",
					description: "Ingresa el nickname",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "userid",
					description: "Ingresa el userID",
					required: true,
				},
			],
		},
		{
			name: "rules",
			description: "Generar Reglas",
		},
		{
			name: "channel-add",
			description: "Registra en canal de texto a la BD",
		},
	];

	async RegisterBuidCommands() {
		try {
			const rest: REST = new REST({ version: "10" }).setToken(this.TOKEN);
			console.log(this.commands);
			await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
				body: this.commands,
			});

			for (let index = 0; index < this.commands.length; index++) {
				console.log(`✅ Comando ${this.commands[index].name} registrado con exito`);
			}
		} catch (error) {
			console.error(
				`❌ Error al registrar el comando : ${this.commands[0].name} `
			);
			console.error(error);
		}
	}

	async registerChannel(): Promise<void> {
		this.client.on(
			"interactionCreate",
			async (interaction: Interaction): Promise<any> => {
				try {
					if (!interaction.isChatInputCommand()) return;
					const guild: Guild | undefined = this.client.guilds.cache.get(
						this.server_id
					);
					const userDc: User = interaction.user;
					const member = await guild?.members.fetch(userDc.id);
					if (interaction.commandName === this.commands[2].name) {
						if (member?.permissions.has("Administrator")) {
							const ch = interaction.channel as TextChannel;
							const srv = interaction.guild;
							const prisma = new PrismaClient();
							const getDataServer = await prisma.serverDc.findFirst({
								where: {
									server_id_dc: srv?.id,
								},
							});

							const getServerId = getDataServer?.server_id;
							console.log(typeof getServerId);
							console.log(getServerId);
							if (typeof getServerId == "number") {
								const dataExist = await prisma.channelDC.findFirst({
									where: {
										channelDc_id_dc: ch.id,
									},
								});
								console.table(dataExist);
								const todayDate = new Date();
								const payLoad: IChannelDS = {
									channelDc_name: ch.name,
									channelDc_id_dc: ch.id,
									server_id_fk: getServerId,
									cdcCreateDt: todayDate,
									cdcUpdateDt: todayDate,
									cdcCreateUser: `${userDc.username}#${userDc.discriminator}`,
									cdcUpdateUser: `${userDc.username}#${userDc.discriminator}`,
								};
								console.log(`channelName: ${ch.name} \n chnannelId: ${ch.id}`);
								if (dataExist === null) {
									const res = await prisma.channelDC.create({
										data: payLoad,
									});
									console.log(`✅ Canal creado ${res}`);
									await interaction.reply("Canal Registrado");
								} else {
									await interaction.reply("esta canal ya esta creado");
								}
							} else {
								throw new Error("El server al cual acceder no existe");
							}
						}
					}
				} catch (error) {
					console.error(`Error en el registro de canal \n ${error}`);
				}
			}
		);
	}

	async sendRules(): Promise<any> {
		this.client.on(
			"interactionCreate",
			async (interaction: Interaction): Promise<any> => {
				try {
					if (!interaction.isChatInputCommand()) return;
					const guild: any = this.client.guilds.cache.get(this.server_id);
					const userDc: User = interaction.user;
					const member = await guild.members.fetch(userDc.id);
					if (interaction.commandName == this.commands[1].name) {
						console.log(`estou en ${interaction.commandName}`);
						if (member.roles.cache.has(CONSTANTS.DISCORD_ROLES_ID.ROOT)) {
							const channel: any = this.client.channels.cache.get(
								CONSTANTS.DISCORD_CHANNELS_ID.RULES
							);
							const msj = await channel.send(CONSTANTS.MESSAGES.RULES);
							await msj.react("👍");
						} else {
							await interaction.reply(`⚠ No tienes permisos para usar este comando`);
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
		);
	}

	async ResgisterAdmin(): Promise<any> {
		this.client.on("interactionCreate", async (interaction: Interaction) => {
			try {
				if (!interaction.isChatInputCommand()) return;
				const guild: any = this.client.guilds.cache.get(this.server_id);
				if (interaction.commandName === this.commands[0].name) {
					const prisma = new PrismaClient();
					const todayDate = new Date();
					const userDc: User = interaction.user;
					const userNick = interaction.options.getString("nickname");
					const userId = interaction.options.getString("userid");

					const userPayload: IUser = {
						user_id_dc: `${userId}`,
						user_name: `${userNick}`,
						user_note: "",
						user_token: "",
						cdcCreateDt: todayDate,
						cdcUpdateDt: todayDate,
						cdcCreateUser: `${userDc.username}#${userDc.discriminator}`,
						cdcUpdateUser: `${userDc.username}#${userDc.discriminator}`,
					};

					const member = await guild.members.fetch(userDc.id);
					let isMember = member.roles.cache.has(CONSTANTS.DISCORD_ROLES_ID.ROOT)
						? true
						: false;
					if (isMember) {
						const dataExisist = await prisma.user.findFirst({
							where: {
								user_id_dc: userPayload.user_id_dc,
							},
						});
						try {
							if (dataExisist === null) {
								const result = await prisma.user.create({
									data: userPayload,
								});
								await interaction.reply(
									`✅ Has el usuario ${userPayload.user_name} ha sido registrado con exito `
								);
								console.log(`Se ha creado usario desde la linia de comandos ${result}`);
							} else {
								await interaction.reply(
									`⚠ el usuario **${userPayload.user_name}**  ya se encuentra registrado`
								);
							}
						} catch (error) {
							await interaction.reply("❌ error en el registro");
							console.error(error);
						}
					} else {
						await interaction.reply(`⚠ No tienes permisos para usar este comando`);
					}
				}
			} catch (error) {
				console.error(error);
			}
		});
		this.client.login(this.TOKEN);
	}
}
