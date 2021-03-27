const express = require('express');
const jwt = require('jsonwebtoken');
const LocalStorage = require('node-localstorage').LocalStorage;
const { isLogin, isNotLogin } = require('./middleware');
const {User, Post, Comment} = require('../models');

localStorage = new LocalStorage('./scratch');

const router = express.Router();

router.get('/',(req, res)=>{
    const token = localStorage.getItem("token");
    if(token){
        try{
            const user = jwt.verify(token, process.env.TOKEN_SECRET);
            return res.render('index.html',{user});
        }catch(error){
            if(error.name == 'TokenExpiredError'){
                console.error('TokenExpiredError');
                return res.render('index.html');
            }
        }
    }
    res.render('index.html');
});

router.get('/join', (req, res)=>{
    res.render('join.html');
});

router.get('/login', (req, res)=>{
    res.render('login.html');
});

router.get('/test', (req, res)=>{
    res.send(localStorage.getItem('token'));
});

router.get('/logout',(req, res)=>{
    localStorage.clear();
    res.send('logged out');
});

router.get('/posts', async (req, res)=>{
    let user;
    const posts = await Post.findAll({
        include:{
            model: User,
            attributes: ["id", "nick"],
        },
        order: [["createdAt", 'DESC']],
    });
    
    try{
        const token = localStorage.getItem("token");
        user = jwt.verify(token, process.env.TOKEN_SECRET);
    }catch(error){
        if(error.name == 'TokenExpiredError'){
            console.error('TokenExpiredError');
            user = {
                nick: "SomeBody",
            }
        }
    }
    
    res.render('post.html',{
        user: user,
        posts: posts,
    });
});

router.post('/posts/:id', async (req, res)=>{
    const token = localStorage.getItem("token");
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const {content} = req.body;
    await Comment.create({
        nick: user.nick,
        content,
        PostId: req.params.id,
        UserId: null,
    });
});

router.post('/posts/:id/user/:user', async (req, res)=>{
    const token = localStorage.getItem("token");
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const {content} = req.body;
    await Comment.create({
        nick: user.nick,
        content,
        PostId: req.params.id,
        UserId: req.params.user,
    });
});

router.get('/write',(req, res)=>{
    res.render('write');
});

module.exports = router;