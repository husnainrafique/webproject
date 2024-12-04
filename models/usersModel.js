const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./my_database.db');
const bcrypt = require('bcrypt');

const User = {
    getAll: () => db.prepare(`SELECT * FROM users`).all(),
    getById: (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id),
    update: (id, name, email, password, user_type) => {
        const stmt = db.prepare(`
            UPDATE users SET name = ?, email = ?, password = ?, user_type = ? WHERE id = ?
        `);
        return stmt.run(name, email, password, user_type, id);
    },
    delete: (id) => db.prepare(`DELETE FROM users WHERE id = ?`).run(id),
    findByEmail: (email) => db.prepare(`SELECT * FROM users WHERE email = ?`).get(email),
    insertWithHash: async (name, email, password, user_type) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare(`INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)`);
        return stmt.run(name, email, hashedPassword, user_type);
    },
    validatePassword: async (email, password) => {
        const user = User.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
};



module.exports = User;