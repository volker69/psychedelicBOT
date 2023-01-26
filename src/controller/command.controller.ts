import { MakeComand } from "../helpers/makeCommands";
import { ICommand } from "../interface/interface.command";
import { Request, Response } from "express";
async function postCommand(req: Request, res: Response): Promise<Response> {
	try {
		const mkCommand = new MakeComand();
		const setCommand: ICommand = {
			name: req.body.name,
			description: req.body.description,
		};

		const result = await mkCommand.buidCommands(setCommand);
		const response: any =
			result.statusCode === 200
				? res.status(200).json(result)
				: res.status(500).json(result);
        return response;
	} catch (error) {
        console.error(error);
		return res.status(500).send(error);
    }
}

export default {postCommand}
