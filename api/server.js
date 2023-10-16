const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/api/beneficiaryLTI/tickers-by-date', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.tickers-by-date').value();

    const startDate = req.header('startDate');
    const endDate = req.header('endDate');

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Both "startDate" and "endDate" headers are required for filtering.' });
    }

    // Filter the data based on the received startDate and endDate
    const filteredData = data.filter(item => {
        const itemDate = item.date; // Assuming your date format is "dd-MM-yyyy"
        if (itemDate >= startDate && itemDate <= endDate) {
            return item.tickers.length > 0; // Include only items with tickers
        }
        return false;
    });

    res.json(filteredData);
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

module.exports = server;
