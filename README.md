# Todo List Application

This is a simple Todo List application built using Node.js, Express, and PostgreSQL.

## Features

- Add tasks for family members
- Edit tasks
- Delete tasks
- Add new family members

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/todo-list.git
    cd todo-list
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up PostgreSQL:

    - Create a new database called `TodoList`.

        ```sql
        CREATE DATABASE "TodoList";
        ```

    - Create the necessary tables:

        ```sql
        CREATE TABLE family (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );

        CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            task VARCHAR(255) NOT NULL,
            member_id INT REFERENCES family(id)
        );
        ```

4. Configure the database connection in `index.js`:

    ```javascript
    const db = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "TodoList",
      password: "yourpassword",
      port: 5432
    });
    db.connect();
    ```

5. Start the server:

    ```sh
    node index.js
    ```

6. Open your browser and navigate to `http://localhost:3000`.

## Usage

One of the toughest challenges was having each family member maintain a separate task list. While I wasn't able to fully implement this feature, it highlighted areas for further learning and growth.

### Adding Family Members

1. Click on the "Add Family Member" button.
2. Enter the name of the new family member and submit the form.

### Adding Tasks

1. Select a family member by clicking their name.
2. Enter the task in the input field and click the "+" button to add it.

### Editing Tasks

1. Click the edit (🖊️) button next to the task you want to edit.
2. Modify the task and click the checkmark (✔️) button to save changes.

### Deleting Tasks

1. Check the checkbox next to the task you want to delete.

## Folder Structure

