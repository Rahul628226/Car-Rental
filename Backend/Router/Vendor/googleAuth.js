const router = require('express').Router();
const passport = require('passport');

// const CLIENT_URL = 'http://emexuae.ae';
const CLIENT_URL =process.env.CLIENT_URL;
// const CLIENT_URL = 'https://emex-ecommerce.netlify.app';


const jwt = require("jsonwebtoken");

const generateToken = (id, vendorName,Role) => {
  return jwt.sign({ _id: id, vendorName,Role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};


router.get('/login/success', (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id, req.user.firstname,req.user.Role); 
    res.header('Access-Control-Allow-Origin', CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({
      success: true,
      message: 'successful',
      user: req.user,
      token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'authentication failed',
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session = null; // Clear the session
    res.redirect('/');
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/',
  })
);

module.exports = router;
