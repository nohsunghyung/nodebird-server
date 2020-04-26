const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport'); 
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const app = express();

db.sequelize.sync();
passportConfig();

app.use(morgan('dev')); // 콘솔에 요청내용 표시
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
})); // 프론트 주소 접근 허용
app.use(express.json()); // json 데이터 해석(파싱)
app.use(express.urlencoded({ extended: false }));
app.use(cookie('cookiesecret'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('안녕 백엔드');
});

// user router 불러오기
app.use('/user',userRouter);
// post router 불러오기
app.use('/post',userRouter);

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중`);
});