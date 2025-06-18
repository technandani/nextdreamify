import multer, { FileFilterCallback } from 'multer';
import { tmpdir } from 'os';
import type { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG images are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});
