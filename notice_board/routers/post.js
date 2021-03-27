const express = require('express');
const {Post, File} = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const methodOverride = require("method-override");
const LocalStorage = require('node-localstorage').LocalStorage;
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploadedFiles/');
    },
    filename(req,file,cb){
        cb(null, `${Date.now()}__${file.originalname}`);
    }
});
const upload = multer({dest:'public/uploadedFiles/'});
const uploadWithOriginFN = multer({storage: storage});

localStorage = new LocalStorage('./scratch');

const router = express.Router();

router.use(methodOverride("_method"));

router.post("/write", uploadWithOriginFN.array('files') , async (req, res)=>{
    const {title, content} = req.body;
    const token = localStorage.getItem("token");
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    await Post.create({
        title,
        content,
        UserId: user.id,
    });
    const post_id = await Post.findOne({
        where: {
            title: title,
            content: content,
        }
    });
    console.log("post id: "+post_id);//post id: [object SequelizeInstance:Post]
    for(i = 0; i<req.files.length; i++){
        console.log("filename"+req.files[i].filename);
        await File.create({
            name: req.files[i].filename,
            type: req.files[i].filename.slice(-3),
            PostId: post_id.id,
        });
    }
    res.redirect('/posts');
});

router.get('/update', (req, res)=>{
    const UserId = req.query.user;
    const PostId = req.query.post;
    res.render('update.html',{
        UserId: UserId,
        PostId: PostId,
    });
});

router.get('/detail/:id', async (req, res)=>{
    const detail = await Post.findOne({where: {id:req.params.id}});
    const files = await File.findAll({where: {PostId:req.params.id}});
    console.log(files);
    res.render('postDetail',{detail: detail, files: files});
});

router.put('/update', async(req, res)=>{
    const {PostId, title, content } = req.body;
    await Post.update({
        title: title,
        content: content
    }, {where: {id:PostId} });
    res.redirect('/posts');
});

router.delete("/delete/:id", (req, res) => {
    Post.destroy({where:{id:req.params.id}});
    res.redirect("/posts");
});

module.exports = router;