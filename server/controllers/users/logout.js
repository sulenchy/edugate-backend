export default (req, res) => {
  req.session = null;
  res.status(200).json({msg: "User logged out successfully"})
}
