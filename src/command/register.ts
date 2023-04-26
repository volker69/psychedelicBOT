import { ApplicationCommandOptionType, Client,  GatewayIntentBits, Interaction,  Partials, REST, Routes, User } from "discord.js";
import { ICommand } from "../interface/interface.command";
import * as UserData from "../data/user.data";
import * as dotenv from "dotenv";
import { IUser } from "../interface/interface.user";
import { CONSTANTS } from "../config/constants";
dotenv.config();


export class RegisterCmd {
    private TOKEN: any = process.env.DISCORD_TOKEN;
    private server_id: any = process.env.DC_SERVER_ID;
	private CLIENT_ID: any = process.env.CLIENT_ID;
    private client = new Client({
		partials: [Partials.Message, Partials.Reaction, Partials.Channel],
		intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildMembers]
	});
    private commands:Array<ICommand> = [
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
                }
            ],
		},
	];
    
    async RegisterBuidCommands() {
        try {
            const rest:REST = new REST({version:'10'}).setToken(this.TOKEN);
            await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
				body: this.commands,
			});

            console.log(`✅ Comando ${this.commands[0].name} registrado con exito`);
        } catch (error) {
            console.error(`❌ Error al registrar el comando : ${this.commands[0].name} `);
            console.error(error);
        }
    }

    async ResgisterAdmin(): Promise<any> {
        
        this.client.on("interactionCreate", async (interaction: Interaction)=> {
            try {
                if (!interaction.isChatInputCommand()) return;
                const guild:any = this.client.guilds.cache.get(this.server_id);
				if (interaction.commandName === "register") {
                    const userData = new UserData.User();
                    const userDc: User = interaction.user;
                    const userNick = interaction.options.getString("nickname");
                    const userId = interaction.options.getString("userid")
                    
                    const userPayload: IUser = {
                        user_id_dc: `${userId}`,
                        user_name: `${userNick}`,
                        user_note: "",
                        user_token: "",
                        cdcCreateDt: userData.FECHA,
                        cdcUpdateDt: userData.FECHA,
                        cdcCreateUser: `${userDc.username}#${userDc.discriminator}`,
                        cdcUpdateUser: `${userDc.username}#${userDc.discriminator}`
                    };
    
                    const member = await guild.members.fetch(userDc.id);
                    let isMember = member.roles.cache.has(CONSTANTS.DISCORD_ROLES_ID.ROOT)
                        ? true
                        : false;
                    if (isMember) {
                        const dataExisist = await userData.getUserById(
                            "user_id_dc",
                            userPayload.user_id_dc
                        );
                        if (dataExisist.statusCode === 404) {
                            const result = await userData.postUser(userPayload);
                            if (result.status) {
                                await interaction.reply(`✅ Has el usuario ${userPayload.user_name} ha sido registrado con exito `);
                            } else {
                                await interaction.reply("❌ error en el registro");
                                console.error(result.data);
                            }
                        } else {
                            await interaction.reply(`⚠ el usuario **${userPayload.user_name}**  ya se encuentra registrado`);
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