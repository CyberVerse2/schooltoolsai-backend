import { authenticate } from '../utils/authenticate.js';
import { catchAsync } from '../utils/errorHandler.js';
import { setCookie } from '../utils/helper.js';

export const protect = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } =
    req.cookies ||
    req.headers['cookie'].split(';').reduce((res, c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      try {
        return Object.assign(res, { [key]: JSON.parse(val) });
      } catch (e) {
        return Object.assign(res, { [key]: val });
      }
    }, {});
  const { currentUser, newAccessToken } = await authenticate(accessToken, refreshToken);
  if (newAccessToken) {
    setCookie(res, 'accessToken', newAccessToken, { maxAge: 15 * 60 * 1000 });
  }
  if (currentUser) {
    req.user = currentUser;
  }
  next();
});
