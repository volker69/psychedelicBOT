
//import { IUser } from "../interface/interface.user";
import { knex } from "./conexion";
import { formatDate } from "../helpers/helpers";
import { IUser } from "../interface/interface.user";
import { IResult } from "../interface/inteface.result";




export class User{
    
    FECHA = formatDate(new Date);
   
    async getUsers():Promise<IResult> {
        try {
            let result:any = await knex('User').select('*');            
            return {status:true,statusCode:200,data:result};
        } catch (error:any) {
            return {status:false,statusCode:500,data:error};
        }
    }
    
    async getUserById(id:number):Promise<IResult>{
        
        try {
            
            let result:any = await knex('User').select('*').where('user_id',id);
            if (result.length == 0) {
                return {status:false,statusCode:404,data:result};
            } else {
                return {status:true,statusCode:200,data:result};
            }
            
        }catch(error:any){
            console.log(error);
            return {status:false,statusCode:500,data:error};
        }
    }
    
    async postUser(data:IUser):Promise<IResult>{
        
        try {     
            let result:any =  await knex('User').insert(data);        
            return {status:true,statusCode:200,data:result};
        }catch(error:any){
            return {status:false,statusCode:500,data:error};
        }
    }
    
    async updateUser(data:any,usr:string):Promise<IResult> {
        try {
            const id:any = data.user_id;
            const currentElement:any = await this.getUserById(id);            
            currentElement.data = '404 not found'
            if (!currentElement.status) {
                return {status:false,statusCode:404,data:currentElement.data};
            }

            const currentData:IUser = (currentElement.data[0] as IUser);

            currentData.user_id = data.user_id;
            currentData.user_id_dc = data.user_id_dc;
            currentData.user_name = data.user_name;
            currentData.user_note = data.user_note;
            currentData.user_token = data.user_token;
            currentData.cdcCreateDt = currentElement.cdcCreateDt;
            currentData.cdcCreateUser = currentElement.cdcCreateUser ;
            currentData.cdcUpdateDt = this.FECHA;
            currentData.cdcUpdateUser = usr;

            let result:any = await knex('User').where({user_id:data.user_id}).update(currentData);
            return {status:true,statusCode:200,data:result};
        }catch(error:any){
            return {status:false,statusCode:500,data:error};
        }
    }
    
    async deleteUser(id:number):Promise<IResult>{
        
        try {            
            let result:any = await knex('User').where({user_id:id}).del();
            const currentElement:any = await this.getUserById(id);            
            currentElement.data = '404 not found'
            if (!currentElement.status) {
                return {status:false,statusCode:404,data:currentElement.data};
            }
            return {status:true,statusCode:200,data:result};
        }catch(error:any){
            return {status:false,statusCode:500,data:error};
        }
    }
}


