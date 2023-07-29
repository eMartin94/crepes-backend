import Producto from '../models/productModel.js';


export const listarProductos = async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
}

export const obtenerProducto = async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ message: "Producto no encontrado" })
  res.json(producto);
}

export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, ingredientes, imagen, categoria, subcategoria } = req.body;
  const producto = new Producto({ nombre, descripcion, precio, ingredientes, imagen, categoria, subcategoria });
  const productoCreado = await producto.save();
  res.json(productoCreado);

}

export const actualizarProducto = async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!producto) return res.status(404).json({ message: "Producto no encontrado" })
  res.json(producto);

}

export const eliminarProducto = async (req, res) => {
  const producto = await Producto.findByIdAndDelete(req.params.id);
  if (!producto) return res.status(404).json({ message: "Producto no encontrado" })
  res.json(producto);
}