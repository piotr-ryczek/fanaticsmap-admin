import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';
import _get from 'lodash/get';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableMUI from '@material-ui/core/Table';

import Api from 'services/api';
import history from 'config/history';

import Pagination from 'common/pagination/pagination.component';
import { setMessage, setIsLoading } from 'components/app/app.actions';

import Search from './search.component';
import TableHeader from './tableHeader.component';
import TableBody from './tableBody.component';

function TableList(props) {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    data: [],
    allCount: 0,
    selected: [],
    search: {},
  });

  const {
    data,
    allCount,
    selected,
    search,
  } = state;

  const {
    apiPath,
    adminPath,
    canEdit,
    canRemove,
    canView,
    columns,
    searchColumns = [],
    hasEditCredential,
    actions,
  } = props;

  const page = +(_get(props, 'match.params.page', 1));

  useDeepCompareEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    dispatch(setIsLoading(true));

    const { data, allCount } = await Api.get(apiPath, {
      page,
      search
    });

    setState(prevState => ({
      ...prevState,
      data,
      allCount,
    }));

    dispatch(setIsLoading(false));
  };

  const searchItems = useCallback((searchData) => {
    setState(prevState => ({
      ...prevState,
      search: searchData,
      selected: [],
    }));

    history.push(`${adminPath}/page/1`);
  }, []);

  const handleSelect = useCallback((id) => {
    setState(prevState => ({
      ...prevState,
      selected: [...prevState.selected, id],
    }));
  }, []);

  const handeDeselect = useCallback((id) => {
    setState(prevState => ({
      ...prevState,
      selected: prevState.selected.filter(selectedId => selectedId !== id),
    }));
  }, []);

  const handleDelete = useCallback(async () => {
    dispatch(setIsLoading(true));

    await Api.delete(apiPath, {
      ids: selected,
    });

    dispatch(setIsLoading(false));
    dispatch(setMessage('success', 'REMOVE_SUCCESS'));

    if (page === 1) fetchData();

    setState(prevState => ({
      ...prevState,
      selected: [],
      page: 1,
    }));
  }, [selected]);

  const isAllChecked = data.length > 0 && data.every(singleData => selected.includes(singleData._id));

  const handleToggleSelected = useCallback(() => {
    const updatedSelected = isAllChecked ? [] : data.map(singleData => singleData._id);

    setState(prevState => ({
      ...prevState,
      selected: updatedSelected,
    }));
  }, [data, isAllChecked]);

  return (
    <>
      <Grid container spacing={2}>
        {searchColumns.length > 0 && (
          <Search
            searchColumns={searchColumns}
            onSearch={searchItems}
          />
        )}
        <Grid item xs={12}>
          <Paper>
            <TableMUI>
              <TableHeader
                columns={columns}
                isAllChecked={isAllChecked}
                toggleSelected={handleToggleSelected}
                handleDelete={handleDelete}
                canRemove={canRemove}
                canView={canView}
                selected={selected}
                hasEditCredential={hasEditCredential}
              />
              <TableBody
                data={data}
                columns={columns}
                selected={selected}
                onSelect={handleSelect}
                onDeselect={handeDeselect}
                apiPath={apiPath}
                canRemove={canRemove}
                canEdit={canEdit}
                canView={canView}
                hasEditCredential={hasEditCredential}
                actions={actions}
              />
            </TableMUI>
          </Paper>
        </Grid>

        <Pagination
          page={page}
          allCount={allCount}
          // changePage={changePage}
          basePath={adminPath}
        />
      </Grid>
    </>
  );
}

export default TableList;
