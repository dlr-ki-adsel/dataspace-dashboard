import React from 'react';
import loading from '../../assets/loading.svg';
import './Loading.css'; // Import CSS file for styling

const Loading: React.FC = () => (
  <div className="spinner">
    <img src={loading} alt="Loading" />
  </div>
);

export default Loading;
