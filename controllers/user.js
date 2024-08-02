const User = require("../models/user.js");
module.exports.renderSignupform = (req,res)=> {
    res.render("users/signup.ejs");
};
    module.exports.Sigup =  async(req,res) => {
    try {
        let {username,email,password}= req.body;
        const newUser = await new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err) => {
            if (err) {
                return next(err);
            }
            req.flash("success","weclome to the webpage!");
            res.redirect("/listings");
    
        })
       
    }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginform = (req,res)=> {
    res.render("users/login.ejs");
};
module.exports.loginUser = async(req,res)=> {
    req.flash("success"," Welcome back to wanderlust!");
    let redirrect = res.locals.redirectUrl || "/listings";
     res.redirect(redirrect);
    };




    module.exports.logout= (req,res,next)=> {
        req.logOut((err)=> {
            if (err) {
               return next(err);
            }
            req.flash("success","you have been logged out successfully!");
            res.redirect("/listings");
        })
    };