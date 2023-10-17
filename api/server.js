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
        return res.status(400).json({ error: 'Both "startDate" and "endDate" headers are required for filtering.' });
    }

    // Parse the start and end dates into Date objects
    const startDateParts = startDate.split('-');
    const endDateParts = endDate.split('-');

    if (startDateParts.length !== 3 || endDateParts.length !== 3) {
        return res.status(400).json({ error: 'Invalid date format. Use "dd-MM-yyyy" format.' });
    }

    // Convert start and end dates to the "yyyy-MM-dd" format for proper comparison
    const startDateFormatted = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;
    const endDateFormatted = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;

    // Filter the data based on the received startDate and endDate
    const filteredData = data.filter(item => {
        const itemDateParts = item.date.split('-');
        if (itemDateParts.length === 3) {
            const itemDateFormatted = `${itemDateParts[2]}-${itemDateParts[1]}-${itemDateParts[0]}`;
            return itemDateFormatted >= startDateFormatted && itemDateFormatted <= endDateFormatted;
        }
        return false;
    });

    // Sort the filtered data by date in ascending order
    filteredData.sort((a, b) => {
        const dateA = a.date.split('-').reverse().join('-');
        const dateB = b.date.split('-').reverse().join('-');
        return dateA.localeCompare(dateB);
    });

    res.json(filteredData);
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
});

module.exports = server;
