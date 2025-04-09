const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Example of data
const data = {
    users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ]
};

app.get('/users', (req, res) => {
    res.json(data.users);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = data.users.length + 1;
    data.users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});