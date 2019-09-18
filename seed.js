const mongoose = require("mongoose");
const FoodTruck = require("./models/foodtruck");
const Comment = require("./models/comment");

const data = [
  {
    name: "Mr Burger",
    image:
      "https://tul.imgix.net/content/article/best-food-trucks-melbourne_1.jpg?auto=format,compress&w=740&h=486&fit=crop",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  },
  {
    name: "Taco Truck",
    image: "https://media.timeout.com/images/103027123/1024/576/image.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  },
  {
    name: "Yo India",
    image: "https://media.timeout.com/images/103941221/1024/576/image.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  }
];

function seedDB() {
  //Remove all foodtrucks
  FoodTruck.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed foodtrucks!");
    Comment.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("removed comments!");
      //add a few foodtrucks
      data.forEach(function(seed) {
        FoodTruck.create(seed, function(err, foodtruck) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a foodtruck");
            //create a comment
            Comment.create(
              {
                text: "This place is great, love the taste",
                author: "Homer"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  foodtruck.comments.push(comment);
                  foodtruck.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
    });
  });
  //add a few comments
}

module.exports = seedDB;
