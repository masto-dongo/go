//  <UIContainer>
//  =================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Request imports.
import { loadMeta } from 'themes/mastodon-go/redux';

//  Component imports.
import UI from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(
  null,
  go => ({
    fetch: () => go(loadMeta),
  })
)(UI);
