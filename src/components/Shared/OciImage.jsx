import React from 'react';
import { CardMedia } from '@mui/material';
import { isEmpty } from 'lodash';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

export const imageArray = [repocube1, repocube2, repocube3, repocube4];

export const getConsistentImage = (digest, name) => {
  const str = digest || name;
  if (!str) {
    return repocube1;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % imageArray.length;
  return imageArray[index];
};

// The placeholder cubes are dark blue, so they get lifted on dark surfaces; uploaded logos are left untouched.
const brightenPlaceholder = (theme) => theme.applyStyles('dark', { filter: 'brightness(1.8)' });

function OciImage({ digest, name, logo, classes, className, sx, ...props }) {
  const hasLogo = !isEmpty(logo);
  const imageSrc = hasLogo ? `data:image/png;base64, ${logo}` : getConsistentImage(digest, name);
  const sxList = Array.isArray(sx) ? sx : [sx];
  return (
    <CardMedia
      classes={classes}
      className={className}
      component="img"
      image={imageSrc}
      alt="icon"
      sx={hasLogo ? sxList : [brightenPlaceholder, ...sxList]}
      {...props}
    />
  );
}

export default OciImage;
