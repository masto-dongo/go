//  COMPOSER:SUBMIT
//  ===============

//  Imported requests.
import { updateTimeline } from 'themes/mastodon-go/redux/timeline'

//  Action types.
export const COMPOSER_SUBMIT_REQUEST = 'COMPOSER_SUBMIT_REQUEST';
export const COMPOSER_SUBMIT_SUCCESS = 'COMPOSER_SUBMIT_SUCCESS';
export const COMPOSER_SUBMIT_FAILURE = 'COMPOSER_SUBMIT_FAILURE';

//  Action creators.
const request = (text, options) => ({
  options,
  text,
  type: COMPOSER_SUBMIT_REQUEST
});
const success = status => ({
  status,
  type: COMPOSER_SUBMIT_SUCCESS,
});
const failure = (text, options, error) => ({
  error,
  options,
  text,
  type: COMPOSER_SUBMIT_FAILURE,
});

//  Request.
export const submitComposer = (text, options, go, current, api) => {

  //  If we have no text, we can't submit our composer.
  if (!text || !text.length) return;

  //  Here is the data we send.
  const data = options ? {
    status: options.local ? text + ' 👁️' : text,
    in_reply_to_id: options.inReplyTo,
    media_ids: options.media,
    sensitive: options.sensitive,
    spoiler_text: options.spoiler,
    visibility: options.privacy,
  } : { status: text };
  const headers = options ? { 'Idempotency-Key': options.idempotency } : {};

  //  The request.
  go(request, text, options);
  api.post(
    '/api/v1/statuses', data, { headers }
  ).then(
    response => {
      go(success, response.data);

      //  After posting our status, we add it to our home timeline.
      go(updateTimeline, '/api/v1/home', response.data);

      //  We also add it to the public and local timelines if it is a
      //  public status.
      if (!response.data.in_reply_to_id && response.data.visibility === 'public') {
        go(updateTimeline, '/api/v1/public', response.data);
        go(updateTimeline, '/api/v1/public?local=true', response.data);
      }
    }
  ).catch(
    error => go(failure, text, options, error)
  );
}
