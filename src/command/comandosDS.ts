import { ApplicationCommandOptionType, Client,  GatewayIntentBits, Interaction,  Partials, REST, Routes, User } from "discord.js";
import { ICommand } from "../interface/interface.command";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../interface/interface.user";
import { CONSTANTS } from "../config/constants";
dotenv.config();


export class ComandosDS {
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
        {
            name:"rules",
            description:"Generar Reglas",
        },
	];
    
    async RegisterBuidCommands() {
        try {
            const rest:REST = new REST({version:'10'}).setToken(this.TOKEN);
            await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
				body: this.commands,
			});

            for (let index = 0; index < this.commands.length; index++) {
                console.log(`✅ Comando ${this.commands[index].name} registrado con exito`);
                
            }
        } catch (error) {
            console.error(`❌ Error al registrar el comando : ${this.commands[0].name} `);
            console.error(error);
        }
    }

    
    async sendRules():Promise<any>{
        this.client.on('interactionCreate',async (interaction:Interaction): Promise<any> =>{
            try {
                if (!interaction.isChatInputCommand()) return;
                const guild:any = this.client.guilds.cache.get(this.server_id);
                const userDc: User = interaction.user;
                const member = await guild.members.fetch(userDc.id);
                console.log("Estoy aqui");
                if (interaction.commandName == this.commands[1].name) {
                    if (member.roles.cache.has(CONSTANTS.DISCORD_ROLES_ID.ROOT)) {
                        const channel: any = this.client.channels.cache.get(
                            CONSTANTS.DISCORD_CHANNELS_ID.RULES
                        );
                        const msj = await  channel.send(CONSTANTS.MESSAGES.RULES);
                        await msj.react("👍");
                    }else{
                        await interaction.reply(`⚠ No tienes permisos para usar este comando`);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        })
    }

    /*
    async RegisterServer():Promise<any>{
        this.client.on("interactionCreate",async(interaction:Interaction)=>{
            try {
                if(!interaction.isChatInputCommand()) return;
                const guild:any = this.client.guilds.cache.get(this.server_id);
                if (interaction.commandName === this.commands[0].name){
                    const prisma = new PrismaClient();
                    const todayDate = new Date();
                    

                }
            }
        })
    }
    */

    async ResgisterAdmin(): Promise<any> {
        
        this.client.on("interactionCreate", async (interaction: Interaction)=> {
            try {
                if (!interaction.isChatInputCommand()) return;
                const guild:any = this.client.guilds.cache.get(this.server_id);
				if (interaction.commandName === this.commands[0].name) {
                    const prisma = new PrismaClient();
                    const todayDate = new Date();
                    const userDc: User = interaction.user;
                    const userNick = interaction.options.getString("nickname");
                    const userId = interaction.options.getString("userid")
                    
                    const userPayload: IUser = {
                        user_id_dc: `${userId}`,
                        user_name: `${userNick}`,
                        user_note: "",
                        user_token: "",
                        cdcCreateDt: todayDate,
                        cdcUpdateDt: todayDate,
                        cdcCreateUser: `${userDc.username}#${userDc.discriminator}`,
                        cdcUpdateUser: `${userDc.username}#${userDc.discriminator}`
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
                                        data:userPayload
                                    }); 
                                    await interaction.reply(`✅ Has el usuario ${userPayload.user_name} ha sido registrado con exito `);
                                    console.log(`Se ha creado usario desde la linia de comandos ${result}`);
                                } else {
                                    await interaction.reply(`⚠ el usuario **${userPayload.user_name}**  ya se encuentra registrado`);
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