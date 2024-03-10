
import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyData, setSurveyData] = useState([]);
  const [selectedRating, setSelectedRating] = useState({});
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchSurveyData();
  }, []);

  

  const showQuestion = () => {
        const currentQuestion = surveyData[currentQuestionIndex];
    
        return currentQuestion ? (
          <div className="question-card">
            <div className="question-number">{`${currentQuestionIndex + 1}/${surveyData.length}`}</div>
            <p>{currentQuestion.text}</p>
            {currentQuestion.type === 'rating' && (
              <div className="rating-container">
                {[...Array(currentQuestion._id === 'some_id4' ? 10 : 5).keys()].map((value) => (
                  <div
                                key={value + 1}
                                className={`rating-circle ${selectedRating[currentQuestion._id] === value + 1 ? 'selected' : ''}`}
                                onClick={() => handleRatingClick(currentQuestion._id, value + 1)}
                              >
                                {value + 1}
                              </div>



                ))}
              </div>
            )}
            {currentQuestion.type === 'text' && (
              <>
                <label htmlFor="text-input">Your Answer:</label>
                <textarea
                  id="text-input"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                />
              </>
            )}
          </div>
        ) : null;
      };









  const handleRatingClick = (questionId, value) => {
    setSelectedRating((prevSelectedRating) => ({
      ...prevSelectedRating,
      [questionId]: value,
    }));
  };

  const handleTextAnswerChange = (questionId, value) => {
    setSelectedRating((prevSelectedRating) => ({
      ...prevSelectedRating,
      [questionId]: value,
    }));
  };

  const showPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const showNextQuestion = () => {
    if (currentQuestionIndex < surveyData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };


const submitSurvey = async () => {

  



  try {
    const responses = surveyData.map((question) => {
      return {
        question: question.text,
        rating: question.type === 'rating' ? selectedRating[question._id] || null : null,
        answer: question.type === 'text' ? answer || null : null,
      };
    });

    console.log('Submitting response:', responses);

    const res = await fetch('http://localhost:4500/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });

    if (res.status === 201) {
      toast.success(' Thank you for your time!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    

     
      resetSurvey();
    } else {
      toast.error('Something is wrong, Please try again !', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    alert('Failed to submit the survey. Please try again later.');
  }
};


  const resetSurvey = () => {
    setCurrentQuestionIndex(0);
    setSurveyData([]);
    setSelectedRating({});
    setAnswer(''); 
    fetchSurveyData();
  };  
  



  const fetchSurveyData = async () => {
    try {
      const response = await fetch('http://localhost:4500/questions');
      const data = await response.json();
      setSurveyData(data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch survey questions. Please try again.');
    }
  };

  return (
    <div className="App">
      <h2>Customer Survey</h2>
      <div className="survey-container">
        {showQuestion()}
        <div className="button-container">
          <button onClick={showPrevQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button onClick={showNextQuestion} disabled={currentQuestionIndex === surveyData.length - 1}>
            Next
          </button>
          {currentQuestionIndex === surveyData.length - 1 && (
            <button onClick={submitSurvey}>Submit</button>
            
            )}
            <ToastContainer/>
        </div>
      </div>
    </div>
  );
}

export default App;
