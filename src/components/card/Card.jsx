import React from 'react';
import './Card.css';
import NiiVueComponent from './viewer';

function Card({ imageUrl }) {
  return (
    <div >
      <NiiVueComponent className="card" />
    </div>
  );
}

export default Card;
