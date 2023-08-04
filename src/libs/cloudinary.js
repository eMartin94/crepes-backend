import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config.js'


cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

export const subirImagen = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'images-crepe-api',
  })
}

export const eliminarImagen = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

export const actualizarImagen = async (publicId, filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
  })

}