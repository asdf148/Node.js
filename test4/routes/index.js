const express = require('express');
const { User, Post } = require("../models");
const { isLogin, isNotLogin } = require('./middlewares');

const router = express.Router();

// router.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });

router.get('/',(req, res)=>{
    res.render('index', {
        isNotLogin: req.user,
    });
});

router.get('/join', (req, res)=>{
    res.render("join");
});

router.get('/login', (req, res)=>{
    res.render("login");
});

router.get('/users',(req, res)=>{
    res.render("users");
})

router.get('/posts', async (req, res)=>{
    res.locals.user = req.user;
    const posts = await Post.findAll({
        include:{
            model: User,
            attributes: ["id", "nick"],
        },
        order: [["createdAt", "DESC"]],
    });
    res.render("posts",{
        posts: posts,
    });
});

router.get("/write", (req, res) => {
    res.render("write.html");
});

router.get("/logintest", isLogin, (req, res)=>{
    return res.render("isLogin");
});

router.get("/Notlogintest", isNotLogin, (req, res)=>{
    return res.render("isNotLogin");
});

module.exports = router;