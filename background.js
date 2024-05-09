chrome.runtime.onInstalled.addListener(function () {
    // Set up an alarm to check for due tasks every minute
    chrome.alarms.create('checkTasks', { periodInMinutes: 1 });
  });
  
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'checkTasks') {
      // Check for tasks with alarms and notify the user
      chrome.storage.sync.get('tasks', function (data) {
        const tasks = data.tasks || [];
        const now = new Date();
        for (const task of tasks) {
          if (task.alarm && new Date(task.alarm) < now) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icon.png',
              title: 'TaskMaster Reminder',
              message: `Reminder for: ${task.text}`
            });
          }
        }
      });
    }
  });