import { GoogleGenerativeAI } from '@google/generative-ai'
import { PDFDocument } from 'pdf-lib'
import { ENVIRONMENT } from '../config/environment.js'
import { PdfReader } from 'pdfreader'
import AppError from './appError.js'

async function extractTextFromPDF(pdfData) {
    let extractedText = '' // Initialize an empty string to store the extracted text

    const parsePromise = new Promise((resolve, reject) => {
        new PdfReader().parseBuffer(pdfData, (err, item) => {
            if (err) {
                console.error(err)
                reject(err) // Reject the promise on error
            } else if (!item) {
                resolve(extractedText) // Resolve the promise with the extracted text when finished
            } else if (item.text) {
                extractedText += item.text + ' ' // Append extracted text with newline for readability
            }
        })
    })

    try {
        const text = await parsePromise
        return text
    } catch (error) {
        console.error('Error extracting text:', error)
        return null // Or throw an error if you prefer
    }
}

async function extractPDFTitleFromBuffer(buffer) {
    try {
        const pdfDoc = await PDFDocument.load(buffer)
        const info = pdfDoc.getTitle()
        return info || 'No Title Found'
    } catch (error) {
        console.error('Error processing PDF:', error)
        throw error // Re-throw for handling in the calling code
    }
}

class QuizGenerator {
    constructor() {
        this.geminiApiKey = ENVIRONMENT.GEMINI.API_KEY
        this.genAI = new GoogleGenerativeAI(this.geminiApiKey)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    }

    async generateQuiz(numberOfQuestions, buffer) {
        const pdfTitle = await extractPDFTitleFromBuffer(buffer)
        const pdfText = await extractTextFromPDF(buffer)
        if (!pdfText) {
            throw new AppError('Invalid PDF file')
        }
        const prompt = `you are a helpful assistant created to help students create multiple choice questions based on sample text sent.
    Based on the words here,make it readable and return ${numberOfQuestions} multiple choice questions and their answers in json format preferably.
    Here is the text:
    ${pdfText}
    `
        const result = await this.model.generateContent(prompt)
        const response = result.response
        const text = response.text()
        return {
            title: pdfTitle,
            questions: JSON.parse(text)?.questions,
        }
    }
}
export default QuizGenerator
// const newQuiz = new QuizGenerator()
// const questions = await newQuiz.generateQuiz(20, filePath)