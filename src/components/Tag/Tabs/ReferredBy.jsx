import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Typography, Stack } from '@mui/material';
import ReferrerCard from '../../Shared/ReferrerCard';
import Loading from '../../Shared/Loading';
import { mapReferrer } from 'utilities/objectModels';

const styles = {
  title: {
    color: 'text.primary',
    fontSize: '1.5rem',
    fontWeight: '600',
    paddingTop: '0.5rem'
  },
  none: {
    color: 'text.muted',
    fontSize: '1.4rem',
    fontWeight: '600'
  }
};

function ReferredBy(props) {
  const { referrers } = props;
  const [referrersData, setReferrersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEmpty(referrers)) {
      const mappedReferrersData = referrers.map((referrer) => mapReferrer(referrer));
      setReferrersData(mappedReferrersData);
    } else {
      setReferrersData([]);
    }
    setIsLoading(false);
  }, []);

  const renderReferrers = () => {
    return !isEmpty(referrersData) ? (
      referrersData.map((referrer, index) => {
        return (
          <ReferrerCard
            key={index}
            artifactType={referrer.artifactType}
            mediaType={referrer.mediaType}
            size={referrer.size}
            digest={referrer.digest}
            annotations={referrer.annotations}
          />
        );
      })
    ) : (
      <div>{!isLoading && <Typography sx={styles.none}> Nothing found </Typography>}</div>
    );
  };

  return (
    <div data-testid="referred-by-container">
      <Typography variant="h4" gutterBottom component="div" align="left" sx={styles.title}>
        Referred By
      </Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          {isLoading ? <Loading /> : renderReferrers()}
        </Stack>
      </Stack>
    </div>
  );
}

export default ReferredBy;
