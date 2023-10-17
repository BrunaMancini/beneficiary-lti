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

    const startDateParts = startDate.split('-');
    const endDateParts = endDate.split('-');

    if (startDateParts.length !== 3 || endDateParts.length !== 3) {
        return res.status(400).json({ error: 'Invalid date format. Use "dd-MM-yyyy" format.' });
    }

    const startDateObj = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    const endDateObj = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({ error: 'invalid date format - use "dd-MM-yyyy", please' });
    }

    // Filter the data based on the received startDate and endDate
    const filteredData = data.filter(item => {
        const itemDateParts = item.date.split('-');
        if (itemDateParts.length === 3) {
            const itemDateObj = new Date(itemDateParts[2], itemDateParts[1] - 1, itemDateParts[0]);
            return itemDateObj >= startDateObj && itemDateObj <= endDateObj;
        }
        return false;
    });

    filteredData.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('/'));
        const dateB = new Date(b.date.split('-').reverse().join('/'));
        return dateA - dateB;
    });

    filteredData.forEach(item => {
        const dateParts = item.date.split('-');
        item.date = dateParts.reverse().join('-');
    });

    res.json(filteredData);
});


server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

module.exports = server;
