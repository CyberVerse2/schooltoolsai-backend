import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
    {
        flashCardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        },
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const Card = mongoose.model('Card', cardSchema)

export default Card