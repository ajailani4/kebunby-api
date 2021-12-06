const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary-config');

const uploadImage = (folderName, image) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: folderName,
    },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );

  streamifier.createReadStream(image).pipe(uploadStream);
});

module.exports = { uploadImage };
