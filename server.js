const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const csvParser = require("csv-parser");
const { db, executeScript, runQuery } = require("./db");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/usersRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Parse JSON body
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", cartRoutes);

// Categories Array
const Categories = [
    { name: "Electronics", description: "Devices and gadgets" },
    { name: "Furniture", description: "Tables and chairs" },
];

// Multer Configuration for File Upload
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/json", "text/csv", "text/plain"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type: ${file.mimetype}`));
        }
        cb(null, true);
    },
});

// Initialize the Categories Table
db.serialize(() => {
    // Create table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        )`,
        (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            } else {
                console.log("Categories table created successfully.");
            }
        }
    );

    // Insert categories into the table
    Categories.forEach((category) => {
        db.run(
            `INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)`,
            [category.name, category.description],
            (err) => {
                if (err) {
                    console.error("Error inserting category:", err.message);
                }
            }
        );
    });
});

// Bulk Upload Route for Products
app.post("/api/upload-bulk", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = req.file.path;

    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => {
                const query = `
                    INSERT INTO products (name, description, image_url, price, category_id, featured)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.run(
                    query,
                    [
                        row.name,
                        row.description,
                        row.image_url,
                        parseFloat(row.price),
                        parseInt(row.category_id),
                        parseInt(row.featured),
                    ],
                    (err) => {
                        if (err) {
                            console.error("Error inserting row:", err.message);
                        }
                    }
                );
            })
            .on("end", () => {
                console.log("CSV file processing completed.");
                res.status(200).json({ message: "File uploaded and data inserted successfully." });
            })
            .on("error", (err) => {
                console.error("Error processing file:", err.message);
                res.status(500).json({ error: "Failed to process file." });
            });
    } catch (error) {
        console.error("Unexpected error:", error.message);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

// Initialize Database: Create tables and insert data
(async () => {
    try {
        console.log("Initializing the database...");
        await executeScript("./Milestone4/create_tables.sql");
        console.log("Tables created successfully.");

        await executeScript("./Milestone4/insert_categories.sql");
        console.log("Categories inserted successfully.");

        await executeScript("./Milestone4/insert_products.sql");
        console.log("Products inserted successfully.");

        const users = await runQuery("SELECT * FROM users;");
        console.log("Users:", users);
    } catch (err) {
        console.error("Error during database initialization:", err.message);
    }
})();

// Test Endpoint
app.get("/api/test", (req, res) => {
    res.send("Server is running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
