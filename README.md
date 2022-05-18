# Fashion Cloud test assignment

## Endpoints 

**GET request to /api/v1/cache :**
This API Path will list down all cache entries that exists in a database.

**GET request to /api/v1/cache/{key} :**
This API will return the data of the given key and if it doesn't exist it will create it.

**POST request to /api/cache/{key} :**
This API will add a key in the database or update it if it already exist.

**DELETE request to /api/cache/{key} :**
This API will delete the entry of the given key.

**DELETE request to /api/cache :**
This API call will remove all entries from database

## Run project
Install app dependencies.
`npm install`

Run app
`npm start`

Run the tests
`npm run test`
The tests run in a different database, not modifying the main one (testing env).


# Instructions
###### Use postman to test this API
###### In the config folder you can provide env variables such as mongoDB url and port, TTL, Max storage limit for both testing and developement environement




