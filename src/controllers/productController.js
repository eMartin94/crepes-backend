import Producto from '../models/productModel.js';
import { subirImagen, actualizarImagen, eliminarImagen } from '../libs/cloudinary.js';
import fs from 'fs-extra';
import { productoSchema } from '../schemas/productSchema.js';

export const listarProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const options = {
      page,
      limit,
    }

    const productos = await Producto.paginate({}, options);
    res.json(productos);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la lista de productos' });
  }
};

export const listarProductosDisponibles = async (req, res) => {
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
    // const productosDisponibles = await Producto.paginate({ disponible: true }, options);
    const productosDisponibles = await Producto.find({ disponible: true });
    res.json(productosDisponibles);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la lista de productos disponibles' });
  }
};


export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener el producto' });
  }
};

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

    const validarCampos = productoSchema.parse(campoProducto);
    const producto = new Producto({ ...validarCampos, user: req.user.id });
    console.log(producto);
    const productoExiste = await Producto.findOne({ nombre: validarCampos.nombre });
    if (productoExiste)
      return res
        .status(409)
        .json({ message: 'El nombre del producto ya existe. Por favor, elija otro nombre.' });

    if (req.files?.image) {
      console.log(req.files?.image);
      const result = await subirImagen(req.files.image.tempFilePath);
      producto.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const productoCreado = await producto.save();
    return res.json(productoCreado);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.errors.map((error) => error.message));
  } finally {
    if (req.files?.image) {
      const tempFilePath = req.files.image.tempFilePath;
      if (fs.existsSync(tempFilePath)) {
        try {
          await fs.unlink(tempFilePath);
          console.log("Imagen temporal eliminada correctamente.");
        } catch (error) {
          console.error("Error al eliminar la imagen temporal:", error);
        }
      } else {
        console.warn("El archivo temporal no existe:", tempFilePath);
      }
    }
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
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
    if (categoria) actualizarCampo.categoria = categoria;
    if (subcategoria) actualizarCampo.subcategoria = subcategoria;
    if (disponible) actualizarCampo.disponible = isDisponible;
    if (precio !== undefined) actualizarCampo.precio = parseFloat(precio);
    if (ingredientes) {
      actualizarCampo.ingredientes = ingredientes
        .split(',')
        .map((ingrediente) => ingrediente.trim());
    }

    const producto = await Producto.findById(req.params.id);
    const validarCampos = productoSchema.parse(actualizarCampo);
    const productoExiste = await Producto.findOne({ nombre: validarCampos.nombre });
    if (productoExiste && productoExiste._id.toString() !== producto._id.toString()) {
      return res
        .status(409)
        .json({ message: 'El nombre del producto ya existe. Por favor, elija otro nombre.' });
    }

    if (req.files?.image) {
      if (producto.imagen && producto.imagen?.public_id) {
        await eliminarImagen(producto.imagen?.public_id);
      }
      const result = await actualizarImagen(
        producto.imagen?.public_id,
        req.files.image.tempFilePath
      );
      actualizarCampo.imagen = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const productoId = req.params.id;
    const productoActualizado = await Producto.findOneAndUpdate(
      { _id: productoId, user: req.user.id },
      actualizarCampo,
      { new: true }
    );

    if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(productoActualizado);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors.map((error) => error.message));
  } finally {
    if (req.files?.image) {
      const tempFilePath = req.files.image.tempFilePath;
      if (fs.existsSync(tempFilePath)) {
        try {
          await fs.unlink(tempFilePath);
          console.log("Imagen temporal eliminada correctamente.");
        } catch (error) {
          console.error("Error al eliminar la imagen temporal:", error);
        }
      } else {
        console.warn("El archivo temporal no existe:", tempFilePath);
      }
    }
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    if (producto.imagen && producto.imagen.public_id)
      await eliminarImagen(producto.imagen.public_id);

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el producto' });
  }
};
