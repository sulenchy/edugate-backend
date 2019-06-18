"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var port = process.env.PORT || 3000;
var app = (0, _express["default"])();
app.get('/', function (req, res) {
  return res.send('Welcome to EduGate!');
});
app.listen(port, function () {
  return _winston["default"].log("info", "Example app listening on port ".concat(port, "!"));
});