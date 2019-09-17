const express = require("express");
const router = express.Router();
const FoodTruck = require("../models/foodtruck");
const middleware = require("../middleware");
const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "locationiq",
  httpAdapter: "https",
  apiKey: "60b9313fae35ff",
  formatter: null
};
const geocoder = NodeGeocoder(options);
let categoryList = [];
FoodTruck.find({}, (err, allTrucks) => {
  if (err) {
    console.log(err);
  } else {
    // Extract category for every single truck
    allTrucks.forEach(truck => {
      categoryList.push(truck.category);
    });
  }
});
// Only unique values allowed in the Set
const uniqueSet = new Set(categoryList);
categoryList = [...uniqueSet];
categoryList.sort();
categoryList.unshift("All");
categoryList.unshift("Select Category");

//INDEX - show foodtrucks
router.get("/", function(req, res) {
  // Get all foodtruckss from DB
  let searchOption = {};
  if (req.query.searchKey && req.query.searchKey !== "All") {
    searchOption = { category: req.query.searchKey };
  }

  FoodTruck.find(searchOption, function(err, allFoodtrucks) {
    if (err) {
      console.log(err);
    } else {
      res.render("foodtrucks/index", {
        foodtrucks: allFoodtrucks,
        categories: categoryList
      });
    }
  });
});

//CITYMAP - show map of foodtrucks
router.get("/citymap", function(req, res) {
  res.render("foodtrucks/citymap");
});

//CREATE - add new foodtrucks to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to foodtrucks array
  const name = req.body.name;
  const image = req.body.image;
  //    const price = req.body.price;
  const item = [];
  const price = [];
  const email = req.body.email;
  const phone = req.body.phone;
  const category = req.body.category;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  for (let i = 0; i < 10; i++) {
    item[i] = "";
    price[i] = "";
  }
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    const lat = data[0].latitude;
    const lon = data[0].longitude;
    // const location = data[0].formattedAddress;
    const location = req.body.location;

    //    const newFoodtruck = {name: name, image: image, price: price, description: desc, author:author}
    const newFoodtruck = {
      name: name,
      image: image,
      email: email,
      phone: phone,
      category: category,
      description: desc,
      location: location,
      lat: lat,
      lon: lon,
      author: author,
      item: item,
      price: price
    };

    // Create a new foodtruck and save to DB
    FoodTruck.create(newFoodtruck, function(err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        //redirect back to foodtrucks page
        console.log(newlyCreated);
        res.redirect("/foodtrucks");
      }
    });
  });
});

//NEW - show form to create new foodtruck
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("foodtrucks/new");
});

// SHOW - shows more info about one foodtruck
router.get("/:id", function(req, res) {
  //find the foodtruck with provided ID
  FoodTruck.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundFoodtruck) {
      if (err || !foundFoodtruck) {
        req.flash("error", "FoodTruck not found");
        res.redirect("back");
      } else {
        //console.log(foundFoodtruck);
        //render show template with that foodtruck
        res.render("foodtrucks/show", { foodtruck: foundFoodtruck });
      }
    });
});

// EDIT FOODTRUCK ROUTE
router.get("/:id/edit", middleware.checkFoodtruckOwnership, function(req, res) {
  FoodTruck.findById(req.params.id, function(err, foundFoodtruck) {
    res.render("foodtrucks/edit", { foodtruck: foundFoodtruck });
  });
});

// UPDATE FOODTRUCK ROUTE
router.put("/:id", middleware.checkFoodtruckOwnership, function(req, res) {
  geocoder.geocode(req.body.foodtruck.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    const lat = data[0].latitude;
    const lon = data[0].longitude;
    const location = req.body.foodtruck.location;

    //    const newFoodtruck = {name: name, image: image, price: price, description: desc, author:author}
    const newFoodtruck = {
      name: req.body.foodtruck.name,
      image: req.body.foodtruck.image,
      email: req.body.foodtruck.email,
      phone: req.body.foodtruck.phone,
      category: req.body.foodtruck.category,
      description: req.body.foodtruck.desc,
      location: req.body.foodtruck.location,
      lat: lat,
      lon: lon,
      author: req.body.foodtruck.author,
      item: req.body.foodtruck.item,
      price: req.body.foodtruck.price
    };

    // find and update the correct foodtruck
    FoodTruck.findByIdAndUpdate(req.params.id, req.body.foodtruck, function(
      err,
      updatedFoodtruck
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/foodtrucks");
      } else {
        req.flash("success", "Successfully updated");
        res.redirect("/foodtrucks/" + req.params.id);
      }
    });
  });
});

// DESTROY FOODTRUCK ROUTE
router.delete("/:id", middleware.checkFoodtruckOwnership, function(req, res) {
  FoodTruck.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/foodtrucks");
    } else {
      res.redirect("/foodtrucks");
    }
  });
});

module.exports = router;
