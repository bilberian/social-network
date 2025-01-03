const { User, Subscription } = require('./db/models');
const pretty = (obj) => JSON.parse(JSON.stringify(obj));
async function main() {
  try {

      const userWithSubscribers = await User.findByPk(1, {
        include: [
          {
            model: User,
            as: 'Following', 
          },
        ],
      });
        console.dir(pretty(userWithSubscribers.Following), { depth: null });
  } catch (error) {
    console.log(error);
  }
}

main();
