if (process.env.NODE_ENV !="production" ) {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { wrap } =jsdjdkd require("module");
// const Review = require("./models/review.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const reviews= require("./routes/review.js");
const userRouter = require("./routes/user.js");

const uri = process.env.ATLAS_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
      console.log(err);
  });

async function main() {
 await mongoose.connect(uri) 
   
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl : uri,
  crypto: {
    secret : process.env.SECRET,
  },
  touchAfter: 24 *3600,
  }
);
store.on("error",()=> {
  console.log("Some error in mongo session",err);
});
const sessionOption = { store,secret : process.env.SECRET,
  resave : false,
  saveUninitialized :true,
  cookie: {
    expires : Date.now() + 7 * 24 *60*60*1000,
    maxAge : 7 * 24 *60*60*1000,
    httpOnly : true,

  }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=> {
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser = req.user;
  next();
})
 

//demo user
// app.get("/demouser", async(req,res) => {
//   let fakeuser = new User({
//     email:"mohadkemd@gmail.com",
//     username :"delaaa-2",
//   })
//  let registeredUser= await User.register(fakeuser,"hello");
//  res.send(registeredUser);

// })



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)
app.use("/",userRouter)

app.all("*",(req,res,next) => {
  next( new ExpressError(404,"page not found!"));

});
app.use ((err,req,res,next)=> {
 const status =err.status || 404;
 const  message = "page not found!"
  res.status(status).send(message);
})



app.listen(8086, () => {
  console.log("server is listing to the port 8086");
});