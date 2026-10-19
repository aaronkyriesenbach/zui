import { Stack, Typography } from '@mui/material';
import { api, endpoints } from 'api';
import { host } from '../../host';
import React, { useEffect, useMemo, useState } from 'react';
import RepoCard from '../Shared/RepoCard';
import { mapToRepo } from 'utilities/objectModels';
import Loading from '../Shared/Loading';
import { useNavigate, createSearchParams } from 'react-router';
import { sortByCriteria } from 'utilities/sortCriteria';
import {
  HOME_POPULAR_PAGE_SIZE,
  HOME_RECENT_PAGE_SIZE,
  HOME_BOOKMARKS_PAGE_SIZE,
  HOME_STARS_PAGE_SIZE
} from 'utilities/paginationConstants';
import { isEmpty } from 'lodash';
import NoDataComponent from 'components/Shared/NoDataComponent';

const styles = {
  gridWrapper: {
    marginTop: '10px',
    marginBottom: '5rem'
  },
  sectionHeaderContainer: (theme) => ({
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    paddingTop: '1rem',
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-end',
      flexDirection: 'row'
    }
  }),
  sectionTitle: {
    fontWeight: '700',
    color: 'text.heading',
    width: '100%',
    // A breakpoint value is emitted after the theme's responsive h4 font size, which a plain value would lose to.
    fontSize: { xs: '2rem' },
    textAlign: 'center',
    lineHeight: '2.375rem',
    letterSpacing: '-0.01rem',
    marginLeft: '0.5rem'
  },
  viewAll: {
    color: 'text.muted',
    fontWeight: '600',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  }
};

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [popularData, setPopularData] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [recentData, setRecentData] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);
  const [starData, setStarData] = useState([]);
  const [isLoadingStars, setIsLoadingStars] = useState(true);

  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);

  const getPopularData = () => {
    setIsLoadingPopular(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_POPULAR_PAGE_SIZE,
          sortBy: sortByCriteria.downloads?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setPopularData(repoData);
          setIsLoading(false);
          setIsLoadingPopular(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsLoadingPopular(false);
      });
  };

  const getRecentData = () => {
    setIsLoadingRecent(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_RECENT_PAGE_SIZE,
          sortBy: sortByCriteria.updateTime?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setRecentData(repoData);
          setIsLoading(false);
          setIsLoadingRecent(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingRecent(false);
        console.error(e);
      });
  };

  const getBookmarks = () => {
    setIsLoadingBookmarks(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_BOOKMARKS_PAGE_SIZE,
          sortBy: sortByCriteria.relevance?.value,
          filter: { IsBookmarked: true }
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setBookmarkData(repoData);
          setIsLoading(false);
          setIsLoadingBookmarks(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingBookmarks(false);
        console.error(e);
      });
  };

  const getStars = () => {
    setIsLoadingStars(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_STARS_PAGE_SIZE,
          sortBy: sortByCriteria.relevance?.value,
          filter: { IsStarred: true }
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setStarData(repoData);
          setIsLoading(false);
          setIsLoadingStars(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingStars(false);
        console.error(e);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    getPopularData();
    getRecentData();
    getBookmarks();
    getStars();
    return () => {
      abortController.abort();
    };
  }, []);

  const handleClickViewAll = (type, value) => {
    navigate({ pathname: `/explore`, search: createSearchParams({ [type]: value }).toString() });
  };

  const isNoData = () =>
    !isLoading &&
    !isLoadingBookmarks &&
    !isLoadingStars &&
    !isLoadingPopular &&
    !isLoadingRecent &&
    bookmarkData.length === 0 &&
    starData.length === 0 &&
    popularData.length === 0 &&
    recentData.length === 0;

  const renderCards = (cardArray) => {
    return (
      cardArray &&
      cardArray.map((item, index) => {
        return (
          <RepoCard
            name={item.name}
            version={item.latestVersion}
            description={item.description}
            downloads={item.downloads}
            stars={item.stars}
            signatureInfo={item.signatureInfo}
            isBookmarked={item.isBookmarked}
            isStarred={item.isStarred}
            vendor={item.vendor}
            platforms={item.platforms}
            key={index}
            vulnerabilityData={{
              vulnerabilitySeverity: item.vulnerabiltySeverity,
              count: item.vulnerabilityCount
            }}
            lastUpdated={item.lastUpdated}
            logo={item.logo}
            digest={item.digest}
          />
        );
      })
    );
  };

  const renderContent = () => {
    return isNoData() === true ? (
      <NoDataComponent text="No images" />
    ) : (
      <Stack alignItems="center" sx={styles.gridWrapper}>
        <Stack sx={styles.sectionHeaderContainer}>
          <div>
            <Typography variant="h4" align="left" sx={styles.sectionTitle}>
              Most popular images
            </Typography>
          </div>
          <div onClick={() => handleClickViewAll('sortby', sortByCriteria.downloads.value)}>
            <Typography variant="body2" sx={styles.viewAll}>
              View all
            </Typography>
          </div>
        </Stack>
        {isLoadingPopular ? <Loading /> : renderCards(popularData, isLoadingPopular)}
        {/* currently most popular will be by downloads until stars are implemented */}
        <Stack sx={styles.sectionHeaderContainer}>
          <div>
            <Typography variant="h4" align="left" sx={styles.sectionTitle}>
              Recently updated images
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              sx={styles.viewAll}
              onClick={() => handleClickViewAll('sortby', sortByCriteria.updateTime.value)}
            >
              View all
            </Typography>
          </div>
        </Stack>
        {isLoadingRecent ? <Loading /> : renderCards(recentData, isLoadingRecent)}
        {!isEmpty(bookmarkData) && (
          <>
            <Stack sx={styles.sectionHeaderContainer}>
              <div>
                <Typography variant="h4" align="left" sx={styles.sectionTitle}>
                  Bookmarks
                </Typography>
              </div>
              <div>
                <Typography
                  variant="body2"
                  sx={styles.viewAll}
                  onClick={() => handleClickViewAll('filter', 'IsBookmarked')}
                >
                  View all
                </Typography>
              </div>
            </Stack>
            {isLoadingBookmarks ? <Loading /> : renderCards(bookmarkData, isLoadingBookmarks)}
          </>
        )}
        {!isEmpty(starData) && (
          <>
            <Stack sx={styles.sectionHeaderContainer}>
              <div>
                <Typography variant="h4" align="left" sx={styles.sectionTitle}>
                  Stars
                </Typography>
              </div>
              <div>
                <Typography
                  variant="body2"
                  sx={styles.viewAll}
                  onClick={() => handleClickViewAll('filter', 'IsStarred')}
                >
                  View all
                </Typography>
              </div>
            </Stack>
            {isLoadingStars ? <Loading /> : renderCards(starData, isLoadingStars)}
          </>
        )}
      </Stack>
    );
  };

  return <>{isLoading ? <Loading /> : renderContent()}</>;
}

export default Home;
