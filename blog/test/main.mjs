import {expect} from 'chai';
import {Post, AbstractPostStore} from '../models/Post.mjs'
import {MongoDBPostStore} from '../models/post-mongodb.mjs'

let posts = new MongoDBPostStore();
let keys = await posts.keyList();
let blog = await Promise.all(keys.map(key => posts.read(key)));
describe('tests', function() {
    it('Get non-existing post', function() {       
        let key = "################";
        expect(blog[key]).to.be.undefined;
    });

    it('Get an existing post', function() {
        let key = "0";
        expect(blog[key]).to.not.be.undefined;
        expect(blog[key].title).to.be.a('string');
        expect(blog[key].body).to.be.a('string');
    });
});

