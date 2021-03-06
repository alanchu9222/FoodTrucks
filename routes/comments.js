const express = require("express");
const router = express.Router({ mergeParams: true });
const FoodTruck = require("../models/foodtruck");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find foodtruck by id
  console.log(req.params.id);
  FoodTruck.findById(req.params.id, function(err, foodtruck) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { foodtruck: foodtruck });
    }
  });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  //lookup foodtruck using ID
  FoodTruck.findById(req.params.id, function(err, foodtruck) {
    if (err) {
      console.log(err);
      res.redirect("/foodtrucks");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          const today = new Date();
          comment.date = today;
          comment.dateString =
            today.getDate() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            (today.getYear() + 1900);
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          foodtruck.comments.push(comment);
          foodtruck.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/foodtrucks/" + foodtruck._id);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err || !foundComment) {
      req.flash("error", "Comment not found");
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        foodtruck_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/foodtrucks/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/foodtrucks/" + req.params.id);
    }
  });
});

module.exports = router;
