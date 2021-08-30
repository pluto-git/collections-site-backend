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

app.get("/:id/get-fields/:collection_id", (req, res) => {
  const user_id = req.params.id;
  const collection_id = req.params.collection_id;

  User.findOne({ user_id: user_id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      const result = doc.collections.find(
        (collection) => collection._id == collection_id
      ).fields;
      res.send(result);
    }
  });
});

///saving a new user.
app.post("/save-user", (req, res) => {
  const { user_id, user_email } = req.body;
  const user = new User({
    user_id: user_id,
    user_role: "user",
    user_email: user_email,
  });
  user.save((err, addedUser) => {
    if (!err) {
      res.json({ message: "success" });
    } else {
      res.json({ message: "already exists" });
    }
  });
});

//send parameters to add a collection, clarify fields
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
            doc.save().then(res.json(collectionId));
          });
        } else {
          res.json({ status: false });
        }
      }
    );
  });
});

app.post("/add-item", (req, res) => {
  const { user_id, collection_id } = req.body;
  const item = req.body.item;

  User.findOne({ user_id: user_id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      doc.collections
        .find((collection) => collection._id == collection_id)
        .items.push(item);
      doc.save().then(res.json({ message: "success" }));
    }
  });
});

app.get("/:id/collections/", (req, res) => {
  const user_id = req.params.id;
  User.findOne({ user_id: user_id }, (err, doc) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      res.status(200).json(doc.collections);
    }
  });
});

app.delete("/:id/delete-collection/:collection_id", (req, res) => {
  const user_id = req.params.id;
  const collection_id = req.params.collection_id;

  User.findOneAndUpdate(
    { user_id: user_id },
    { $pull: { collections: { _id: collection_id } } },
    { new: true },
    function (err) {
      if (err) {
        console.log(err);
      }else{
        res.status(200);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Your server is running on PORT ${PORT}`);
});
