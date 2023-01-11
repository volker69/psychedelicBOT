import { Request, Response } from "express";
import { User } from "../data/user.data";
import { IUser } from "../interface/interface.user";

async function getUsersController(
	_req: Request,
	res: Response
): Promise<Response> {
	try {
		const user = new User();
		let result = await user.getUsers();
		if (result.status) {
			return res.status(200).json(result);
		} else {
			let response: any =
				result.statusCode == 404
					? res.status(404).json(result)
					: res.status(500).json(result);
			return response;
		}
	} catch (error) {
		return res.status(500).send({ status: false, statusCode: 500, data: error });
	}
}

async function getUserByIdController(
	req: Request,
	res: Response
): Promise<Response> {
	try {
		const user = new User();
		let id: any = req.params.id;
		let result = await user.getUserById(id);
		if (result.status) {
			return res.status(200).json(result);
		} else {
			let response: any =
				result.statusCode == 404
					? res.status(404).json(result)
					: res.status(500).json(result);
			return response;
		}
	} catch (error) {
		return res.status(500).send({ status: false, statusCode: 500, data: error });
	}
}

async function postUserController(
	req: Request,
	res: Response
): Promise<Response> {
	try {
		let usr = "Admin";
		let user = new User();
		let data: IUser = {
			user_id_dc: req.body.user_id_dc,
			user_name: req.body.user_name,
			user_note: req.body.user_note,
			user_token: req.body.user_token,
			cdcCreateDt: user.FECHA,
			cdcUpdateDt: user.FECHA,
			cdcCreateUser: usr,
			cdcUpdateUser: usr,
		};
		let result = await user.postUser(data);
		if (result.status) {
			return res.status(200).json(result);
		} else {
			return res.status(500).json(result);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ status: false, statusCode: 500, data: error });
	}
}

async function updateUserController(
	req: Request,
	res: Response
): Promise<Response> {
	try {
		let dataUpdate = req.body;
		let usr = "Admin";
		const user = new User();

		let result = await user.updateUser(dataUpdate, usr);
		if (result.status) {
			return res.status(200).json(result);
		} else {
			let response: any =
				result.statusCode == 404
					? res.status(404).json(result)
					: res.status(500).json(result);
			return response;
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
}

async function deleteUserController(
	req: Request,
	res: Response
): Promise<Response> {
	try {
		let id: any = req.params.id;
		let user = new User();
		let result = await user.deleteUser(id);
		if (result.status) {
			return res.status(200).json(result);
		} else {
			let response: any =
				result.statusCode == 404
					? res.status(404).json(result)
					: res.status(500).json(result);
			return response;
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
}

export default {
	getUsersController,
	getUserByIdController,
	postUserController,
	updateUserController,
	deleteUserController,
};
