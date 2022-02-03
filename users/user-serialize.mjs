import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';

await mongoose.connect(`${process.env.MONGODB}://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`);

const Schema = mongoose.Schema;

class User {
  user;
  #saltRounds = 10;

  constructor(props) {
    const userSchema = new Schema({
          username: {
            type: String,
            required: true,
            unique: true
          },
          password: {
            type: String,
            required: true
          },
          firstName: {
            type: String,
            required: true
          },
          lastName: {
            type: String,
            required: true
          },
          dateCreated: {
            type: Date,
            default: Date.now
          }
        }, {
          toObject: {
            transform: (doc, ret) => {
              delete ret._id;
              delete ret.password;
            }
          },
          toJSON: {
            transform: (doc, ret) => {
              delete ret._id;
              delete ret.password;
            }
          }
        }
    )

    this.user = mongoose.connection.model(`${process.env.MONGODB_COLLECTION}`, userSchema);
  }

  async get(username) {
    return this.user.findOne({username: username}).exec();
  }

  async list() {
    return this.user.find().exec();
  }

  async create(data) {
    return this.user.create(await this.#sanitizeUser(data));
  }

  async update(data) {
    data = await this.#sanitizeUser(data);
    return this.user.updateOne({username: data.username}, data).exec();
  }

  async delete(username) {
    let user = await this.get(username);
    return user.deleteOne();
  }

  async #sanitizeUser(data) {
    if (data.hasOwnProperty('password')) {
      data.password = await new Promise((resolve, reject) => {
        bcrypt.hash(data.password, this.#saltRounds, (err, hash) => {
          if (err) {
            return reject(err);
          }

          return resolve(hash);
        });
      })
    }

    return data;
  }

  async check (username, password) {
    let user = await this.get(username);

    if (!user) {
      return false;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      })
    })
  }

  close() {
    mongoose.disconnect();
  }
}

export default new User();