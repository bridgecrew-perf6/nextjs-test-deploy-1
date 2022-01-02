import { MdLocationPin } from 'react-icons/md';
import GoogleMapReact from 'google-map-react';

import styles from './styles.module.css';

const OfficePin = (props: GoogleMapReact.ChildComponentProps) => {
  return (
    <div className={styles.officePin}>
      <MdLocationPin size="3em" />
    </div>
  );
}

export default OfficePin;
