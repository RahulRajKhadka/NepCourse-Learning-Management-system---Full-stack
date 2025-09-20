import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const random = uuidv4();
    cb(null, random + "" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File received:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype
  });

  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    console.log(" File accepted:", file.mimetype);
    cb(null, true);
  } else {
    console.log(" File rejected. Invalid type:", file.mimetype);
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed!`), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  }
});

export default upload;
