import express from 'express'
import passport from 'passport'
import passportLocal from 'passport-local'
import * as usersModel from '../models/user-superagent.mjs'

const LocalStrategy = passportLocal.Strategy;

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

router.get('/logout', (req, resp, next) => {
    req.session.destroy();
    req.logout();
    resp.clearCookie('blogcookie');
    resp.redirect('/');
});

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        let resp = await usersModel.check(username, password);
        let check = resp.data;
        if (check) {
            console.log('The user has logged in', username);
            done(null, {id: check.username, username: check.username});
        } else {
            done(null, false, 'Invalid username/password');
        }
    } catch (e) {
        done(e);
    }
}));

passport.serializeUser( async (user, done) => {
    try {
        done(null, user.username);
    } catch (e) {
        done(e);
    }
});

passport.deserializeUser(async (username, done) => {
    try {
        let resp = await usersModel.find(username);
        done(null, resp.data);
    } catch (e) {
        done(e);
    }
});

function authenticate(req, resp, next) {
    try{
        console.log('Authenticate User', req.user);
        if (req.user) {
            console.log('The user has logged in', req.user);
            next();
        } else {
            console.log('Login failed');
            resp.redirect('/login');
        }
    } catch(e) {
        next(e);
    }
};

function initPassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());
};

export {router, authenticate, initPassport};