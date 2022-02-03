import express from 'express'
import {MongoDBPostStore} from '../models/post-mongodb.mjs';
import { authenticate } from './users.mjs';

const router = express.Router();
let posts = new MongoDBPostStore();

router.get('/', async (req, resp, next) => {
  try {
    let keys = await posts.keyList();

    resp.render('posts', {
      title: 'Blog Posts',
      posts: await Promise.all(keys.map(key => posts.read(key)))
    });
  } catch (e) {
    next(e);
  }
});

router.get('/new', authenticate, async (req, resp, next) => {
  try {
    if (req.query.key && req.query.title && req.query.body) {
      await posts.create(req.query.key, req.query.title, req.query.body);
      resp.redirect('/posts');
    } else {
      resp.render('edit-post', {
        title: 'Create Post'
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get('/edit/:key', async (req, resp, next) => {
  try {
    let post = await posts.read(req.params.key);

    if (!post) {
      next(new Error(`No such key ${req.params.key}`));
      return;
    }

    if (req.query.title && req.query.body) {
      await posts.update(post.key, req.query.title, req.query.body);
      resp.redirect('/posts');
    } else {
      resp.render('edit-post', {
        title: 'Edit post',
        post: post,
        edit: true
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get('/delete/:key', async (req, resp, next) => {
  try {
    let post = await posts.read(req.params.key);

    if (!post) {
      next(new Error(`No such key ${req.params.key}`));
      return;
    }

    await posts.destroy(post.key);
    resp.redirect('/posts');
  } catch (e) {
    next(e);
  }
});

export default router;
