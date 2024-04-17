import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
        },
        answers: [
            {
                type: String,
                required: true,
            },
        ],
        correctAnswer: Number,
    },
    { timestamps: true }
)

const Question = mongoose.model('Question', questionSchema)

export default Question
