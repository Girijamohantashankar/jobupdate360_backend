const multer = require('multer');
const path = require('path');

// Set file storage 
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 }, 
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

module.exports = upload;
