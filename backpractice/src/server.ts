import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./prisma-client.js";
import users from "./users.js";

interface Post {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", users);


app.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1"
    );
    const data = await response.json();

    if (data.length > 0) {
      const post: Post = data[0];

      const existingPostDetails = await prisma.postDetails.findUnique({
        where: { postId: post.date },
      });

 

      if (!existingPostDetails) {
      
        const result = await prisma.post.create({
          data: {
            date: post.date,
            title: post.title,
            url: post.url,
            watched: true,
            userId: Number(userId),
            postDetails: {
              create: {
                explanation: post.explanation,
                hdurl: post.hdurl,
                media_type: post.media_type,
                service_version: post.service_version,
              },
            },
          },
          include: {
            postDetails: true, // Include the post in the returned object
          },
        });
      }

            if (existingPostDetails) {
              const watchedPost = await prisma.post.findFirst({
                where: { date: post.date, userId: Number(userId), watched: true },
              });

              if (!watchedPost) {
                await prisma.post.update({
                  where: { date: post.date },
                  data: { watched: true },
                });
              }
      }
    }

    res.send("Data fetched and updated successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

const { SERVER_PORT } = process.env;
app.listen(SERVER_PORT, () => {
  console.log(`Forum API listening on :${SERVER_PORT}`);
});
