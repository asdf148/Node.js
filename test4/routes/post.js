const express = require("express");
const methodOverride = require("method-override");
const { Post, User } = require("../models");

const router = express.Router();
router.use(methodOverride("_method"));

router.post("/write", async (req, res) => {
    const { title, content } = req.body;
    await Post.create({
        title,
        content,
        UserId: req.user.id,
    });
    res.redirect("/posts");
});

router.get("/update", (req, res) => {
    const UserId = req.query.user;
    const PostId = req.query.post;
    res.render("update",{
        UserId: UserId,
        PostId: PostId,
    });
});

router.put("/update", async (req, res) => {
    const { PostId, title, content } = req.body;
    console.log(PostId);
    await Post.update({
        title: title,
        content: content
    }, {where: {id:PostId} });
    res.redirect("/posts");
});

router.delete("/delete/:id", (req, res) => {
    Post.destroy({where:{id:req.params.id}});
    res.redirect("/posts");
});

module.exports = router;