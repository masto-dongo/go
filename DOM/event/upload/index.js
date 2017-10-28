import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventUpload (options = {}) {
  DOMDispatch(DOMEventCompose, {
    completed: options.completed,
    progress: options.progress,
    withSuccess: options.withSuccess,
  });
}

DOMEventCompose.type = 'mastodongoupload';
