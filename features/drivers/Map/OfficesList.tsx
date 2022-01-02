import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { LOCATIONS } from './consts';

import styles from './styles.module.css'

const OfficesList = ({ currentOffice, onClick }: {
  currentOffice: string,
  onClick: (office: string) => void,
}) => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle>
        {currentOffice}
      </DropdownToggle>
      <DropdownMenu>
        {Object.values(LOCATIONS).map(l => {
          return (
            <DropdownItem key={l.key} onClick={() => onClick(l.key)}>
              {l.key}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default OfficesList;
