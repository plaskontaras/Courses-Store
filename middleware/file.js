const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        const fileName = (new Date().toISOString() + '-' + file.originalname).split(":").join("");
        cb(null, fileName)
    }
})// here we define where and how we will upload files

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}// validator for files

module.exports = multer({
    storage,
    fileFilter
})
