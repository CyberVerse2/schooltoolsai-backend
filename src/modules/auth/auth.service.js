import { User } from "../user/user.schema.js";
import AppError from "../../common/utils/appError.js";
import { compareData } from "../../common/utils/helper.js";
import { findUser } from "../user/user.service.js";

export async function createNewUser(body) {
  const newUser = await User.create(body);
  await newUser.save();
  return newUser;
}

export async function loginUser(email, password) {
  const loginUser = await findUser("email", email);
  if (!loginUser) {
    throw new AppError("user with the email does not exist", 404);
  }

  // Check if password is correct
  const isPasswordCorrect = await compareData(password, loginUser.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 401);
  }

  return loginUser;
}
