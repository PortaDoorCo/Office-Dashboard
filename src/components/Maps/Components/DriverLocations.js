import React, { Component, useState, useEffect } from 'react';
import { DriverInfoWindow } from './DriverInfoWindow';
import io from 'socket.io-client';
import db_url from '../../../redux/db_url';
const socket = io(db_url);

export const DriverLocations = (props) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    socket.on('drivers', (res) => setLocations(res));
  });

  return locations.map((location, index) => {
    return <DriverInfoWindow key={index} location={location} />;
  });
};
