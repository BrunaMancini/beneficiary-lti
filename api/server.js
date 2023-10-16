const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/api/beneficiaryLTI/GetCompany', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.GetCompany').value();
    res.json(data);
  });

server.get('/api/beneficiaryLTI/portfolio-consolidated', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.portfolio-consolidated').value();
    res.json(data);
  });

server.get('/api/beneficiaryLTI/next-events', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.next-events').value();
    res.json(data);
  });

server.post('/api/beneficiaryLTI/tickers-by-date', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.tickers-by-date').value();

    const startDate = req.header('startDate');
    const endDate = req.header('endDate');

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'both "startDate" and "endDate" headers are required for filtering.' });
    }

    const filteredData = data.filter(item => {
        const itemDate = item.date;
        return Date(itemDate) >= Date(startDate) &&  Date(itemDate) <=  Date(endDate);
    });

    res.json(filteredData);
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

module.exports = server;
