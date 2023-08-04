import Producto from '../models/productModel.js';
import { subirImagen, actualizarImagen, eliminarImagen } from '../libs/cloudinary.js';
import fs from 'fs-extra';
import { productoSchema } from '../schemas/productSchema.js';

export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    // const productos = await Producto.find({ user: req.user.id }).populate("User");
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de productos' });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// export const crearProducto = async (req, res) => {
//   try {
//     const { nombre, descripcion, categoria, subcategoria } = req.body;
//     const precio = parseFloat(req.body.precio);
//     const isDisponible = req.body.disponible === 'true';
//     const ingredientes = req.body.ingredientes.split(',').map((ingrediente) => ingrediente.trim());
//     const campoProducto = {
//       nombre,
//       descripcion,
//       precio,
//       ingredientes,
//       categoria,
//       subcategoria,
//       disponible: isDisponible,
//     };
//     if (req.files?.image) {
//       const result = await subirImagen(req.files.image.tempFilePath);
//       campoProducto.imagen = {
//         public_id: result.public_id,
//         secure_url: result.secure_url,
//       };
//       await fs.unlink(req.files.image.tempFilePath);
//       // console.log(result);
//     }
//     const validData = productoSchema.parse(campoProducto);
//     const producto = new Producto({ ...validData, user: req.user.id });
//     const productoCreado = await producto.save();
//     console.log(productoCreado);
//     res.json(productoCreado);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error.errors.map((error) => error.message));
//   }
// };

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, subcategoria } = req.body;
    const precio = parseFloat(req.body.precio);
    const isDisponible = req.body.disponible === 'true';
    const ingredientes = req.body.ingredientes.split(',').map((ingrediente) => ingrediente.trim());
    const campoProducto = {
      nombre,
      descripcion,
      precio,
      ingredientes,
      categoria,
      subcategoria,
      disponible: isDisponible,
    };

    const validData = productoSchema.parse(campoProducto);
    if (req.files?.image) {
      const result = await subirImagen(req.files.image.tempFilePath);
      campoProducto.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }
    const producto = new Producto({ ...validData, user: req.user.id });
    const productoCreado = await producto.save();
    console.log(productoCreado);
    res.json(productoCreado);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors.map((error) => error.message));
  }
};


export const actualizarProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      imagen,
      categoria,
      subcategoria,
      disponible,
      precio,
      ingredientes,
    } = req.body;
    const isDisponible = req.body.disponible === 'true';
    const actualizarCampo = {};
    if (nombre) actualizarCampo.nombre = nombre;
    if (descripcion) actualizarCampo.descripcion = descripcion;
    if (imagen) actualizarCampo.imagen = imagen;
    if (categoria) actualizarCampo.categoria = categoria;
    if (subcategoria) actualizarCampo.subcategoria = subcategoria;
    // if (disponible !== undefined) actualizarCampo.disponible = Boolean(disponible);
    if (disponible) actualizarCampo.disponible = isDisponible;
    if (precio !== undefined) actualizarCampo.precio = parseFloat(precio);
    if (ingredientes) {
      actualizarCampo.ingredientes = ingredientes
        .split(',')
        .map((ingrediente) => ingrediente.trim());
    }
    const validData = productoSchema.parse(actualizarCampo);
    const producto = await Producto.findById(req.params.id);
    if (req.files?.image) {
      await eliminarImagen(producto.imagen.public_id);
      const result = await actualizarImagen(
        producto.imagen.public_id,
        req.files.image.tempFilePath
      );
      producto.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }
    const productoId = req.params.id;
    const productoActualizado = await Producto.findOneAndUpdate(
      { _id: productoId, user: req.user.id },
      validData,
      { new: true }
    );
    if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(productoActualizado);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors.map((error) => error.message));
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    await eliminarImagen(producto.imagen.public_id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
