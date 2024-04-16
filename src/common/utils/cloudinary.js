import { ENVIRONMENT } from "../config/environment.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "./appError.js";

cloudinary.config({
  cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
  api_key: ENVIRONMENT.CLOUDINARY.API_KEY,
  api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET,
});

export function validateImage(file) {
  console.log(file);
  const allowedImageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
  ];
  if (!allowedImageMimeTypes.includes(file.mimetype)) {
    throw new AppError("Invalid Image type", 400);
  }
}

export function uploadFile(area, file) {
  try {
    return new Promise((resolve, reject) => {
      validateImage(file);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: `${area}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  } catch (error) {
    throw new AppError("Error in uploading profile picture", 500);
  }
}

export default cloudinary;
