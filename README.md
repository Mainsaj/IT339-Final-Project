# Simple Blog

## This application contains a simple blog with an authentication microservice built along side
### Any user can view posts while only an authenticated user can add, edit or delete them.   

# Setup
### This application was created with a local Mongo Database, posts can not be created and the microservice will not work without a database connection
1. Open a terminal in the blog directory and users directory  
2. Run npm install in each directory to install the required dependencies.

3. Create a .env file in each directory containing the following
> - PORT
> - MONGODB=mongodb
> - MONGODB_HOST
> - MONGODB_PORT     
> - MONGODB_DATABASE
> - MONGODB_COLLECTION
4. Run npm start in each directory to launch each application  
5. The application can now be viewed at the port specified in /blog/.env

# Database
### Example Post
`[{
  "_id": {
    "$oid": "Auto-generated on post creation"
  },
  "key": "",
  "title": "",
  "body": ""
}]`
### Example User
`[{
        "username":"",
        "password":"",
        "firstName":"",
        "lastName":""
    }]`

# Testing
### Testing for the application is built with mocha and chai  
### Sample tests may be run with npm test  
### For tests to pass there must be a post at key=0

