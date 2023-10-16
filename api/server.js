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

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use "dd-MM-yyyy" format.' });
    }

    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDateObj && itemDate <= endDateObj;
    });

    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json(filteredData);
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

module.exports = server;
