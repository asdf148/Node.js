const Sequelize = require('sequelize');

module.exports = class File extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        name: {
          type: Sequelize.STRING(60),
          allowNull: false,
        },
        type:{
          type: Sequelize.STRING(10),
          allowNull: false,
        }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'file',
      tableName: 'files',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.File.belongsTo(db.Post);
  }
};