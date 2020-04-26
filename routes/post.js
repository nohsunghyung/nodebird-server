const express = require('express');
const multer = require('multer');

const { isLoggedIn } = require('./middlewares');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done){
      done(null, 'uploads')
    },
    filename(rea, file, done){

    }
  }),
  limit: { fileSize: 20 * 1024 * 1024}
})

router.post('/images', isLoggedIn, (req, res) => {

});

router.post('/', isLoggedIn, (req, res) => {

});

module.exports = router;