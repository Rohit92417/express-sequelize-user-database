const db = require("../config/sequelize");
const User = db.user;
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

// Create new user
exports.insert = async (req, res) => {
  let image = await cloudinary.uploader.upload(req.file.path);
  const user = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_password: CryptoJS.AES.encrypt(
      req.body.user_password,
      process.env.SECURITY_KEY
    ).toString(),
    user_image: image.secure_url,
    total_orders: req.body.total_orders,
  };
  try {
    const newUser = await User.create(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET TOKEN
exports.auth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_email: req.body.user_email },
    });
    !user && res.status(401).json("User does not exist");
    const bytes = CryptoJS.AES.decrypt(
      user.user_password,
      process.env.SECURITY_KEY
    );
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword === req.body.user_password) {
      accessToken = JWT.sign(
        { user_id: user.user_id },
        process.env.SECURITY_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET USER BY ID
exports.details = async (req, res) => {
  if (req.params.id === req.user.user_id) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ["user_image"],
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ err, message: "Something went to Wrong" });
    }
  } else {
    res.status(401).json("you are not authenticate");
  }
};

// Update a user by id
exports.update = async (req, res) => {
  if (req.params.id === req.user.user_id) {
    let newImage = "";
    const user = await User.findByPk(req.params.id);
    if (req.file) {
      let url = user.user_image.split("/")[7];
      let secure_url = url.split(".")[0];
      await cloudinary.uploader.destroy(secure_url);
      newImage = await cloudinary.uploader.upload(req.file.path);
    }
    if (req.body.user_password) {
      req.body.user_password = CryptoJS.AES.encrypt(
        req.body.user_password,
        process.env.SECURITY_KEY
      ).toString();
    }
    const updateUser = {
      user_name: req.body.user_name || user.user_name,
      user_email: req.body.user_email || user.user_email,
      user_password: req.body.user_password || user.user_password,
      user_image: newImage.secure_url || user.user_image,
      total_orders: req.body.total_orders || user.user.total_orders,
    };
    await User.update(updateUser, { where: { user_id: req.params.id } })
      .then(res.status(201).json("User was updated successfully."))
      .catch((err) => {
        res.status(500).json({ err, message: "Something went to Wrong" });
      });
  } else {
    res.status(401).json("you are not authenticate");
  }
};

// Delete a user by id
exports.delete = async (req, res) => {
  if (req.params.id === req.user.user_id) {
    const user = await User.findByPk(req.params.id);
    try {
      let url = user.user_image.split("/")[7];
      let secure_url = url.split(".")[0];
      console.log(secure_url);
      await cloudinary.uploader.destroy(secure_url);
      await User.destroy({ where: { user_id: req.params.id } });
      res.status(200).json("User deleted Sucessfully");
    } catch (err) {
      res.status(500).json({ err, message: "Something went to Wrong" });
    }
  } else {
    res.status(401).json("you are not authenticate");
  }
};

//GET ALL USER
exports.getAll = async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
