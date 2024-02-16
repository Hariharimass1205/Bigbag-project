//isblock session handle 


const isUser= async (req,res,next)=>{
if (req.session.userInfo){
    next()
}else{
    res.redirect("/login")
}
}

module.exports = {isUser}