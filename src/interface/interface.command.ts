import { ApplicationCommandOption } from "discord.js";

export interface ICommand{
    name:string,
    description:string,
    options?: ApplicationCommandOption[];
}
