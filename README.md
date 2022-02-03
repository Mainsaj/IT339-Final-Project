# Simple Blog

## This application contains a simple blog with an authentication microservice built along side
-Any user can view posts while only an authenticated user can add, edit or delete them.   

# Setup
## Open a terminal in the blog directory and users directory  
## Run npm install in each directory to install the required dependencies.
## This application was created with a local Mongo Database, posts can not be created and the microservice will not work without a database connection
## Create a .env file in each directory containing the following
-PORT
-MONGODB=mongodb
-MONGODB_HOST
-MONGODB_PORT     
-MONGODB_DATABASE
-MONGODB_COLLECTION
## Run npm start in each directory to launch each application  
## The application can now be viewed at the port specified in /blog/.env

# Database
-Sample datasets can be found in posts.json and users.json

## Testing
-Testing for the application is built with mocha and chai  
-Sample tests may be run with npm test  
-For tests to pass there must be a post at key=0
