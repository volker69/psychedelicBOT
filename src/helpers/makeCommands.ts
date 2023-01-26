import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { ICommand } from "../interface/interface.command";
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

	async buidCommands(command: ICommand): Promise<any> {
        try {
            const rest: REST = new REST({ version: "10" }).setToken(this.TOKEN);
            const commands:any = [
                {
                    name:command.name,
                    description: command.description,
                }
            ]
			//console.log("Comenzó a actualizar los comandos de la aplicación (/).");
			await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
				body: commands,
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

/* (async () => {
	try {
		console.log("Comenzó a actualizar los comandos de la aplicación (/).");

		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

		console.log("Comandos de aplicación (/) recargados con éxito.");
	} catch (error) {
		console.error(error);
	}
})(); */
