const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            title:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            content:{
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Post",
            tableName: "Posts",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User);
    }
}