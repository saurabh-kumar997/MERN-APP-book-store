const express = require("express");
const router = express.Router();

const {
  getProductById,
  getProduct,
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getUniqueCategory,
  photo,
} = require("../controllers/product");
const { getCategoryById } = require("../controllers/category");
const { isAdmin, isSignedIn, isAuthenticate } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("productId", getProductById);
router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

//post route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  createProduct
);

//get routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/product", getAllProduct);
router.get("/product/category", getUniqueCategory);

//delete route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteProduct
);

//update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateProduct
);

//

module.exports = router;
