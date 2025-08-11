 import express from "express";
 import verfiyToken from "../../../utils/verfiytoken.js";
 import {getAllUsers, getUserById, updateUser, deleteUser } from "../Users/user.controller.js";

 const userRouter = express.Router();

 userRouter.get("/get-all-users", verfiyToken, getAllUsers);
 userRouter.get("/get-user/:id", verfiyToken, getUserById);
 userRouter.put("/update-user/:id", verfiyToken, updateUser);
 userRouter.delete("/delete-user/:id", verfiyToken, deleteUser);


 export default userRouter;
