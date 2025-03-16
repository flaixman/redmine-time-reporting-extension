chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("logTime", { periodInMinutes: 60 }); // Default: 1 hour
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "logTime") {
    chrome.scripting.executeScript({
      target: { allFrames: true },
      files: ["content.js"]
    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.scripting.executeScript({
    target: { allFrames: true },
    files: ["content.js"]
  });
});
