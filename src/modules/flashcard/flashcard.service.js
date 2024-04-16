import FlashCard from '../flashcard/flashcard.schema.js'

export async function createFlashCard(body) {
    return await FlashCard.create(body)
}


