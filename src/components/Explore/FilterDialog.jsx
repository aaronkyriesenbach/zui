import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button
} from '@mui/material';
import { sortByCriteria } from 'utilities/sortCriteria.js';

function FilterDialog(props) {
  const { open, setOpen, sortValue, setSortValue, renderFilterCards } = props;

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <DialogContentText>Sort results</DialogContentText>
        <FormControl sx={{ m: '1', width: '80%' }} size="small">
          <Select label="Sort" value={sortValue} onChange={handleSortChange} MenuProps={{ disableScrollLock: true }}>
            {Object.values(sortByCriteria).map((el) => (
              <MenuItem key={el.value} value={el.value}>
                {el.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {renderFilterCards()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FilterDialog;
