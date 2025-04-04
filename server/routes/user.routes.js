const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// POST /api/users -> NO NEED TO CREAT BECAUSE
// WE ALREAY MANAGE IT IN SIGNU-UP ROUTE IN AUTH FILE

// GET /api/users/:id => Retrieves a specific user by id.
// The route should be protected by the authentication middleware
router.get("/:userId", isAuthenticated, async (req, res, next)=>{
    const {userId} = req.params;
    // console.log("test ", req.payload._id === userId)
    if(req.payload._id === userId){
        // console.log(req.payload);
        try {
            const myUser = await User.findById(userId);
            res.status(200).json(myUser);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(403).json({message: "Access denied"})
    }
})

// PATCH /api/users/:id => Update a specific user by id.
// The route should be protected by the authentication middleware
// router.patch("/update-user/:userId", async (req, res) => {
//     const { userId } = req.params;
//     const { email, newEmail, password, newPassword } = req.body;
//     const mysalt = bcrypt.genSaltSync(12);
//     const hashedNewPassword= bcrypt.hashSync(newPassword, mysalt);
//     const updatedData = {
//         name: req.body.name,
//         password: {type: String, required: true},
//         email: newEmail,
//     }
//     try {

//         const foundUser = await User.findByIdAndUpdate({email : email});
//         // Verify existing email

//         // Verify if new pwd !== old pwd

//     } catch (error) {

//     }
// })

//DELETE /api/users/:id => Delete a specific user by id.
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log({ deletedUser });
    res.status(200).json({ deletedUser });
  } catch (error) {
    res.status(500).json({ errorMessage: "Problem with deleting the user" });
  }
});

module.exports = router;
