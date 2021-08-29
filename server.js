require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary");
const cors = require("cors");
const app = express();

const db = require("./dbConnection.js");
const usersSchema = require("./mongooseSchema");

const PORT = process.env.PORT || 3001;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" }));

const User = db.model("Users", usersSchema);
//dummy user

// const user = new User({
//   user_id: "2",
//   user_role: "user",
// });

app.get("/", (req, res) => {
  console.log("from the route");
  User.find({}, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.status(400).json({ error: err });
    }
  });
});

app.get("/find", (req, res) => {
  console.log("from the route");

  User.findOne({ user_id: "auth0|60ffa66e3582bc0069466022" }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    doc.collections[0].items = [{ logo: "goingoo" }, { go: "goo" }];
    console.log(doc);
    doc.save();
  });
  // User.findOneAndUpdate(
  //   { user_id: "auth0|60ffa66e3582bc0069466022" },
  //   { $set: { user_role: "admin" } },
  //   { new: true },
  //   (err, doc) => {
  //     if (err) {
  //       console.log("Something wrong when updating data!");
  //     }
  // doc.collections[0].items = [{ logo: "going" }, { go: "go" }];
  // console.log(doc);
  // doc.save();
  //   }
  // );
});

app.post("/save-user", (req, res) => {
  const user_id = req.body.user_id;
  const user = new User({
    user_id: user_id,
    user_role: "user",
  });

  user.save((err, addedUser) => {
    if (!err) {
      res.json({ message: "success" });
    } else {
      res.json({ message: "already exists" });
    }
  });
});

app.patch("/add-user-collection", (req, res) => {
  const { user_id, name, theme, description, image, fields } = req.body;

  cloudinary.v2.uploader.upload(image, (error, cloudinaryImage) => {
    if (error) {
      res.json({ error: error });
    }
    const imageUrl = cloudinaryImage.url;
    const updateObject = {
      name: name,
      theme: theme,
      description: description,
      image: imageUrl,
    };
    User.updateOne(
      { user_id: user_id },
      {
        $addToSet: {
          collections: updateObject,
        },
      },
      (err, result) => {
        if (!err && result) {
          let collectionId;
          User.findOne({ user_id: user_id }, (err, doc) => {
            if (err) {
              res.status(400).json({ error: err });
            }
            doc.collections[doc.collections.length - 1].fields = fields;
            collectionId = doc.collections[doc.collections.length - 1]._id;
            console.log(collectionId);
            doc.save().then(res.json(collectionId));
          });
        } else {
          res.json({ status: false });
        }
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Your server is running on PORT ${PORT}`);
});
