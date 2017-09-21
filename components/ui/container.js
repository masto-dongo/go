//  <UIContainer>
//  =================

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/ui/container

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//  Mastodon imports.
import { uploadCompose } from 'mastodon/actions/compose';
import { refreshHomeTimeline } from 'mastodon/actions/timelines';
import { refreshNotifications } from 'mastodon/actions/notifications';
import { clearStatusesHeight } from 'mastodon/actions/statuses';

//  Our imports.
import UI from '.';

//  * * * * * * *  //

//  State mapping
//  -------------

//  State mapping.
const mapStateToProps = state => ({
  columns: state.getIn(['settings', 'columns']),
  systemFontUi: state.getIn(['meta', 'system_font_ui']),
  layout: state.getIn(['local_settings', 'layout']),
  isWide: state.getIn(['local_settings', 'stretch']),
  navbarUnder: state.getIn(['local_settings', 'navbar_under']),
  isComposing: state.getIn(['compose', 'is_composing']),
});

//  * * * * * * *  //

//  Dispatch mapping
//  ----------------

const mapDispatchToProps = dispatch => ({
  handler: {
    refresh () {
      dispatch(refreshHomeTimeline());
      dispatch(refreshNotifications());
    },
    resize () {
      dispatch(clearStatusesHeight());
    },
    upload (files) {
      dispatch(uploadCompose(files));
    }
  },
});

//  * * * * * * *  //

//  Connecting
//  ----------

//  `connect` will only update when its resultant props change. So
//  `withRouter` won't get called unless an update is already planned.
//  This is intended behaviour because we only care about the (mutable)
//  `history` object.
export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(UI)
);
