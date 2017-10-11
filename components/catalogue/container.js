//  <CatalogueContainer>
//  ====================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Catalogue from '.';

//  Request imports.
import {
  expandCatalogue,
  fetchCatalogue,
  refreshCatalogue,
} from 'themes/mastodon-go/redux';

//  Other imports
import { connect } from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

export default connect(
  createStructuredSelector({
    accounts: (state, { path }) => state.getIn(['catalogue', path, 'accounts']),
    isLoading: (state, { path }) => state.getIn(['catalogue', path, 'isLoading']),
    rainbow: (state, { path }) => state.getIn(['catalogue', path, 'rainbow']),
  }),
  (go, store, { path }) => ({
    expand: () => go(expandCatalogue, path),
    block: () => go(fetchCatalogue, path),
    follow: () => go(refreshCatalogue, path),
  })
)(Catalogue);
