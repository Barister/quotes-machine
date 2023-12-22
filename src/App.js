import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FacebookShareButton } from "react-share";

const siteLink = "https://barister.github.io/quotes-machine/";
const shortUrl = `https://shorturl.at/kwEFY`;

function QuoteQuery({ quoteData }) {
  return (
    <>
      <i className="fa-solid fa-quote-left"></i>
      <p id='text'>{quoteData.quote}</p>
      <cite>- <span id='author'>{quoteData.author}</span></cite>
    </>

  );
}

function QuoteRender({ quoteData, quoteLoaded }) {
  return (
    <blockquote className={`quote-box__content`}>
      <CSSTransition key={quoteData.quote} in={quoteLoaded} appear={true} timeout={500} classNames='quote' unmountOnExit>
        <div>
          {quoteLoaded && <QuoteQuery key={quoteData.quote} quoteData={quoteData} />}
        </div>
      </CSSTransition>
    </blockquote>
  );
}

function FacebookMediaButton({ quoteData }) {
  return (
    <FacebookShareButton
      url={siteLink}
      hashtag="#ourparents"
      quote={`"${quoteData.quote}" - ${quoteData.author}`}
    >
      <div id='facebook-quote'>Facebook<i className="fa-brands fa-facebook" rel="noreferrer"></i></div>
    </FacebookShareButton>
  );
}

function TwitterShare({ quoteData }) {
  const quote = quoteData.quote;
  const tweetUnshortened = `"${quote}" - ${quoteData.author}`;
  const totalTweet = 280 - (tweetUnshortened.length + shortUrl.length + 11 + 4);

  let tweetShortened = '';

  if (totalTweet <= 0) {
    const quoteShort = quote.slice(0, totalTweet);
    tweetShortened = `"${quoteShort + '...'}" - ${quoteData.author}`;
  } else {
    tweetShortened = tweetUnshortened;
  }

  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${tweetShortened}&hashtags=ourparents&url=${shortUrl}`}
      id='tweet-quote'
      target='_blank'
      rel='noreferrer'
    >
      Twitter<i className="fa-brands fa-square-twitter"></i>
    </a>
  )
}

export default function App() {
  const [quoteData, setQuoteData] = useState({
    quote: '',
    shortQuote: '',
    author: ''
  });

  const [quoteLoaded, setQuoteLoaded] = useState(false);
  const [quotesHistory, setQuotesHistory] = useState([]);
  const [currentKey, setCurrentKey] = useState(0);  // Добавляем текущий ключ

  const fetchData = useCallback(async () => {
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
      setQuoteLoaded(true);
      setQuotesHistory(prev => [...prev, result[0]]);
      setCurrentKey(prev => prev + 1);  // Обновляем текущий ключ
    } catch (error) {
      console.error('Error:', error);
      setQuoteData({
        quote: `Error loading quote from server: ${error}`,
        author: 'Evgenii Liskevich'
      });
    }
  }, []);

  const handleNextQuote = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handlePreviousQuote = useCallback(() => {
    if (quotesHistory.length >= 2) {
      setQuoteData(quotesHistory[quotesHistory.length - 2]);
      setQuotesHistory(prev => prev.slice(0, -1));
      setCurrentKey(prev => prev + 1);  // Обновляем текущий ключ
    }
  }, [quotesHistory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <QuoteRender key={currentKey} quoteData={quoteData} quoteLoaded={quoteLoaded} />
      <div className='quote-box__panel'>
        <div className='quote-box__socials socials'>
          <FacebookMediaButton quoteData={quoteData} />
          <TwitterShare quoteData={quoteData} />
        </div>
        <div className='quote-box__buttons'>
          <button className='btn' id='previous-quote' onClick={handlePreviousQuote}>Previous</button>
          <button className='btn' id='new-quote' onClick={handleNextQuote}>New Quote</button>
        </div>
      </div>
    </>
  );
}

