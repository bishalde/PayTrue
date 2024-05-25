const express = require("express");
const Users = require("../models/userModel");
const router = express.Router();

router.get("/",async (req, res) => {
  const upi = req.query.upi;
  const UserData = await Users.findOne({ upi: upi }).select("firstName lastName email upi");
  res.status(200).json(UserData);
});

module.exports = router;
