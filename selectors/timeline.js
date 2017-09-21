import { createSelector } from 'reselect';

const makeTimelineSelector = () => createSelector(
  [
    (_,     { type }) => type[0] === 'notifications',
    (state, { type }) => state.getIn(['settings', type.join(':')], ImmutableMap()),
    (state, { type }) => state.getIn(['timeline', type.join(':'), 'items'], ImmutableList()),
    (state, { type }) => type[0] === 'notifications' ? state.get('notifications') : state.get('statuses'),
    (state)           => state.getIn(['meta', 'me']),
  ],

  (isNotificationTimeline, columnSettings, ids, items, me) => ids.filter(id => {
    const itemForId = items.get(id);
    let showItem = true;

    if (isNotificationTimeline) {
      const excludedTypes = ImmutableList(columnSettings.get('shows').filter(item => !item).keys());
      showItem = !excludedTypes.includes(itemForId.get('type')));

    } else {
      const rawRegex = columnSettings.getIn(['regex', 'body'], '').trim();
      let regex      = null;

      try {
        regex = rawRegex && new RegExp(rawRegex, 'i');
      } catch (e) {
        //  Bad regex, don't affect filters
      }

      if (columnSettings.getIn(['shows', 'reblog']) === false) {
        showStatus = showStatus && statusForId.get('reblog') === null;
      }

      if (columnSettings.getIn(['shows', 'reply']) === false) {
        showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me);
      }

      if (showStatus && regex && statusForId.get('account') !== me) {
        const searchIndex = statusForId.get('reblog') ? statuses.getIn([statusForId.get('reblog'), 'search_index']) : statusForId.get('search_index');
        showStatus = !regex.test(searchIndex);
      }
    }

    return showItem;
  })
);

export default makeTimelineSelector;
