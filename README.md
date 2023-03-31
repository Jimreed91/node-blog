# Node BlogList
------
### Node backend with jwt authentication
A backend I put together from the ground up to get to know all the parts of a Node backend better and practivce TDD. This especially helped develop my understanding of middleware as I used it to DRY up the controllers by extracting user information from tokens in the middleware.
Users can create an account, once signed in they can add blogs they want to save to the list. A user can only delete their own entries
#### Features
- Testing with Jest and supertest
- jwt auth using bcrypt
- utilizing mongoose/mongoDB to aggrigate a users notes
