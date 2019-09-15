const express = require("express");
const router  = express.Router();
const FoodTruck = require("../models/foodtruck");
const middleware = require("../middleware");


//INDEX - show all foodtrucks
router.get("/", function(req, res){
    // Get all foodtruckss from DB
    FoodTruck.find({}, function(err, allFoodtrucks){
       if(err){
           console.log(err);
       } else {
          res.render("foodtrucks/index",{foodtrucks:allFoodtrucks});
       }
    });
});

//CREATE - add new foodtrucks to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to foodtrucks array
    const name = req.body.name;
    const image = req.body.image;
//    const price = req.body.price;	
	const menu = [];
    const email = req.body.email;	
    const phone = req.body.phone;	
    const category = req.body.category;	
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
//    const newFoodtruck = {name: name, image: image, price: price, description: desc, author:author}
    const newFoodtruck = {name: name, image: image, email: email, phone: phone, category: category, description: desc, author:author, menu:menu}
	
    // Create a new foodtruck and save to DB
    FoodTruck.create(newFoodtruck, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to foodtrucks page
            console.log(newlyCreated);
            res.redirect("/foodtrucks");
        }
    });
});

//NEW - show form to create new foodtruck
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("foodtrucks/new"); 
});

// SHOW - shows more info about one foodtruck
router.get("/:id", function(req, res){
    //find the foodtruck with provided ID
    FoodTruck.findById(req.params.id).populate("comments").exec(function(err, foundFoodtruck){
        if(err|| !foundFoodtruck){
            req.flash('error','FoodTruck not found')
			res.redirect('back')
        } else {
            console.log(foundFoodtruck)
            //render show template with that foodtruck
            res.render("foodtrucks/show", {foodtruck: foundFoodtruck});
        }
    });
});

// EDIT FOODTRUCK ROUTE
router.get("/:id/edit", middleware.checkFoodtruckOwnership, function(req, res){
    FoodTruck.findById(req.params.id, function(err, foundFoodtruck){
        res.render("foodtrucks/edit", {foodtruck: foundFoodtruck});
    });
});

// UPDATE FOODTRUCK ROUTE
router.put("/:id",middleware.checkFoodtruckOwnership, function(req, res){
    // find and update the correct foodtruck
    FoodTruck.findByIdAndUpdate(req.params.id, req.body.foodtruck, function(err, updatedFoodtruck){
       if(err){
           res.redirect("/foodtrucks");
       } else {
           //redirect somewhere(show page)
           res.redirect("/foodtrucks/" + req.params.id);
       }
    });
});

// DESTROY FOODTRUCK ROUTE
router.delete("/:id",middleware.checkFoodtruckOwnership, function(req, res){
   FoodTruck.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/foodtrucks");
      } else {
          res.redirect("/foodtrucks");
      }
   });
});


module.exports = router;

