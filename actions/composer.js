import { updateTimeline } from './timelines';

export const COMPOSER_UPLOAD_REQUEST = 'COMPOSER_UPLOAD_REQUEST';
export const COMPOSER_UPLOAD_ADVANCE = 'COMPOSER_UPLOAD_ADVANCE';
export const COMPOSER_UPLOAD_SUCCESS = 'COMPOSER_UPLOAD_SUCCESS';
export const COMPOSER_UPLOAD_FAILURE = 'COMPOSER_UPLOAD_FAILURE';
export const COMPOSER_UPLOAD_DISCARD = 'COMPOSER_UPLOAD_DISCARD';

export const COMPOSER_SUBMIT_REQUEST = 'COMPOSER_SUBMIT_REQUEST';
export const COMPOSER_SUBMIT_SUCCESS = 'COMPOSER_SUBMIT_SUCCESS';
export const COMPOSER_SUBMIT_FAILURE = 'COMPOSER_SUBMIT_FAILURE';

export const COMPOSER_RESET = 'COMPOSER_RESET';

export const changeContentComposer = value => ({
  type : COMPOSER_CONTENT_CHANGE,
  value,
});

export const changeSpoilerComposer = spoiler => ({
  spoiler,
  type : COMPOSER_SPOILER_CHANGE,
});

export const changeOptionsComposer = (key, value) => ({
  key,
  type : COMPOSER_OPTIONS_CHANGE,
  value,
});

export const activationComposer = () => ({ type : COMPOSER_ACTIVATION });

export const deactivateComposer = () => ({ type : COMPOSER_DEACTIVATE });

export const uploadComposer = files => (go, state, api) => {
  if (state.getIn(['composer', 'attachments']).size > 3) return;

  go(requestUploadComposer());

  let data = new FormData();
  data.append('file', files[0]);

  api.post('/api/v1/media', data, {
    onUploadProgress: e => go(advanceUploadComposer(e.loaded, e.total)),
  }).then(response => go(successUploadComposer(response.data.value)))
    .catch(error =>  go(errorUploadComposer(error)));
}

export const requestUploadComposer = () => ({
  skipLoading: true,
  type: COMPOSER_UPLOAD_REQUEST,
});

export const advanceUploadComposer = (loaded, total) => ({
  loaded,
  total,
  type: COMPOSER_UPLOAD_ADVANCE,
});

export const successUploaderComposer = media => ({
  media,
  skipLoading: true,
  type: COMPOSER_UPLOADER_SUCCESS,
});

export const failureUploaderComposer = error => ({
  error,
  skipLoading: true,
  type: COMPOSER_UPLOADER_FAILURE,
});

export const discardUploaderComposer = id => ({
  id,
  type: COMPOSER_UPLOADER_DISCARD,
});

export const submitComposer = (text, options = {}) => (go, state, api) => {
  if (!text || !text.length) return;

  go(requestSubmitComposer(text, options));

  if (options.local) text = text + ' 👁️';

  api.post('/api/v1/statuses', {
    status: text,
    in_reply_to_id: options.inReplyTo,
    media_ids: options.media,
    sensitive: options.sensitive,
    spoiler_text: options.spoiler,
    visibility: options.privacy,
  }, {
    headers: { 'Idempotency-Key': options.idempotency, },
  }).then(response => {
      go(successSubmitComposer({ response.data.value }));
      go(updateTimeline('/api/v1/home', { response.data.value }));
      if (!response.data.value.in_reply_to_id && response.data.value.visibility === 'public') {
        if (state.getIn(['timeline', '/api/v1/public', 'loaded'])) {
          go(updateTimeline('/api/v1/public', { response.data.value }));
        }
        if (state.getIn(['timeline', '/api/v1/public?local=true', 'loaded'])) {
          go(updateTimeline('/api/v1/public?local=true', { response.data.value }));
        }
      }
    }).catch(error => go(failureSubmitComposer(error)));
}

export const requestSubmitComposer = (text, options) => ({
  options,
  text,
  type: COMPOSER_SUBMIT_REQUEST
});

export const successSubmitComposer = status => ({
  status,
  type: COMPOSER_SUBMIT_SUCCESS,
});

export const failureSubmitComposer = error => ({
  error,
  type: COMPOSER_SUBMIT_FAILURE,
});

export const resetComposer = () => ({ type: COMPOSER_RESET });
