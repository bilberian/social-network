const { User, Subscription } = require('../../db/models');
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

  subscribe = async (req, res) => {
    try {
      const subscriberId = res.locals.user.id;
      const subscribedToId = req.params.userId;

      const user = await User.findByPk(subscribedToId);
      if (!user) {
        return res.status(404).json({ text: 'Пользователь не найден' });
      }

      await Subscription.create({ subscriberId, subscribedToId });
      res.status(201).json({ text: 'Подписка успешно создана' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ text: 'Ошибка подписки', message: error.message });
    }
  };

  unsubscribe = async (req, res) => {
    try {
      const subscriberId = res.locals.user.id;
      const subscribedToId = req.params.userId;

      const user = await User.findByPk(subscribedToId);
      if (!user) {
        return res.status(404).json({ text: 'Пользователь не найден' });
      }

      const result = await Subscription.destroy({
        where: {
          subscriberId,
          subscribedToId,
        },
      });

      if (result === 0) {
        return res.status(404).json({ text: 'Подписка не найдена' });
      }

      res.status(204).json({ text: 'Вы отписались от пользователя' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ text: 'Ошибка отписки', message: error.message });
    }
  };

  getUserSubscriptions = async (req, res) => {
    try {
      const userId = res.locals.user.id;
      const userSubscriptions = await User.findByPk(userId, {
        include: [
          {
            model: User,
            as: 'Following',
          },
        ],
      });

      res.json(userSubscriptions.Following);
    } catch (error) {
      console.log(error);
      res.status(500).json({ text: 'Ошибка получения подписок', message: error.message });
    }
  };

  getUserFollowers = async (req, res) => {
    try {
      const userId = res.locals.user.id;
      const userWithSubscribers = await User.findByPk(userId, {
        include: [
          {
            model: User,
            as: 'Subscribers',
          },
        ],
      });

      res.json(userWithSubscribers.Subscribers);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка получения подписчиков', message: error.message });
    }
  };
}

const userController = new UserController();

module.exports = userController;
