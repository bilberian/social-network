const searchRouter = require('express').Router();
const { Op } = require('sequelize');
const { User } = require('../../db/models');

searchRouter.get('/', async (req, res) => {
  const { filter } = req.query;

  try {
    const usersArray = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${filter}%` } },
          { nickname: { [Op.iLike]: `%${filter}%` } },
        ],
      },
    });

    res.json(usersArray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
module.exports = searchRouter;
