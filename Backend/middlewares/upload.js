const multer = require("multer");
const path = require("path");

// Design Image Storage
const designStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/designs"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// Item Image Storage
const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/items"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// Filter (common for both)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Exports
const uploadDesign = multer({ storage: designStorage, fileFilter });
const uploadItem = multer({ storage: itemStorage, fileFilter });

module.exports = {
  uploadDesign,
  uploadItem
};
