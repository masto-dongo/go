//  ACCOUNT:UPDATE
//  ==============

//  Action types.
export const ACCOUNT_UPDATE_REQUEST = 'ACCOUNT_UPDATE_REQUEST';
export const ACCOUNT_UPDATE_SUCCESS = 'ACCOUNT_UPDATE_SUCCESS';
export const ACCOUNT_UPDATE_FAILURE = 'ACCOUNT_UPDATE_FAILURE';

//  Action creators.
const request = id => ({
  id,
  type: ACCOUNT_UPDATE_REQUEST,
});
const success = account => ({
  account,
  type: ACCOUNT_UPDATE_SUCCESS,
});
const failure = (id, error) => ({
  error,
  id,
  type: ACCOUNT_UPDATE_FAILURE,
});

//  Request.
export default function updateAccount (info, go, current, api) {

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
    data = {}
    if ((item = info.displayName)) {
      data.display_name = item;
    }
    if ((item = info.bio)) {
      data.note = item;
    }
  }

  //  The request.
  go(request, id);
  api.patch(
    `/api/v1/accounts/update_credentials`, data
  ).then(
    response => go(success, response.data)
  ).catch(
    error => go(failure, id, error)
  );
}
