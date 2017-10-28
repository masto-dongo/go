import { DOMDispatch } from 'themes/mastodon-go/DOM';

export default function DOMEventUpload (options = {}) {
  DOMDispatch(DOMEventUpload, {
    completed: options.completed,
    progress: options.progress,
    withSuccess: options.withSuccess,
  });
}

DOMEventUpload.type = 'mastodongoupload';
