//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports
import './style';

import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

function Preview () {
  return null;
}

var ConnectedPreview;

moduleOnReady(function () {
  ConnectedPreview = connect(Preview);
});

export { ConnectedPreview as default };
