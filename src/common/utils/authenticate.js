// import { findUser } from '../../modules/user/user.service.js';
import { User } from '../../modules//user/user.schema.js';
import AppError from './appError.js';
import { decodeData, signData } from './helper.js';
import { ENVIRONMENT } from '../config/environment.js';
import jwt from 'jsonwebtoken';

export async function authenticate(accessToken, refreshToken) {
  if (!refreshToken) {
    throw new AppError('Unauthorized', 401);
  }
  const handleUserVerification = async (decoded) => {
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new AppError(`This user doesn't exist`, 404);
    }
    if (currentUser?.refreshToken !== refreshToken) {
      throw new AppError('Invalid token, Please log in again', 401);
    }
    return currentUser;
  };
  const handleAccessTokenRefresh = async () => {
    const decodedRefreshToken = decodeData(refreshToken, ENVIRONMENT.JWT.REFRESH_KEY);
    const currentUser = await handleUserVerification(decodedRefreshToken);
    const newAccessToken = signData(
      { id: currentUser.id },
      ENVIRONMENT.JWT.ACCESS_KEY,
      ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
    );
    if (newAccessToken) {
      return { newAccessToken, currentUser };
    }
    return { currentUser };
  };
  try {
    if (!accessToken) {
      return await handleAccessTokenRefresh();
    }
    const decodedAccessToken = decodeData(accessToken, ENVIRONMENT.JWT.ACCESS_KEY);
    const currentUser = await handleUserVerification(decodedAccessToken);
    return { currentUser };
  } catch (error) {
    if (
      (error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError ||
        error instanceof AppError) &&
      refreshToken
    ) {
      return await handleAccessTokenRefresh();
    } else {
      console.log(error);
      throw new AppError('Session Expired, please log in again', 401);
    }
  }
}
