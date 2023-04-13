import Express, { response } from "express";
import { Configuration, OpenAIApi } from "openai";
import cors from 'cors';

const app = Express();
app.use(Express.json());
app.use(cors());

// organization: "org-lKygmJm61yAW0x2Pv9ogiaMw",
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();
// console.log(response,"response here")

// const response = await openai.createCompletion({



app.get('/ping', (req, res) => {
    res.json({
        message: "Pong"
    })
})
app.post('/chat', (req, res) => {
    const { question } = req.body;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 4000,
        temperature: 0,
    }).then((response) => {
        // console.log(response.data, "response here")
        return response?.data?.choices?.[0]?.text
    }).then((answer) => {
        // console.log(answer,"check answer")
        const array = answer?.split("/n").filter(value => value).map(value => value.trim());
        return array;
    }).then((answer) => {
        res.json({
            answer: answer,
            prompt: question
        })
    })
})

app.listen(8000, () => {
    console.log("Server is listening on 8000")
})