// Execute showTimeLogger when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: newTabProjects
    });
  });


  // Automatically execute code when a new tab with the specified URL is opened
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("projectes.apsl.net/my/api_key?yabadabaduu")) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: showTimeLogger
      });
    }
  });

  // Schedule execution every hour
  chrome.alarms.create("logTimeReminder", { periodInMinutes: 60 });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "logTimeReminder") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: newTabProjects
          });
        }
      });
    }
  });
  
  function newTabProjects() {
    // Open a new tab with the specified URL
    const Window = window.open("https://projectes.apsl.net/my/api_key?yabadabaduu", "_blank");

  }


  function showTimeLogger() {
    // Open a new window with the specified URL
    // and set its size to 800x600 pixels
      const redmineUrl = "https://projectes.apsl.net";
      const redmineTicketId = 156037; // Replace with the actual ticket ID
      const redmineApiKeyElement = document.getElementsByTagName("pre")[0].innerHTML;


      var left = (screen.width/2)-(1200/2);
      var top = (screen.height/2)-(650/2);    
      const newWindow = window.open("", "_blank", "width=2000,height=900,top="+top+",left="+left);

      // Create a popup in the new window's context
      const popup = newWindow.document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.width = "75%";
      popup.style.height = "75%";
      popup.style.overflow = "auto";
      popup.style.background = "red";
      popup.style.boxShadow = "0px 4px 6px rgba(214, 16, 16, 0.1)";
      popup.style.borderRadius = "8px";
      popup.style.padding = "15px";
      popup.style.zIndex = "10000";
  
      // Add content to the popup
      popup.innerHTML = `
        <h3>Log Your Time</h3>
        <textarea id='activity' rows='3' style='width: 100%;'></textarea>
        <br><br>
        <label for='time-select'>Time:</label>
        <select id='time-select' style='width: 100%;'>
          <option value="1">1 hour</option>
          <option value="0.75">45 minutes</option>
          <option value="0.5">30 minutes</option>
          <option value="0.25">15 minutes</option>
        </select>
        <br><br>
        <button id="log-hours" style="width: 100%;">Log Hours</button>
      `;
  
      // Append the popup to the new window's body
      newWindow.document.body.appendChild(popup);
  
      // Add an event listener to the button in the new window
      newWindow.document.getElementById("log-hours").addEventListener("click", async () => {

        const activity = newWindow.document.getElementById("activity").value;
        const selectedTime = newWindow.document.getElementById("time-select").value;
  
  
        const requestBody = {
          time_entry: {
            issue_id: redmineTicketId,
            hours: selectedTime,
            comments: activity,
          },
        };
  
        try {
          const response = await fetch(`${redmineUrl}/time_entries.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Referer": redmineUrl,
              "X-Redmine-API-Key": redmineApiKeyElement,
            },
            body: JSON.stringify(requestBody),
          });
  
          if (response.ok) {
            newWindow.close();
            close();
          } else {
            newWindow.alert("Failed to log time. Check API settings.");
          }
        } catch (error) {
          newWindow.alert("Error: " + error.message);
        }
      });
  }
