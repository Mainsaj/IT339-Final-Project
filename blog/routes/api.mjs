import express from 'express'
import {MongoDBPostStore} from '../models/post-mongodb.mjs';

const router = express.Router();
let posts = new MongoDBPostStore();

router.get('/', async (req, resp, next) => {
  try {
    let keys = await posts.keyList();
    resp.send(await Promise.all(keys.map(key => posts.read(key))));
    }
  catch (e) {
    resp.send(e);
  }
});


export default router;
