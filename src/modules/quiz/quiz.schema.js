import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        count: String,
        score: Number,
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
    },
    { timestamps: true }
)

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz
