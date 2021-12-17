import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'
const app = express();

const secretAccessToken = "Yurp"

app.use(bodyParser.json())

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(JSON.stringify(req.headers));
    console.log(JSON.stringify(req.body));
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretAccessToken, (err, user) => {
            if (err) {
                res.sendStatus(403);
            }
            req.user = user;
            next()
        })
    } else {
        res.sendStatus(401)
    }
 
}



var posts = [
    {
        id: 0,
        title: "I'm Here to Stay!",
        body: "This is History in The Making!"
    },
    {
        id: 1,
        title: "Love you Boogie!",
        body: "You might say cousin, but I will always say brother!"
    },
    {
        id: uuidv4(),
        title: "Role Model",
        body: "You've taught me a lot of what to be and not to be like!"
    },
    {
        id: uuidv4(),
        title: "Hoffa",
        body: "My ace in the hole...My guy!"
    }
]



app.get('/posts', authenticateJWT, (req, res) => {
    res.send(posts)
});

app.get('/post', authenticateJWT, (req, res) => {
    let id = req.body.id
    let foundPost = posts.find(post => post.id === id)
    res.send(foundPost)
});

app.post('/post', authenticateJWT, (req, res) => {
    let { role } = req.user;
    if (role !== 'admin') {
        res.sendStatus(403)
    }
    posts.title = req.body.title;
    posts.postBody = req.body.postBody;

    let post = {
        id: uuidv4(),
        title: req.body.title,
        postBody: req.body.postBody
    }

    posts.push(post);
    console.log(post)
    res.send(posts)


});

app.delete('/post', authenticateJWT, (req, res) => {
    let { role } = req.user;
    if (role !== 'admin'){
        res.sendStatus(403)
    }

    let id = req.body.id
    let deleteThisPost = posts.filter((post) => post.id !== id)
    posts = deleteThisPost
    res.send(posts)
});

app.patch('/post', authenticateJWT, (req, res) => {
    let id = req.body.id;
    console.log(id)
    let editPost = posts.find((post) => post.id === id)
    console.log(editPost)
    editPost.title = req.body.title;
    editPost.body = req.body.postBody
    
    editPost = {...posts[id], ...editPost}
    res.send(posts)
})





const port = 3333;
app.listen(port, (req, res) => {
    console.log("Let's Get It!")
})