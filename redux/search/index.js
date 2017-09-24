

const normalize = search => ImmutableMap({
  'accounts': ImmutableList(search.accounts.map(
    account => account.id
  ),
  'hashtags': ImmutableList(search.hashtags),
  'statuses': ImmutableList(search.statuses.map(
    status => status.id
  ),
})