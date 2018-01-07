//  DOM:SCHEDULE
//  ============

//  [Code taken from upstream]

//  Wrapper to call requestIdleCallback() to schedule low-priority
//  work.  See
//  https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
//  for a good breakdown of the concepts behind this.

import Queue from 'tiny-queue';

const taskQueue = new Queue();
let running = false;

function runTasks (deadline) {
  while (taskQueue.length && deadline.timeRemaining() > 0) {
    taskQueue.shift()();
  }
  if (taskQueue.length) {
    requestIdleCallback(runTasks);
  } else {
    running = false;
  }
}

export default function DOMSchedule (task) {
  taskQueue.push(task);
  if (!running) {
    running = true;
    requestIdleCallback(runTasks);
  }
}

