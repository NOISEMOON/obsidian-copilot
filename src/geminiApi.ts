import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, InputContent } from '@google/generative-ai';
import { ChatMessage } from '@/sharedState';

const MODEL_NAME = "gemini-pro";
const historySample = [
    {
        role: "user",
        parts: [{ text: "翻译 last resort" }],
    },
    {
        role: "model",
        parts: [{ text: "最后手段" }],
    },
    {
        role: "user",
        parts: [{ text: "为什么" }],
    },
    {
        role: "model",
        parts: [{ text: "" }],
    },
];

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

export async function chatGemini(API_KEY: string, prompt: string, chatMessages: ChatMessage[]) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const history: InputContent[] = chatMessages.map((chatMessage: ChatMessage) => {
        return {
            role: chatMessage.sender,
            parts: [{ text: chatMessage.message }],
        };
    });
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: history,
    });
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
}