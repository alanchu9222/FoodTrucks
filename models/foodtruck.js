const mongoose = require("mongoose");
 
const foodtruckSchema = new mongoose.Schema({
   name: String,
 //price: String,
   menu: [{
	   item: String,
	   price: String
   }],
   email: String,
   phone: String, 
   category: String,
   image: String,
   description: String,
   author: {
	   id: {
			 type: mongoose.Schema.Types.ObjectId,
			 ref: "User"
	   },
	   username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("FoodTruck", foodtruckSchema);