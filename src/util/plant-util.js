const pool = require('../config/db-config');

const isPlantExist = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."plant" WHERE id=$1',
      [id],
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

module.exports = { isPlantExist };
