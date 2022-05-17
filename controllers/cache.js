const Cache = require("../models/cache");
const randomStringGenerator = require("../helpers/randomStringGenerator");
const handleTtl = require("../helpers/handleTtl");
const handleStorageLimit = require("../helpers/handleStorageLimit");
const { createCustomError } = require("../errors/custom-error");

exports.getAllCache = async (req, res, next) => {
  try {
    const caches = await Cache.find({});
    if (caches.length === 0) {
      return res.status(404).json({ message: "Database is empty" });
    }
    const currentTime = new Date().getTime();
    const keys = await Promise.all(
      caches.map(async (cache) => {
        if (cache.get("ttl") < currentTime) {
          //ttl is exceeded, therefore cached data should not be used (random value get generated)
          const randomString = randomStringGenerator();
          await cache.updateOne({
            data: randomString,
            ttl: handleTtl(),
            createdAt: new Date().getTime(),
          });

          return randomString;
        }

        return cache.get("key");
      })
    );
    res.status(200).json({ message: "keys fetched successfully", data: keys });
  } catch (error) {
    next(error);
  }
};

exports.getCache = async (req, res, next) => {
  try {
    const { key } = req.params;
    let record = await Cache.findOne({ key });
    if (record) {
      //key found in DB
      const currentTime = new Date().getTime();
      if (record.get("ttl") < currentTime) {
        //time is exceeded so basically it is like a cache miss !
        const randomString = randomStringGenerator();
        await record.updateOne({
          data: randomString,
          ttl: handleTtl(),
          createdAt: new Date().getTime(),
        });
        message = "Cache miss";
        return res.status(200).json({ message, data: record.data });
      }
      const message = "cache hit";
      await record.updateOne({
        ttl: handleTtl(),
      }); //reset TTL on cache hit

      return res.status(200).json({ message, data: record.data });
    } else {
      const randomString = randomStringGenerator();
      const result = await handleStorageLimit(key, randomString);

      if (!result) {
        record = await Cache.create({
          key: key,
          data: randomString,
          ttl: handleTtl(),
          createdAt: new Date().getTime(),
        });
      }

      res.status(200).json({ message: "cache miss", data: randomString });
    }
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdate = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    let record = await Cache.findOne({ key: key });

    if (record) {
      //Key exist : update data
      record.data = data;
      await record.save();
      return res
        .status(200)
        .json({ message: "Key updated successfully", data: record.data });
    } else {
      const result = await handleStorageLimit(key, data);

      if (!result) {
        //cache storage does not exceed the limit
        record = await Cache.create({
          key: key,
          data: data,
          ttl: handleTtl(),
          createdAt: new Date().getTime(),
        });
      }
      res.status(200).json({ message: "Key added successfully", data: data });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCache = async (req, res, next) => {
  try {
    const { key } = req.params;
    const record = await Cache.findOne({ key });
    if (record) {
      await Cache.deleteOne({ key });
      return res.status(200).json({ message: "ok" });
    }
    next(createCustomError("Invalid key! record not found!", 404));
  } catch (error) {
    next(error);
  }
};

exports.deleteAllCache = async (req, res, next) => {
  try {
    await Cache.deleteMany({}).exec();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(err);
  }
};
