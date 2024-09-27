require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const { router: usersRouter } = require('./routes/users');
const { router: productsRouter } = require('./routes/products');
const ordersRouter = require('./routes/orders');

app.use(express.json());

// Generate a secret temporary key in each server restart
const serverSecret = crypto.randomBytes(64).toString('hex');

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate hardcoded credentials
    if (email === 'admin@admin.com' && password === 'admin') {
        const user = { email };
        
        // Create token with the temporary secret key generated in each restart
        const accessToken = jwt.sign(user, serverSecret, { expiresIn: '1h' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Incorrect credentials' });
    }
});

// Authenticate the token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No valid token' });

    // Verify the token with the secret temporary key
    jwt.verify(token, serverSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Protect all routes with the authentication token
app.use('/users', authenticateToken, usersRouter);
app.use('/products', authenticateToken, productsRouter);
app.use('/orders', authenticateToken, ordersRouter);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});