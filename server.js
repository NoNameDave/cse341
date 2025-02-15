const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Logging environment variables (REMOVE in production)
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET);
console.log("Callback URL:", process.env.CALLBACK_URL);

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }))
    .use('/', require('./routes'));

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/', (req, res) => res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged Out"));

app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: true }), (req, res) => {
    console.log("GitHub User:", req.user);
    req.session.user = req.user;
    res.redirect('/');
});

mongodb.initDb(err => {
    if (err) console.log(err);
    else if (process.env.NODE_ENV !== 'test') {
        app.listen(port, () => console.log(`Database is running and Web Server is listening on port ${port}`));
    }
});

module.exports = app;