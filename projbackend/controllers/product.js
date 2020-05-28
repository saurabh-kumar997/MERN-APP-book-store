const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id, (err, product) => {
    if (err) {
      return res.status(400).json({
        error: "No product found",
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "problem with the file",
      });
    }

    const { name, price, description, category, author } = fields;

    if (!name || !price || !description || !category || !author) {
      return res.status(400).json({
        error: "Please provide all fields",
      });
    }

    const product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        res.status(400).json({
          error: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving product failed",
        });
      }

      res.json(product);
    });
  });
};

exports.getAllProduct = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "No Products found",
        });
      }
      res.json(products);
    });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedproduct) => {
    if (err) {
      return res.status(400).json({
        error: "Can't find the product to delete",
      });
    }
    return res.json(deletedproduct);
  });
};

exports.updateProduct = (req, res) => {
  //
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "problem with the file",
      });
    }

    let product = req.product;

    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        res.status(400).json({
          error: "File size too big!",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed",
        });
      }

      res.json(product);
    });
  });
};

exports.getUniqueCategory = (req, res) => {
  Product.distinct("category", (err, category) => {
    if (err) {
      return res.status(400).json({
        err: "No category found",
      });
    }
    res.json(category);
  });
};

//Middlewares

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let updationOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }, //
      },
    };
  });

  Product.bulkWrite(updationOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
