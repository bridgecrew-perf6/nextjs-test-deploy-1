import { FaTaxi }  from 'react-icons/fa';
import GoogleMapReact from 'google-map-react';

import styles from './styles.module.css';

const DriverPin = (props: GoogleMapReact.ChildComponentProps) => {
  return (
    <div className={styles.driversPin}>
      <FaTaxi size="2.0em" />
    </div>
  );
}

export default DriverPin;
