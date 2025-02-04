document.addEventListener('DOMContentLoaded', function () {
 
  document.getElementById("btn").addEventListener("click", fetchCurrentTabInfo);
});

function fetchCurrentTabInfo() {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, ([currentTab]) => {
      console.log("Current URL: " + currentTab.url);
      if (isBIM360Url(currentTab.url)) {
          fetchBIM360Url(currentTab.url);
      }
      if (isAccUrl(currentTab.url)) {
          fetchInfo(currentTab.url);
      }
      // execute script
      chrome.scripting
          .executeScript({
              target: { tabId: currentTab.id },
              files: ["script.js"],
          })
          .then(() => console.log("script injected"));

  });
}

function fetchInfo(url) {
  let project_id = url.match(/projects\/([^\/?#]+)/)?.[1] || '';
  let urlParams = new URLSearchParams(url.split('?')[1] || '');
  let folder_urn = urlParams.get('folderUrn') || '';
  let entity_id = urlParams.get('entityId') || '';
  let viewable_guid = urlParams.get('viewableGuid') || '';

  generateOutput(project_id, folder_urn, entity_id, viewable_guid);

  document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', function () {
          copyValue(this.getAttribute('data-value'));
      });
  });

  // Integrate the export and download functionality
  exportAndDownloadFile(project_id, entity_id);
}

function generateOutput(project_id, folder_urn, entity_id, viewable_guid) {
  let output = "<div class='info-item'><label>Project ID:</label> " + project_id + "<button class='copy-button' data-value='" + project_id + "'>Copy</button></div>";
  output += "<div class='info-item'><label>Folder URN:</label> " + folder_urn + "<button class='copy-button' data-value='" + folder_urn + "'>Copy</button></div>";
  output += "<div class='info-item'><label>Entity ID:</label> " + entity_id + "<button class='copy-button' data-value='" + entity_id + "'>Copy</button></div>";
  output += "<div class='info-item'><label>Viewable GUID:</label> " + viewable_guid + "<button class='copy-button' data-value='" + viewable_guid + "'>Copy</button></div>";
  let infoOutput = document.getElementById("infoOutput");
  infoOutput.innerHTML = output;
  infoOutput.style.display = "block";
  return output;
}

function fetchBIM360Url(url) {
  let project_id = url.match(/projects\/([^\/?#]+)/)?.[1] || '';
  let folder_urn = url.match(/folders\/([^\/?#]+)/)?.[1] || '';
  let entity_id = url.match(/items\/([^\/?#]+)/)?.[1] || '';
  let viewable_guid = ""

  generateOutput(project_id, folder_urn, entity_id, viewable_guid);

  document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', function () {
          copyValue(this.getAttribute('data-value'));
      });
  });

  // Integrate the export and download functionality
  exportAndDownloadFile(project_id, entity_id);
}

function isBIM360Url(url) {
  return url.includes("docs.b360");
}

function isAccUrl(url) {
  return url.includes("acc.autodesk.com");
}

function copyValue(value) {
  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = value;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

async function fetchToken() {
  try {
      const response = await fetch(
          "https://developer.api.autodesk.com/authentication/v2/token",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                  Authorization: "Basic YzdJSkRPa1d5b1VNenZtQWlISmkxQjlIdXlxM1oxMVA6M1Q4dlBRSmxNbEFLa2ZNMA==", // Replace with your encoded client_id:client_secret
              },
              body: new URLSearchParams({
                  grant_type: "client_credentials",
                  scope: "data:read",
              }),
          }
      );

      if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.statusText}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;
      console.log('Access Token:', accessToken);

      chrome.storage.local.set({ 'accessToken': accessToken }, () => {
          if (chrome.runtime.lastError) {
              console.error('Error saving access token:', chrome.runtime.lastError);
          } else {
              console.log('Access token saved');
          }
      });

      return accessToken;
  } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
  }
}

async function exportAndDownloadFile(projectId, itemId) {
  try {
      const accessToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiVnJaYWpvSU9JZkVONWxIbHdMR1JDZlA0YnRScmZLUlRqQlRFVFo0bEE1aWdINzA5aHZHMXZBTDlwbnFEaFR6TCIsImV4cCI6MTczODY2NjQ2MCwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.jusydM3mc1eY1a3FVD118SmVNCt36xE-CPeesG1jByP62zgBSGIzfwM5WLAlRoxWE7B67AZbF2rBS_GTf7bepJEehJSGig8a9roW2Kwedb0oTIqzYj0BqB4a-9Mr0tkzjbBzfMUfAWKVRL15M_Tz6DXYtf4WYLYmGoKkaean8tKln7MuLfkxwKhM3ydHBGn2KGPdekqyv7GZluPtlSVnGXFU2bhV4hC8yh_VDOy37w2VDS8MABnKtzOdMuqp1Q_8c644MuvYoJmnJDkkeWTQ6ctLsOZNoZB7HEd4ZYthDNVNqdNp_uZ6y69_eDUwgUnWLHFOIFYXRvZ-O2JADUWrCg";

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const raw = JSON.stringify({
          documents: [
              {
                  urn: `urn:adsk.wipprod:fs.file:vf.${itemId}?version=1`
              }
          ]
      });

      const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
      };

      fetch(`https://developer.api.autodesk.com/pes/v2/projects/${projectId}/files:export`, requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log('Export Result:', result);
              const jobId = result.jobId;

              const checkJobStatus = () => {
                  fetch(`https://developer.api.autodesk.com/pes/v2/projects/${projectId}/jobs/${jobId}`, {
                      method: "GET",
                      headers: myHeaders,
                      redirect: "follow"
                  })
                      .then(response => response.json())
                      .then(jobResult => {
                          console.log('Job Result:', jobResult);
                          if (jobResult.status === 'completed') {
                              const storageUrl = jobResult.storageUrl;
                              fetch(storageUrl, {
                                  headers: {
                                      'Authorization': `Bearer ${accessToken}`
                                  }
                              })
                                  .then(response => response.blob())
                                  .then(blob => {
                                      console.log('Blob:', blob);
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.style.display = 'none';
                                      a.href = url;
                                      a.download = 'file';
                                      document.body.appendChild(a);
                                      a.click();
                                      window.URL.revokeObjectURL(url);
                                  })
                                  .catch(error => console.error('Error downloading file:', error));
                          } else {
                              setTimeout(checkJobStatus, 5000); // Check again after 5 seconds
                          }
                      })
                      .catch(error => console.error('Error checking job status:', error));
              };

              checkJobStatus();
          })
          .catch(error => console.error('Error exporting file:', error));
  } catch (error) {
      console.error('Failed to fetch token and download file:', error);
  }
}