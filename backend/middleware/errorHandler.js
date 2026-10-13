// Last-resort handlers. Without them Express answers unknown routes and
// malformed request bodies with an HTML page that, outside production, includes
// a stack trace, and the frontend (which expects JSON) cannot even parse it.

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Request body is not valid JSON",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large",
    });
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

module.exports = { notFound, errorHandler };
