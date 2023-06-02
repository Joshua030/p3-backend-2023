import { Request, Response, Router } from "express";
import prisma from "./prisma-client.js";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) return res.status(200).send("{No users founded}");
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;