//  EVENTS:UPLOAD
//  =============

//  Imports.
import { DOMDispatch } from 'flavours/go/lib/DOM';

//  The event.
export default function GOUpload (options = {}) {
  DOMDispatch(GOUpload, {
    completed: options.completed,
    progress: options.progress,
    withSuccess: options.withSuccess,
  });
}

//  Event type.
GOUpload.type = 'mastodongoupload';
