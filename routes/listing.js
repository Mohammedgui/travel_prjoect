const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validlisting} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post( upload.single("listing[image]"),validlisting,wrapAsync(listingcontroller.createListing));

//new route
router.get("/new", isLoggedIn,listingcontroller.rendernewform);
router.get("/accommodations",listingcontroller.accamodation);
router.get("/offers",listingcontroller.offers);
router.get("/offer",listingcontroller.offer);
router.get("/sphere",listingcontroller.sphere);
router.get("/things",listingcontroller.things);
router.get("/golf",listingcontroller.golf);
router.get("/event",listingcontroller.event);

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn,isOwner, upload.single("listing[image]")
  ,validlisting,wrapAsync(listingcontroller.updateListing)
)
.delete( isLoggedIn,isOwner,listingcontroller.deleteListing);

 router.get("/:id/edit",isLoggedIn,
  isOwner,listingcontroller.editListing);
  
module.exports = router;