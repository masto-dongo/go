//  ATTACHMENT:SUBMIT
//  =================

//  Action types.
export const ATTACHMENT_SUBMIT_REQUEST = 'ATTACHMENT_SUBMIT_REQUEST';
export const ATTACHMENT_SUBMIT_SUCCESS = 'ATTACHMENT_SUBMIT_SUCCESS';
export const ATTACHMENT_SUBMIT_FAILURE = 'ATTACHMENT_SUBMIT_FAILURE';

//  Action creators.
const request = file => ({
  file,
  type: ATTACHMENT_SUBMIT_REQUEST,
});
const success = attachment => ({
  attachment,
  type: ATTACHMENT_SUBMIT_SUCCESS,
});
const failure = (file, error) => ({
  error,
  file,
  type: ATTACHMENT_SUBMIT_FAILURE,
});

//  Request.
export const uploadComposer = (file, go, current, api) => {

  //  We create `FormData` with our file
  let data = new FormData();
  data.append('file', file);

  //  The request.
  go(request, files);
  api.post(
    '/api/v1/media', data, {
      onUploadProgress: e => {},  //  TODO
    }
  ).then(
    response => go(success, response.data)
  ).catch(
    error =>  go(error, file, error)
  );
}
