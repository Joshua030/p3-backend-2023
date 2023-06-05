import { Request, Response, Router } from "express";
import prisma from "./prisma-client.js";
import isValidEmail from "../helpers/emailCheck.js";


const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const users = await prisma.user.findMany();
//     if (!users) return res.status(200).send("{No users founded}");
//     res.status(200).json({ data: users });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  if (isNaN(userId)) return res.status(400).send ('Id must be a Number!');
 
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
    });
    if (!user) return res.status(404).send("{User is not created}");
   
const posts= await prisma.user.findUnique({
  where: {
    id: userId,
  },
  include: {
    posts: {
      select: {
        title: true,
        createdAt: true,
        date: true,
        favourited: true,
        watched: true,
        url: true,
        comments: true
      },
    },
  },
});
    if (!posts) return res.status(404).send("{No watched post}");
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  const {userId,date} = req.body
  const id = Number(userId)
  if (isNaN(id)) return res.status(400).send ('Id must be a Number!');
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
    });
    if (!user) return res.status(404).send("{User is not created}");
    const updateUser = await prisma.user.update({
      where: {
        id
      },
      data: {
        posts: {
          updateMany: {
            where: {
              date 
            },
            data: {
              favourited: true,
            },
          },
        },
      },
      include: {
        posts: true,
      },
    });

    res.status(200).json({ message: `User ${updateUser.name} was Updated` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  const {userId,date} = req.body
  const id = Number(userId)
  if (isNaN(id)) return res.status(400).send ('Id must be a Number!');
 
  try {
      const user = await prisma.user.findUnique({
        where: {
          id
        },
      });
      if (!user) return res.status(404).send("{User is not created}");
    
const deleteUser = await prisma.post.delete({
  where: {
    id,
    date
  },
})

    res.status(200).json({ message: `post ${deleteUser.id} was Deleted` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;