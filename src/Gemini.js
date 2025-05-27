let apikey = "AIzaSyBFAY8vvXNQn-q7xS5uKJrMrl_d7V0ipqE";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apikey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 45,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  let cleanedResponse = result.response.text().replace(/\*/g, "");

  return cleanedResponse;
}

export default run;
