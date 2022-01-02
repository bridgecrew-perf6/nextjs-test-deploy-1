import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
} from 'reactstrap';
import { FaLocationArrow }  from 'react-icons/fa';

import styles from './styles.module.css';

let currentPosition: GeolocationPosition;

const NearButton = ({ onLocated, onError }: {
  onLocated: (data: GeolocationPosition) => void,
  onError: (data: GeolocationPositionError) => void,
}) => {
  const [loading, setLoading] = useState(false);

  const onLoadPosition = (data: GeolocationPosition) => {
    setLoading(false);

    currentPosition = data;

    onLocated(data);
  };

  const onLocationError = (data: GeolocationPositionError) => {
    setLoading(false);
    onError(data);
  };

  const onClick = () => {
    if (currentPosition) {
      onLocated(currentPosition);
      return;
    }

    if (navigator.geolocation && !loading) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(onLoadPosition, onLocationError);
    } else {
      toast('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Button className="me-1" onClick={onClick}>
      {loading ? (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <FaLocationArrow />
      )}
    </Button>
  );
};

export default NearButton;
