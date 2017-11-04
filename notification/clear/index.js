//  NOTIFICATION:CLEAR
//  ==================

//  Imported requests.
import { removeNotification } from 'themes/mastodon-go/redux';

//  Action types.
export const NOTIFICATION_CLEAR_REQUEST = 'NOTIFICATION_CLEAR_REQUEST';
export const NOTIFICATION_CLEAR_SUCCESS = 'NOTIFICATION_CLEAR_SUCCESS';
export const NOTIFICATION_CLEAR_FAILURE = 'NOTIFICATION_CLEAR_FAILURE';

//  Action creators.
const request = { type: NOTIFICATION_CLEAR_REQUEST };
const success = { type: NOTIFICATION_CLEAR_SUCCESS };
const failure = error => ({
  error,
  type: NOTIFICATION_CLEAR_FAILURE,
});

//  Request.
export default function clearNotification (go, current, api) {
  go(request);
  api.post(
    '/api/v1/notifications/clear'
  ).then(
    () => {
      go(success);
      go(removeNotification, current().get('notification').keySeq().toArray());
    }
  ).catch(
    error => go(failure, error)
  );
}
