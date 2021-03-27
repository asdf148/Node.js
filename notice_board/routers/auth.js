const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const {User} = require('../models');
const { smtpTransport } = require('../config/email');
const generateRandom = () => {
    var ranNum = Math.floor(Math.random()*(999999-111111+1)) + 111111;
    return ranNum;
}
const rancode = generateRandom();

const router = express.Router();

router.post('/certification', async (req, res)=>{
    const {code, email, nick, password} = req.body;

    if(code == rancode){
        await User.create({
            email,
            nick,
            password,
        });
        res.redirect('/');
    }
    else{
        res.send('code was wrong');
    }
    
});

router.post("/join", async (req, res, next)=>{
    try{
        const { email, nick, password, repassword } = req.body;
        const hash = await bcrypt.hash(password, 12);
        if(password != repassword){
            return res.send('password and re-password are different');
        }
        const user = {
            email,
            nick,
            password: hash,
        };
        const mailOptions = {
            from: "TEST.site",
            to: email,
            subject: "이메일 인증번호",
            text: `이메일 인증번호: ${rancode}`
        };
        const result = await smtpTransport.sendMail(mailOptions, (error, responses) =>{
            console.log("if");
            if(error){
                console.log('error')
                res.json({msg:err});
            }else{
                console.log('redirect')
                res.render('auth',{user});
            }
            console.log('before close');
            smtpTransport.close();
            console.log('after close');
        });
    }catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login', async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        const Fuser = await User.findOne({where:{email}});
        const user = {
            id: Fuser.id,
            nick: Fuser.nick,
        }
        if(localStorage.getItem('token')){
            localStorage.clear();
        }
        if(await bcrypt.compare(password, Fuser.password)){
            const token = jwt.sign(user, process.env.TOKEN_SECRET,{expiresIn: '10m', issuer: 'me'});
            localStorage.setItem("token", token);
            console.log(token);
        }
        res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
});

module.exports = router;