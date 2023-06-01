import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./prisma-client.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.post('/', async(req, res) => {

  try {
    const newUser = await prisma.user.create({
      data: {
        name: 'Carlos',
        email: 'Carlos@prisma.io',
      },
    })
    console.log(newUser);
    
    res.send('POST request done')
  } catch (error) {
    console.log(error);
    
  }


})



const { SERVER_PORT } = process.env;
app.listen(SERVER_PORT, () => {
  console.log(`Forum API listening on :${SERVER_PORT}`);
});