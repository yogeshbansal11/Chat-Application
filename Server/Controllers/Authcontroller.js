import { compare } from "bcrypt";
import User from "../Modules/Usermodule.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
import { request } from "http";
import path from "path";
import bcrypt from 'bcrypt';



const maxage = 3 * 24 * 60 * 60; // 3 days in seconds (JWT 'expiresIn' expects seconds)

const createtoken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxage,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.create({ email, password });

    res.cookie("jwt", createtoken(email, user.id), {
      maxAge: maxage * 1000,
      secure: false, // ✅ important for localhost (otherwise blocked)
      httpOnly: true,
      sameSite: "Lax", // ✅ allows cross-origin with credentials
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.Profilesetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).send("Email and password are required");
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("User with the given email not found !!");
//     }

//     const auth = await compare(password, user.password);
//     if (!auth) {
//       return res.status(401).send("INCORRECT PASSWORD !!");
//     }

//     // if (!auth) {
//     //   return res.status(404).send("INCORRECT PASSWORD !!");
//     // }

//     // res.cookie("jwt", createtoken(email, user.id), {
//     //   maxAge: maxage * 1000, // Convert seconds to milliseconds for cookies
//     //   secure: process.env.NODE_ENV === "production",
//     //   httpOnly: true,
//     //   sameSite: "None",
//     // });

//     res.cookie("jwt", createtoken(email, user.id), {
//       maxAge: maxage * 1000,
//       secure: false, // ✅ important for localhost (otherwise blocked)
//       httpOnly: true,
//       sameSite: "Lax", // ✅ allows cross-origin with credentials
//     });

//     return res.status(201).json({
//       user: {
//         id: user.id,
//         email: user.email,
//         profileSetup: user.Profilesetup,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         image: user.image,
//         color: user.color,
//       },
//     });
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).send("Internal server error");
//   }
// };



// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Entered password:", password);
// console.log("Entered password type:", typeof password);

//     if (!email || !password) {
//       return res.status(400).send("Email and password are required");
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("User with the given email not found !!");
//     }

//     console.log("Entered password:", password);
//     console.log("Hashed password from DB:", user.password);

//     const auth = await compare(password, user.password);

//     if (!auth) {
//       return res.status(401).send("INCORRECT PASSWORD !!");
//     }

//     res.cookie("jwt", createtoken(email, user.id), {
//       maxAge: maxage * 1000,
//       secure: false,
//       httpOnly: true,
//       sameSite: "Lax",
//     });

//     return res.status(201).json({
//       user: {
//         id: user.id,
//         email: user.email,
//         profileSetup: user.Profilesetup,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         image: user.image,
//         color: user.color,
//       },
//     });
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).send("Internal server error");
//   }
// };

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Entered password:", password);
    console.log("Entered password type:", typeof password);

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User with the given email not found !!");
    }

    console.log("Entered password:", password);
    console.log("Hashed password from DB:", user.password);

    // manual test
    const testCompare = await bcrypt.compare("123", "$2b$10$qGh5g5PeHvXS5PkEkyDchO1lwxMYEaqm9lQxIoXoMV4RORgr2ifjC");
    console.log("Manual test compare result:", testCompare);

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(401).send("INCORRECT PASSWORD !!");
    }

    res.cookie("jwt", createtoken(email, user.id), {
      maxAge: maxage * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "Lax",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.Profilesetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};


export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("user with given id not found");
    }
    return res.status(201).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.Profilesetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, color } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        color,
        Profilesetup: true, // <-- mark setup complete
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      profileSetup: updatedUser.Profilesetup,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      image: updatedUser.image,
      color: updatedUser.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("file is required");
    }

    const data = Date.now();
    let fileName = "uploads/profiles/" + data + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId} = req;
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    if(user.image){
      unlinkSync(user.image)
    }

    user.image=null;
    await user.save();

    return res.status(200).send("Profile image removed Successfully !!")
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};


  export const logout = async (req, res, next) => {
    try {
      
      res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})

      return res.status(200).send("Logout successfull.!")
    } catch (error) {
      console.log({ error });
      return res.status(500).send("Internal server error");
    }
  };