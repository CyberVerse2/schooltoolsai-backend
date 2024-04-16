import { User } from "../user/user.schema.js";
import AppError from "../../common/utils/appError.js";

export async function findUser(field, value) {
  const user = await User.findOne({ [field]: value });
  return user;
}

export async function updateUser(id, body) {
  const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
  if (!updatedUser) throw new AppError("Error in updating the user");
  return updatedUser;
}

export async function deleteUser(id) {
  const deletedUser = await User.findById(id);
  deletedUser.isDeleted = true;
  await deletedUser.save();
}
