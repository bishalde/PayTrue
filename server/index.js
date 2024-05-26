const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const axios = require('axios');
var morgan = require('morgan')
const path = require('path')
const cors = require('cors');


const RegisterUser =  require('./routes/registerUser')
const Transactions = require('./routes/transactionProcess')
const FixedDeposit = require('./routes/fixedDeposit')
const Login = require('./routes/login')
const GetBalance = require('./routes/getBalance')
const GetUserData = require('./routes/getUserData')
const Upipayments = require('./routes/GetUpipayments')
const Upidata = require('./routes/getUpiData')
const GetGraphs = require('./routes/getGraphData')
const ReadSms = require('./routes/readSms')
const Manual = require('./routes/manual')
const GeneratePdf = require('./routes/generatepdf')
const AffliatesData = require('./routes/affliatesData')


require('dotenv').config()

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

const app = express()

app.use('/data', express.static(path.join(__dirname, 'data')));
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))


app.get('',(req,res)=>{
    const message = {
        status: 200,
        message: 'Welcome To FinWise API'
    }
    res.status(200).send(message)
})


app.post('/api/financial-advisor', async (req, res) => {
    try {
        const userQuestion = req.body.question;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { "role": "system", "content": "You are a knowledgeable financial advisor." },
                { "role": "user", "content": userQuestion }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API}`,
                'Content-Type': 'application/json'
            }
        });

        const generatedAnswer = response.data.choices[0].message.content;
        res.json({ answer: generatedAnswer });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



app.use('/api/login',Login)
app.use('/api/register',RegisterUser)
app.use('/api/transactions',Transactions)
app.use('/api/fixeddeposite',FixedDeposit)
app.use('/api/balance',GetBalance)
app.use('/api/userdata',GetUserData)
app.use('/api/upipayments',Upipayments)
app.use('/api/getUpiData',Upidata)
app.use('/api/getGraphs',GetGraphs)
app.use('/api/readsms',ReadSms)
app.use('/api/manual',Manual)
app.use('/api/generatepdf',GeneratePdf)
app.use('/api/affliates',AffliatesData)





const connectToDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
        })
        .then(
            app.listen(PORT,()=>{
                console.log(`PayTrue API is running on : http://localhost:${PORT}`)
            }
        ))
        .then(console.log('MongoDB Connected'))
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectToDB()