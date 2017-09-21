//  Package imports
import { connect } from 'react-redux';

//  Mastodon imports
import { makeGetStatus } from 'mastodon/selectors'

//  Our imports
import {
  cancelReplyComposer,
  changeOptionComposer,
  changeSpoilerComposer,
  changeValueComposer,
  enableOrDisableComposer,
  undoUploadCompose,
  uploaderComposer,
  submitComposer
} from 'glitch/actions/composer';
import Composer from '.';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => ({
    attachments : state.getIn(['composer', 'attachments']),
    datetimes   : state.getIn(['composer', 'datetimes']),
    disabled    : state.getIn(['composer', 'disabled']),
    keys        : state.getIn(['composer', 'keys']),
    inReplyTo   : getStatus(state, state.getIn(['composer', 'in_reply_to'])),
    options     : state.getIn(['composer', 'options']),
    request     : state.getIn(['composer', 'request']),
    spoiler     : state.getIn(['composer', 'spoiler']),
    value       : state.getIn(['composer', 'value']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({ dispatches: {

  cancelReply () {
    dispatch(cancelReplyComposer());
  },

  changeOption (key, value) {
    dispatch(changeOptionComposer(key, value));
  },

  changeSpoiler (spoiler) {
    dispatch(changeSpoilerComposer(spoiler));
  },

  changeValue (value) {
    dispatch(changeValueComposer(value));
  },

  enable (component) {
    dispatch(enableOrDisableComposer(component))
  },

  submit () {
    dispatch(submitComposer());
  },

  remove (id) {
    dispatch(undoUploadCompose(id));
  },

  upload (files) {
    dispatch(uploadCompose(obj.files));
  }

} });

export default connect(makeMapStateToProps, mapDispatchToProps)(Composer);
