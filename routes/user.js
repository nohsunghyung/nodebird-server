const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.post('/');

// 회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email,
      }
    })

    if (exUser) { // 이미 회원가입되어있을경우
      return res.status(403).json({
        errorCode: 1, // 프론트와 상의된 에러코드
        message: '이미 존재하는 이메일 입니다.',
      })
    }

    // const newUser = await db.User.create({
    //   email: req.body.email,
    //   password: hash,
    //   nickname: req.body.nickname,
    // });

    //return res.status(201).json(newUser); // 성공했을경우

    // 회원가입 후 바로 로그인
    await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (err) => { // 세션에 사용자 정보 저장
        if (err) {
          console.error(err);
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  } catch (error) {
    console.log(error);
    return next(error); // 에러났을경우
  }
})

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (err) => { // 세션에 사용자 정보 저장
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
})

// 로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.session.destroy(); // 선택사항
    return res.status(200).send('로그아웃 되었습니다.');
  }
})

module.exports = router;