const { User } = require('../../db/models');
const removeImage = require('../utils/removeImage');

class UserController {
  getUsers = async (req, res) => {
    try {
      const messages = await User.findAll();
      res.json(messages);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка получения пользователей', message: error.message });
    }
  };

  getOneUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
      res.json(user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка получения пользователя', message: error.message });
    }
  };

  updateUserInfo = async (req, res) => {
    try {
      const { name, email, nickname, city } = req.body;
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        return res.status(404).json({ text: 'Пользователь не найден' });
      }
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ text: 'Этот email уже используется' });
        }
      }
      await user.update({ name, email, nickname, city });
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        text: 'Ошибка изменения информации о пользователе',
        message: error.message,
      });
    }
  };

  updateUserPhoto = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        return res.status(404).json({ text: 'Пользователь не найден' });
      }

      if (req.file) {
        const newFilename = req.file ? req.file.filename : user.img;
        if (user.img !== 'noimage_detail.png') await removeImage(user.img);
        await user.update({ img: newFilename });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        text: 'Ошибка изменения фотографии пользователя',
        message: error.message,
      });
    }
  };

  deleteAccount = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
      if (user.img !== 'noimage_detail.png') await removeImage(user.img);
      await user.destroy();
      setTimeout(() => {
        res.sendStatus(204);
      }, 1500);
    } catch (error) {
      console.log(error);
      res.status(500).json({ text: 'Ошибка удаления аккаунта', message: error.message });
    }
  };
}

const userController = new UserController();

module.exports = userController;
