//  ATTACHMENT
//  ==========

import { Map as ImmutableMap } from 'immutable';

import { MEDIA_TYPE } from 'mastodon-go/util/constants';

const normalize = attachment => ImmutableMap({
  height: +((attachment.meta || {}).original || {}).height,
  id: '' + attachment.id,
  preview: ImmutableMap({
    height: +((attachment.meta || {}).small || {}).height,
    src: '' + attachment.preview_url,
    width: +((attachment.meta || {}).small || {}).width,
  }),
  src: ImmutableMap({
    local: '' + attachment.url,
    remote: '' + attachment.remote_url,
    shortlink: '' + attachment.text_url,
  }),
  type: (
    (type) => {
      switch (type) {
      case 'gifv':
        return MEDIA_TYPE.GIFV;
      case 'image':
        return MEDIA_TYPE.IMAGE;
      case 'video':
        return MEDIA_TYPE.VIDEO;
      default:
        return MEDIA_TYPE.UNKNOWN;
    }
  )(attachment.type),
  width: +((attachment.meta || {}).small || {}).width,
})
