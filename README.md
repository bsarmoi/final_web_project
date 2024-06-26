# bsarmoi
# Teacher Task Manager

Teacher Task Manager is a web application designed to help teachers manage their tasks efficiently. The application supports adding, editing, completing, and deleting tasks.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- View all tasks
- Add new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks

## Technologies Used
- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: 
  - `express` for the server
  - `body-parser` for parsing incoming request bodies
  - `mysql2` for connecting to the MySQL database
  - `cors` for enabling Cross-Origin Resource Sharing

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/teacher-task-manager.git
    cd teacher-task-manager
    ```

2. Set up the backend:
    - Install dependencies:
      ```bash
      npm install
      ```
    - Configure the database connection in `index.js` with your MySQL credentials.
    - Create a MySQL database named `task_manager` and a table named `tasks` with appropriate columns.

3. Set up the frontend:
    - Ensure the frontend files (`index.html`, `styles.css`, `script.js`) are in the `public` directory.

4. Run the application:
    ```bash
    node index.js
    ```
    The server will start on `http://localhost:3000`.

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Use the interface to add, edit, complete, and delete tasks.

## API Endpoints
- **GET /tasks**: Retrieve all tasks
- **POST /tasks**: Add a new task
  - Request body: 
    ```json
    {
      "title": "Task title",
      "description": "Task description",
      "dueDate": "YYYY-MM-DD",
      "priority": "Low|Medium|High"
    }
    ```
- **PUT /tasks/:id**: Update a task
    - Request body:
    ```json
        {
        "title": "Updated title",
        "description": "Updated description",
        "dueDate": "YYYY-MM-DD",
        "priority": "Low|Medium|High"
        }
    ```
- **DELETE /tasks/:id**: Delete a task

## Project Structure
teacher-task-manager/
├── public/
│ ├── index.html
│ ├── styles.css
│ └── script.js
├── index.js
├── package.json
└── README.md


## Contributing
1. Fork the repository.
2. Create your feature branch:
    ```bash
    git checkout -b feature/your-feature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add your feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature
    ```
5. Open a pull request.

## License
This project is licensed under the MIT License..


