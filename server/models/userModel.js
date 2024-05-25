const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  avatarId:{
    type: String,
  },
  dob:{
    type: String,
  },
  email: {
    unique: true,
    required:true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  upi:{
    type: String,
  }
});

userSchema.pre('save',async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10); 
      this.password = await bcrypt.hash(this.password, salt); 
    } catch (err) {
      return next(err);
    }
  }
  if (this.isNew) {
      this.upi = this.phoneNumber+"@paytrue"
  }
  if (this.gender.toLowerCase() === 'female') {
    this.avatarId = 'female_avatar_1';
  } else {
    this.avatarId = 'men_avatar_1';
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model("User", userSchema);
module.exports = User;
