/*********************************************************************\
|                                                                     |
|   <CatalogueContainer>                                              |
|   ====================                                              |
|                                                                     |
|   This container just snatches our catalogue information from the   |
|   store and creates handlers for our various actions.  Catalogues   |
|   are stored by `path`, which is an API access point.               |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

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
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(
  createStructuredSelector({
    accounts: (state, { path }) => state.getIn(['catalogue', path, 'accounts']),
    isLoading: (state, { path }) => state.getIn(['catalogue', path, 'isLoading']),
    rainbow: (state, { path }) => state.getIn(['catalogue', path, 'rainbow']),
  }),
  (go, store, { path }) => ({
    expand: (newPath = path) => go(expandCatalogue, path),
    fetch: (newPath = path) => go(fetchCatalogue, path),
    refresh: (newPath = path) => go(refreshCatalogue, path),
  })
)(Catalogue);
