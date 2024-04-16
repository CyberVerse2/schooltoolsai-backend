import mongoose from 'mongoose'

const flashCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  { timestamps: true }
)

const FlashCard = mongoose.model('FlashCard', flashCardSchema)

export default FlashCard
