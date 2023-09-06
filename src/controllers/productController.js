import Product from '../models/productModel.js';
import { uploadImage, updateImage, deleteImage } from '../libs/cloudinary.js';
import fs from 'fs-extra';
import { productValidationSchema } from '../schemas/productSchema.js';

export const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const products = await Product.paginate({}, options);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: 'Error al obtener la lista de productos' });
  }
};

export const listAvailableProducts = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // let limit = parseInt(req.query.limit) || 10;
    // const maxLimit = 50;
    // if (limit > maxLimit) {
    //   limit = maxLimit;
    // }
    // const options = {
    //   page,
    //   limit,
    // };
    // const availableProducts = await Product.paginate({ available: true }, options);
    const availableProducts = await Product.find({ available: true }).sort({
      createdAt: -1,
    });
    res.json(availableProducts);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Error al obtener la lista de productos disponibles' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory } = req.body;
    const price = parseFloat(req.body.price);
    const isAvailable = req.body.available === 'true';
    const ingredients = req.body.ingredients
      .split(',')
      .map((ingredient) => ingredient.trim());
    const inputProduct = {
      name,
      description,
      price,
      ingredients,
      category,
      subcategory,
      available: isAvailable,
    };

    const validateInput = productValidationSchema.parse(inputProduct);
    const product = new Product({ ...validateInput, user: req.user.id });
    console.log(product);
    const existingProduct = await Product.findOne({
      nombre: validateInput.name,
    });
    if (existingProduct)
      return res.status(409).json({
        message:
          'El nombre del producto ya existe. Por favor, elija otro nombre.',
      });

    if (req.files?.image) {
      console.log(req.files?.image);
      const result = await uploadImage(req.files.image.tempFilePath);
      product.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const newProduct = await product.save();
    return res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(404).json(error.errors.map((error) => error.message));
  } finally {
    if (req.files?.image) {
      const tempFilePath = req.files.image.tempFilePath;
      if (fs.existsSync(tempFilePath)) {
        try {
          await fs.unlink(tempFilePath);
          console.log('Imagen temporal eliminada correctamente.');
        } catch (error) {
          console.error('Error al eliminar la imagen temporal:', error);
        }
      } else {
        console.warn('El archivo temporal no existe:', tempFilePath);
      }
    }
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      available,
      price,
      ingredients,
    } = req.body;
    const isAvailable = req.body.available === 'true';

    const inputUpdate = {};
    if (name) inputUpdate.name = name;
    if (description) inputUpdate.description = description;
    if (category) inputUpdate.category = category;
    if (subcategory) inputUpdate.subcategory = subcategory;
    if (available) inputUpdate.available = isAvailable;
    if (price !== undefined) inputUpdate.price = parseFloat(price);
    if (ingredients) {
      inputUpdate.ingredients = ingredients
        .split(',')
        .map((ingredient) => ingredient.trim());
    }

    const product = await Product.findById(req.params.id);
    const validateInput = productValidationSchema.parse(inputUpdate);
    const existingProduct = await Product.findOne({ name: validateInput.name });
    if (
      existingProduct &&
      existingProduct._id.toString() !== product._id.toString()
    ) {
      return res.status(409).json({
        message:
          'El nombre del producto ya existe. Por favor, elija otro nombre.',
      });
    }

    if (req.files?.image) {
      if (product.imagen && product.imagen?.public_id) {
        await deleteImage(product.imagen?.public_id);
      }
      const result = await updateImage(
        product.imagen?.public_id,
        req.files.image.tempFilePath
      );
      inputUpdate.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const productId = req.params.id;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, user: req.user.id },
      inputUpdate,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error.errors.map((error) => error.message));
  } finally {
    if (req.files?.image) {
      const tempFilePath = req.files.image.tempFilePath;
      if (fs.existsSync(tempFilePath)) {
        try {
          await fs.unlink(tempFilePath);
          console.log('Imagen temporal eliminada correctamente.');
        } catch (error) {
          console.error('Error al eliminar la imagen temporal:', error);
        }
      } else {
        console.warn('El archivo temporal no existe:', tempFilePath);
      }
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Producto no encontrado' });
    if (product.imagen && product.imagen.public_id)
      await deleteImage(product.imagen.public_id);

    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Error al eliminar el producto' });
  }
};
