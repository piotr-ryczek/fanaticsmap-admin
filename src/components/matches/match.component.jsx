import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

// import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import DateTimePickerWrapper from 'common/dateTimePickerWrapper/dateTimePickerWrapper.component';
import AddressSearch from 'common/addressSearch/addressSearch.component';
import { setIsLoading } from 'components/app/app.actions';

import Api from 'services/api';

import {
  ATTITUDE_COLORS,
  ATTITUDE_COLOR_UNKNOWN,
  IMPORTANCE_COLORS,
  DEFAULT_COORDINATES,
} from 'config/config';
import { parseCoordinates } from 'util/helpers';

const GoogleMapLocation = withGoogleMap((props) => {
  const [defaultLng, defaultLat] = DEFAULT_COORDINATES;

  const {
    markerCoordinates,
    setState,
  } = props;

  const finalMarkerCoordinates = _isEmpty(markerCoordinates)
    ? { lat: defaultLat, lng: defaultLng, }
    : markerCoordinates

  const handleDragEnd = useCallback((event) => {
    const { latLng: { lat, lng } } = event;

    setState(prevState => ({
      ...prevState,
      coordinates: {
        lat: lat(),
        lng: lng(),
      },
    }));
  }, []);

  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={finalMarkerCoordinates}
      center={finalMarkerCoordinates}
    >
      <Marker
        position={finalMarkerCoordinates}
        draggable
        onDragEnd={handleDragEnd}
      />
    </GoogleMap>
  );
});

const getAttitudeColor = (attitude) => {
  const maybeFoundColor = ATTITUDE_COLORS.find(({ from, to }) => (from <= attitude && attitude <= to));

  return maybeFoundColor || ATTITUDE_COLOR_UNKNOWN;
};
const getImportanceColor = (importance) => {
  const maybeFoundColor = IMPORTANCE_COLORS.find(({ from, to }) => from <= importance && importance <= to);

  return maybeFoundColor || ATTITUDE_COLOR_UNKNOWN;
};

// const useStyles = makeStyles(theme => ({
//   button: {
//     marginRight: theme.spacing(1),
//   },
// }));

