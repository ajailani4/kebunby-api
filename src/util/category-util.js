const pool = require('../config/db-config');

const getPlantCategory = async (id) => {
  let category = '';

  try {
    const result = await pool.query(
      'SELECT category FROM public."category" WHERE id=$1',
      [id],
    );

    if (result.rows[0]) {
      category = result.rows[0].category;
    }
  } catch (err) {
    console.log(err);
  }

  return category;
};

module.exports = { getPlantCategory };
