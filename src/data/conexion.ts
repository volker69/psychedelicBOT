import Knex from "knex";
import { db_conex } from "../db/db_mysql";

export const knex = Knex(db_conex);