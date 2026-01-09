# InstagramClone02

backend
cd Backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer datauri sharp cloudinary socket.io nodemon
"type": "module",
"dev": "nodemon index.js",

cd Frontend

npm create vite@latest . -- --template react
npm install axios react-router-dom @reduxjs/toolkit react-redux redux-persist react-icons socket.io-client
npm run dev

Features

Authentication
User registration with validation
Secure login with JWT
Password hashing with bcryptjs
Protected routes
Persistent authentication state

User Management

View user profiles
Update profile (name, bio, profile picture)
Follow/Unfollow users
View followers and following lists
Display user statistics

Post Management

Upload image posts to Cloudinary
Delete own posts
Like/Unlike posts
Comment on posts
View all posts (public feed)
Post owner identification

Real-time Chat

One-to-one messaging
Real-time message delivery
Online user status indicators
Message history
Socket.io powered communication


API Endpoints

Authentication
MethodEndpointDescriptionAuth RequiredPOST/api/auth/registerRegister new userNoPOST/api/auth/loginLogin userNo

User
MethodEndpointDescriptionAuth RequiredGET/api/users/:idGet user profileNoPUT/api/users/updateUpdate profileYesPOST/api/users/follow/:idFollow userYesPOST/api/users/unfollow/:idUnfollow userYes

Posts
MethodEndpointDescriptionAuth RequiredPOST/api/postsCreate postYesGET/api/postsGet all postsNoDELETE/api/posts/:idDelete postYesPUT/api/posts/like/:idLike postYesPUT/api/posts/unlike/:idUnlike postYes

Comments
MethodEndpointDescriptionAuth RequiredPOST/api/comments/:postIdAdd commentYesDELETE/api/comments/:idDelete commentYes

Chat
MethodEndpointDescriptionAuth RequiredPOST/api/chatCreate/Get chatYesGET/api/chat/:userIdGet messagesYes
