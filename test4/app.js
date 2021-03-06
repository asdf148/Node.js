const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require("express-session");
require('dotenv').config();

const indexRouter = require("./routes/index");
const UserRouter = require("./routes/user");
const PostRouter = require("./routes/post");
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
sequelize.sync().then(()=>{
    console.log("데이터베이스 연결 됨");
}).catch((err)=>{
    console.log(err);
});
passportConfig(passport);

app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "html");
nunjucks.configure("views",{
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/",indexRouter);
app.use("/user",UserRouter);
app.use("/post",PostRouter);

// app.use((req, res, next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), ()=>{
    console.log(app.get("port"), "번 포트에서 대기중");
});