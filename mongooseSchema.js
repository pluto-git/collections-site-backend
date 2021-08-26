const mongoose = require("mongoose");

// const usersSchema = new mongoose.Schema({
//   user_id: {
//     type: Number,
//     required: true,
//     unique: [true, "user id must be unique"],
//   },
//   user_role: {
//     type: String,
//     required: true,
//   },
//   collections: [

//   ],
// });

const usersSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: [true, "user id must be unique"],
  },
  user_role: {
    type: String,
    required: true,
  },
  collections: [
    {
      _id: false,
      id: {
        type: Number,
        required: true,
        unique: [true, "collection id must be unique"],
      },
      name: {
        type: String,
      },
      description: String,
      image: "",
      items: [
        {
          name: {
            type: String,
          },
        },
      ],
    },
  ],
});

module.exports = usersSchema;
