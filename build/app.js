"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
console.log(process.env.PORT);
app.get('/', function (req, res) {
  return res.send('<h1 style="text-align:center; padding-top:70px">Welcome to EduGate!</h1>');
});
app.listen(process.env.PORT, function () {
  return console.log("Example app listening on port ".concat(process.env.PORT, "!"));
});