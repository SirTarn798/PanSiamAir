# AC Management System

This is a web application designed to help clients manage their air conditioners and provide employees with a platform to streamline their tasks. The application focuses on fixing ACs, with additional features that enhance user experience and task management. It is built using Next.js for both the client and server (Next.js API) and incorporates a separate Socket.IO server for real-time chat functionality.

# Features
### For Clients
- Request Tracking: Track the progress of your AC repair requests.
- Chat: Communicate in real-time with support or employees.
### For Employees
- Role-Based Access: Employees are rerouted to their dedicated pages based on their roles.
- Task Management: Streamline repair and request handling processes.
- Communication: Collaborate with clients via real-time chat.
- Document Tracking: Manage and monitor documents related to your requests.
# Technology Stack
- Frontend & Backend: Next.js
- Real-Time Communication: Socket.IO
- Database: PostgreSQL
# Installation
Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL
__Steps__  
- Clone the repository:
```
git clone https://github.com/SirTarn798/PanSiamAir  
cd PanSiamAir 
```

- Dependencies Installation
```
npm install
```
- Set up environment variables
```
DB_PASSWORD = ""
NEXT_PUBLIC_API_URL = ""
SECRET_KEY = ""
FIREBASE_API_KEY = ""
```
- Run the development web application
```
npm run dev
```
- Run the socket server
```
cd server
node socketServer
```

- Open localhost:3000 in your web browser

# Areas for Improvement
- API Management: Reduce redundancy and improve planning for better scalability and maintainability.
# Future Enhancements
- Add more user-friendly features to expand the scope of the application.
- Improve the UI/UX for smoother navigation.
- Enhance performance for handling larger datasets and more users.


