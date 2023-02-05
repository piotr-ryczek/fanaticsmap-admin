import React, { memo } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import ButtonLink from 'common/buttonLink/buttonLink.component';
import { PER_PAGE } from 'config/config';

const OFFSET = 6;

function Pagination(props) {
  const {
    page: currentPage,
    allCount,
    basePath,
    perPage = PER_PAGE,
  } = props;

  const nrPages = Math.ceil(allCount / perPage);
  const pagesArray = Array.from(Array(nrPages).keys());

  return (
    <Grid item container justify="center">
      <ButtonGroup
        variant="contained"
        size="small"
      >
        <ButtonLink
          variant="contained"
          color={currentPage === 1 ? 'primary' : 'default'}
          type="button"
          to={`${basePath}/page/1`}
        >
          1
        </ButtonLink>

        {currentPage > (2 + OFFSET) && (
          <Button
            disabled
            variant="contained"
            color="default"
            type="button"
          >
            ...
          </Button>
        )}

        {pagesArray.map(page => {
          if (
            page !== 0 &&
            page !== pagesArray.length - 1 &&
            (page > currentPage - (2 + OFFSET) && page < currentPage + OFFSET)
          ) {
            return (
              <ButtonLink
                key={page + 1}
                variant="contained"
                color={currentPage === page + 1 ? 'primary' : 'default'}
                type="button"
                to={`${basePath}/page/${page + 1}`}
              >
                {page + 1}
              </ButtonLink>
            );
          }

          return (null);
        })}

        {currentPage < pagesArray.length - (1 + OFFSET) && (
          <Button
            disabled
            variant="contained"
            color="default"
            type="button"
          >
            ...
          </Button>
        )}

        {pagesArray.length > 1 && (
          <ButtonLink
            variant="contained"
            color={currentPage === pagesArray.length ? 'primary' : 'default'}
            type="button"
            to={`${basePath}/page/${pagesArray.length}`}
          >
            {pagesArray.length}
          </ButtonLink>
        )}
        
      </ButtonGroup>
    </Grid>
  );
}

export default memo(Pagination);
