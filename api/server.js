const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/api/beneficiaryLTI/tickers-by-date', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.tickers-by-date').value();
    
    const startDate = req.header('startDate');
    const endDate = req.header('endDate');

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required header parameters.' });
    }

    // Filter the data based on the received dates
    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date); // Assuming your JSON data has a 'date' property
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    res.json(filteredData);
});

server.use(router)

server.listen(3000, () => {
    console.log('JSON Server is running')
})

module.exports = server
