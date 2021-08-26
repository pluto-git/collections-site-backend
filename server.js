require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./dbConnection.js");
const usersSchema = require("./mongooseSchema");

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// app.all("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

const User = db.model("Users", usersSchema);
//dummy user

const user = new User({
  user_id: 1,
  user_role: "user",
});

// const user = new User({
//   user_id: 12,
//   user_role: "user",
//   collections: [
//     {
//       collection_id: 1,
//       collection_name: "Books",
//       collection_description: "The best books from my virtual bookshelf",
//       collection_image: "logo.png",
//       items: [
//         {
//           name: { type: String },
//         },
//       ],
//     },
//   ],
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

app.get("/save-user", (req, res) => {
  // let user = req.body;
  console.log("from the save-user route");
  user.save((err, addedUser) => {
    if (!err) {
      res.send(addedUser);
    } else {
      res.status(400).json({ error: err });
    }
  });
});

//testing
app.get("/add-user-collection", (req, res) => {
  console.log("this is the patching route");
  const updateObject = {
    id: "2",
    name: "My collection name",
    description: "My description",
    image: "my_image_src",
  };

  User.updateOne(
    { user_id: "1" },
    {
      $addToSet: {
        collections: updateObject,
      },
    },
    (err, result) => {
      if (!err && result) {
        res.send({
          status: true,
        });
      } else {
        res.send({
          status: false,
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Your server is running on PORT ${PORT}`);
});
