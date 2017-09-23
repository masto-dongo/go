//  DOMAIN:UNBLOCK
//  ============

//  Action types.
export const DOMAIN_UNBLOCK_REQUEST = 'DOMAIN_UNBLOCK_REQUEST';
export const DOMAIN_UNBLOCK_SUCCESS = 'DOMAIN_UNBLOCK_SUCCESS';
export const DOMAIN_UNBLOCK_FAILURE = 'DOMAIN_UNBLOCK_FAILURE';

//  Action creators.
const request = domain => ({
  domain,
  type: DOMAIN_UNBLOCK_REQUEST,
});
const success = domain => ({
  domain,
  type: DOMAIN_UNBLOCK_SUCCESS,
});
const failure => (id, error) => ({
  error,
  id,
  type: DOMAIN_UNBLOCK_FAILURE,
});

//  Request.
export const unblockDomain = (domain, go, state, api) => {
  go(request, domain);
  api.post(
    '/api/v1/domain_blocks', { domain }
  ).then(
    () => go(success, domain)
  ).catch(
    error => go(failure, domain, error)
  );
};
