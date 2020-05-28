const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cat) => {
    if (err || !cat) {
      return res.status(400).json({
        error: "Category not found",
      });
    }

    req.category = cat;
    next();
  });
};

exports.createCategory = (req, res) => {
  let category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot save it in DB",
      });
    }

    res.json(category);
  });
};

exports.getAllCategory = (req, res) => {
  Category.find((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.updateCategory = (req, res) => {
  let category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Cannot update category",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  let category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Cannnot delete the category",
      });
    }
    res.json(category);
  });
};
