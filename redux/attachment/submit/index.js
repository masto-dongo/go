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
export default function uploadComposer (file, onAttach, onUpload, go, current, api) {

  //  We create `FormData` with our file
  let data = new FormData();
  data.append('file', file);

  //  The request.
  go(request, file);
  if (onUpload) {
    onUpload({ completed: false });
  }
  api.post('/api/v1/media', data, onUpload ? {
    onUploadProgress: function (e) {
      return onUpload({
        completed: false,
        progress: e.loaded / e.total,
      });
    },
  } : {}).then(function ({ data }) {
    go(success, data);
    if (onAttach) {
      onAttach(data.id);
    }
    if (onUpload) {
      onUpload({
        completed: true,
        withSuccess: true,
      });
    }
  }).catch(function (error) {
    go(failure, file, error);
    if (onUpload) {
      onUpload({
        completed: true,
        withSuccess: false,
      });
    }
  });
}
