import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./prisma-client.js";

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


app.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    // Fetch data from NASA API
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1');
    const data = await response.json();

    if (data.length > 0) {
      const post:Post = data[0];

      // Check if PostDetails already exists
      const existingPostDetails = await prisma.postDetails.findUnique({
        where: { postDate: post.date },
      });

      if (!existingPostDetails) {
        // Create PostDetails if it doesn't exist
        const newPostDetails = await prisma.postDetails.create({
          data: {
            postDate: post.date,
            explanation: post.explanation,
            hdurl: post.hdurl,
            media_type: post.media_type,
            service_version: post.service_version,
            postId: null, // This will be updated later
          },
        });

        // Associate PostDetails with a Post
        await prisma.post.update({
          where: { id: postId },
          data: { postDetails: { connect: { id: newPostDetails.id } } },
        });
      }

      // Check if the user has watched the Post
       // Assuming you have user authentication implemented
      const watchedPost = await prisma.post.findFirst({
        where: { id: postId, userId, watched: true },
      });

      if (!watchedPost) {
        // Update watched status if the user hasn't watched the Post
        await prisma.post.update({
          where: { id: postId },
          data: { watched: true },
        });
      }
    }

    res.send('Data fetched and updated successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});



const { SERVER_PORT } = process.env;
app.listen(SERVER_PORT, () => {
  console.log(`Forum API listening on :${SERVER_PORT}`);
});