import createError from 'http-errors';
import express from 'express';
import 'dotenv/config';
import hbs from 'hbs';
import * as path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';

import indexRouter from './routes/index.mjs';
import postsRouter from './routes/post.mjs';
import apiRouter from './routes/api.mjs';
import {initPassport, router as usersRouter} from './routes/users.mjs';

const __dirname = path.resolve();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));
hbs.registerHelper('reverseArray', (array) => {
  return array.reverse();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  secret: 'keyboard mouse',
  resave: true,
  name: 'blogcookie',
  saveUninitialized: true
}));

initPassport(app);

app.use((req, resp, next) => {
  if (req.user) {
    resp.locals.user = req.user;
  }
  next();
})

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
