const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const usersSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_role: {
    type: String,
    required: true,
  },
  collections: [
    {
      name: {
        type: String,
      },
      theme: {
        type: String,
      },
      description: String,
      image: "",
      fields: [],
      items: [],
    },
  ],
});
usersSchema.plugin(uniqueValidator);

module.exports = usersSchema;
