var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var request = require('request');
// var _ = require("underscore");

module.exports = function(app, config) {
    console.log('doing the config')
    var configAuth = config;
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(cookieSession({
        secret: 'youateanentirewheelofcheese2',
        cookie: {
            maxAge: 60 * 60 * 24 * 7 //7 days?
        }
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleID,
        clientSecret: configAuth.googleSecret,
        callbackURL: configAuth.googleCallback,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function(req, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function() {
              console.log('logging in')
                // To keep the example simple, the user's Google profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Google account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }));

    // app.use(isLoggedIn);

    app.get('/login', passport.authenticate('google', {
        scope: ['email']
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login',
            failureFlash: false
        }),
        function(req, res) {
            // if (req.user._json.domain != "tru-signal.com") {
            //     req.logout();
            // }
            console.log('doing the redirect to /')
            res.redirect('/');
        });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() || req.path == "/" || req.path == "/auth/google/callback" || req.path == "/login" || req.path == "/logout") {
        console.log('is authenticated', req.isAuthenticated(), req.path)
        return next();
    }
    console.log('redirect to /login')
    res.redirect('/');
}
