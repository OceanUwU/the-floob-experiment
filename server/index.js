global.floob = {
    started: false,
};

const express = require('express');
const expresssession = require('express-session');
const cookieParser = require('cookie-parser');

const cfg = require('./cfg');
const db = require('./models');

var app = express();
//app.use('/', express.static(__dirname + '/public'));

var sessionStore = new (require("connect-session-sequelize")(expresssession.Store))({db: db.sequelize});
app.use(cookieParser());
app.use(expresssession({
    secret: cfg.secret,
    key: 'floob.session',
    store: sessionStore,
    resave: true,
    proxy: true,
    saveUninitialized: false,
    /*cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        hostOnly: false,
        secure: false,
        httpOnly: false,
    }*/
}));
sessionStore.sync();

const passport = require('./passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.router);
/*app.use((req, res, next) => {
    res.locals = {
        req,
        cfg,
    };
    next();
});

app.use(require("./routes"));*/

if (cfg.dev == true) {
    const proxy = require('express-http-proxy');
    app.use('/', proxy('http://localhost:3000'));
} else {
    app.use('/', express.static(__dirname + '/../build'));
}

const server = app.listen(cfg.port, () => {
    console.log(`Web server started on port ${cfg.port}. This should be accessible from ${cfg.host}`);
});

global.io = require('./socket')(server, sessionStore);