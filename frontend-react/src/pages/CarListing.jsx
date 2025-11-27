import React, { useEffect, useState } from 'react';
import { getCars } from '../api/auth';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCars()
      .then((res) => setCars(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Unauthenticated'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {cars.map((car) => (
        <li key={car.id}>
          {car.name} - {car.model}
        </li>
      ))}
    </ul>
  );
};

export default Cars;
