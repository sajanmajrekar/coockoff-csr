import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions } from './data';
import { ChevronRight, HeartPulse, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import './index.css';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleStart = () => {
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleNext = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setCurrentStep('result');
    }
  };

  const handleLearnMore = () => {
    setCurrentStep('campaign');
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        
        {currentStep === 'intro' && (
          <motion.div 
            key="intro"
            className="glass-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="quiz-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <HeartPulse size={40} color="var(--primary-color)" />
              </div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-light)', letterSpacing: '1px' }}>
                PARENTS, YOUR CHILDREN LEARNED TO BRUSH.
              </h2>
              <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                BUT DID THEY LEARN TO BRUSH <span style={{ color: 'var(--primary-color)' }}>GENTLY?</span>
              </h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                Scan or click below to find out in a short interactive oral-care quiz.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary" 
                onClick={handleStart}
              >
                Start Quiz <ArrowRight size={20} style={{ marginLeft: '8px' }}/>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'quiz' && (
          <motion.div 
            key="quiz"
            className="glass-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="quiz-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                  Question {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
                <Heart size={20} color="var(--primary-light)" fill="var(--primary-color)" />
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
              <h2 style={{ whiteSpace: 'pre-line', fontSize: '1.5rem', marginTop: '1.5rem', minHeight: '80px' }}>
                {currentQuestion.question}
              </h2>
            </motion.div>
            
            <motion.div variants={containerVariants} className="options-container" style={{ marginTop: '1rem' }}>
              {currentQuestion.options.map((option) => (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: selectedAnswer === option.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={option.id}
                  className={`btn-option ${selectedAnswer === option.id ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option.id)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <div className="option-circle" style={{
                    width: '24px', height: '24px', borderRadius: '50%', border: '2px solid',
                    borderColor: selectedAnswer === option.id ? 'var(--primary-color)' : '#cbd5e1',
                    marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: selectedAnswer === option.id ? 'var(--primary-color)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    {selectedAnswer === option.id && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />}
                  </div>
                  {option.text}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleNext}
                disabled={!selectedAnswer}
                style={{ 
                  opacity: selectedAnswer ? 1 : 0.5, 
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.3s ease'
                }}
              >
                {currentQuestionIndex === quizQuestions.length - 1 ? 'See Results' : 'Next Question'} <ChevronRight size={18} style={{ marginLeft: '8px' }}/>
              </button>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'result' && (
          <motion.div 
            key="result"
            className="glass-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ textAlign: 'center' }}
          >
            <motion.div variants={itemVariants}>
              <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontWeight: 800 }}>WE'RE SORRY.</h1>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-light)', padding: '8px 24px', borderRadius: '20px', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', margin: 0 }}>YOU GOT {score}/{quizQuestions.length}.</h2>
              </div>
            </motion.div>
            
            <motion.p variants={itemVariants} style={{ fontSize: '1.2rem', fontWeight: 500, margin: '1rem 0 2rem 0', color: 'var(--text-main)' }}>
              Not bad. But here's the thing...<br/><br/>
              <span style={{ color: 'var(--text-light)' }}>Most of us were taught to brush.</span><br/>
              Not necessarily how to brush gently.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>WE'RE SORRY.</h2>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>We should've taught this sooner.</p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary" 
                onClick={handleLearnMore} 
                style={{ marginTop: '2rem' }}
              >
                Learn More <ArrowRight size={18} style={{ marginLeft: '8px' }}/>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'campaign' && (
          <motion.div 
            key="campaign"
            className="glass-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ textAlign: 'center' }}
          >
            <motion.div variants={itemVariants} style={{ background: 'white', padding: '16px', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <ShieldCheck size={40} color="var(--primary-color)" />
            </motion.div>
            <motion.h2 variants={itemVariants} style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>In the classroom.</motion.h2>
            <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              Dentists and oral-health professionals visit schools to teach children how to care for their smiles—not just how to brush them.
              <br/><br/>
              And every child takes home a <strong style={{ color: 'var(--primary-color)' }}>SensoProx</strong> toothbrush to put the lesson into practice.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ backgroundColor: 'var(--primary-light)', padding: '2.5rem', borderRadius: '24px', margin: '2rem 0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              <h1 style={{ fontSize: '2.8rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontWeight: 800 }}>WE'RE SORRY.</h1>
              <p style={{ fontStyle: 'italic', marginBottom: '1rem', fontSize: '1.1rem' }}>To the generation that had to learn the hard way.</p>
              <p style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.2rem' }}>We're making sure the next one learns to go soft.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginTop: '3rem' }}>
              <h3 style={{ letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', color: '#a0aec0', marginBottom: '1rem' }}>The Lesson We Missed</h3>
              <p style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Powered by SensoProx</p>
              <p style={{ fontStyle: 'italic', color: 'var(--primary-color)', fontWeight: 500 }}>Putting the Care in Oral Care.</p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
