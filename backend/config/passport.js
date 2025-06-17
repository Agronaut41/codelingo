const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
  },
  async (profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id
    });

    await newUser.save();
    done(null, newUser);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || '';

      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.create({
          name: profile.username,
          email,
          githubId: profile.id,
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));