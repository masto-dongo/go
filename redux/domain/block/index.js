//  DOMAIN:BLOCK
//  ============

//  Action types.
export const DOMAIN_BLOCK_REQUEST = 'DOMAIN_BLOCK_REQUEST';
export const DOMAIN_BLOCK_SUCCESS = 'DOMAIN_BLOCK_SUCCESS';
export const DOMAIN_BLOCK_FAILURE = 'DOMAIN_BLOCK_FAILURE';

//  Action creators.
const request = domain => ({
  domain,
  type: DOMAIN_BLOCK_REQUEST,
});
const success = (domain, relationship) => ({
  domain,
  relationship,
  type: DOMAIN_BLOCK_SUCCESS,
});
const failure => (domain, error) => ({
  domain,
  error,
  type: DOMAIN_BLOCK_FAILURE,
});

//  Request.
export const blockDomain = (domain, go, state, api) => {
  go(request, domain);
  api.post(
    '/api/v1/domain_blocks', { domain }
  ).then(
    response => go(success, domain, response.data.value)
  ).catch(
    error => go(failure, domain, error)
  );
};
