import AppError from '../../common/utils/appError.js'
import { AppResponse } from '../../common/utils/appResponse.js'
import { catchAsync } from '../../common/utils/errorHandler.js'
import { signData } from '../../common/utils/helper.js'
import { ENVIRONMENT } from '../../common/config/environment.js'
import { findUser, updateUser } from '../user/user.service.js'
import { createNewUser, loginUser } from './auth.service.js'
import { EntityTransformer } from '../../common/transformers/entityTransformer.js'

// Signup route
export const httpSignUp = catchAsync(async (req, res) => {
    // Extract user data from request body
    const { username, email, password } = req.body

    // Validate user data
    if (!username || !email || !password) {
        throw new AppError('All fields are required', 400)
    }

    // Check if user already exists in the database
    const existingUser = await findUser('email', email)
    if (existingUser) {
        throw new AppError('User already exists', 409)
    }

    // Create a new user object
    const newUser = await createNewUser({
        username,
        email,
        password,
        lastLogin: new Date(),
    })
    const accessToken = signData({ id: newUser.id }, ENVIRONMENT.JWT.ACCESS_KEY)
    // Return success response
    return AppResponse(
        res,
        201,
        { userDetails: EntityTransformer(newUser), accessToken },
        'Signup successful'
    )
})

export const httpLogin = catchAsync(async (req, res) => {
    // Extract user data from request body
    const { email, password } = req.body

    // Validate user data
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await loginUser(email, password)
    const accessToken = signData(
        { id: user.id },
        ENVIRONMENT.JWT.ACCESS_KEY,
        ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
    )
    const updatedUser = await updateUser(user.id, {
        lastLogin: new Date(),
    })
    const userDetails = EntityTransformer(updatedUser)
    // Return success response
    return AppResponse(
        res,
        200,
        { userDetails, accessToken },
        'Login successful'
    )
})
