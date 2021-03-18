const express = require("express");
const bcrypt = require("bcrypt");
const {User} = require("../models");
const passport = require("passport");

const router = express.Router();

router.post("/join",async (req, res)=>{
    const {email, nick, password} = req.body;
    const hash = await bcrypt.hash(password, 12)
    await User.create({
        email,
        nick,
        password: hash,
    });
    return res.redirect("/");
})

router.post("/login", (req,res,next)=>{
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect("/join");
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect("/");
});

router.get("/user",async (req, res, next)=>{
    const email = req.query.email
    console.log(email);
    const asUser = await User.findOne({ where: {email} });
    return res.send(asUser);
});

router.get("/list", async (req, res, next)=>{
    const Users = await User.findAll();
    return res.send(Users);
});

module.exports = router;