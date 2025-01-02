const { Router } = require('express');
const upload = require('../ middlewares/upload');
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../ middlewares/verifyTokens');
const userRouter = Router();

userRouter.route('/').get(userController.getUsers);

userRouter
  .route('/:userId')
  .get(verifyAccessToken, userController.getOneUser)
  .patch(verifyAccessToken, userController.updateUserInfo)
  .delete(verifyAccessToken, userController.deleteAccount);

userRouter
  .route('/:userId/image')
  .patch(verifyAccessToken, upload.single('img'), userController.updateUserPhoto);

userRouter.route('/:userId/subscribe').post(verifyAccessToken, userController.subscribe);

userRouter
  .route('/:userId/unsubscribe')
  .delete(verifyAccessToken, userController.unsubscribe);

module.exports = userRouter;
