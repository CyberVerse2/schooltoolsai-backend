import { User } from '../user/user.schema.js'
import AppError from '../../common/utils/appError.js'

export async function findUser(field, value) {
    return await User.findOne({ [field]: value })
}

export async function getQuizzes(userId) {
    const user = await User.findById(userId)
        .populate({
            path: 'quizzes',
            model: 'Quiz',
            populate: {
                path: 'questions',
            },
        })
        .sort({ createdAt: -1 })
    return user.quizzes
}

export async function updateUser(id, body) {
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true })
    if (!updatedUser) throw new AppError('Error in updating the user')
    return updatedUser
}

export async function deleteUser(id) {
    const deletedUser = await User.findById(id)
    deletedUser.isDeleted = true
    await deletedUser.save()
}
