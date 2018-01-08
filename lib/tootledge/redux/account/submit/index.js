//  ACCOUNT:UPDATE
//  ==============

//  Action types.
export const ACCOUNT_SUBMIT_REQUEST = 'ACCOUNT_SUBMIT_REQUEST';
export const ACCOUNT_SUBMIT_SUCCESS = 'ACCOUNT_SUBMIT_SUCCESS';
export const ACCOUNT_SUBMIT_FAILURE = 'ACCOUNT_SUBMIT_FAILURE';

//  Action creators.
const request = info => ({
  info,
  type: ACCOUNT_SUBMIT_REQUEST,
});
const success = account => ({
  account,
  type: ACCOUNT_SUBMIT_SUCCESS,
});
const failure = (info, error) => ({
  error,
  info,
  type: ACCOUNT_SUBMIT_FAILURE,
});

//  Request.
export default function submitAccount (info, go, current, api) {

  //  `data` will store our new data.
  let data;
  let item;

  //  If we are updating the `avatar` or `header`, we need to use
  //  `FormData()`.
  if (info.avatar || info.header) {
    let data = new FormData();
    if ((item = info.avatar)) {
      data.append('avatar', item);
    }
    if ((item = info.displayName)) {
      data.append('display_name', item);
    }
    if ((item = info.bio)) {
      data.append('note', item);
    }
    if ((item = info.header)) {
      data.append('header', item);
    }

  //  Otherwise, we can just use a plain object.
  } else {
    data = {};
    if ((item = info.displayName)) {
      data.display_name = item;
    }
    if ((item = info.bio)) {
      data.note = item;
    }
  }

  //  The request.
  go(request, info);
  api.patch(
    '/api/v1/accounts/update_credentials', data
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, info, error)
  );
}
