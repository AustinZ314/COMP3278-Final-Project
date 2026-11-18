# COMP3278-Final-Project

## **Spotify Mini**

A Spotify-inspired music library web application built using React (Vite), Flask, and MySQL. The application allows users to browse songs, search music, like songs, create playlists, and manage their music library.

## **Prerequisites**

Before running the project, ensure the following software is installed:

MySQL 8.0+

Python 3

Node.js 

npm

## **Database Setup**

### 1. Create the Database

From the project root directory, run:

```bash
/usr/local/mysql/bin/mysql -u root -p < create_database.sql
```
 
Enter the MySQL password when prompted.

### 2. Insert Sample Data

```bash
/usr/local/mysql/bin/mysql -u root -p music_streaming_db < insert_sample_data.sql
```

After successful execution, the database ```music_streaming_db``` and its sample data will be created.

### 3. Verify Database Creation (Optional)

```bash
/usr/local/mysql/bin/mysql -u root -p
```

Inside MySQL:

```bash
SHOW DATABASES;
USE music_streaming_db;
SHOW TABLES;
```

## **Backend Setup**

### 1. Create a Virtual Environment

```bash
python3 -m venv backend/.venv
```

### 2. Activate the Virtual Environment

```bash
source backend/.venv/bin/activate
```

### 3. Install Required Packages

```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables

Create a file named ```.env``` inside the backend folder.

_Example configuration:_

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=music_streaming_db
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
```

Replace ```YOUR_PASSWORD``` with your MySQL password.

### 5. Test Database Connection

```bash
python backend/test_connection.py
```

### 6. Start the Backend Server

```bash
python backend/app.py
```

The Flask API will run at:

http://127.0.0.1:5001

Keep this terminal running.

## **Frontend Setup**

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

http://127.0.0.1:5173

## **Running the Application**

To use the application:

1. Ensure MySQL is running.

2. Start the Flask backend:

```bash
python backend/app.py
```

3. Start the React frontend:

```bash
cd frontend
npm run dev
```

4. Open:

http://127.0.0.1:5173

## **Features**

#### 1. Browse music catalog

#### 2. Search songs and artists

#### 3. Like and unlike songs

#### 4. Create playlists

#### 5. Add songs to playlists

#### 6. Store user interactions in MySQL
