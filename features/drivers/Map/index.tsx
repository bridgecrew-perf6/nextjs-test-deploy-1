import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { pick, get, throttle }  from 'lodash';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlay, FaStop } from 'react-icons/fa';
import { Button, Alert } from 'reactstrap';

import DriversSlider from './DriversSlider';
import NearButton from './NearButton';
import OfficesList from './OfficesList';
import DriverPin from './DriverPin';
import OfficePin from './OfficePin';

import {
  LOCATIONS,
  ZOOM_TO_MAX_DRIVERS_MAP,
  DEFAULT_OFFICE,
  MIN_DRIVERS_COUNT,
  DRIVERS_MIN_ZOOM,
  DRIVERS_MAX_ZOOM,
  MAX_DRIVERS_ZOOM,
} from './consts';

import styles from './styles.module.css';

type Driver = {
  id: string,
  lat: number,
  lng: number,
};

type SimpleMapProps = {

};

type SimpleMapState = {
  currentOffice: string,
  drivers: Driver[],
  driversCount: number,
  zoom: number,
  autoUpdateDrivers: boolean,
};

class SimpleMap extends Component<SimpleMapProps, SimpleMapState> {
  googleMapObject?: google.maps.Map;
  driversUpdateInterval?: number;

  constructor(props: SimpleMapProps) {
    super(props);

    const zoom = DRIVERS_MIN_ZOOM;

    this.state = {
      currentOffice: DEFAULT_OFFICE,
      drivers: [],
      driversCount: ZOOM_TO_MAX_DRIVERS_MAP[zoom],
      zoom,
      autoUpdateDrivers: false,
    };
  }

  componentDidMount() {
    this.updateDrivers();
  }

  updateDrivers = throttle(async () => {
    const { currentOffice, driversCount } = this.state;

    const office = LOCATIONS[currentOffice];

    if (!office) {
      return;
    }

    try {
      const response = await axios.get('/api/drivers', {
        params: {
          latitude: office.lat,
          longitude: office.lng,
          count: driversCount,
        },
      });

      this.setState({ drivers: (response.data || []).slice(0, driversCount) });
    } catch (e) {
      // console.debug(e);
    }
  }, 1000);

  onCurrentLocation = (data: GeolocationPosition) => {
    const checkApiExists = get((window as any).google, 'maps.geometry.spherical.computeDistanceBetween');

    if (!data || !data.coords || !checkApiExists) {
      return;
    }

    const currentPoint = {
      lat: data.coords.latitude,
      lng: data.coords.longitude,
    };

    let nearestOffice;
    let minDistance = Number.MAX_SAFE_INTEGER;
    Object.values(LOCATIONS).forEach((l) => {
      const point = pick(l, ['lat', 'lng']);
      const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(currentPoint, point);

      if (distance < minDistance) {
        nearestOffice = l.key;
        minDistance = distance;
      }
    });

    if (nearestOffice) {
      this.setCurrentOffice(nearestOffice);
    }
  };

  onCurrentLocationError = (data: GeolocationPositionError) => {
    toast(data && data.message ? data.message : 'Geolocation error.');
  };

  onClickDropdownItem = (officeKey: string) => {
    this.setCurrentOffice(officeKey);
  };

  setCurrentOffice = (officeKey: string) => {
    this.setState({
      currentOffice: officeKey,
    }, () => {
      if (this.googleMapObject) {
        this.googleMapObject.setCenter({
          lat: LOCATIONS[officeKey].lat,
          lng: LOCATIONS[officeKey].lng,
        });
        this.googleMapObject.setZoom(MAX_DRIVERS_ZOOM);
      }
    });
  };

  handleApiLoaded = (map: any) => {
    this.googleMapObject = map;

    this.googleMapObject?.addListener('zoom_changed', this.onChangeZoom)
  };

  onChangeDriversNumber = (value: number) => {
    this.setState({
      driversCount: value,
    }, () => {
      this.updateDrivers();
    });
  };

  onChangeZoom = () => {
    const newZoom = this.googleMapObject?.getZoom() || DRIVERS_MIN_ZOOM;
    this.setState(() => ({
      zoom: newZoom,
      driversCount: this.resolveMax(newZoom),
    }), () => {
      this.updateDrivers();
    });
  };

  resolveMax = (newZoom?: number) => {
    const zoom = newZoom || this.state.zoom;

    if (zoom < DRIVERS_MIN_ZOOM) {
      return MIN_DRIVERS_COUNT;
    }

    if (zoom > DRIVERS_MAX_ZOOM) {
      return MIN_DRIVERS_COUNT;
    }

    return ZOOM_TO_MAX_DRIVERS_MAP[zoom];
  };

  onToggleDriversAutoUpdate = () => {
    const { autoUpdateDrivers } = this.state;

    if (autoUpdateDrivers) {
      window.clearInterval(this.driversUpdateInterval);
    }  else {
      this.driversUpdateInterval = window.setInterval(() => {
        this.updateDrivers();
      }, 3000);
    }

    this.setState({
      autoUpdateDrivers: !autoUpdateDrivers,
    })
  };

  render() {
    const { currentOffice, drivers, driversCount, zoom, autoUpdateDrivers } = this.state;

    const office = LOCATIONS[currentOffice] ? currentOffice : DEFAULT_OFFICE;

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      return (
        <Alert color="danger">Google maps API KEY required!</Alert>
      );
    }

    return (
      // Important! Always set the container height explicitly
      <div className={styles.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            libraries: ['geometry'], // to use built-in computeDistanceBetween method
          }}
          defaultCenter={{
            lat: LOCATIONS[office].lat,
            lng: LOCATIONS[office].lng
          }}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => this.handleApiLoaded(map)}
        >
          <OfficePin
            lat={LOCATIONS[office].lat}
            lng={LOCATIONS[office].lng}
          />
          {drivers.map(driver => {
            return (
              <DriverPin
                key={driver.id}
                lat={driver.lat}
                lng={driver.lng}
              />
            );
          })}
        </GoogleMapReact>
        <div className={styles.controls}>
          <Button className="me-1" onClick={this.onToggleDriversAutoUpdate}>
            {autoUpdateDrivers ? <FaStop /> : <FaPlay />}
          </Button>
          <NearButton onLocated={this.onCurrentLocation} onError={this.onCurrentLocationError} />
          <OfficesList currentOffice={office} onClick={this.onClickDropdownItem} />
        </div>
        <DriversSlider
          value={driversCount}
          onChange={this.onChangeDriversNumber}
          max={this.resolveMax()}
        />
      </div>
    );
  }
}

export default SimpleMap;
