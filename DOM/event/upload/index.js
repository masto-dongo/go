//  DOM:UPLOAD
//  ==========

//  Imports.
import { DOMDispatch } from 'themes/mastodon-go/DOM';

//  The event.
export default function DOMEventUpload (options = {}) {
  DOMDispatch(DOMEventUpload, {
    completed: options.completed,
    progress: options.progress,
    withSuccess: options.withSuccess,
  });
}

//  Event type.
DOMEventUpload.type = 'mastodongoupload';
