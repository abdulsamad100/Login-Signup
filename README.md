
# Todos-Using-Firebase

This project is a simple **To-Do List** application built using **Firebase** for backend functionalities. It allows users to create, read, update, and delete their tasks in real-time.

## Features

- **User Authentication**: Secure user login and signup using Firebase Authentication.
- **Real-Time Database**: Uses Firebase Firestore to store todos.
- **CRUD Operations**: Users can add, edit, delete, and mark tasks as complete.
- **Responsive Design**: Works across multiple devices with a clean, user-friendly interface.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Firestore, Authentication)

## Setup and Installation

To get started with this project, follow these steps:

### Prerequisites

- Node.js installed on your machine
- Firebase account

### Steps

1. **Clone the Repository**  
   ```
   git clone https://github.com/abdulsamad100/Todos-Using-Firebase.git
   cd Todos-Using-Firebase
   ```

2. **Install Dependencies**  
   If the project has any dependencies (e.g., Firebase SDK):
   ```
   npm install
   ```

3. **Firebase Setup**  
   - Go to the Firebase console and create a new project.
   - Set up Firebase Authentication and Firestore.
   - Get the Firebase configuration object from the Firebase console.
   - Create a `firebase-config.js` file in your project and add the Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Run the Application**  
   Open the `index.html` file in your browser to view and interact with the app.

## Usage

- Sign up or log in with an email and password.
- Create, edit, and delete your to-do tasks.
- Mark tasks as complete by clicking the checkbox.

## Contributing

Feel free to fork this repository, create a branch, and submit pull requests with improvements. All contributions are welcome!
