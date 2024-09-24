import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers";


export const login = async (req:express.Request,res:express.Response) =>{
  try{
    const {email,password }= req.body;
    if(!email||!password){
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if(!existingUser){
      return res.sendStatus(400);
    }
    const expectedHash = authentication(existingUser.authentication.salt,password)
    if(existingUser.authentication.password != expectedHash){
      return res.sendStatus(403);
    }
    const salt = random();
    existingUser.authentication.sessionToken = authentication(salt,existingUser._id.toString())

    await existingUser.save()
    res.cookie('ANTONIO-AUTH',existingUser.authentication.sessionToken,{domain:'localhost',path:"/"})
    return res.status(200).json(existingUser)
  }catch(err){
    console.log(err);
    return res.sendStatus(400);
  }
}


export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();
    const user = await createUser({
      email,
      userName,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(201).json(user).end()
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
