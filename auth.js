import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'
const app = express();

const secretAccessToken = "Yurp"
const secretRefreshToken = "Yurpie";

const users = [
    {
        id: uuidv4(),
        email: "jangoy@gmail.com",
        password: "jangoy123",
        role: "admin"
    },
    {
        id: uuidv4(),
        email: "jthomas@gmail.com",
        password: "jthomas123",
        role: "admin"
    },
    {
        id: uuidv4(),
        email: "gscott@gmail.com",
        password: "gscott123",
        role: "member"
    },
    {
        id: uuidv4(),
        email: "rsmith@gmail.com",
        password: "rsmith123",
        role: "member"
    },
]

var refreshTokens = []
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send(`Create an account and/or login to get connected!!!`)
});

app.post('/create', (req, res) => {
    let user = {
        id: uuidv4(),
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }

    users.push(user)
    console.log(users)
    res.send(users)
})

app.post('/login', (req, res) => {
    let { email, password } = req.body
    let user = users.find((account) => account.email === email && account.password === password)
    if (user) {
        const accessToken = jwt.sign({email: user.email, role: user.role}, secretAccessToken, {expiresIn: '20m'})
        const refreshToken = jwt.sign({email: user.email, role: user.role}, secretRefreshToken)

        refreshTokens.push(refreshToken)
        res.json({
            accessToken,
            refreshToken
        })
    } else {
        res.send(`We could not authenticate your credentials...Please try again...`)
    }
});

app.post('/logout', (req, res) =>{
    let { token } = req.body;
    refreshTokens = refreshTokens.filter((token) => token !== token)
    res.send('Logout Successful...Make it Happen!')
})


const port = 2222;
app.listen(port, (req, res) => {
    console.log("Authentication Server Up and Running boss!")
})