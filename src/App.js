import React, { useEffect, useState } from 'react';

function QuoteQuery({ quoteData, setQuoteData }) {

  return (
    <>
      <p id='text'>{quoteData.quote}</p>
      <cite id='author'>- {quoteData.author}</cite>
    </>
  );
}

function QuoteRender({ quoteData, setQuoteData, quoteLoaded }) {
  return (
    <blockquote className='quote-box__content'>
      <QuoteQuery quoteData={quoteData} setQuoteData={setQuoteData} />
    </blockquote>
  );
}

export default function App() {
  const [quoteData, setQuoteData] = useState({
    quote: '',
    author: ''
  });

  const [quoteLoaded, setQuoteLoaded] = useState(false);

  const handleNextQuote = () => {
    fetchData();
  };

  const handlePreviousQuote = () => {
    fetchData();
  };

  const fetchData = async () => {
    setQuoteLoaded(false); // Устанавливаем флаг загрузки в false перед запросом

    try {
      const validCategories = ['dad', 'mom'];
      const randomCategory = validCategories[Math.floor(Math.random() * validCategories.length)];

      const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${randomCategory}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': 'XVo7MQhstxmlJMGfGlli7A==9tH9DREe7850Fgms',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setQuoteData({
        quote: result[0].quote,
        author: result[0].author
      });
    } catch (error) {
      console.error('Error:', error);
      setQuoteData({
        quote: 'Error loading quote',
        author: ''
      });
    } finally {
      setQuoteLoaded(true); // Устанавливаем флаг загрузки в true после получения данных или в случае ошибки
    }
  };

  useEffect(() => {
    fetchData(); // Загрузка данных при монтировании компонента
  }, []);

  if (quoteLoaded) {
    return (
      <>
        <QuoteRender quoteData={quoteData} setQuoteData={setQuoteData} quoteLoaded={quoteLoaded} />
        <div className='quote-box__panel'>
          <div className='quote-box__socials socials'>
            <a href='#' id='facebook-quote'>Facebook<i className="fa-brands fa-facebook"></i></a>
            <a href='twitter.com/intent/tweet' id='tweet-quote'>Twitter<i className="fa-brands fa-square-twitter"></i></a>
          </div>
          <div className='quote-box__buttons'>
            <button className='btn' id='previous-quote' onClick={handlePreviousQuote}>Previous</button>
            <button className='btn' id='new-quote' onClick={handleNextQuote}>New Quote</button>
          </div>
        </div>
      </>
    );
  }

}
