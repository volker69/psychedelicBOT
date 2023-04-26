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
		EmbedBuilder
	} from "discord.js";
import { CONSTANTS } from "../config/constants";
import * as UserData from "../data/user.data";
import { IUser } from "../interface/interface.user";
dotenv.config();



export class DiscordServices{
	private client = new Client({
		partials: [Partials.Message, Partials.Reaction, Partials.Channel],
		intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildMembers]
	});
	
	private TOKEN = process.env.DISCORD_TOKEN;

	async messajeGenerate() {
		this.client.on("ready", async (): Promise<any> =>{
			const channel: any = this.client.channels.cache.get(
				CONSTANTS.DISCORD_CHANNELS_ID.RULES
			);
			const msj =
				await  channel.send(`Bienvenidos @everyone a psychedelic_humor! Los invitamos a leer el reglamento del servidor, para mantener un ambiente cálido y agradable para todo el mundo.
			Recuerde que el servidor es para usted y para compartir entre todos
			
			- Prohibido usar tag para etiquetar rangos. Solo se puede etiquetar personas.
			- No insultar a otros miembros del servidor, el respeto es la base de la convivencia.
			- No haga amenazas, hostigue, intimide y/o invada la privacidad de otros usuarios.
			- El SPAM de cualquier tipo está prohibido, los streamers tienen su propio canal para compartir su contenido.
			- Publicar contenido en el canal correspondiente
			- No comparta información personal o explícita que ponga en riesgo su seguridad.
			- Están terminalmente prohibidos los comentarios que inciten al odio.
			- No se permite comercialización de ningún tipo.
			- No se permite contenido sexual o violento de ningún tipo.
			
			Si tiene alguna duda o reclamo sobre otro miembro, puede enviar un mensaje a cualquier ADMIN, que están para mantener el orden y la paz en el servidor
			
			Recuerde que evadir o romper cualquiera de estas reglas lo llevará a ser baneado o expulsado temporalmente del servidor sin previo aviso. Las reglas aplican para todos los miembros del servidor por igual. Por favor reaccionar al leer las reglas.
			
			**Reacciona a este mesaje con " :thumbsup: " para ver todos los canales**
	
			Atte: La Administración`);
			await msj.react("👍");
		});
	}

	async reactionRegister(botname:string){
		this.client.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
			console.log(botname);
			const emoji:Emoji= reaction.emoji
			const strEmoji:string = emoji.toString();
			const mensajeID = CONSTANTS.DISCORD_MESSAGE_ID.REGLAS;
			const roleId = CONSTANTS.DISCORD_ROLES_ID.USERS;
			console.log(`El emoji que es uso es ${emoji}`);
			if (reaction.message.id === mensajeID && strEmoji == "👍") {
				const guild:any = reaction.message.guild;
				const member = await guild.members.fetch(user.id);
				const role = guild.roles.cache.get(roleId);
				if (!role) {
					console.error(`❌ Role with ID ${roleId} not found`);
					return;
				}
		
				const userData = new UserData.User();
				const userNameDc = user.username;
				const userPayload: IUser = {
					user_id_dc: `${user.id}`,
					user_name: `${userNameDc?.replace(/\s+/g,"_")}#${user.discriminator}`,
					user_note: "",
					user_token: "",
					cdcCreateDt: userData.FECHA,
					cdcUpdateDt: userData.FECHA,
					cdcCreateUser: botname,
					cdcUpdateUser: botname,
				};
				
				const dataExisist = await userData.getUserById(
					"user_id_dc",
					userPayload.user_id_dc
				);
				const sendMsj:any = reaction.message.channel;
				if (dataExisist.statusCode === 404) {
					const result = await userData.postUser(userPayload);
					if (result.status) {
						console.log(`✅ ${user.username}#${user.deleteDM}, has sido registrado con éxito.`);
						await sendMsj.send(`✅ Has sido registrado con exito  `);
					} else {
						console.log("❌ error en el registro");
						await sendMsj.send(`❌ error en el registro"`);
						console.error(result.data);
					}
				} else {
					console.log("⚠ Ya estas registrado");
					await sendMsj.send(`⚠ Ya estas registrado`);

					
				}
				
		
				member.roles.add(role).catch((error:any) => {
					console.error('❌ Error al asignar el rol:', error);
				});
			}
		});
		this.client.login(this.TOKEN);
	}

	async welcomeServer(){
		this.client.on('guildMemberAdd',(member:GuildMember)=>{
			const welcomeEmbed = new EmbedBuilder()
				.setTitle(`Bienvenido ${member.user.username}`)
				.setDescription(`¡Bienvenido a esta cagada de servidor, ${member}! `)
				.setColor('Green')
				.setImage('https://usagif.com/wp-content/uploads/2021/4fh5wi/troll-face-44.gif')
				.setThumbnail(member.user.displayAvatarURL({size:128}));

			if (member.guild.banner) {
				welcomeEmbed.setDescription(
					`¡Bienvenido a nuestro servidor, ${member}!\n\n${member.guild.name} tiene un banner de servidor:\n${member.guild.bannerURL()}`
				);
				}
			
				const welcomeChannel:any = member.guild.channels.cache.find(
				(channel) => channel.name === '🏠welcome'
				);
			
				if (welcomeChannel) {
				welcomeChannel.send({ embeds: [welcomeEmbed] });
				}

		})
	}

}











