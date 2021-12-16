module.exports = function (app) {
  const userController = require("../controller/userController.js");
  const upload = require("../utils/multer");
  const verify = require("../middleware/verifyToken");
  const { userValidationRules, validate } = require("../middleware/validation");

  // Retrieve user details
  app.get("/details/:id", verify, userController.details);

  // Update a user with Id
  app.put(
    "/update/:id",
    verify,
    upload.single("user_image"),
    userController.update
  );

  // Delete a user with Id
  app.delete("/delete/:id", verify, userController.delete);

  // Create a new User
  app.post(
    "/insert",
    validate,
    userValidationRules(),
    upload.single("user_image"),
    userController.insert
  );

  //Generate Token
  app.post("/auth", userController.auth);

  //Get ALL user
  app.get("/getall", userController.getAll);
};
