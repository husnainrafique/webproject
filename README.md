# webproject 

## Project Overview
Online Products is an e-commerce application designed to manage products, categories, users, and carts. The platform supports bulk product uploads, dynamic image serving, and a seamless user experience.

---

## Features
- **Product Management**: Add, update, and display products.
- **Category Management**: Organize products into categories.
- **User Functionality**: Support for user data and carts.
- **Bulk Product Upload**: Upload products in bulk using CSV files.
- **Dynamic Image Serving**: Serve product images directly via static file hosting.
- **SQLite Integration**: Uses SQLite for lightweight, server-side data storage.

---

## Prerequisites
Make sure you have the following installed before running the project:
1. **Node.js**: Version 16.x or later
2. **npm**: Installed alongside Node.js
3. **SQLite3**: Pre-installed or configured for use in the project.

---

## Tech Stack
The project leverages the following technologies:

### **Frontend**
- **HTML/CSS**: For structuring and styling the user interface.
- **EJS (Embedded JavaScript)**: Template engine for rendering dynamic pages.

### **Backend**
- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Fast and lightweight web framework for building APIs and handling routes.

### **Database**
- **SQLite3**: Lightweight and file-based SQL database for storing products, categories, users, and cart data.

### **Libraries and Middleware**
- **Multer**: Handles file uploads, such as bulk CSV files.
- **CSV-Parser**: Parses and processes CSV files for bulk product uploads.
- **Path**: Node.js module for handling file and directory paths.
- **FS (File System)**: Native Node.js module for file operations.

## Third-Party APIs and Cool Features
This project demonstrates the integration of various tools and APIs to enhance functionality:

### **1. Multer (File Upload Handling)**
- **Purpose**: Upload bulk CSV files for inserting multiple products.
- **Cool Factor**: Multer simplifies handling file uploads and integrates well with Express.

### **2. CSV-Parser (CSV File Processing)**
- **Purpose**: Parse CSV files and transform data into a usable format for the SQLite database.
- **Cool Factor**: Efficiently processes bulk data while handling different CSV structures.

### **3. Static File Serving**
- **Purpose**: Serve images and other static files directly from the `public/` folder.
- **Cool Factor**: Makes product images easily accessible via URL.

---

## Installation Instructions
Follow these steps to set up and run the project locally:
Install the necessary Node.js packages using npm:
**npm install**
This will install all dependencies listed in package.json, such as express, sqlite3, multer, and others.
**node server.js**
**http://localhost:3000**

1. **Clone the Repository**
   ```bash
   git clone https://github.com:husnainrafique/webproject.git
   cd Online-Products
