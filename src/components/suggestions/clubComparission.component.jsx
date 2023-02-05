import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import { IMAGES_URL } from 'config/config';
import { parseCoordinates } from 'util/helpers';
import GoogleMapsStaticLocation from 'common/googleMapStaticLocation/googleMapStaticLocation.component';

import AfterRelations from './util/afterRelations.component';
import Field from './util/field.component';
import FieldWrapper from './util/fieldWrapper.component';
import RelationClub from './util/relationClub.component';

function ClubComparission(props) {
  const { t } = useTranslation();

  const {
    comment,
    comparision: {
      isNewName,
      isNewTier,
      isNewSearchName,
      isNewTransliterationName,
      isNewLogo,
      isNewLocation,
      toAddFriendships,
      toRemoveFriendships,
      toAddAgreements,
      toRemoveAgreements,
      toAddPositives,
      toRemovePositives,
      toAddSatellites,
      toRemoveSatellites,
      toAddEnemies,
      toRemoveEnemies,
      toAddDerbyRivalries,
      toRemoveDerbyRivalries,
      toAddSatelliteOf,
      toRemoveSatelliteOf,
    },
    data,
    comparision,
    data: {
      name,
      tier,
      searchName,
      transliterationName,
      logo,
      location: {
        coordinates,
      },
      friendships = [],
      friendshipsToCreate,
      agreements = [],
      agreementsToCreate,
      positives = [],
      positivesToCreate,
      satellites = [],
      satellitesToCreate,
      enemies = [],
      enemiesToCreate,
      derbyRivalries = [],
      derbyRivalriesToCreate,
      satelliteOf,
      satelliteOfToCreate,
    }
  } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={1}>
          <Field
            label={`${t('club.name')}:`}
            value={name}
            className={classNames({ 'to-change': isNewName })}
            tooltipText={t(`suggestions.tooltips.${isNewName ? 'change' : 'noChange'}`)}
          />
          <Divider />
          <Field
            label={`${t('club.tier')}:`}
            value={tier}
            className={classNames({ 'to-change': isNewTier })}
            tooltipText={t(`suggestions.tooltips.${isNewTier ? 'change' : 'noChange'}`)}
          />
          <Divider />
          <Field
            label={`${t('club.searchNameShort')}:`}
            value={searchName}
            className={classNames({ 'to-change': isNewSearchName })}
            tooltipText={t(`suggestions.tooltips.${isNewSearchName ? 'change' : 'noChange'}`)}
          />
          <Divider />
          <Field
            label={`${t('club.transliterationNameShort')}:`}
            value={transliterationName}
            className={classNames({ 'to-change': isNewTransliterationName })}
            tooltipText={t(`suggestions.tooltips.${isNewTransliterationName ? 'change' : 'noChange'}`)}
          />
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.logo')}
                :
              </Typography>
            </Grid>
            <Tooltip title={t(`suggestions.tooltips.${isNewLogo ? 'change' : 'noChange'}`)} placement="left">
              <Grid item xs={10}>
                {logo && (
                  <img src={`${IMAGES_URL}/h180/${logo}`} alt="" className={classNames({ 'to-change': isNewLogo })} />
                )}
              </Grid>
            </Tooltip>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.friendships')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={friendships}
                toRemove={toRemoveFriendships}
                toAdd={toAddFriendships}
                toCreate={friendshipsToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.agreements')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={agreements}
                toRemove={toRemoveAgreements}
                toAdd={toAddAgreements}
                toCreate={agreementsToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.positives')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={positives}
                toRemove={toRemovePositives}
                toAdd={toAddPositives}
                toCreate={positivesToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.enemies')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={enemies}
                toRemove={toRemoveEnemies}
                toAdd={toAddEnemies}
                toCreate={enemiesToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.derbyRivalries')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={derbyRivalries}
                toRemove={toRemoveDerbyRivalries}
                toAdd={toAddDerbyRivalries}
                toCreate={derbyRivalriesToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.satellites')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <AfterRelations
                current={satellites}
                toRemove={toRemoveSatellites}
                toAdd={toAddSatellites}
                toCreate={satellitesToCreate}
              />
            </Grid>
          </FieldWrapper>
          <Divider />
          <FieldWrapper>
            <Grid item xs={2}>
              <Typography color="textSecondary">
                {t('club.satelliteOf')}
                :
              </Typography>
            </Grid>
            <Grid item xs={10}>
              {toRemoveSatelliteOf && <RelationClub type="remove">{toRemoveSatelliteOf.name}</RelationClub>}
              {satelliteOfToCreate && <RelationClub type="create">{satelliteOfToCreate}</RelationClub>}
              {satelliteOf && <RelationClub type={toAddSatelliteOf ? 'add' : 'no-change'}>{satelliteOf.name}</RelationClub>}
            </Grid>
          </FieldWrapper>
          {comment && (
            <>
              <Divider />
              <Field label={`${t('club.comments')}:`} value={comment} />
            </>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Tooltip title={t(`suggestions.tooltips.${isNewLocation ? 'change' : 'noChange'}`)} placement="top">
          <Box
            className={classNames({
              'to-change': isNewLocation,
            })}
          >
            <GoogleMapsStaticLocation
              markerCoordination={parseCoordinates(coordinates)}
            />
          </Box>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default ClubComparission;
