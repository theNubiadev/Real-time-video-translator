const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Api Working');
});

app.listen(4000, () => {
    console.log('Server running on Port 4000');
});