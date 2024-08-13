# Backend test project

**Backend test project** is a simple Twitter clone API that allows users to register, log in, tweet, follow/unfollow other users, and view their personalized feed.

## Features

- **User Registration and Authentication**
  - Register with a unique username and password
  - Log in to receive a JWT token for authenticated requests
  - Log out functionality

- **Tweeting**
  - Post a tweet with a message up to 200 characters
  - View tweets from followed users in a personalized feed

- **User Interaction**
  - Follow and unfollow other users
  - View tweets in the feed ordered by the latest time

## API Endpoints

### User Endpoints

- **POST /register**
  - Register a new user
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "token": "string"
    }
    ```

- **POST /login**
  - Log in an existing user
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "token": "string"
    }
    ```

- **POST /logout**
  - Log out the current user

- **POST /follow/:user_id**
  - Follow another user
  - Requires JWT authentication

- **DELETE /unfollow/:user_id**
  - Unfollow a user
  - Requires JWT authentication

### Feed Endpoints

- **GET /feed**
  - Get the feed of tweets from followed users
  - Requires JWT authentication

- **POST /tweet**
  - Create a new tweet
  - Request Body:
    ```json
    {
      "content": "string"
    }
    ```
  - Requires JWT authentication

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Simsonss/backend-test.git
   cd backend-test
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
Create a .env file in the root directory and add the following:
    ```env
    PORT=3000
    MONGO_URI=your_mongo_url
    JWT_SECRET=your_jwt_secre
    ```
4. Start the server:
   ```bash
   npm start
   ```

### Installation
To run the test suite:
    ```bash
   npm test
   ```


