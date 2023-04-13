import { REST, Routes } from "discord.js";
import { ICommand } from "../interface/interface.command";


import * as dotenv from "dotenv";
dotenv.config();
export class MakeComand {
	private TOKEN: any = process.env.DISCORD_TOKEN;
	private CLIENT_ID: any = process.env.CLIENT_ID;
	/* commands = [
		{
			name: "register",
			description: "Este comando permite registrar al usuario al servidor",
		},
	]; */

	async buidCommands(newCommand:Array<ICommand>): Promise<any> {
        try {
			const rest: REST = new REST({ version: "10" }).setToken(this.TOKEN);
			
			console.log(`tipo de dato `,newCommand[0]);

			await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
				body: newCommand,
			});
			return {
				message: "Comandos de aplicación (/) recargados con éxito.",
				status: true,
				statusCode: 200,
			}; 

			//console.log("Comandos de aplicación (/) recargados con éxito.");
		} catch (error) {
			console.error(error);
			return {
				message: error,
				status: false,
				statusCode: 500,
			}; 
		}
	}
}

