import { Card, CardContent, Checkbox, FormControlLabel, Stack, Tooltip, Typography } from '@mui/material';
import { isArray, isNil } from 'lodash';
import React from 'react';
import { cardShadow } from 'theme/styles';

const styles = {
  card: {
    display: 'flex',
    minWidth: '15%',
    alignItems: 'flex-start',
    backgroundColor: 'background.paper',
    boxShadow: cardShadow,
    borderColor: 'background.paper',
    borderRadius: '0.75rem',
    color: 'text.strong'
  },
  cardContent: {
    '&:last-child': {
      padding: '1rem'
    }
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    letterSpacing: '-0.01rem',
    marginBottom: '1rem'
  },
  formControl: {
    marginLeft: '0',
    marginRight: '0'
  },
  cardContentText: {
    fontSize: '1rem',
    color: 'text.muted',
    lineHeight: '1.5rem',
    paddingLeft: '0.5rem'
  }
};

function FilterCard(props) {
  const { title, filters, updateFilters, filterValue, wrapperLoading } = props;

  const handleFilterClicked = (event, changedFilterValue) => {
    const { checked } = event.target;
    if (checked) {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: true });
      } else {
        updateFilters([...filterValue, changedFilterValue]);
      }
    } else {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: false });
      } else {
        updateFilters(filterValue.filter((e) => e !== changedFilterValue));
      }
      // setSelectedFilter(null);
    }
  };

  const getCheckboxStatus = (filter) => {
    if (isNil(filter)) {
      return false;
    }
    if (isArray(filterValue)) {
      return filterValue?.includes(filter.label);
    }
    return filterValue[filter.value] || false;
  };

  const getFilterRows = () => {
    const filterRows = filters;
    return filterRows.map((filter, index) => {
      return (
        <Tooltip key={index} title={filter.tooltip ?? filter.label} placement="top" arrow>
          <FormControlLabel
            sx={styles.formControl}
            componentsProps={{ typography: { variant: 'body2', sx: styles.cardContentText } }}
            control={<Checkbox sx={{ padding: '0.188rem', color: 'text.muted' }} />}
            label={filter.label}
            id={title}
            checked={getCheckboxStatus(filter)}
            onChange={() => handleFilterClicked(event, filter.value)}
            disabled={wrapperLoading}
          />
        </Tooltip>
      );
    });
  };

  return (
    <Card variant="outlined" sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Typography sx={styles.cardTitle}>{title || 'Filter Title'}</Typography>
        <Stack direction="column">{getFilterRows()}</Stack>
      </CardContent>
    </Card>
  );
}

export default FilterCard;
