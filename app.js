const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path= require("path");
const methodOverride=require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrappAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema} = require("./schema.js");
const Review=require("./models/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/Wonderlust";
app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

main()
  .then(() =>{
    console.log("Connected to DB");
  })
  .catch((err) =>{
    console.log(err);
  });
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res) => {
    res.send("Hi I am Root");
});

const validateListing = (req,res,next) =>{
    let {error}=listingSchema.validate(req.body);
    console.log(result);
}


//INDEX ROUTE
app.get("/listings", async (req,res) =>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//NEW ROUTE
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
})

//SHOW ROUTE
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})
//Create Route
app.post("/listings",wrapAsync(async (req,res)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
        const newListingnew = Listing(req.body.listing)
        await newListingnew.save();
        res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", async (req,res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

app.put("/listings/:id", async (req,res) =>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {... req.body.listing});
    res.redirect(`/listings/${id}`)
})

app.delete("/listings/:id", async(req,res) =>{
    let {id}= req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
})

//REVIEWS
//POST ROUTE

app.post("/listings/:id/review" , async(req,res) => {
    let Listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})

/*app.get("/testListing",async (req,res)=>{
    let sampleListing= new Listing({</form
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Calcutta",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("Successful Testing");
})*/

app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Error Page Not Found"));
})

app.use((err,req,res,next) =>{
    let{ statusCode=500 , message="Something Went Wrong"} =err;
    res.render("error.ejs");
    res.status(statusCode).send(message);
})

app.listen(8080,() => {
    console.log("Server is working on port 8080");
});



