const Listing =require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } ;
  module.exports.rendernewform = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",
      populate : {
        path:"author",
      },
    }
      ).populate("owner");
    if (!listing) {
      req.flash("error","The listing you are trying to access does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };
  module.exports.createListing = async (req,res,next)=> {

    let response =await geocodingClient.forwardGeocode({
      query:req.body.listing.location,
      limit: 1,
    })
      .send(); 
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    newListing.geometry = response.body.features[0].geometry;

   let savedListing = await newListing.save();

    req.flash("success","New listing is created");
   res.redirect("/listings");
};
module.exports.editListing = async (req, res) => { 
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error","The listing you are trying to access does not exist");
      res.redirect("/listings");
    }
    let originalimage = listing.image.url;
    originalimage= originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing ,originalimage});
  };
  module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if( typeof req.file !=="undefined" ) {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image= {url,filename};
  await listing.save();
  }
  req.flash("success","listing is updated");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listings");
  };
  module.exports.Search= async(req,res) => {
    try {
      // Assuming Listing is your model and 'location' is a field in your collection
      let listing = await Listing.findOne({ location: req.body.location }); // Use `location` directly here
    
      if (!listing) {
        return res.redirect("/listings"); // Redirect and exit the function
      }
    
      // If listing is found, send a response
      res.send("found");
    } catch (error) {
      // Handle errors
      console.error(error); // Log the error for debugging
      res.status(500).send("Internal server error"); // Send an error response
    }
  }
