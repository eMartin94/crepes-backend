import Categoria from '../models/categoryModel.js';
import { categoriaSchema } from '../schemas/categorySchema.js';

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la lista de categorias' });
  }
}

export const obtenerCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);
    if (!categoria) return res.status(404).json({ message: 'Categoria no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al obtener la categoria' });
  }
}

export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const campoCategoria = { nombre };
    const validarCampos = categoriaSchema.parse(campoCategoria);
    const categoria = new Categoria({ ...validarCampos, user: req.user.id });
    const categoriaExiste = await Categoria.findOne({ nombre: validarCampos.nombre });
    if (categoriaExiste)
      return res.status(409).json({ message: 'La categoria ya existe. Por favor, elija otro nombre.' });
    const categoriaCreada = await categoria.save();
    return res.json(categoriaCreada);
  } catch (error) {
    return res.status(400).json(error.errors.map((error) => error.message));
  }
}

export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const actualizarCampo = {};
    if (nombre) actualizarCampo.nombre = nombre;
    const categoria = await Categoria.findById(id);
    const validarCampos = categoriaSchema.parse(actualizarCampo);
    const categoriaExiste = await Categoria.findOne({ nombre: validarCampos.nombre });
    if (categoriaExiste && categoriaExiste._id.toString() !== categoria._id.toString()) {
      return res
        .status(409)
        .json({ message: 'El nombre de la categoria ya existe. Por favor, elija otro nombre.' });
    }
    const categoriaId = id;
    const categoriaActualizada = await Categoria.findOneAndUpdate(
      { _id: categoriaId, user: req.user.id },
      actualizarCampo,
      { new: true });
    if (!categoriaActualizada) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(categoriaActualizada);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors.map((error) => error.message));
  }
}

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndDelete(id);
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la categoria' });
  }

}