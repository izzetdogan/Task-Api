const express = require('express');
const auth = require('../middleware/auth');
const usersControllers = require('../controller/user-controller');
const multer = require('multer');
const router = express.Router();

const upload = multer({
 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/',usersControllers.postUser);
router.get('/me',auth,usersControllers.getMe)
router.get('/',usersControllers.getUsers);
router.get('/:uid',usersControllers.getUserById);
router.patch('/me', auth, usersControllers.updateUser);
router.delete('/me',auth,usersControllers.deleteUser);

//------------------------IMAGE---------------------------------//

router.post('/me/avatar',auth,upload.single('avatar'),usersControllers.postmeAvatar);
router.delete('/me/avatar', auth, usersControllers.deleteAvatar);
router.get('/:uid/avatar',usersControllers.getAvatarById)

//--------------------------Authenticate----------------------------------------//


router.post('/login',usersControllers.userLogin);
router.post('/logout', auth, usersControllers.userLogout);
router.post('/logoutAll', auth, usersControllers.logoutAll);

module.exports = router;

