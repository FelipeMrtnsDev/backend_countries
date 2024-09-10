const express = require("express");
const router = express.Router();
const axios = require("axios");

// Endpoint para obter países disponíveis
router.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching countries:', error.message);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// Endpoint para obter informações detalhadas sobre um país
router.get('/api/country/:countryCode', async (req, res) => {
    const countryCode = req.params.countryCode;

    try {
        console.log(`Fetching data for country code: ${countryCode}`);
        
        // Obter informações sobre países vizinhos
        const borderCountriesResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        console.log('Border Countries Response:', borderCountriesResponse.data);

        // Obter dados populacionais
        const populationResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/population');
        console.log('Population Response:', populationResponse.data);

        // Obter URL da bandeira
        const flagResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        console.log('Flag Response:', flagResponse.data);

        // Processar dados das respostas
        const borderCountries = borderCountriesResponse.data && borderCountriesResponse.data.borders
            ? borderCountriesResponse.data.borders
            : [];
        
        // Encontrar dados populacionais para o país especificado (por nome)
        const countryName = borderCountriesResponse.data.commonName || "";
        const populationData = populationResponse.data && populationResponse.data.data
            ? populationResponse.data.data.find(c => c.country === countryName)
            : {};
        
        // Formatando dados populacionais
        const formattedPopulationData = populationData ? populationData.populationCounts : [];
        
        // Encontrar URL da bandeira para o país especificado
        const flagUrl = flagResponse.data && flagResponse.data.data
            ? flagResponse.data.data.find(c => c.name === countryName)?.flag
            : '';
        
        console.log('Final Response:', {
            borderCountries,
            populationData: formattedPopulationData,
            flagUrl
        });

        res.json({
            borderCountries,
            populationData: formattedPopulationData,
            flagUrl
        });
    } catch (error) {
        console.error(`Error fetching country info for ${countryCode}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch country info' });
    }
});

module.exports = router;
