const pool = require('../config/db-config');

const getPlantCategory = async (id) => {
  let category = {};

  try {
    const result = await pool.query(
      'SELECT * FROM public."category" WHERE id=$1',
      [id],
    );

    if (result.rows[0]) {
      const categoryResult = result.rows[0];

      category = {
        id: categoryResult.id,
        category: categoryResult.category,
      };
    }
  } catch (err) {
    console.log(err);
  }

  return category;
};

module.exports = { getPlantCategory };
