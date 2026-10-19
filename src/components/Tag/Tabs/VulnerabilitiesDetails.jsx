import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../../api';

// components
import {
  Box,
  IconButton,
  Stack,
  Typography,
  InputBase,
  ToggleButton,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { host } from '../../../host';
import { debounce, isEmpty } from 'lodash';
import Loading from '../../Shared/Loading';
import { mapCVEInfo, mapAllCVEInfo } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

import * as XLSX from 'xlsx';
import exportFromJSON from 'export-from-json';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

import VulnerabilitiyCard from '../../Shared/VulnerabilityCard';
import VulnerabilityCountCard from '../../Shared/VulnerabilityCountCard';

const styles = {
  title: {
    color: 'text.strong',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0'
  },
  none: {
    color: 'text.muted',
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  vulnerabilities: {
    position: 'relative',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  search: {
    position: 'relative',
    maxWidth: '100%',
    flex: 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'none',
    border: '0.063rem solid',
    borderColor: 'border.light',
    borderRadius: '0.625rem'
  },
  view: {
    alignContent: 'right',
    variant: 'outlined'
  },
  viewModes: {
    position: 'relative',
    alignItems: 'baseline',
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'right'
  },
  searchIcon: {
    color: 'text.muted',
    paddingRight: '3%'
  },
  searchInputBase: {
    width: '90%',
    paddingLeft: '1.5rem',
    height: '40px',
    color: 'text.secondary'
  },
  input: {
    color: 'text.body',
    '&::placeholder': {
      opacity: '1'
    }
  },
  popper: {
    width: '100%',
    overflow: 'hidden',
    padding: '0.3rem',
    display: 'flex',
    justifyContent: 'left'
  },
  dropdownArrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdownText: {
    color: 'text.link',
    fontSize: '1.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  test: {
    width: '95%'
  }
};

function VulnerabilitiesDetails(props) {
  const [cveData, setCveData] = useState([]);
  const [allCveData, setAllCveData] = useState([]);
  const [cveSummary, setCVESummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAllCve, setIsLoadingAllCve] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag, digest, platform } = props;

  const [openExcludeSearch, setOpenExcludeSearch] = useState(false);

  // pagination props
  const [cveFilter, setCveFilter] = useState('');
  const [cveExcludeFilter, setCveExcludeFilter] = useState('');
  const [cveSeverityFilter, setCveSeverityFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const [anchorExport, setAnchorExport] = useState(null);
  const openExport = Boolean(anchorExport);

  const [selectedViewMore, setSelectedViewMore] = useState(false);

  const getCVERequestName = () => {
    return digest !== '' ? `${name}@${digest}` : `${name}:${tag}`;
  };

  const getPaginatedCVEs = () => {
    api
      .get(
        `${host()}${endpoints.vulnerabilitiesForRepo(
          getCVERequestName(),
          { pageNumber, pageSize: EXPLORE_PAGE_SIZE },
          cveFilter,
          cveExcludeFilter,
          cveSeverityFilter
        )}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let cveInfo = response.data.data.CVEListForImage?.CVEList;
          let summary = response.data.data.CVEListForImage?.Summary;
          let cveListData = mapCVEInfo(cveInfo);
          setCveData((previousState) => (pageNumber === 1 ? cveListData : [...previousState, ...cveListData]));
          setIsEndOfList(response.data.data.CVEListForImage.Page?.ItemCount < EXPLORE_PAGE_SIZE);
          setCVESummary((previousState) => {
            if (isEmpty(summary)) {
              return previousState;
            }
            return {
              Count: summary.Count,
              UnknownCount: summary.UnknownCount,
              LowCount: summary.LowCount,
              MediumCount: summary.MediumCount,
              HighCount: summary.HighCount,
              CriticalCount: summary.CriticalCount
            };
          });
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setCveData([]);
        setCVESummary(() => {});
        setIsEndOfList(true);
      });
  };

  const getAllCVEs = () => {
    api
      .get(`${host()}${endpoints.allVulnerabilitiesForRepo(getCVERequestName())}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          const cveInfo = response.data.data.CVEListForImage?.CVEList;
          const cveListData = mapAllCVEInfo(cveInfo);
          setAllCveData(cveListData);
        }
        setIsLoadingAllCve(false);
      })
      .catch((e) => {
        console.error(e);
        setAllCveData([]);
        setIsLoadingAllCve(false);
      });
  };

  const resetPagination = () => {
    setIsLoading(true);
    setIsEndOfList(false);
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      getPaginatedCVEs();
    }
  };

  const handleOnExportExcel = () => {
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(allCveData);

    XLSX.utils.book_append_sheet(wb, ws, 'vulnerabilities');

    XLSX.writeFile(wb, `${name}:${tag}-vulnerabilities.xlsx`);

    handleCloseExport();
  };

  const handleOnExportCSV = () => {
    const fileName = `${name}:${tag}-vulnerabilities`;
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data: allCveData, fileName, exportType });

    handleCloseExport();
  };

  const handleCveFilterChange = (e) => {
    const { value } = e.target;
    setCveFilter(value);
  };

  const handleClickExport = (event) => {
    setAnchorExport(event.currentTarget);
  };

  const handleCloseExport = () => {
    setAnchorExport(null);
  };

  const handleExpandCVESearch = () => {
    setOpenExcludeSearch((openExcludeSearch) => !openExcludeSearch);
  };

  const handleCveExcludeFilterChange = (e) => {
    const { value } = e.target;
    setCveExcludeFilter(value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handleCveFilterChange, 300));
  const debouncedExcludeFilterChangeHandler = useMemo(() => debounce(handleCveExcludeFilterChange, 300));

  useEffect(() => {
    getPaginatedCVEs();
  }, [pageNumber]);

  // setup intersection obeserver for infinite scroll
  useEffect(() => {
    if (isLoading || isEndOfList) return;
    const handleIntersection = (entries) => {
      if (isLoading || isEndOfList) return;
      const [target] = entries;
      if (target?.isIntersecting) {
        setPageNumber((pageNumber) => pageNumber + 1);
      }
    };
    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });

    if (listBottom.current) {
      intersectionObserver.observe(listBottom.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [isLoading, isEndOfList]);

  useEffect(() => {
    if (isLoading) return;
    resetPagination();
  }, [cveFilter, cveExcludeFilter, cveSeverityFilter]);

  useEffect(() => {
    return () => {
      abortController.abort();
      debouncedChangeHandler.cancel();
      debouncedExcludeFilterChangeHandler.cancel();
    };
  }, []);

  useEffect(() => {
    if (openExport && isEmpty(allCveData)) {
      getAllCVEs();
    }
  }, [openExport]);

  const renderCVEs = () => {
    return !isEmpty(cveData) ? (
      cveData.map((cve, index) => {
        return <VulnerabilitiyCard key={index} cve={cve} name={name} platform={platform} expand={selectedViewMore} />;
      })
    ) : (
      <div>{!isLoading && <Typography sx={styles.none}> No Vulnerabilities </Typography>}</div>
    );
  };

  const renderCVESummary = () => {
    if (cveSummary === undefined) {
      return;
    }

    return !isEmpty(cveSummary) ? (
      <VulnerabilityCountCard
        total={cveSummary.Count}
        critical={cveSummary.CriticalCount}
        high={cveSummary.HighCount}
        medium={cveSummary.MediumCount}
        low={cveSummary.LowCount}
        unknown={cveSummary.UnknownCount}
        filterBySeverity={setCveSeverityFilter}
      />
    ) : (
      <></>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} />;
    }
    return;
  };

  return (
    <Stack direction="column" spacing="1rem" data-testid="vulnerability-container">
      <Stack sx={styles.vulnerabilities}>
        <Typography variant="h4" gutterBottom component="div" align="left" sx={styles.title}>
          Vulnerabilities
        </Typography>
        <Stack direction="row" spacing="1rem" sx={styles.viewModes}>
          <IconButton disableRipple onClick={handleClickExport}>
            <DownloadIcon />
          </IconButton>
          <Snackbar
            open={openExport && isLoadingAllCve}
            message="Getting your data ready for export"
            action={<CircularProgress size="2rem" sx={{ color: 'common.white' }} />}
          />
          <ToggleButton
            value="viewLess"
            title="Collapse list view"
            size="small"
            sx={styles.view}
            selected={!selectedViewMore}
            onChange={() => setSelectedViewMore(false)}
          >
            <ViewHeadlineIcon />
          </ToggleButton>
          <ToggleButton
            value="viewMore"
            title="Expand list view"
            size="small"
            sx={styles.view}
            selected={selectedViewMore}
            onChange={() => setSelectedViewMore(true)}
            data-testid="expand-list-view-toggle"
          >
            <ViewAgendaIcon />
          </ToggleButton>
        </Stack>
        <Menu
          anchorEl={anchorExport}
          open={openExport}
          onClose={handleCloseExport}
          data-testid="export-dropdown"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem
            onClick={handleOnExportCSV}
            disableRipple
            disabled={isLoadingAllCve}
            sx={styles.popper}
            data-testid="export-csv-menuItem"
          >
            csv
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={handleOnExportExcel}
            disableRipple
            disabled={isLoadingAllCve}
            sx={styles.popper}
            data-testid="export-excel-menuItem"
          >
            xlsx
          </MenuItem>
        </Menu>
      </Stack>
      {renderCVESummary()}
      <Stack direction="row">
        <Box sx={styles.dropdownArrowBox} onClick={handleExpandCVESearch}>
          {!openExcludeSearch ? (
            <KeyboardArrowRight sx={styles.dropdownText} />
          ) : (
            <KeyboardArrowDown sx={styles.dropdownText} />
          )}
        </Box>
        <Stack sx={styles.test} direction="column" spacing="0.25em">
          <Stack sx={styles.search}>
            <InputBase
              placeholder={'Search'}
              sx={[styles.searchInputBase, { '& .MuiInputBase-input': styles.input }]}
              onChange={debouncedChangeHandler}
            />
            <Box sx={styles.searchIcon}>
              <SearchIcon />
            </Box>
          </Stack>

          <Collapse in={openExcludeSearch} timeout="auto" unmountOnExit>
            <Stack sx={styles.search}>
              <InputBase
                placeholder={'Exclude'}
                sx={[styles.searchInputBase, { '& .MuiInputBase-input': styles.input }]}
                onChange={debouncedExcludeFilterChangeHandler}
              />
            </Stack>
          </Collapse>
        </Stack>
      </Stack>
      <Stack direction="column" spacing={selectedViewMore ? '1rem' : '0.5rem'}>
        {renderCVEs()}
        {renderListBottom()}
      </Stack>
    </Stack>
  );
}

export default VulnerabilitiesDetails;
