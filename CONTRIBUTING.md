#  CONTRIBUTING  #

My ideal world is one in which there are a bajillion different Mastodon frontends, all of which offer slightly different features and configuration options which respond to the specific needs of their community.
Consequently, I'd honestly rather people spend time developing their own _Mastodon GO!_ forks than try to merge changes into this repository proper.
That said, maintaining a fork is a lot of work, and for those interested in helping out without that kind of stamina there are things which can be done.

If your patch is just a quick bugfix or some other small change, naturally feel free to submit your PR.
For longer endeavours, I really encourage you to first *get in touch with me* and talk things out.
I'm `@kibi@glitch.social` and my mentions are always open.

The reason I recommend doing this is because it will give me a chance to introduce you to the codebase and maybe give some pointers regarding where to start working, some tips for making the merge process go easier, and also (naturally) vet your idea before you wind up spending hours and hours working on it.
Having written pretty much this entire thing from scratch, nobody knows it better than I do, and I'm happy to help.

If you haven't already been involved with the _Mastodon GO!_ project for a while, sticking to a smaller project is better than trying to attempt a larger one, and anything involving refactoring should definitely only come after extensive discussion.
_Mastodon GO!_ has… a particular way of going about things, and if you haven't been working with the code for a while then you're not going to be as fluent in its design and approach as someone who has.
Most everything is architectured the way that it is for a reason, and learning the reasons behind the code is key to being able to write good additions.

In terms of priorities, code that is down-to-earth and accessible is valued above code that is extra-professional or mightily efficient.
If your thought-process is “I'm going to change X to match Y programming trend or marginally boost Z efficiency,” you should first think about what the consequences of that change will be regarding keeping the codebase straightforward and friendly.
If you can't implement your change in a simple and inviting manner, it might be necessary to head back to the drawing board and rethink it over.

The ideal process for contributing is roughly as follows:

1.  Develop an implementation of your new feature, bugfix, or solution to the problem.

2.  Test and edit your implementation to be as clear and straightforward as possible.

3.  Submit a PR with your code, and explain what it does.

4.  Someone else will test your code, potentially rewriting aspects for clarity or to match [styling conventions](CONVENTIONS.md).

5.  Documentation for the code will be written/updated.

6.  If everything looks good, the code will get merged.

Not everyone has the same amount of time or ability when it comes to working on this stuff, but as a general rule of thumb, the more time you spend on the first 3 items, the less time it will take for the last 3.
If your code requires extensive rewriting to bring it up to _Mastodon GO!_ standards, it's not *that* much better than us just writing the code from scratch, so try to do what you can to build things correctly from the getgo.
