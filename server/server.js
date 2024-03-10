
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/survey', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Survey model setup (if not already defined)
const Response = mongoose.model('Response', {
  question: String,
  rating: Number,
  answer: String,
});




const questions = [
  { "_id": "some_id1", "text": "How satisfied are you with our product?", "type": "rating", "__v": 0 },
  { "_id": "some_id2", "text": "How fair are the prices compared to similar retailers?", "type": "rating", "__v": 0 },
  { "_id": "some_id3", "text": "How satisfied are you with the value for money of your purchase?", "type": "rating", "__v": 0 ,"ratingScale": 10 },
  { "_id": "some_id4", "text": "On a scale of 1-10, how would you recommend us to your friends and family?", "type": "rating", "__v": 0 },
  { "_id": "some_id5", "text": "What could we do to improve our service?", "type": "text", "__v": 0 }
];



// Route for fetching questions
app.get('/questions', (req, res) => {
  res.json(questions);
});




app.post('/responses', async (req, res) => {
  try {
    const { responses } = req.body || {};

    if (!Array.isArray(responses)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Save each response to the database
    for (const responseItem of responses) {
      const { question, rating, answer } = responseItem;

      if (!question || (rating === undefined && !answer)) {
        return res.status(400).json({ error: 'Invalid response data' });
      }

      const response = new Response({
        question,
        rating: rating !== undefined ? rating : null,
        answer: answer || null,
      });

      await response.save();
    }

    res.status(201).json({ message: 'Survey responses saved successfully' });
  } catch (error) {
    console.error('Error handling survey responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
