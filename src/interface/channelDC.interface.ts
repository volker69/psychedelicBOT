import { IBase } from "./interface.base";

export interface IChannesDC extends IBase {
	channelDc_id?: number;
	server_id_fk: number;
	channelDc_id_dc: string;
	channelDc_name: string;
}
