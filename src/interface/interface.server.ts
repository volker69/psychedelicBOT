import { IBase } from "./interface.base";

export interface IServer extends IBase {
	server_id?: number;
	server_id_dc: string;
	server_name: string;
}
