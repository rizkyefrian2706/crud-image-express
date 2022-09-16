const router = require('express').Router()
const user = require('../controller/user')
const multer = require('multer')
const bodyParser = require('body-parser') 
router.use(bodyParser.json())
 
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg'
    ){ 
        cb(null, true);
    }else{
        cb(null, false)
    }
}

const upload = multer({storage: fileStorage, fileFilter: fileFilter});
const uploadMultiple = upload.fields([{ name: 'gambar', maxCount: 1 }])

router.get('/user', user.index)  
router.get('/user/:id', user.show)  
router.post('/user', uploadMultiple, user.create)   
router.put('/user/:id', uploadMultiple, user.update)  
router.delete('/user/:id', user.destroy)  

module.exports = router
