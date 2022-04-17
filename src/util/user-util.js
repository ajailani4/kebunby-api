const pool = require('../config/db-config');

const isUserActivityExist = async (username, plantId, isPlanting, isPlanted, isFavorited) => {
  let isExist = false;
  let query = '';

  try {
    if (isPlanting) {
      query = 'SELECT * FROM public."planting" WHERE "user"=$1 AND plant=$2';
    } else if (isPlanted) {
      query = 'SELECT * FROM public."planted" WHERE "user"=$1 AND plant=$2';
    } else if (isFavorited) {
      query = 'SELECT * FROM public."favorite" WHERE "user"=$1 AND plant=$2';
    }

    const result = await pool.query(
      query,
      [username, plantId],
    );

    if (result.rows[0]) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

module.exports = { isUserActivityExist };
