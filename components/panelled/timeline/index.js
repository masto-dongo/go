//  <PanelledTimeline>
//  ==================

//  The settings for the timeline are available via the
//  `<PanelledTimelineSettings>` panel.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import {
  ConnectedTimeline,
  RawPaneller,
} from 'flavours/go/components';
import PanelledTimelineSettings from './settings';

//  Lib imports.
import connect from 'flavours/go/lib/connect';
import { moduleOnReady } from 'flavours/go/lib/module';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledTimeline;

//  Building the paneller.
moduleOnReady(function () {
  PanelledTimeline = connect(

    //  Component.
    RawPaneller,

    //  Store.
    null,

    //  Messages.
    defineMessages({
      advanced: {
        defaultMessage: 'Advanced',
        description: 'Advanced section heading in timeline settings',
        id: 'timeline.advanced',
      },
      basic: {
        defaultMessage: 'Basic',
        description: 'Basic section heading in timeline settings',
        id: 'timeline.basic',
      },
      hideReblogs: {
        defaultMessage: 'Hide boosts',
        description: 'Option to turn off boosts in timeline settings',
        id: 'timeline.hide_reblogs',
      },
      hideReplies: {
        defaultMessage: 'Hide replies',
        description: 'Option to turn off replies in timeline settings',
        id: 'timeline.hide_replies',
      },
      regex: {
        defaultMessage: 'Filter out by regular expressions',
        description: 'Label for regex filtering in timeline settings',
        id: 'timeline.regex',
      },
      settings: {
        defaultMessage: 'Settings',
        description: 'Used as the label for a settings panel in the paneller menu',
        id: 'paneller.settings',
      },
      showReblogs: {
        defaultMessage: 'Show boosts',
        description: 'Option to turn on boosts in timeline settings',
        id: 'timeline.show_reblogs',
      },
      showReplies: {
        defaultMessage: 'Show replies',
        description: 'Option to turn on replies in timeline settings',
        id: 'timeline.show_replies',
      },
      title: {
        defaultMessage: 'Timeline',
        description: 'Used as the fallback title for a timeline column',
        id: 'timeline.title',
      },
      '❌': {
        defaultMessage: 'Close',
        description: 'Used in the paneller menu to return to Start',
        id: 'paneller.close',
      },
      '⬅': {
        defaultMessage: 'Back',
        description: 'Used in the paneller menu to close the current panel',
        id: 'paneller.back',
      },
    }),

    //  Handlers.
    null,

    //  Panelling.
    {
      backdrop: ConnectedTimeline,
      className: 'MASTODON_GO--PANELLED--TIMELINE',
      icon: ({ icon }) => icon || 'question',
      menu: ({ ℳ }) => [{
        hash: '#settings',
        icon: 'sliders',
        title: ℳ.settings,
      }],
      panels: { settings: PanelledTimelineSettings },
      title: ({
        title,
        ℳ,
      }) => title || ℳ.title,
    }
  );
});

//  Exporting.
export { PanelledTimeline as default };
