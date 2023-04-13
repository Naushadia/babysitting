const router = require("express").Router();
const authController = require("../controller/authController");
const { body } = require("express-validator");
const requireUser = require("../middleware/RequireUser");

router.post(
  "/signup",
  body("first_name").isString(),
  body("last_name").isString(),
  body("email").isEmail(),
  body("account_type").isString(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than or equal to 8"),
  authController.signupController
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password"),
  authController.loginController
);
router.get("/refresh", authController.refreshAccessTokenController);
router.post(
  "/forget-password",
  body("email").isEmail(),
  authController.forgetPasswordController
);

router.post(
  "/update-password",
  body("new_password")
    .isLength({ min: 8 })
    .withMessage("Password length should must be greater or equal to 8"),
  requireUser.user,
  authController.updatePasswordController
);

router.get("/reset/:token", (req,res) => {
  const token = req.params.token;
  res.render('reset',{token: token});
});

router.post("/reset/:token", authController.getNewpassword);

router.post("/find_user", requireUser.admin, authController.findUser);

router.get('/verify/:email', (req,res) => {
  const email = req.params.email;
  res.render('verify', {email:email});
});

router.post("/verify/:email", authController.verifyEmailController);

router.post("/resend", authController.reSendEmail);

router.post("/decoded", requireUser.user,authController.decodeToken);

module.exports = router;
