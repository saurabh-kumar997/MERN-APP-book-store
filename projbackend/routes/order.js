const express = require("express");
const router = express.Router();

const {
  getOrderById,
  createOrder,
  getAllOrder,
  getOrderStatus,
  updateOrderStatus,
} = require("../controllers/order");
const { isAdmin, isSignedIn, isAuthenticate } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

//param
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//routes
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticate,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
router.get("/order/:userId", isSignedIn, isAuthenticate, isAdmin, getAllOrder);

router.get(
  "/order/status/:orderId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateOrderStatus
);
module.exports = router;
