// react global
import React, { useState } from 'react';

// components
import Typography from '@mui/material/Typography';
import { Box, Stack, InputBase, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TagCard from '../../Shared/TagCard';
import { tagsSortByCriteria } from 'utilities/sortCriteria';

const styles = {
  search: {
    position: 'relative',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'none',
    border: '0.063rem solid',
    borderColor: 'border.light',
    borderRadius: '0.625rem'
  },
  searchIcon: {
    color: 'text.muted',
    paddingRight: '3%'
  },
  searchInputBase: {
    width: '90%',
    paddingLeft: '1.5rem',
    height: '40px'
  },
  input: {
    color: 'text.body',
    fontSize: '1rem',
    '&::placeholder': {
      opacity: '1'
    }
  }
};

export default function Tags(props) {
  const { tags, repoName, onTagDelete } = props;
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortFilter, setSortFilter] = useState(tagsSortByCriteria.updateTimeDesc.value);

  const renderTags = (tags) => {
    const selectedSort = Object.values(tagsSortByCriteria).find((sc) => sc.value === sortFilter);
    const filteredTags = tags.filter((t) => t.tag?.includes(tagsFilter));
    if (selectedSort) {
      filteredTags.sort(selectedSort.func);
    }
    return (
      tags &&
      filteredTags.map((tag) => {
        return (
          <TagCard
            key={tag.tag}
            tag={tag.tag}
            lastUpdated={tag.lastUpdated}
            vendor={tag.vendor}
            manifests={tag.manifests}
            repo={repoName}
            repoName={repoName}
            showRepoName={false}
            onTagDelete={onTagDelete}
            isDeletable={tag.isDeletable}
          />
        );
      })
    );
  };

  const handleTagsFilterChange = (e) => {
    const { value } = e.target;
    setTagsFilter(value);
  };

  const handleTagsSortChange = (e) => {
    const { value } = e.target;
    setSortFilter(value);
  };

  return (
    <Stack direction="column" spacing="1rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          align="left"
          sx={{ color: 'text.primary', fontSize: '1.5rem', fontWeight: '600' }}
        >
          Tags History
        </Typography>
        <FormControl sx={{ m: '1', minWidth: '4.6875rem' }} size="small">
          <InputLabel>Sort</InputLabel>
          <Select
            label="Sort"
            value={sortFilter}
            onChange={handleTagsSortChange}
            MenuProps={{ disableScrollLock: true }}
          >
            {Object.values(tagsSortByCriteria).map((el) => (
              <MenuItem key={el.value} value={el.value}>
                {el.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack sx={styles.search}>
        <InputBase
          placeholder={'Search tags...'}
          sx={[styles.searchInputBase, { '& .MuiInputBase-input': styles.input }]}
          value={tagsFilter}
          onChange={handleTagsFilterChange}
        />
        <Box sx={styles.searchIcon}>
          <SearchIcon />
        </Box>
      </Stack>
      {renderTags(tags)}
    </Stack>
  );
}
