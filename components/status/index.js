//  <Status>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/status

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Container imports.
import {
  AccountContainer,
//  PrependContainer,
} from 'themes/mastodon-go/components';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Our imports.
import StatusActionBar from './action_bar';
import StatusContent from './content';
import StatusFooter from './footer';
import StatusMissing from './missing';
import StatusNav from './nav';

//  Stylesheet imports.
import './style';

//  Other imports.
import {
  PREPEND_TYPE,
  VISIBILITY,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  The component
//  -------------

export default class Status extends React.PureComponent {

  //  Props, and state.
  static propTypes = {
    account: PropTypes.string.isRequired,
    application: ImmutablePropTypes.map,
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    comrade: PropTypes.string,
    content: PropTypes.string,
    datetime: PropTypes.instanceOf(Date),
    detailed: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    href: PropTypes.string,
    id: PropTypes.string.isRequired,
    index: PropTypes.number,
    inReplyTo: PropTypes.map,
    intl: PropTypes.object,
    is: ImmutablePropTypes.map.isRequired,
    listLength: PropTypes.number,
    location: PropTypes.object,  //  Not updated; don't use
    match: PropTypes.object,  //  Not updated; don't use
    me: PropTypes.string,
    media: ImmutablePropTypes.list,
    mentions: ImmutablePropTypes.list,
    sensitive: PropTypes.bool,
    setDetail: PropTypes.func,
    spoiler: PropTypes.string,
    staticContext: PropTypes.object,  //  Don't use
    tags: ImmutablePropTypes.list,
    visibility: PropTypes.number.isRequired,
  }
  state = {
    contentVisible: !this.props.spoiler,
  }

  //  Prior to mounting, we fetch the status's card if this is a
  //  detailed status and we don't already have it.
  componentWillMount () {
    const {
      card,
      detailed,
      handler,
    } = this.props;
    if (!card && detailed) handler.card();
  }

  //  If our component is about to become detailed, we request its card
  //  if we don't have it.
  componentWillUpdate (nextProps) {
    const {
      detailed,
      handler,
    } = this.props;
    if (!nextProps.card && nextProps.detailed && !detailed) {
      handler.card();
    }
  }

  //  `setExpansion` handles expanding and collapsing spoilers.
  setExpansion = (value) => {
    const { detailed } = this.props;
    const { contentVisible } = this.state;
    switch (true) {

    //  A value of `null` or `undefined` flips the state.
    case value === undefined || value === null:
      this.setState({ contentVisible: !contentVisible });
      break;

    //  A value of `false` means that the status should be collapsed.
    case !value:
      this.setState({ contentVisible: false });
      break;

    //  A value of `true` means that the status should be expanded.
    case !!value:
      this.setState({ contentVisible: true });
      break;
    }
  }

  //  `handleClick()` handles all clicking stuff. We route links and
  //  make our status detailed if it isn't already.
  handleClick = (e) => {
    const { detailed, history, id, setDetail, status } = this.props;
    if (!history || e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    if (setDetail) setDetail(detailed ? null : id);
    e.preventDefault();
  }

  //  Puts our element on the screen.
  render () {
    const {
      handleClick,
      setExpansion,
    } = this;
    const {
      account,
      application,
      card,
      className,
      comrade,
      content,
      datetime,
      detailed,
      handler,
      history,
      href,
      id,
      index,
      inReplyTo,
      intl,
      is,
      listLength,
      location,
      match,
      me,
      media,
      mentions,
      sensitive,
      setDetail,
      spoiler,
      staticContext,
      tags,
      visibility,
    } = this.props;
    const { contentVisible } = this.state;

    let computedClass = classNames('MASTODON_GO--STATUS', {
      detailed,
      direct: visibility === VISIBILITY.DIRECT,
    }, className);

    let conditionalProps = {};
    let selectorAttribs = {};

    //  If there's no status, we can't render lol.
    if (status === null) {
      return <StatusMissing />;
    }

    //  If our index and list length have been set, we can set the
    //  corresponding ARIA attributes.
    if (isFinite(index) && isFinite(listLength)) conditionalProps = {
      'aria-posinset': index,
      'aria-setsize': listLength,
    };

    //  Otherwise, we can render our status!
    return (
      <article
        className={computedClass}
        {...conditionalProps}
        {...selectorAttribs}
        tabIndex='0'
      >
        {(comrade || inReplyTo) && false ? (  //  TK: Prepend support
          <PrependContainer
            comrade={comrade || inReplyTo.account}
            type={PREPEND_TYPE.STATUS | !!comrade * PREPEND_TYPE.REBLOG | !!inReplyTo * PREPEND_TYPE.REPLY}
          />
        ) : null}
        <AccountContainer
          comrade={comrade}
          id={account}
          small
        />
        <StatusContent
          card={card}
          content={content}
          contentVisible={contentVisible}
          detailed={detailed}
          handler={handler}
          history={history}
          intl={intl}
          media={media}
          mentions={mentions}
          onClick={handleClick}
          setExpansion={setExpansion}
          tags={tags}
        />
        <StatusFooter
          application={application}
          datetime={datetime}
          detailed={detailed}
          href={href}
          intl={intl}
          visibility={visibility}
        />
        <StatusActionBar
          detailed={detailed}
          handler={handler}
          history={history}
          intl={intl}
          is={is}
          me={me}
          setDetail={setDetail}
          visibility={visibility}
        />
        {detailed ? (
          <StatusNav id={id} intl={intl} />
        ) : null}
      </article>
    );

  }

}
