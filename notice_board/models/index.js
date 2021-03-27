const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const File = require('./file');
const Comment = require('./comment');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.File = File;
db.Comment = Comment;

User.init(sequelize);
Post.init(sequelize);
File.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Post.associate(db);
File.associate(db);
Comment.associate(db);

module.exports = db;