const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/api/beneficiaryLTI/portfolio-consolidated', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.portfolio-consolidated').value();
    res.json(data);
  });

server.get('/api/beneficiaryLTI/shares-by-ticker', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.shares-by-ticker').value();
    res.json(data);
  });

server.get('/api/beneficiaryLTI/next-events', (req, res) => {
    const db = router.db;
    const data = db.get('api.beneficiaryLTI.next-events').value();
    res.json(data);
  });

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

module.exports = server
