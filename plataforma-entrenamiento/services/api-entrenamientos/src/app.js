const express = require('express');
const cors = require('cors');
require('dotenv').config();

const videoRutas = require('./rutas/videoRutas');
const feedbackRutas = require('./rutas/feedbackRutas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/videos', videoRutas);
app.use('/api/feedbacks', feedbackRutas);

app.get('/salud', (req, res) => {
  res.json({ status: 'API Entrenamientos funcionando' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Microservicio api-entrenamientos ejecutándose en puerto ${PORT}`);
});