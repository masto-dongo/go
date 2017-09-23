//  COMPOSER:UPLOAD
//  ===============

//  Action types.
export const COMPOSER_UPLOAD_REQUEST = 'COMPOSER_UPLOAD_REQUEST';
export const COMPOSER_UPLOAD_ADVANCE = 'COMPOSER_UPLOAD_ADVANCE';
export const COMPOSER_UPLOAD_SUCCESS = 'COMPOSER_UPLOAD_SUCCESS';
export const COMPOSER_UPLOAD_FAILURE = 'COMPOSER_UPLOAD_FAILURE';

//  Action creators.
const request = file => ({
  file,
  type: COMPOSER_UPLOAD_REQUEST,
});
const advance = (loaded, total) => ({
  loaded,
  total,
  type: COMPOSER_UPLOAD_ADVANCE,
});
const success = media => ({
  media,
  type: COMPOSER_UPLOAD_SUCCESS,
});
const failure = (file, error) => ({
  error,
  file,
  type: COMPOSER_UPLOAD_FAILURE,
});

//  Request.
export const uploadComposer = (file, go, state, api) => {

  //  If we already have 4 attachments, we can't upload another.
  if (state.getIn(['composer', 'attachments']).size >= 4) {
    return;
  }

  //  We create `FormData` with our file
  let data = new FormData();
  data.append('file', file);

  go(request, files);
  api.post(
    '/api/v1/media', data, { onUploadProgress: (
      e => go(advance, e.loaded, e.total)
    ) }
  ).then(
    response => go(success, response.data.value)
  ).catch(
    error =>  go(error, file, error)
  );
}
