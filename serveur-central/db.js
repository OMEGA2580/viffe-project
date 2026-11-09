const oracledb = require('oracledb');
require('dotenv').config();

// Définition du chemin du Wallet si renseigné dans .env
if (process.env.TNS_ADMIN) {
    oracledb.tnsAdmin = process.env.TNS_ADMIN;
}

async function initializeDatabase() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING,
        });
        console.log("✅ Connexion au pool Oracle établie avec succès.");
    } catch (err) {
        console.log("⚠️ Base Oracle non connectée :", err.message);
    }
}

async function closeDatabase() {
    try {
        if (oracledb.getPool()) {
            await oracledb.getPool().close(10);
        }
    } catch (err) {
        console.error("Erreur fermeture pool :", err);
    }
}

module.exports = {
    initializeDatabase,
    closeDatabase,
    execute: async (sql, binds = [], opts = {}) => {
        let connection;
        try {
            connection = await oracledb.getConnection();
            return await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT, ...opts });
        } finally {
            if (connection) await connection.close();
        }
    }
};
