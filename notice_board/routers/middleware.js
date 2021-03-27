exports.isLogin = (req, res, next) => {
    const token = localStorage.getItem("token");
    if (token){
        next();
    } else {
        res.status(403).send("로그인 필요");
    }
};

exports.isNotLogin = (req, res, next) => {
    const token = localStorage.getItem("token");
    if (!token){
        next();
    } else {
        const message = encodeURIComponent("로그인한 상태입니다.");
        res.redirect(`/?error=${message}`);
    }
};