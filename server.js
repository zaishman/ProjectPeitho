//loading main used tools
const express = require('express'); //helps make server
const Anthropic = require('@anthropic-ai/sdk'); //sdk that talks directly to claude
require('dotenv').config(); //reads the env
console.log("API KEY LOADED:", process.env.API_KEY);

const app = express();
app.use(express.json());
app.use(express.static('.'));
//tells it to understand json data + loads project

const anthropic = new Anthropic({ apiKey: process.env.API_KEY });
//client to communitcate with anthropic, hides API

//routes the frotend and backend, essentially answers the fetch(/chat)

//get fetches response, not awaits one and sends it over
app.get('/topic', async (req, res) => {
    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: 'Provide me with just a random debate topic, make it simple, yet thought provoking and discussion worthy; while also making it reflect real world problems and ethics. Take sources from international debate clubs, and derive the debate themes and premise around that. So, educational, well-rounded, and debateable. Reply only with the topic, and NO explainations or punctuations at the end- refrain from emojis and symbols.'
            }]
        });
        res.json({topic: response.content[0].text});
            //message that the frontend sends, and response with res.json
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    app.listen(3000, () => console.log('Running on http://localhost:3000'));

async function askClaude(userMessage) {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: userMessage }]
        })
    });
    const data = await response.json();
    return data.content[0].text;
}

    //sends message user sends, and tells claude to accept the content