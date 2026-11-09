const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Serveur Central VIFFE opérationnel',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/alertes/sos', (req, res) => {
    const { latitude, longitude, horodatage, type, description } = req.body;
    console.log(`[ALERTE REÇUE]`, req.body);
    
    res.status(201).json({
        success: true,
        message: 'Alerte enregistrée au serveur central.'
    });
});

app.listen(PORT, () => {
    console.log(`Serveur central VIFFE démarré sur le port ${PORT}`);
});
