const errorHandler = (err, req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.status(err.statusCode || 500).send(JSON.stringify(err));
};

module.exports = errorHandler;
