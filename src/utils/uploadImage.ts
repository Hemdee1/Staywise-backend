import { v2 } from "cloudinary";

const cloudinary = v2;

const uploadImage = async (id: any, img: string) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const res = await cloudinary.uploader.upload(img, {
      folder: "user-images",
      public_id: id,
      width: 1000,
      crop: "scale",
      quality: "auto",
      fetch_format: "auto",
    });

    return res;
  } catch (err) {
    console.log(err);
  }
};

export default uploadImage;
