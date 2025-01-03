const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const redis = require("redis");
const connectRedis = require("connect-redis");
const User = require('../../Model/Vendor/VendorReg');
const RedisStore = connectRedis(session);

// Create a Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379", 
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

const app = express();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "None",
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Update user information
          user.googleId = profile.id;
          user.firstname = profile.displayName;
          user.verify = true;
          user.lastlogin=new Date();
          await user.save();
          return done(null, user);
        }
        
        // Create a new user if one does not already exist
        user = new User({
          googleId: profile.id,
          firstname: profile.displayName,
          email: profile.emails[0].value,
          verify: true,
          Role:'Vendor',
          lastlogin:new Date(),
        });
        await user.save();
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID into session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve user by ID
    done(null, user); // Attach user object to req.user
  } catch (error) {
    done(error);
  }
});

module.exports = app;
