const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  bannerId:{
    type: Number,
    required: true,
    unique: true,
  },
  uid:{
    type: String,
    required: true,
  },
  redmeedAt:{
    type: Date,
    required: true,
    default: Date.now,
  }
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
