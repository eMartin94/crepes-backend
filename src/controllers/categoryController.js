import Category from '../models/categoryModel.js';
import { categoryValidationSchema } from '../schemas/categorySchema.js';

export const listCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(404).json({ error: 'Error al obtener la lista de categorías' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: 'Error al obtener la categoría' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const inputCategory = { name };
    const validateInput = categoryValidationSchema.parse(inputCategory);
    const category = new Category({ ...validateInput, user: req.user.id });
    const existingCategory = await Category.findOne({
      name: validateInput.name,
    });
    if (existingCategory)
      return res.status(409).json({
        message: 'La categoría ya existe. Por favor, elija otro nombre.',
      });
    const newCategory = await category.save();
    return res.json(newCategory);
  } catch (error) {
    return res.status(404).json(error.errors.map((error) => error.message));
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateInput = {};
    if (name) updateInput.name = name;
    const category = await Category.findById(id);
    const validateInput = categoryValidationSchema.parse(updateInput);
    const existingCategory = await Category.findOne({
      name: validateInput.name,
    });
    if (
      existingCategory &&
      existingCategory._id.toString() !== category._id.toString()
    ) {
      return res.status(409).json({
        message: 'La categoría ya existe. Por favor, elija otro nombre.',
      });
    }
    const categoryId = id;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId, user: req.user.id },
      updateInput,
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ error: 'Categoría no encontrado' });
    return res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error.errors.map((error) => error.message));
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: 'Error al eliminar la category' });
  }
};
