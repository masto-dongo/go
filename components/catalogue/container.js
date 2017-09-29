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

//  Selector factory.
export default connect(
  go => createSelector(

    //  Props.
    createStructuredSelector({
      accounts: (state, { path }) => state.getIn(['catalogue', path, 'accounts']),
    }),

    //  Inputs.
    (state, { path }) => path,

    //  Result.
    (props, path) => ({
      handler: {
        expand: () => go(expandCatalogue, path),
        block: () => go(fetchCatalogue, path),
        follow: () => go(refreshCatalogue, path),
      },
      ...props,
    })
  )
)(Catalogue);
