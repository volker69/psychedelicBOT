import { IBase } from "./interface.base";

export interface IUser extends IBase{
    user_id?:number,
    user_id_dc:string,
    user_name:string,
    user_token:string
    user_note:string
}

