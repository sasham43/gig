var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var request = require('request');
// var _ = require("underscore");
var dbconn = require('./db');

var db;
// dbconn('gig-db').then(function(thing){
//   db = thing;
//   console.log('connected to db')
// })

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
              console.log('logging in', profile)
                // To keep the example simple, the user's Google profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Google account with a user record in your database,
                // and return that user instead.
                dbconn('gig-db').then(function(db){
                  // db = thin

                  // console.log('connected to db')
                  db.users.find({google_id: profile.id}).then(function(resp){
                      if(resp.length && resp.length > 0){
                        req.user[0] = resp;
                        return done(null, profile);
                      } else {
                        db.users.save({
                          first_name: profile.name.givenName,
                          last_name: profile.name.familyName,
                          google_id: profile.id,
                          google_image: profile.photos[0].value
                        }).then(function(resp){
                            console.log('saved user:', resp);
                            req.user = resp[0];
                            return done(null, profile);
                        }).catch(function(err){
                          console.log('err saving user', err);
                          return done(err);
                        })
                      }
                  }).catch(function(err){
                    console.log('err finding user', err);
                    return done(err);
                  })
                }).catch(function(err){
                  console.log('err connecting to db', err);
                  return done(err);
                })

                // req.user = profile;
                // return done(null, profile);
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
            failureRedirect: '/',
            failureFlash: false
        }),
        function(req, res) {
            // if (req.user._json.domain != "tru-signal.com") {
            //     req.logout();
            // }
            console.log('doing the redirect to /home')
            res.redirect('/home');
            // req.user = profile;
            // res.send(req.user);
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
