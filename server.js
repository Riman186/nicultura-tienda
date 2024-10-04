// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Para poder recibir JSON en el body

// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // o el servicio de correo que prefieras
    auth: {
        user: 'niculturashop@gmail.com', // Tu correo
        pass: 'Nicultura123' // Tu contraseña o App Password
    }
});

// Ruta para recibir pedidos
app.post('/api/pedidos', (req, res) => {
    const { productos, total } = req.body;

    // Aquí puedes construir el cuerpo del email
    const mailOptions = {
        from: 'niculturashop@gmail.com', // Remitente
        to: 'niculturashop@gmail.com', // Destinatario (puede ser el mismo que el remitente)
        subject: 'Nuevo pedido recibido',
        text: `Productos: ${JSON.stringify(productos)}\nTotal: C$${total.toFixed(2)}` // Cuerpo del correo
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo.');
        }
        console.log('Correo enviado:', info.response);
        res.json({ mensaje: 'Pedido recibido con éxito', productos, total });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
