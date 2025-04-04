const router = require("express").Router();
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  POST /signup
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      const mysalt = bcrypt.genSaltSync(12);
      const hashedPassword = bcrypt.hashSync(password, mysalt);
      const hashedUser = {
        ...req.body,
        password: hashedPassword,
      };
      User.create(hashedUser)
        .then((createdUser) => {
          const userInDB = createdUser;
          userInDB.password = "********";
          res.status(201).json(userInDB);
        })
        .catch((pizza) => {
          next(pizza);
        });
    } else {
      res.status(400).json({ message: "This user already exist" });
    }
  } catch (err) {
    next(err);
  }
});

//POST login
router.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        console.log("the user was found,", foundUser);
        const doesPasswordMatch = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );
        if (doesPasswordMatch) {
          const theData = { _id: foundUser._id, name: foundUser.name };
          const authToken = jwt.sign(theData, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "12h",
          });
          res.status(200).json({ message: "You are logged", authToken });
        } else {
          res.status(400).json({ message: "Incorrect password" });
        }
      } else {
        res.status(400).json({ message: "Email doesn't exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Problem loggin in user" });
    });
});

// GET /auth
//verify route to check the token
router.get("/verify", isAuthenticated, (req, res) => {
  console.log("hello from route", req.payload);
  res
    .status(200)
    .json({ message: "You are still logged in", payload: req.payload });
});
module.exports = router;
