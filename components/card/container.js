/*********************************************************************\
|                                                                     |
|   <CardContainer>                                                   |
|   ===============                                                   |
|                                                                     |
|   Our container just pulls all of our card information from redux   |
|   and passes it through.                                            |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Card from '.';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store.
export default connect(createStructuredSelector({
  author: (state, { id }) => state.getIn(['card', id, 'author']),
  description: (state, { id }) => state.getIn(['card', id, 'description']),
  href: (state, { id }) => state.getIn(['card', id, 'href']),
  html: (state, { id }) => state.getIn(['card', id, 'html']),
  image: (state, { id }) => state.getIn(['card', id, 'image']),
  provider: (state, { id }) => state.getIn(['card', id, 'provider']),
  title: (state, { id }) => state.getIn(['card', id, 'title']),
  type: (state, { id }) => state.getIn(['card', id, 'type']),
}))(Card);
