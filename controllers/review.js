const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=> {
    let listing=  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    listing.reviews.push(newReview);
   await  newReview.save();
   await  listing.save();
   console.log("review has been saved");
   req.flash("success","your review has been added");
  //  res.send("review has been saved");
   res.redirect(`/listings/${listing._id}`);
};
module.exports.deleteReview = async(req,res)=> {
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reveiw: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","review has been deleted");
  
   res.redirect(`/listings/${id}`);
  };