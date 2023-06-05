import { Request, Response, Router } from "express";
import prisma from "./prisma-client.js";
import isValidEmail from "../helpers/emailCheck.js";


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

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId)
  if (isNaN(userId)) return res.status(400).send ('Id must be a Number!');
 
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId ,
      },
    });
    if (!user) return res.status(404).send("{No user founded}");
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/', async (req: Request, res: Response) => {
  const {email,name} = req.body
  if (!email) return res.status(400).send ('email must be provided!');
  if(!isValidEmail(email)) return  res.status(400).send ('email not valid');
  try {
    const user = await prisma.user.findUnique({
      where: {
        email 
      },
    });
    if (user) return res.status(404).send("{User is already created}");
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    })
    res.status(200).json({ message: `User ${newUser.name} was Created` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  const {email,name} = req.body
  if (!email) return res.status(400).send ('email must be provided!');
  if(!isValidEmail(email)) return  res.status(400).send ('email not valid');
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        email 
      },
    });
    if (!user) return res.status(404).send("{User is not created}");
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
      },
    })

    res.status(200).json({ message: `User ${updateUser.name} was Updated` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  const {email} = req.body
  if (!email) return res.status(400).send ('email must be provided!');
  if(!isValidEmail(email)) return  res.status(400).send ('email not valid');
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        email 
      },
    });
    if (!user) return res.status(404).send("{User is not created}");
    
const deleteUser = await prisma.user.delete({
  where: {
    email,
  },
})

    res.status(200).json({ message: `User ${deleteUser.name} was Updated` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;