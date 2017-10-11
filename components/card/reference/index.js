import classNames from 'classnames';
import PropTypes from 'prop-types';
import punycode from 'punycode';
import React from 'react';

import { ParseContainer } from 'themes/mastodon-go/components';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Reliably gets the hostname from a URL.
const getHostname = url => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
};

const CardReference = ({
  className,
  href,
  name,
}) => {
  const computedClass = classNames('MASTODON_GO--CARD--REFERENCE', className);
  if (href) {
    return (
      <CommonLink
        className={computedClass}
        href={href}
      >
        <ParseContianer
          text={name || punycode.toUnicode(getHostname(href))}
          type='emoji'
        />
      </CommonLink>
    );
  }
  if (name) {
    return (
      <span className={computedClass}>
        <ParseContianer
          text={name || punycode.toUnicode(getHostname(href))}
          type='emoji'
        />
      </span>
    );
  }
  return null;
}
