import multer from 'multer';
import path from 'path';

// allowed file types
const allowedFileTypes = ['.pdf', '.docx', '.jpg', '.jpeg', '.png', '.gif'];


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + Date.now() + ext); // Rename file to avoid conflicts
  }
});

// File filter to only allow certain file types
const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types are pdf, docx, jpg, jpeg, png, gif'));
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;