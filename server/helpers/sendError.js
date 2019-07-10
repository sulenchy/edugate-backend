const sendError = (res, statusCode, error) => {
  return res.status(statusCode).json({
    status: 'failure',
    error
    })
}

export default sendError;
