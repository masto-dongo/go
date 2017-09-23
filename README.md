#  Mastodon GO!  #

__*Mastodon GO!*__ is an alternative frontend for [Mastodon](https://joinmastodon.org) which supports the additional features provided by the [Glitch Social](https://glitch-soc.github.io/docs/) fork.
It started out as just a modification of a few core components and then spread to become a rewrite of the entire frontend, because that's kinda how Mastodon development works 😓.

##  Installing  ##

For installation instructions, see [INSTALLING.md](INSTALLING.md).

##  Principles  ##

###  Design:

1.  __Accessible.__
    The common components provided by _Mastodon GO!_ are designed to help encourage accessible web design.
    In addition, the flow and layout of various parts of the site have been redesigned to more intuitively map to what users might expect.

2.  __Personal.__
    Different users have different needs, and _Mastodon GO!_ attempts to accommodate this by giving users the freedom to configure the frontend according to their preferences.

3.  __Queer.__
    _Mastodon GO!_ is gay trans software.
    Take it or leave it 💁.

###  Coding:

1.  __Familiar.__
    _Mastodon GO!_ is written using the same tools as the vanilla Mastodon frontend—namely, React+Redux—and it tries to follow the same conventions.
    It shouldn't be overly difficult for someone familiar with Mastodon development to jump over to development on _Mastodon GO!_

2.  __Simple.__
    The components used by _Mastodon GO!_ are designed to be generalized and reüsable in a variety of situations, which helps keep the overall size and scope of the code small.

3.  __Organized.__
    The files in the _Mastodon GO!_ source follow a clear structure and are named in predictable ways.
    Stylesheets are packaged with their components and follow straightforward conventions.

##  Additional Information  ##

_Mastodon GO!_ was initially written by [kibigo!](https://glitch.social/@kibi) with help from the other members of the [glitch-soc](https://github.com/glitch-soc/) team.
It was modified from the vanilla [Mastodon](https://github.com/tootsuite/mastodon/) frontend, written by Eugen Rochko and many others, in September 2017.
It is licensed under the [GNU Affero General Public License, Version 3](LICENSE.md).
