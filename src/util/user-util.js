const pool = require('../config/db-config');

const isPlantActivityExist = async (username, plantId, isPlanting, isPlanted, isFavorited) => {
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

const getPlantActivitiesCount = async (username, isPlanting, isPlanted, isUploaded) => {
  let query = '';
  let count = 0;

  try {
    if (isPlanting) {
      query = 'SELECT COUNT(*) FROM public."planting" WHERE "user"=$1';
    } else if (isPlanted) {
      query = 'SELECT COUNT(*) FROM public."planted" WHERE "user"=$1';
    } else if (isUploaded) {
      query = 'SELECT COUNT(*) FROM public."plant" WHERE author=$1';
    }

    const result = await pool.query(
      query,
      [username],
    );

    if (result.rows[0]) {
      count = parseInt(result.rows[0].count, 10);
    }
  } catch (err) {
    console.log(err);
  }

  return count;
};

const deletePlantActivity = async (username, plantId, isPlanting, isPlanted, isFavorited) => {
  let isDeleted = false;
  let query = '';

  try {
    if (isPlanting) {
      query = 'DELETE FROM public."planting" WHERE "user"=$1 AND plant=$2';
    } else if (isPlanted) {
      query = 'DELETE FROM public."planted" WHERE "user"=$1 AND plant=$2';
    } else if (isFavorited) {
      query = 'DELETE FROM public."favorite" WHERE "user"=$1 AND plant=$2';
    }

    const result = await pool.query(
      query,
      [username, plantId],
    );

    if (result) isDeleted = true; else isDeleted = false;
  } catch (err) {
    console.log(err);
  }

  return isDeleted;
};

module.exports = {
  isPlantActivityExist,
  getPlantActivitiesCount,
  deletePlantActivity,
};
