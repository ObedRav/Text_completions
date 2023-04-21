const PORT = 8000;
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());


app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message}],
            temperature: 0
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options )
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
    })

app.listen(PORT, () => console.log(`Your server is running on ${PORT}`))