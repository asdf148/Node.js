const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
require('dotenv').config();

const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const postRouter = require('./routers/post');
const { sequelize } = require('./models');

const app = express();
sequelize.sync();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/',indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});