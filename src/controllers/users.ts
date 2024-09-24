import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deleteUser = await deleteUserById(id);
    return res.status(200).json(deleteUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userName } = req.body;
    const { id } = req.params;

    if (!userName || !id) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    user.userName = userName;
    await user.save();

    return res.status(200).json(user).end();

  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
