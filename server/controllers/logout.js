export default (req, res) => {
  req.session = {};
  res.redirect('/');
}
