// content.js
function showTimeLogger() {
  if (!document.getElementById("redmine-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "redmine-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";

    const modal = document.createElement("div");
    modal.style.background = "white";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.innerHTML = `
      <h2>Log Your Time</h2>
      <textarea id='activity' rows='4' cols='30'></textarea>
      <br><br>
      <label for='time-select'>Select Time:</label>
      <select id='time-select'>
        <option value="1">1 hour</option>
        <option value="0.75">45 minutes</option>
        <option value="0.5">30 minutes</option>
        <option value="0.25">15 minutes</option>
      </select>
      <br><br>
      <button id='submit'>Submit</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("submit").addEventListener("click", async () => {
      const activity = document.getElementById("activity").value;
      const selectedTime = parseFloat(document.getElementById("time-select").value);
      if (!activity) return alert("Please enter your activity");
      
      const apiKey = localStorage.getItem("redmineApiKey") || prompt("Enter your Redmine API Key:");
      const redmineUrl = localStorage.getItem("redmineUrl") || prompt("Enter your Redmine URL:");
      
      if (!localStorage.getItem("redmineApiKey")) localStorage.setItem("redmineApiKey", apiKey);
      if (!localStorage.getItem("redmineUrl")) localStorage.setItem("redmineUrl", redmineUrl);
      
      const issueId = "YOUR_ISSUE_ID";
      
      const requestBody = {
        time_entry: {
          issue_id: issueId,
          hours: selectedTime,
          comments: activity
        }
      };
      
      try {
        const response = await fetch(`${redmineUrl}/time_entries.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Redmine-API-Key": apiKey
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          alert("Time logged successfully!");
          document.body.removeChild(overlay);
        } else {
          alert("Failed to log time. Check API settings.");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }
}

// Show popup when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.scripting.executeScript({
    target: { allFrames: true },
    func: showTimeLogger
  });
});

// Show popup when triggered by the alarm
showTimeLogger();
