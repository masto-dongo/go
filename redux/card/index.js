
import { Map as ImmutableMap } from 'immutable';

import { CARD_TYPE } from 'mastodon-go/util/constants';

const normalize = card => ImmutableMap({
  author: card.author ? ImmutableMap({
    href: card.author.url,
    name: card.author.name,
  }) : null,
  description: '' + card.description,
  height: card.height,
  href: '' + card.url,
  html: card.html,
  image: card.image ? '' + card.image : null,
  provider: card.provider ? ImmutableMap({
    href: card.provider.url,
    name: card.provider.name,
  }) : null,
  title: '' + card.title,
  type: (
    type => {
      switch (type) {
      case "link":
        return CARD_TYPE.LINK;
      case "photo":
        return CARD_TYPE.PHOTO;
      case "rich":
        return CARD_TYPE.RICH;
      case "video":
        return CARD_TYPE.VIDEO;
      default:
        return CARD_TYPE.UNKNOWN;
      }
    }
  )(card.type),
  width: card.width,
});
