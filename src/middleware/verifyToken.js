const JWT = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeaders = req.headers.token;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    JWT.verify(token, process.env.SECURITY_KEY, (err, user) => {
      if (err) throw res.status(401).json("token is not valid");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "you are not authenticate" });
  }
}

module.exports = verify;
