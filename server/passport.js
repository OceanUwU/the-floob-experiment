const passport = require('passport');
const IdentificatorStrategy = require('passport-identificator').Strategy;
const cfg = require("./cfg");

passport.use(new IdentificatorStrategy(
    {
        "identificatorHost": cfg.identificatorHost,
        "callbackURL": cfg.host+"/login/callback",
    },

    (profile, cb) => {
        cb(null, profile.id);
    }
));

passport.serializeUser((profile, cb) => {
    return cb(null, profile);
});

passport.deserializeUser((id, cb) => {
    IdentificatorStrategy.loadUserProfile(cfg.identificatorHost, id, cb);
});

var router = require('express').Router();

router.get('/login', (req, res, next) => {
    next(); //end middleware
}, passport.authenticate('identificator')); //authenticate with identificator

router.get('/login/callback', passport.authenticate('identificator', {failureRedirect: '/login/fail'}), (req, res) => {
    res.redirect('/'); //redirect the user to the return url
});

router.get("/login/fail", (req, res) => res.send("There was an error logging in. <a href='/login'>Try again?</a>"));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
    //req.session.destroy(err => res.redirect('/'));
});

module.exports = passport;
module.exports.router = router;
module.exports.loadUserProfile = function(id) {
    return new Promise((res, rej) => {
        require('passport-identificator').Strategy.loadUserProfile(cfg.identificatorHost, id, (err, profile) => {
            res(profile);
        });
    });
}