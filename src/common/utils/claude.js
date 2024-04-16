import { Configuration, Client } from "@anthropic-ai/sdk"
import { getDocument } from 'pdfjs-dist'

class Claude3Model {
    constructor() {
        const configuration = new Configuration({
            apiKey: 'your_anthropic_api_key_here',
        })
        this.client = new Client(configuration)
        this.BATCH_SIZE = 5 // Number of paragraphs to process per batch
    }

    async generateFlashcards(
        pdfBuffer,
        pageRange = { start: 1, end: 0 },
        numFlashcardsPerParagraph = 3,
        topicCategories = []
    ) {
        const flashcards = []

        // Load the PDF document
        const doc = await getDocument(pdfBuffer).promise

        // Extract text from the PDF, considering the specified page range
        const text = await this.extractPdfText(doc, pageRange)

        // Process the text in batches
        for (let i = 0; i < text.length; i += this.BATCH_SIZE) {
            const batch = text.slice(i, i + this.BATCH_SIZE)
            const batchFlashcards = await this.generateFlashcardsForBatch(
                batch,
                numFlashcardsPerParagraph,
                topicCategories
            )
            flashcards.push(...batchFlashcards)
        }

        return flashcards
    }

    async generateFlashcardsForBatch(
        batch,
        numFlashcardsPerParagraph,
        topicCategories
    ) {
        const flashcards = []

        for (const paragraph of batch) {
            try {
                const response = await this.client.completion({
                    prompt: `
Please generate ${numFlashcardsPerParagraph} high-quality flashcards based on the following text:

${paragraph}

Flashcard 1:
Question:
Answer:
Topic: ${topicCategories.length > 0 ? topicCategories.join(', ') : 'General'}

Flashcard 2:
Question:
Answer: 
Topic: ${topicCategories.length > 0 ? topicCategories.join(', ') : 'General'}

Flashcard 3:
Question:
Answer:
Topic: ${topicCategories.length > 0 ? topicCategories.join(', ') : 'General'}

The flashcards should be concise and capture the key concepts and information from the provided text. Please ensure the questions are clear and the answers are accurate and informative.
`,
                    maxTokens: 800,
                    n: 1,
                    temperature: 0.5,
                })

                const flashcardText = response.completions[0].text.trim()
                const individualFlashcards =
                    flashcardText.split('\n\nFlashcard ')

                for (let i = 1; i <= numFlashcardsPerParagraph; i++) {
                    const flashcard = individualFlashcards[i].split('\n')
                    const question = flashcard[1].replace('Question: ', '')
                    const answer = flashcard[2].replace('Answer: ', '')
                    const topic = flashcard[3].replace('Topic: ', '')

                    flashcards.push({
                        question,
                        answer,
                        topic,
                    })
                }
            } catch (error) {
                console.error('Error generating flashcards:', error)
            }
        }

        return flashcards
    }

    async extractPdfText(doc, pageRange) {
        const text = []

        for (
            let pageNum = pageRange.start;
            pageNum <= (pageRange.end || doc.numPages);
            pageNum++
        ) {
            const page = await doc.getPage(pageNum)
            const pageText = await page.getTextContent()
            text.push(...pageText.items.map((item) => item.str))
        }

        return text
    }
}

module.exports = { Claude3Model }
