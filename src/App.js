
import { useState } from 'react';

export default function Card() {
  return (
    <>
      <blockquote className='quote-box__content'>
        <p>Nothing to remember!</p>
        <cite>- Evgenii Liskevich</cite>
      </blockquote>
      <div className='quote-box__panel'>
        <div className='quote-box__socials socials'>
          <a>Twitter<i className="fa-brands fa-twitter"></i></a>
          <a>Twitter<i className="fa-brands fa-square-twitter"></i></a>
        </div>
        <div>
          <button>Previous</button>
          <button>New Quote</button>
        </div>
      </div>
    </>
  )
}