//  <StatusContent>
//  ===============

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, FormattedMessage } from 'react-intl';

import CommonButton from 'themes/mastodon-go/components';
import CommonLink from 'themes/mastodon-go/components';

//  Our imports.
// import StatusContentCard from './card';
// import StatusContentGallery from './gallery';
// import StatusContentUnknown from './unknown';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  card_link :
    { id: 'status.card', defaultMessage: 'Card' },
  video_link :
    { id: 'status.video', defaultMessage: 'Video' },
  image_link :
    { id: 'status.image', defaultMessage: 'Image' },
  unknown_link :
    { id: 'status.unknown_attachment', defaultMessage: 'Unknown attachment' },
  hashtag    :
    { id: 'status.hashtag', defaultMessage: 'Hashtag @{name}' },
  show_more  :
    { id: 'status.show_more', defaultMessage: 'Show more' },
  show_less  :
    { id: 'status.show_less', defaultMessage: 'Show less' },
});

//  * * * * * * *  //

//  The component
//  -------------

const Temp = ({ content }) => <span>content</span>;
export default Temp;

class StatusContent extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    content: PropTypes.string,
    contentVisible: PropTypes.bool,
    detailed: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    media: ImmutablePropTypes.list,
    mentions: ImmutablePropTypes.list,
    onClick: PropTypes.func,
    sensitive: PropTypes.bool,
    setExpansion: PropTypes.func,
    tags: ImmutablePropTypes.list,
  }

  //  Variables.
  startXY = null

  //  Our constructor preprocesses our status content and turns it into
  //  an array of React elements, stored in `this.text`.
  constructor (props) {
    super(props);
    const { intl, history, status } = props;

    //  This creates a document fragment with the DOM contents of our
    //  status's text and a TreeWalker to walk them.
    const range = document.createRange();
    range.selectNode(document.body);
    const walker = document.createTreeWalker(
      range.createContextualFragment(status.get('contentHtml')),
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      { acceptNode (node) {
        const name = node.nodeName;
        switch (true) {
        case node.parentElement && node.parentElement.nodeName.toUpperCase() === 'A':
          return NodeFilter.FILTER_REJECT;  //  No link children
        case node.nodeType === Node.TEXT_NODE:
        case name.toUpperCase() === 'A':
        case name.toUpperCase() === 'P':
        case name.toUpperCase() === 'BR':
        case name.toUpperCase() === 'IMG':  //  Emoji
          return NodeFilter.FILTER_ACCEPT;
        default:
          return NodeFilter.FILTER_SKIP;
        }
      } },
    );
    const attachments = status.get('attachments');
    const card = (!attachments || !attachments.size) && status.get('card');
    this.text = [];
    let currentP = [];

    //  This walks the contents of our status.
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeName = node.nodeName.toUpperCase();
      switch (nodeName) {

      //  If our element is a link, then we process it here.
      case 'A':
        currentP.push((() => {

          //  Here we detect what kind of link we're dealing with.
          let mention = status.get('mentions') ? status.get('mentions').find(
            item => node.href === item.get('url')
          ) : null;
          let tag = status.get('tags') ? status.get('tags').find(
            item => node.href === item.get('url')
          ) : null;
          let attachment = attachments ? attachments.find(
            item => node.href === item.get('url') || node.href === item.get('text_url') || node.href === item.get('remote_url')
          ) : null;
          let text = node.textContent;
          let icon = '';
          let type = '';

          //  We use a switch to select our link type.
          switch (true) {

          //  This handles cards.
          case card && node.href === card.get('url'):
            text = card.get('title') || intl.formatMessage(messages.card);
            icon = 'id-card-o';
            return (
              <CommonButton
                className={'content\card content\button'}
                href={node.href}
                icon={icon}
                key={currentP.length}
                showTitle
                title={text}
              />
            );

          //  This handles mentions.
          case mention && (text.replace(/^@/, '') === mention.get('username') || text.replace(/^@/, '') === mention.get('acct')):
            icon = text[0] === '@' ? '@' : '';
            text = mention.get('acct').split('@');
            if (text[1]) text[1].replace(/[@.][^.]*/g, (m) => m.substr(0, 2));
            return (
              <CommonLink
                className='content\mention content\link'
                destination={`/accounts/${mention.get('id')}`}
                history={history}
                href={node.href}
                key={currentP.length}
                title={'@' + mention.get('acct')}
              >
                {icon ? <span className='content\at'>{icon}</span> : null}
                <span className='content\username'>{text[0]}</span>
                {text[1] ? <span className='content\at'>@</span> : null}
                {text[1] ? <span className='content\instance'>{text[1]}</span> : null}
              </CommonLink>
            );

          //  This handles attachment links.
          case !!attachment:
            type = attachment.get('type');
            switch (type) {
            case 'unknown':
              text = intl.formatMessage(messages.unknown_attachment);
              icon = 'question';
              break;
            case 'video':
              text = intl.formatMessage(messages.video);
              icon = 'video-camera';
              break;
            default:
              text = intl.formatMessage(messages.image);
              icon = 'picture-o';
              break;
            }
            return (
              <CommonButton
                className={`content\\${type} content\\button`}
                href={node.href}
                icon={icon}
                key={currentP.length}
                showTitle
                title={text}
              />
            );

          //  This handles hashtag links.
          case !!tag && (text.replace(/^#/, '') === tag.get('name')):
            icon = text[0] === '#' ? '#' : '';
            text = tag.get('name');
            return (
              <CommonLink
                className='content\tag content\link'
                destination={`/timelines/tag/${tag.get('name')}`}
                history={history}
                href={node.href}
                key={currentP.length}
                title={intl.formatMessage(messages.hashtag, { name: tag.get('name') })}
              >
                {icon ? <span className='content\hash'>{icon}</span> : null}
                <span className='content\tagname'>{text}</span>
              </CommonLink>
            );

          //  This handles all other links.
          default:
            if (text === node.href && text.length > 23) {
              text = text.substr(0, 22) + '…';
            }
            return (
              <CommonLink
                className='content\link'
                href={node.href}
                key={currentP.length}
                title={node.href}
              >{text}</CommonLink>
            );
          }
        })());
        break;

      //  If our element is an IMG, we only render it if it's an emoji.
      case 'IMG':
        if (!node.classList.contains('emojione')) break;
        currentP.push(
          <img
            alt={node.alt}
            className={'content\emojione'}
            draggable={false}
            key={currentP.length}
            src={node.src}
            {...(node.title ? { title: node.title } : {})}
          />
        );
        break;

      //  If our element is a BR, we pass it along.
      case 'BR':
        currentP.push(<br key={currentP.length} />);
        break;

      //  If our element is a P, then we need to start a new paragraph.
      //  If our paragraph has content, we need to push it first.
      case 'P':
        if (currentP.length) this.text.push(
          <p key={this.text.length}>
            {currentP}
          </p>
        );
        currentP = [];
        break;

      //  Otherwise we just push the text.
      default:
        currentP.push(node.textContent);
      }
    }

    //  If there is unpushed paragraph content after walking the entire
    //  status contents, we push it here.
    if (currentP.length) this.text.push(
      <p key={this.text.length}>
        {currentP}
      </p>
    );
  }

  //  When the mouse is pressed down, we grab its position.
  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY];
  }

  //  When the mouse is raised, we handle the click if it wasn't a part
  //  of a drag.
  handleMouseUp = (e) => {
    const { startXY } = this;
    const { onClick } = this.props;
    const { button, clientX, clientY, target } = e;

    //  This gets the change in mouse position. If `startXY` isn't set,
    //  it means that the click originated elsewhere.
    if (!startXY) return;
    const [ deltaX, deltaY ] = [clientX - startXY[0], clientY - startXY[1]];

    //  This switch prevents an overly lengthy if.
    switch (true) {

    //  If the button being released isn't the main mouse button, or if
    //  we don't have a click parsing function, or if the mouse has
    //  moved more than 5px, OR if the target of the mouse event is a
    //  button or a link, we do nothing.
    case button !== 0:
    case !onClick:
    case Math.sqrt(deltaX ** 2 + deltaY ** 2) >= 5:
    case (
      target.matches || target.msMatchesSelector || target.webkitMatchesSelector || (() => void 0)
    ).call(target, 'button, button *, a, a *'):
      break;

    //  Otherwise, we parse the click.
    default:
      onClick(e);
      break;
    }

    //  This resets our mouse location.
    this.startXY = null;
  }

  //  This expands and collapses our spoiler.
  handleSpoilerClick = (e) => {
    const { setExpansion } = this.props;
    e.preventDefault();
    if (this.props.setExpansion) {
      this.props.setExpansion();  //  Calling with no argument toggles
    }
  }

  //  Renders our component.
  render () {
    const {
      handleMouseDown,
      handleMouseUp,
      handleSpoilerClick,
    } = this;
    const {
      card,
      className,
      content,
      contentVisible,
      detailed,
      handler,
      history,
      intl,
      media,
      mentions,
      onClick,
      sensitive,
      setExpansion,
      tags,
      ...rest
    } = this.props;
    const computedClass = classNames('glitch', 'glitch__status__content', {
      actionable: !detailed && onClick,
      spoilered: !contentVisible,
    });
    let mediaElement;

    //  If there aren't any media attachments, we try showing a card.
    if ((!media || !media.size) && card) {
      mediaElement = <CardContainer card={card} />;

    //  Otherwise, we render the attachments.
    } else {
      mediaElement = (
        <AttachmentContainer
          ids={media}
          sensitive={sensitive}
        />
      );
    }
    
    //  Spoiler stuff.
    if (spoiler.length > 0) {

      //  This gets our list of mentions.
      const mentionLinks = status.get('mentions').map(mention => {
        const text = mention.get('acct').split('@');
        if (text[1]) text[1].replace(/[@.][^.]*/g, (m) => m.substr(0, 2));
        return (
          <CommonLink  //  TK: Make a <CommonAt> component
            destination={`/accounts/${mention.get('id')}`}
            history={history}
            href={mention.get('url')}
            key={mention.get('id')}
            title={'@' + mention.get('acct')}
          >
            <span className='at'>@</span>
            <span className='username'>{text[0]}</span>
            {text[1] ? <span className='at'>@</span> : null}
            {text[1] ? <span className='instance'>{text[1]}</span> : null}
          </CommonLink>
        );
      }).reduce((aggregate, item) => [...aggregate, ' ', item], []);

      //  Component rendering.
      return (
        <div className={computedClass}>
          <div
            className='spoiler'
            {...(onClick ? {
              onMouseDown: handleMouseDown,
              onMouseUp: handleMouseUp,
            } : {})}
          >
            <p>
              <ParseContainer
                text={spoiler}
                type={ParseContainer.Type.EMOJI}
              />
              {' '}
              <CommonButton
                active={!!contentVisible}
                className='showmore'
                onClick={handleSpoilerClick}
                showTitle={!contentVisible}
                title={intl.formatMessage(messages.show_more)}
              >
                {contentVisible ? null : (
                  <FormattedMessage {...messages.show_less} />
                )}
              </CommonButton>
            </p>
          </div>
          {!contentVisible ? mentionLinks : null}
          <div className='contents' hidden={!contentVisible}>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ParseContainer
                text={content}
                type={ParseContainer.Type.STATUS}
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );

    //  Non-spoiler statuses.
    } else {
      return (
        <div className={computedClass}>
          <div className='contents'>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ParseContainer
                text={content}
                type={ParseContainer.Type.STATUS}
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );
    }
  }

}
