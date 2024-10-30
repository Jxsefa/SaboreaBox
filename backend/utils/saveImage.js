const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.'));
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/ProductosNuevos');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${getExtension(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });


module.exports = upload;