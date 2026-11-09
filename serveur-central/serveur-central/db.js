const oracledb = require('oracledb');
require('dotenv').config();

// Définir le dossier du Wallet si TNS_ADMIN est renseigné
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
        console.error("⚠️ Attention : Base Oracle non connectée (le serveur HTTP reste fonctionnel).");
        console.error("Détail de l'erreur :", err.message);
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
