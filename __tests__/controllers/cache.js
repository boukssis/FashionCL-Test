const request = require("supertest");
const app = require("../../app");
const Cache = require("../../models/cache");
const mongoose = require('mongoose')


beforeAll(async () => {
  try {
    //delete all collections before starting the test
    await Cache.deleteMany({});
  } catch (error) {
    console.log("error", error);
  }
});


describe("Testing cache endpoints", () => {
  const API = "/api/v1/cache";

  it("Should add a new cache to the DB", async () => {
    const doc = {
      data: "test112",
    };
    const response = await request(app)
      .post(API + "/1")
      .send(doc);
    expect(response.body.data).toEqual(doc.data);
    expect(response.body.message).toEqual("Key added successfully");
  });


  it("should try to Get a non existent Key and create one instead and return it", async () => {
    const response = await request(app).get(API + "/2");
    expect(typeof response.body.data).toBe("string");
    expect(response.body.message).toEqual("cache miss");
    expect(response.statusCode).toEqual(200);
  });


  it("should update data when providing existing key", async () => {
    const doc = {
      data: "updated data",
    };
    const response = await request(app)
      .post(API + "/1")
      .send(doc);
    expect(response.body.message).toEqual("Key updated successfully");
    expect(response.body.data).toEqual(doc.data);
  });


  it("should get a key that exists in cache", async () => {
    const response = await request(app).get(API + "/2");
    const count = await Cache.countDocuments();
    expect(response.body.message).toEqual("cache hit");
    expect(count).toEqual(2);
  });


  it("should get all keys from cache", async () => {
    const response = await request(app).get(API);
    const expectedArray = ["1", "2"];
    expect(response.body.data.length).toEqual(2);
    expect(response.body.data).toEqual(expectedArray);
  });


it("should replace the oldest record if storage is exceeded",async()=>{
        //Use case max storage is 3, 
        const response = await request(app).post(API+'/3').send({data:"random data"}) //now storage is exceeded

        expect(response.body.data).toEqual("random data");
        expect(response.body.message).toEqual("Key added successfully");

        // add another record
        const record = await request(app).post(API+'/4').send({data:"random string"})
        const count = await Cache.countDocuments()
        expect(count).toEqual(3);
        expect(record.body.message).toEqual("Key added successfully");
        

})


  it("should return a 404 error while trying to remove a key that does not exist", async () => {
    const response = await request(app).delete(API + "/12");
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Invalid key! record not found!");
  });



  it("should delete all keys",async()=>{
      const response = await request(app).delete(API)
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("ok");
      const count = await Cache.countDocuments()
      expect(count).toEqual(0)

  })
});
