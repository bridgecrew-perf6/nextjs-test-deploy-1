import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { toInteger }  from 'lodash';

import styles from './styles.module.css';

const DriversSlider = ({ value, onChange, max }: {
  value: number,
  max: number,
  onChange: (value: number) => void,
}) => {
  const [currentIndex, setCurrentIndex] = useState(value);

  useEffect(() => {
    if (currentIndex !== value) {
      setCurrentIndex(value);
    }
  }, [value])

  const onInnerChange = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();

    setCurrentIndex(toInteger(e.target.value));
  };

  const onMouseUp = (e: React.BaseSyntheticEvent) => {
    onChange(toInteger(e.target.value));
  };

  return (
    <div className={cn('alert alert-info m-0', styles.sliderContainer)}>
      <div className="mb-2">Drivers: {currentIndex}</div>
      <div className={styles.slider}>
        <input
          type="range"
          min={1}
          max={max}
          value={currentIndex}
          onChange={onInnerChange}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          onPointerUp={onMouseUp}
        />
      </div>
    </div>
  );
};

export default DriversSlider;
