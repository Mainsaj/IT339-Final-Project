import {Post, AbstractPostStore} from './Post.mjs';
import mongodb from 'mongodb';
import 'dotenv/config';

const MongoClient = mongodb.MongoClient;

const db = await (async () => {
  let client = await MongoClient.connect(`${process.env.MONGODB}://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`);
  return client.db(`${process.env.MONGODB_DATABASE}`);
})();

const posts = db.collection(`${process.env.MONGODB_COLLECTION}`);

class MongoDBPostStore extends AbstractPostStore {
  async create (key, title, body) {
    await posts.insertOne( {
      key: key,
      title: title,
      body: body,
    });

    return new Post(key, title, body);
  }

  async update (key, title, body) {
    await posts.updateOne({key: key}, {
      $set: {
        title: title,
        body: body
      }
    })

    return new Post(key, title, body);
  }

  async read (key) {
    let doc = await posts.findOne({key: key});
    return new Post(doc.key, doc.title, doc.body);
  }

  async destroy (key) {
    let doc = await posts.findOne({key: key});
    if (!doc) {
      throw new Error(`No post found for ${key}`);
    }

    return await posts.findOneAndDelete({key: key});
  }

  async keyList() {
    return await posts.find().map(post => post.key).toArray();
  }

  async count() {
    return await posts.countDocuments();
  }
}

export {MongoDBPostStore}