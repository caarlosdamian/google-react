'use client';
import Image from 'next/image';
import styles from './page.module.css';

import { useLoadScript } from '@react-google-maps/api';
import React from 'react';
import { Map } from './components/Map';

export default function Home() {
  const [map, setMap] = React.useState(null);

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: '',
    libraries: ['places'],
  });

  if(!isLoaded) return <div>Loading...</div>

  return <Map/>;
}
