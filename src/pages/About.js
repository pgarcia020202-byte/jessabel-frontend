import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  // Game state
  const gameData = [
    {
      question: "Which art style uses geometric shapes and bright colors?",
      options: ["Cubism", "Baroque", "Impressionism", "Renaissance"],
      answer: 0
    },
    {
      question: "Which tool is commonly used for digital drawing?",
      options: ["Paintbrush", "Tablet", "Pencil", "Spray"],
      answer: 1
    },
    {
      question: "What is 7 x 3?",
      options: ["20", "21", "24", "18"],
      answer: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      answer: 2
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [resultColor, setResultColor] = useState('black');
  const [gameOver, setGameOver] = useState(false);

  const currentData = gameData[currentIndex];

  useEffect(() => {
    setSelectedOption(null);
    setResult('');
  }, [currentIndex]);

  const selectOption = (idx) => {
    setSelectedOption(idx);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;

    if (selectedOption === currentData.answer) {
      setScore(score + 1);
      setResult('Correct!');
      setResultColor('green');
    } else {
      setResult(`Wrong! Correct answer: ${currentData.options[currentData.answer]}`);
      setResultColor('red');
    }

    setSelectedOption(null);

    setTimeout(() => {
      if (currentIndex < gameData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameOver(true);
        setResult(`Your final score is ${score + (selectedOption === currentData.answer ? 1 : 0)} out of ${gameData.length}.`);
        setResultColor('black');
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setResult('');
    setResultColor('black');
    setGameOver(false);
  };

  return (
    <main className="about-page">
      <div className="container">
        <h2>About My Passion for Art</h2>
        
        {/* Section 1: What I Love About Art */}
        <section className="about-section">
          <h3>What I Love About Visual Arts</h3>
          <img src="/assets/painting-studio.jpeg" alt="Artist working in a bright studio with canvases and paint supplies" className="about-image" />
          <p>Art has been an integral part of my life, serving as both a creative outlet and a means of understanding the world around me. The beauty of visual arts lies in its infinite possibilities – from traditional oil paintings that capture light and shadow with stunning realism, to abstract expressionism that conveys raw emotion through color and form. What captivates me most is the way art transcends language barriers, communicating complex ideas and feelings that words often fail to express. Whether I'm exploring Renaissance masterpieces in museums or experimenting with digital illustration on my tablet, each artistic experience offers new perspectives and inspires continuous growth. The tactile nature of working with different media – the texture of acrylic paint, the precision of pen and ink, the fluidity of watercolors – creates a deeply satisfying sensory experience that grounds me in the present moment.</p>
        </section>

        {/* Section 2: My Journey with Art */}
        <section className="about-section">
          <h3>My Creative Journey</h3>
          <img src="/assets/art-supplies.jpg" alt="Collection of colorful art supplies including brushes, paints, and pencils arranged on a table" className="about-image" />
          <p>My relationship with art began in childhood and has evolved significantly over the years. Each phase of my artistic development has taught me valuable lessons about patience, observation, and creative problem-solving. The journey from simple crayon drawings to more sophisticated artistic techniques has been filled with both challenges and breakthroughs. I've learned that art is not just about the final product, but about the process of exploration, experimentation, and self-discovery. Through studying art history, I've gained appreciation for how artistic movements reflect and shape cultural change. Contemporary digital tools have opened up exciting new possibilities, allowing me to blend traditional techniques with modern technology. This ongoing evolution keeps my passion for art fresh and constantly evolving.</p>
          
          {/* Ordered List: Timeline */}
          <h4>My Art Learning Timeline</h4>
          <ol className="timeline">
            <li>Early childhood: Discovered joy in drawing and coloring, filled sketchbooks with imaginative characters</li>
            <li>Elementary school: Took first formal art classes, learned basic color theory and composition principles</li>
            <li>Middle school: Experimented with various media including watercolors, pastels, and charcoal</li>
            <li>High school: Enrolled in advanced art courses, studied art history, developed personal artistic style</li>
            <li>Recent years: Explored digital art and graphic design, participated in local art exhibitions</li>
            <li>Current focus: Combining traditional and digital techniques, building portfolio for future opportunities</li>
          </ol>
        </section>

        {/* Blockquote Section */}
        <section className="quote-section">
          <blockquote>
            <p>"Art enables us to find ourselves and lose ourselves at the same time."</p>
            <cite>— Thomas Merton</cite>
          </blockquote>
          <p className="quote-reflection">This quote perfectly encapsulates my experience with art. In the creative process, I discover aspects of myself I never knew existed, while simultaneously experiencing the transcendent flow state where time and self-consciousness dissolve. Art is both a mirror and a window – reflecting who we are while opening us to infinite possibilities.</p>
        </section>

        {/* Interactive Art Quiz Game Section */}
        <section className="about-section game-section">
          <h3>Test Your Art Knowledge!</h3>
          <p>Think you know about art? Try this fun quiz to test your knowledge about art history, techniques, and famous artists. It's a great way to engage with the world of visual arts!</p>
          
          <div className="game-container">
            <div className="game-logo">🎮 ArtVision Quiz</div>
            
            {!gameOver ? (
              <>
                <h4>{currentData.question}</h4>
                <div className="game-options">
                  {currentData.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`game-option ${selectedOption === idx ? 'selected' : ''}`}
                      onClick={() => selectOption(idx)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <button 
                  className="game-submit-btn"
                  onClick={submitAnswer} 
                  disabled={selectedOption === null}
                >
                  Submit Answer
                </button>
                {result && <div className="game-result" style={{ color: resultColor }}>{result}</div>}
              </>
            ) : (
              <>
                <h4>Game Over!</h4>
                <div className="game-result" style={{ color: resultColor }}>{result}</div>
                <button className="game-reset-btn" onClick={resetGame}>Play Again</button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
