import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  firstName: {
    type: String,
    required: false,
  },

  lastName: {
    type: String,
    required: false,
  },

  image: {
    type: String,
    required: false,
  },

  color: {
    type: Number,
    required: false,
  },

  Profilesetup:{
    type: Boolean,
    required: false,
  },

});

// userSchema.pre("save",async function (next) {
//   const salt = await genSalt();
//   this.password = await hash(this.password,salt);
//   next()
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Ensure hashing only happens if password is modified
  const salt = await genSalt(10);  // Specify salt rounds
  this.password = await hash(this.password, salt);
  next();
});



const User = mongoose.model("Users",userSchema)

export default User












// import mongoose from "mongoose";
// import { genSalt, hash } from "bcrypt";

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   firstName: String,
//   lastName: String,
//   image: String,
//   color: Number,
//   Profilesetup: {
//     type: Boolean,
//     default: false,
//   },
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await genSalt();
//   this.password = await hash(this.password, salt);
//   next();
// });

// const User = mongoose.model("Users", userSchema);

// export default User;
