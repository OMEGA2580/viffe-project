const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialisation du pool Oracle au démarrage
db.initializeDatabase();

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Serveur Central VIFFE opérationnel',
        timestamp: new Date().toISOString()
    });
});

// Endpoint pour recevoir et insérer une alerte en BDD Oracle
app.post('/api/alertes/sos', async (req, res) => {
    const { latitude, longitude, type, description, location } = req.body;
    
    try {
        const query = `
            INSERT INTO ALERTES (TYPE_INCIDENT, DESCRIPTION, LATITUDE, LONGITUDE, LOCALISATION)
            VALUES (:type, :description, :latitude, :longitude, :location)
        `;
        
        await db.execute(query, {
            type: type || 'URGENCE_SOS',
            description: description || 'Alerte SOS rapide déclenchée',
            latitude: latitude || null,
            longitude: longitude || null,
            location: location || 'Yaoundé, Cameroun'
        });

        res.status(201).json({
            success: true,
            message: 'Alerte enregistrée avec succès dans la base Oracle VIFFE.'
        });
    } catch (err) {
        console.error('Erreur lors de l’enregistrement de l’alerte :', err);
        res.status(500).json({ success: false, error: 'Erreur interne du serveur central.' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur central VIFFE démarré sur le port ${PORT}`);
});
