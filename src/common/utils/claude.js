import pdf from 'pdf-lib'
import axios from 'axios'

class MCQGenerator {
    constructor(openaiApiKey) {
        this.openaiApiKey = openaiApiKey
    }

    async extractTextFromPDF(pdfData) {
        const pdfDoc = await pdf.Document.load(pdfData)
        const pages = pdfDoc.getPages()
        let text = ''
        for (const page of pages) {
            text += await page.getTextContent()
        }
        return text
    }

    async generateMCQs(text, numQuestions, options = {}) {
        const { focusArea, difficultyLevel = 'medium', examples = [] } = options

        const defaultExamples = [
            'What is the main idea of the first paragraph?',
            'Which of the following statements is supported by evidence in the passage?',
            "What is the author's argument in this section?",
        ]

        const prompt = `This is a passage of text that focuses on ${focusArea || ''}. 

Please generate ${numQuestions} multiple choice questions with answer choices (including the correct answer) based on the information in the passage. 

The questions should be at a ${difficultyLevel} level and focus on testing the reader's understanding of the key concepts. 

${examples.length ? `Here are some examples of what the questions could look like:\n${examples.join('\n')}\n` : defaultExamples.join('\n')}`

        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                engine: 'text-davinci-003',
                prompt,
                max_tokens: 1024,
                n: 1,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.openaiApiKey}`,
                },
            }
        )

        return this.parseMCQsFromResponse(response.data.choices[0].text)
    }

    parseMCQsFromResponse(mcqText) {
        const mcqs = []
        const lines = mcqText.split('\n\n')
        for (const line of lines) {
            if (!line.trim()) continue
            const parts = line.split('\n')
            const question = parts[0]
            const choices = parts.slice(1)
            mcqs.push({ question, choices })
        }
        return mcqs
    }
}

export default MCQGenerator