function Match(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const classes = useStyles({});

  const {
    onSelect,
    onDeselect,
    isChecked,
    match: {
      _id: matchId,
      retrievedHomeClubName,
      homeClub,
      unimportantHomeClubName,
      retrievedAwayClubName,
      awayClub,
      unimportantAwayClubName,
      isHomeClubReserve,
      isAwayClubReserve,
      attitude: propsAttitude,
      importance: propsImportance,
      location: propsLocation,
      date: propsDate,
      isVisible: propsIsVisible,
      league,
      attitudeEstimationLevel,
    }
  } = props;

  const [state, setState] = useState({
    anchorEl: null,
    isMapOpened: false,
    // Attitude
    originalAttitude: '',
    attitude: '',
    // Date
    originalDate: new Date(),
    date: new Date(),
    // Importance
    originalImportance: '',
    importance: '',
    // Coordinates
    originalCoordinates: '',
    coordinates: '',
    // isVisible
    originalIsVisible: false,
    isVisible: false,
  });

  // Initial
  useEffect(() => {
    const originalDate = propsDate ? new Date(propsDate) : new Date();
    const parsedCoordinates = parseCoordinates(propsLocation.coordinates);

    setState(prevState => ({
      ...prevState,
      originalAttitude: propsAttitude,
      attitude: propsAttitude,
      originalDate: originalDate,
      date: originalDate,
      originalImportance: propsImportance,
      importance: propsImportance,
      originalCoordinates: parsedCoordinates,
      coordinates: parsedCoordinates,
      originalIsVisible: propsIsVisible,
      isVisible: propsIsVisible,
    }));
  }, []);

  const {
    anchorEl,
    isMapOpened,
    originalAttitude,
    attitude,
    originalDate,
    date,
    originalImportance,
    importance,
    originalCoordinates,
    coordinates,
    originalIsVisible,
    isVisible,
  } = state;

  const homeClubName = homeClub ? homeClub.name : unimportantHomeClubName;
  const awayClubName = awayClub ? awayClub.name : unimportantAwayClubName;

  // const roundedAttitude = attitude === 'unknown' ? 'unknown' : Math.round(attitude * 100) / 100;
  // const roundedImportance = Math.round(importance * 100) / 100;

  const attitudeColor = getAttitudeColor(attitude);
  const importanceColor = getImportanceColor(importance);

  const handleSelection = useCallback(() => {
    if (isChecked) {
      onDeselect(matchId)
    } else {
      onSelect(matchId);
    }
  }, [isChecked, matchId, onDeselect, onSelect]);

  const handleChange = (name) => event => {
    const { value } = event.target;

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleChangeDate = useCallback((value) => {
    setState(prevState => ({
      ...prevState,
      date: value,
    }));
  }, []);

  const handleChangeVisibility = useCallback((event, value) => {
    setState(prevState => ({
      ...prevState,
      isVisible: value,
    }));
  }, []);

  const hasChanged = useMemo(() => {
    const originalAttitudeToCompare = originalAttitude === 'unknown' ? 'unknown' : parseFloat(originalAttitude);
    const attitudeToCompare = attitude === 'unknown' ? 'unknown' : parseFloat(attitude);

    return !_isEqual(originalAttitudeToCompare, attitudeToCompare) ||
      !_isEqual(originalDate, date) ||
      !_isEqual(originalImportance, parseFloat(importance)) ||
      !_isEqual(originalCoordinates, coordinates) ||
      !_isEqual(originalIsVisible, isVisible);
  }, [originalAttitude, originalDate, originalImportance, originalCoordinates, originalIsVisible, attitude, date, importance, coordinates, isVisible]);

  const handleOpenMap = useCallback((event) => {
    setState(prevState => ({
      ...prevState,
      anchorEl: event.currentTarget,
      isMapOpened: true,
    }));
  }, []);

  const handleCloseMap = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isMapOpened: false,
    }));
  }, []);

  const handleCoordinatesChange = useCallback((coordinates) => {
    const [lng, lat] = coordinates;

    setState(prevState => ({
      ...prevState,
      coordinates: {
        lat,
        lng,
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    dispatch(setIsLoading(true));

    await Api.put(`/matches/${matchId}`, {
      attitude,
      importance,
      date,
      coordinates,
      isVisible,
    });

    setState(prevState => ({
      ...prevState,
      originalAttitude: attitude,
      originalImportance: importance,
      originalDate: date,
      originalCoordinates: coordinates,
      originalIsVisible: isVisible,
    }));

    dispatch(setIsLoading(false));
  }, [matchId, attitude, date, importance, coordinates, isVisible]);

  const finalCoordinates = coordinates;
  const hasLocation = (finalCoordinates.lat !== 0 || finalCoordinates.lng !== 0);

  return (
    <tr className="match">
      <td className="match-remove">
        <Checkbox
          checked={isChecked}
          onChange={handleSelection}
        />
      </td>
      <td className="match-importance">
        <input
          type="text"
          value={importance}
          onChange={handleChange('importance')}
          className="importance"
          style={{ backgroundColor: importanceColor.backgroundColor }}
        />
      </td>
      <td className="match-home-club">
        {retrievedHomeClubName && !unimportantHomeClubName && (
          <span className="retrieved-club-name">{retrievedHomeClubName}</span>
        )}
        <span className={classNames('club-name', { 'unimportant': unimportantHomeClubName })}>
          {homeClubName}
          {isHomeClubReserve ? ' II' : ''}
        </span>
        {isHomeClubReserve && <span className="club-name-reserve">{t('match.reserves')}</span>}
      </td>
      <td className="match-attitude">
        <div className="attitude-wrapper">
          <input
            type="text"
            value={attitude}
            onChange={handleChange('attitude')}
            className="attitude"
            style={{ backgroundColor: attitudeColor.backgroundColor }}
          />
          {attitudeEstimationLevel && (
            <div className="attitude-estimation-level">
              {attitudeEstimationLevel}
            </div>
          )}
        </div>
      </td>
      <td className="match-away-club">
        {retrievedAwayClubName && !unimportantAwayClubName && (
          <span className="retrieved-club-name">{retrievedAwayClubName}</span>
        )}
        <span className={classNames('club-name', { 'unimportant': unimportantAwayClubName })}>
          {awayClubName}
          {isAwayClubReserve ? ' II' : ''}
        </span>
        {isAwayClubReserve && <span className="club-name-reserve">{t('match.reserves')}</span>}
      </td>
      <td className="match-location">
        <Popper open={isMapOpened} anchorEl={anchorEl}>
          <ClickAwayListener onClickAway={handleCloseMap}>
            <Paper>
              <Box p={1}>
                <div className="location-wrapper">
                  <GoogleMapLocation
                    markerCoordinates={finalCoordinates}
                    setState={setState}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `30rem`, width: '30rem' }} />}
                    containerElement={<div style={{ height: `30rem`, width: '30rem' }} />}
                    mapElement={<div style={{ height: `30rem`, width: '30rem' }} />}
                  />

                  <AddressSearch onChange={handleCoordinatesChange} />
                </div>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        <Button
          variant="contained"
          color={!hasLocation ? 'secondary' : 'primary'}
          type="button"
          size="small"
          onClick={handleOpenMap}
        >
          {!hasLocation ? t('match.setLocation') : t('match.changeLocation')}
        </Button>
      </td>
      <td className="match-league">
        {league && (
          <Tooltip placement="top" title={league.name}><span className={classNames('tier', `tier-${league.tier}`)}>{league.tier}</span></Tooltip>
        )}
      </td>
      <td className="match-date">
        <DateTimePickerWrapper 
          onChange={handleChangeDate}
          value={date}
        />
      </td>
      <td className="match-visibility">
        <Checkbox
          checked={isVisible}
          onChange={handleChangeVisibility}
        />
      </td>
      <td className="match-actions">
        <Button
          variant="contained"
          color="secondary"
          type="button"
          size="small"
          disabled={!hasChanged}
          onClick={handleSave}
        >
          {t('global.save')}
        </Button>
      </td>
    </tr>
  );
}

export default memo(Match);
