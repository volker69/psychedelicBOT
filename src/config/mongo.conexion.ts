import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

/* const dbOption ={
    useNewUrlParser:true,
    useUnifiedTopology:true
} */

mongoose.connect(`${process.env.MONGO_URI}`);

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log(`✅ conexion establecida con Mongodb`);
});

connection.on('error',err => {
    console.error(`❌ error en la conexion de Mongo: \n ${err}`);
   // process.exit(0);
})

