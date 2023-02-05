import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

const GoogleMapStaticLocation = withGoogleMap((props) => {
  const {
    markerCoordination,
  } = props;

  return (
    <GoogleMap
      defaultZoom={8}
      center={markerCoordination}
    >
      <Marker
        position={markerCoordination}
      />
    </GoogleMap>
  );
});

function GoogleMapStaticLocationHOC(props) {
  return (
    <GoogleMapStaticLocation
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `400px` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  )
}

export default GoogleMapStaticLocationHOC;
