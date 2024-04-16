import FlashCard from '../flashcard/flashcard.schema.js'

export async function createFlashCard(body) {
    return await FlashCard.create(body)
}

export async function getFlashCardById(id) {
  return await FlashCard.findById(id)
}

export async function deleteFlashCard(id) {
  return await FlashCard.findByIdAndDelete(id)
}

