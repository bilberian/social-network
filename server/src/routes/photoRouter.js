const { Router } = require('express');
const upload = require('../ middlewares/upload');
const { verifyAccessToken } = require('../ middlewares/verifyTokens');
const photoController = require('../controllers/photoController');
const photoRouter = Router();

photoRouter
  .route('/:ownerId')
  .get(verifyAccessToken, photoController.getUserPhotos)
  .post(verifyAccessToken, upload.single('pic'), photoController.postPhoto);

photoRouter
  .route('/:ownerId/:photoId')
  .get(verifyAccessToken, photoController.getOnePhoto)
  .patch(
    verifyAccessToken,
    photoController.validateOwnership,
    photoController.updatePhotoInfo,
  )
  .delete(
    verifyAccessToken,
    photoController.validateOwnership,
    photoController.deletePhoto,
  );

module.exports = photoRouter;
