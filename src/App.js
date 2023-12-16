import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FacebookShareButton } from "react-share";

const siteLink = "https://barister.github.io/quotes-machine/";
const shortUrl = `https://shorturl.at/kwEFY`;

function QuoteQuery({ quoteData, quoteLoaded }) {

  return (

    <CSSTransition in={quoteLoaded} appear={true} timeout={300} classNames='quote' mountOnEnter={true}>
      <div>
        <i className="fa-solid fa-quote-left"></i>
        <p id='text'>{quoteData.quote}</p>
        <cite>- <span id='author'>{quoteData.author}</span></cite>
      </div>
    </CSSTransition>

  );
}




function QuoteRender({ quoteData, quoteLoaded }) {
  return (

    <blockquote className={`quote-box__content`}>
      <QuoteQuery quoteData={quoteData} quoteLoaded={quoteLoaded} />
    </blockquote>

  )
};

function FacebookMediaButton({ quoteData }) {

  return (
    <FacebookShareButton
      url={siteLink}
      hashtag="#ourparents"
      quote={`"${quoteData.quote}" - ${quoteData.author}`}
    >
      <a href='#' id='facebook-quote' target='_blank'>Facebook<i className="fa-brands fa-facebook" rel="noreferrer"></i></a>

    </FacebookShareButton>
  );
}

function TwitterShare({ quoteData }) {

  const quote = quoteData.quote;
  const tweetUnshortened = `"${quote}" - ${quoteData.author}`;


  const totalTweet = 280 - (tweetUnshortened.length + shortUrl.length + 11 + 4);

  //console.log('tweetQuote:', tweetUnshortened, totalTweet);

  let tweetShortened = '';

  if (totalTweet <= 0) {
    const quoteShort = quote.slice(0, totalTweet);
    tweetShortened = `"${quoteShort + '...'}" - ${quoteData.author}`;
  } else {
    tweetShortened = tweetUnshortened;
  }

  //console.log('tweetShortened:', tweetShortened);

  return (
    <a href={`https://twitter.com/intent/tweet?text=${tweetShortened}&hashtags=ourparents&url=${shortUrl}`} id='tweet-quote' target='_blank' rel="noreferrer">Twitter<i className="fa-brands fa-square-twitter"></i></a>
  )
}

let quotesHistory = [];

export default function App() {
  const [quoteData, setQuoteData] = useState({
    quote: '',
    shortQuote: '',
    author: ''
  });

  const [quoteLoaded, setQuoteLoaded] = useState(false);


  const handleNextQuote = () => {
    fetchData();
  };

  const handlePreviousQuote = () => {
    // console.log('Нужна предыдущая цитата!!!');

    // console.log('предпоследний элемент массива:', quotesHistory[quotesHistory.length - 2]);

    // console.log('последний элемент массива:', quotesHistory[quotesHistory.length - 1]);
    if (quotesHistory.length >= 2) {

      setQuoteData(quotesHistory[quotesHistory.length - 2]);
      setQuoteLoaded(true);

      // console.log('quotesHistory before pop:', quotesHistory);

      quotesHistory = quotesHistory.slice(0, -2)

      // console.log('quotesHistory after pop:', quotesHistory);
    }



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
        quote: 'Error loading quote from server',
        author: 'Evgenii Liskevich'
      });
    } finally {
      setQuoteLoaded(true);
      //console.log('quoteLoad = true') // Устанавливаем флаг загрузки в true после получения данных или в случае ошибки
    }
  };

  useEffect(() => {
    fetchData(); // Загрузка данных при монтировании компонента
  }, []);

  if (quoteLoaded) {



    quotesHistory.push(quoteData);

    // console.log(quotesHistory);


    return (
      <>
        <QuoteRender quoteData={quoteData} setQuoteData={setQuoteData} quoteLoaded={quoteLoaded} />
        <div className='quote-box__panel'>
          <div className='quote-box__socials socials'>

            <FacebookMediaButton quoteData={quoteData} />
            <TwitterShare quoteData={quoteData} />

          </div>
          <div className='quote-box__buttons'>
            <button className='btn' id='previous-quote' onClick={handlePreviousQuote}>Previous</button>
            <button className='btn' id='new-quote' onClick={handleNextQuote}>New Quote</button>
          </div>
        </div >
      </>
    );
  }

}
