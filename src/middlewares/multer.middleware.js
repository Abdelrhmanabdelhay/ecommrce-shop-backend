import multer from 'multer';
import path from 'path';

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'Images'));
    }
    ,
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
        }
    }
}).single('image');

export default upload;