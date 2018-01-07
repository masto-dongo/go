#  ƔAML (pronounced "garglamel")  #

The syntax recognized by _Mastodon GO!_ for its bio metadata is
a limited subset of that provided by the YAML 1.2 specification
(we will henceforth call this subset ƔAML).  Generally speaking
this syntax matches that of a YAML implicit map, with the extra
requirement that each key-value pair take up only a single line
and with character escaping in double-quoted strings forbidden.

As with YAML, the beginning of a ƔAML document is marked with a
sequence of three hyphens (`---`), and the ending is marked via
a sequence of either three hyphens or three dots (`...`).  Only
ƔAML documents whose opening sequence occurs within the initial
text node of the account bio should be processed.

The parsing requirements of ƔAML documents require that the bio
be passed to the parser in plain text.  This can make rendering
account and hashtag links inside of bio metadata something of a
challenge.  Additionally, `<p>` and `<br>` elements will not be
converted to line-breaks, so this **must** be taken care of via
some other means prior to invoking the script.

The keys and values of this map are both interpreted as strings
with no additional processing.  Unlike YAML, ƔAML preserves any
duplicate keys, as well as key ordering.
