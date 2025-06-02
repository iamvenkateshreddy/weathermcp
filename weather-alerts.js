const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

// NWS API endpoint for New York state alerts
const NY_ZONE = 'NYZ'; // New York zone code
const API_BASE_URL = 'https://api.weather.gov';

async function getWeatherAlerts() {
    try {
        const response = await axios.get(`${API_BASE_URL}/alerts/active/area/NY`);
        return response.data.features;
    } catch (error) {
        console.error('Error fetching weather alerts:', error.message);
        return [];
    }
}

app.get('/alerts', async (req, res) => {
    const alerts = await getWeatherAlerts();
    
    // Format the alerts for better readability
    const formattedAlerts = alerts.map(alert => ({
        event: alert.properties.event,
        headline: alert.properties.headline,
        description: alert.properties.description,
        severity: alert.properties.severity,
        areas: alert.properties.areaDesc,
        start: alert.properties.effective,
        end: alert.properties.expires
    }));

    res.json(formattedAlerts);
});

app.listen(port, () => {
    console.log(`Weather alert server running at http://localhost:${port}/alerts`);
}); 