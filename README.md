# COMP3278-Final-Project

**Spotify Mini**

A Spotify-inspired music library web application built using React (Vite), Flask, and MySQL. The application allows users to browse songs, search music, like songs, create playlists, and manage their music library.

**Prerequisites**

Before running the project, ensure the following software is installed:

MySQL 8.0+
Python 3
Node.js and npm

**Database Setup**

_1. Create the Database_

From the project root directory, run:

/usr/local/mysql/bin/mysql -u root -p < create_database.sql
 
Enter the MySQL password when prompted.

_2. Insert Sample Data_

/usr/local/mysql/bin/mysql -u root -p music_streaming_db < insert_sample_data.sql

After successful execution, the database music_streaming_db and its sample data will be created.

_3. Verify Database Creation (Optional)_

/usr/local/mysql/bin/mysql -u root -p

Inside MySQL:

SHOW DATABASES;
USE music_streaming_db;
SHOW TABLES;

**Backend Setup**

_1. Create a Virtual Environment_

python3 -m venv backend/.venv

_2. Activate the Virtual Environment_

source backend/.venv/bin/activate

_3. Install Required Packages_

pip install -r backend/requirements.txt

_4. Configure Environment Variables_

Create a file named .env inside the backend folder.

Example configuration:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=music_streaming_db
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD

Replace YOUR_PASSWORD with your MySQL password.

_5. Test Database Connection_

python backend/test_connection.py

_6. Start the Backend Server_

python backend/app.py

The Flask API will run at:

http://127.0.0.1:5001

Keep this terminal running.

**Frontend Setup**

Open a new terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will be available at:

http://127.0.0.1:5173

**Running the Application**

To use the application:

1. Ensure MySQL is running.

2. Start the Flask backend:

python backend/app.py

3. Start the React frontend:

cd frontend
npm run dev

4. Open:

http://127.0.0.1:5173

**Features**

Browse music catalog
Search songs and artists
Like and unlike songs
Create playlists
Add songs to playlists
View personal music library
Store user interactions in MySQL
