const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
// const { wrap } =jsdjdkd require("module");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validreview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reveiwcontroller = require("../controllers/review.js");
//post review
router.post("/",isLoggedIn,reveiwcontroller.createReview);
//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reveiwcontroller.deleteReview);
module.exports= router;