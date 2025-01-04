const { Photo } = require('../../db/models');
const removeImage = require('../utils/removeImage');

class PhotoController {
  validateOwnership = async (req, res, next) => {
    try {
      const { photoId } = req.params;
      const photo = await Photo.findByPk(photoId);
      if (photo.ownerId !== res.locals.user.id) {
        return res.sendStatus(403);
      }
      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ text: 'Ошибка валидации', message: error.message });
    }
  };

  getUserPhotos = async (req, res) => {
    try {
      const { ownerId } = req.params;
      const photos = await Photo.findAll({ where: { ownerId } });
      res.json(photos);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка получения фотографий', message: error.message });
    }
  };

  getOnePhoto = async (req, res) => {
    try {
      const photo = await Photo.findByPk(req.params.photoId);
      if (!photo) {
        return res.status(404).json({ text: 'Фотография не найдена' });
      }
      res.json(photo);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка получения фотографии', message: error.message });
    }
  };

  postPhoto = async (req, res) => {
    try {
      const { desc } = req.body;
      const filename = req.file ? req.file.filename : null;
      const newPhoto = await Photo.create({
        desc,
        img: filename,
        ownerId: res.locals.user.id,
      });
      res.status(201).json(newPhoto);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка создания фотографии', message: error.message });
    }
  };

  updatePhotoInfo = async (req, res) => {
    try {
      const { desc } = req.body;
      const photo = await Photo.findByPk(req.params.photoId);
      await photo.update({ desc });
      res.json(photo);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка обновления данных фотографии', message: error.message });
    }
  };

  deletePhoto = async (req, res) => {
    try {
      const photo = await Photo.findByPk(req.params.photoId);
      await removeImage(photo.pic);
      await photo.destroy();
      setTimeout(() => {
        res.sendStatus(204);
      }, 1500);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка удаления фотографии', message: error.message });
    }
  };
}

const photoController = new PhotoController();
module.exports = photoController;
