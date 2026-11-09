const oracledb = require('oracledb');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // Configuration du pool de connexions Oracle
        await oracledb.createPool({
            user: process.env.DB_USER || "ADMIN",
            password: process.env.DB_PASSWORD || "VotreMotDePasseSecret123!",
            connectString: process.env.DB_CONNECTION_STRING || "nom_de_votre_base_high",
            // Le mode Thin est utilisé par défaut dans les versions récentes de node-oracledb (pas besoin de client lourd)
        });
        console.log("✅ Connexion au pool Oracle établie avec succès.");
    } catch (err) {
        console.error("❌ Erreur de connexion à la base Oracle :", err);
    }
}

async function closeDatabase() {
    try {
        await oracledb.getPool().close(10);
        console.log("Pool Oracle fermé.");
    } catch (err) {
        console.error("Erreur lors de la fermeture du pool :", err);
    }
}

module.exports = {
    initializeDatabase,
    closeDatabase,
    // Fonction utilitaire pour exécuter des requêtes facilement
    execute: async (sql, binds = [], opts = {}) => {
        let connection;
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT, ...opts });
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
};
