import React from 'react';
import logo from '../assets/logo.png';

export const Logo = ({ width = 150, height = 150 }) => (
  <img
    src={logo}
    alt="St. Michael's College Logo"
    style={{
      width,
      height,
      objectFit: 'contain'
    }}
  />
);

export const LogoSmall = () => (
  <Logo width={40} height={40} />
);

export default Logo;