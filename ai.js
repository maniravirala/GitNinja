import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import os from 'os';
import chalk from "chalk";

const configPath = `${os.homedir()}/.gitninjaconfig`;

let apiKey = '';
if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf-8');
    const match = config.match(/GEMINI_API_KEY=(.*)/);
    if (match && match.length > 1) {
        apiKey = match[1];
    }
    // console.log(apiKey);
}

const GenAi = new GoogleGenerativeAI(apiKey);

async function generateCommitMessage(diff) {
    try {
        const model = GenAi.getGenerativeModel({ model: 'gemini-pro' });
        const prompt =
            `
            Write a commit message for the following changes:\n
            ${diff}\n
            Please make the commit message clear and concise, following these guidelines:\n
            - Start with a brief summary describing the purpose of the commit.\n
            - Provide additional details about the changes made and their context.\n
            - Indicate the scope of the changes, such as which files or components were modified.\n
            if you are not sure what to write , just say this do not assume anything of yourself update changes from GitNinja\n
            and do not go out of the scope of the changes\n

            do not write like refer to docs or something like that only write the changes that is it\n`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return text
    } catch (error) {
        console.error(chalk.red('An error occurred while generating commit message:', error));
        process.exit(1);
    }
}

export { generateCommitMessage };


