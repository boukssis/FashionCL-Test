const express = require("express");
const router = express.Router();
const cacheController = require("../controllers/cache");

router
  .route("/")
  .get(cacheController.getAllCache)
  .delete(cacheController.deleteAllCache);

router
  .route("/:key")
  .get(cacheController.getCache)
  .post(cacheController.createOrUpdate)
  .delete(cacheController.deleteCache);


module.exports=router



