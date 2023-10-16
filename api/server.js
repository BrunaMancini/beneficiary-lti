const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Middleware to parse JSON from the request body
server.use(jsonServer.bodyParser)

server.use(middlewares)

server.post('/api/beneficiaryLTI/tickers-by-date', (req, res) => {
    const { startDate, endDate } = req.body; // Assuming you send startDate and endDate in the request body
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.tickers-by-date').value();

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
