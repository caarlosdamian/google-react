import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Circle,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  MarkerClusterer,
} from '@react-google-maps/api';
import { Places } from './Places';
import Distance from './Distance';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export const Map = () => {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: '',
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);
  const houses = useMemo(() => generateHouses(office), [office]);

  const fetchDirections = async (house: LatLngLiteral) => {
    if (!office) return;

    const services = new google.maps.DirectionsService();
    services.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {directions && <Distance leg={directions.routes[0].legs[0]}/>}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          options={options}
          onLoad={onLoad}
          mapContainerClassName="map-container"
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {office && (
            <>
              <Marker
                position={office}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              <MarkerClusterer
                styles={[
                  {
                    textColor: 'white',
                    height: 53,
                    url: '/m1.png',
                    width: 53,
                  },
                  {
                    textColor: 'white',
                    height: 56,
                    url: '/m2.png',
                    width: 56,
                  },
                  {
                    textColor: 'white',
                    height: 66,
                    url: '/m3.png',
                    width: 66,
                  },
                  {
                    textColor: 'white',
                    height: 78,
                    url: '/m4.png',
                    width: 78,
                  },
                  {
                    textColor: 'white',
                    height: 90,
                    url: '/m5.png',
                    width: 90,
                  },
                ]}
              >
                {(clusterer) =>
                  // @ts-ignore
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => fetchDirections(house)}
                    />
                  ))
                }
              </MarkerClusterer>

              {}

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: '#8BC34A',
  fillColor: '#8BC34A',
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: '#FBC02D',
  fillColor: '#FBC02D',
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: '#FF5252',
  fillColor: '#FF5252',
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position?.lat + Math.random() / direction,
      lng: position?.lng + Math.random() / direction,
    });
  }
  return _houses;
};
