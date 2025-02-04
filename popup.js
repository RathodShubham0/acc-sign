document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    const activeTabUrl = activeTab.url;
    document.getElementById("url").textContent = activeTabUrl;
  });
});
 
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("download").addEventListener("click", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const activeTabUrl = activeTab.url;
      document.getElementById("url").value = activeTabUrl;
    });
 
    const url = document.getElementById("url").textContent;
    console.log("URL:", url);
 
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");
 
    // Extract Project ID from the URL path
    const projectId = pathSegments[4];
 
    // Extract Folder URN from entityId parameter
    const params = new URLSearchParams(urlObj.search);
    const folderUrn = params.get("folderUrn");
 
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "authorization",
        "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoickhwZVpWczBadGhBRmVBVFZ4V1dpVXltVThoY2hhS2YxdnVWV2laaGp2bDBha083WFFuYXdVU0NIT2tFQ0FhUiIsImV4cCI6MTczODY3NDYyMiwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.j-D1IRq8rI3_clntTNUs7frtwg5yzBKLJPVjHtO-Px8I4JOHdXGhuPugRoCOiljG_SBx28_UDw1d8Gi2aH7DDggkRreJb11YqwnzsuzXz7cI8NblNf4KoaExPkDK2lBUgw2i2owjvfMCgeIGAO3CUpwDXFExfyr8J8jEWdTGV5XQr6_WQdP9ueinaDTWGi8KNpd0_eE-qU6VmkM7vFxKcTR2T3on2jwJEV6JK6xsp7qyiKmwPK2STb2XpzQMfpQp2U88b_KKL85NPdsU4Ub2xFNtY0_9zlaUxWnQXuQMDySThurB0aFnpKGqsJ-xcB1qtk060x1GiLUX9siPbrKE_w"
      );
      myHeaders.append("Content-Type", "application/json");
 
      const raw = JSON.stringify({
        documents: [
          {
            urn: "urn:adsk.wipprod:fs.file:vf.ussZBooCS-6aiFbKRuDNGQ?version=1",
          },
        ],
      });
 
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
 
      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://developer.api.autodesk.com/pes/v2/projects/f514557e-3b26-434b-98fc-b743936e2aa0/files:export",
            requestOptions
          );
 
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
 
          const resultData = await response.text();
          console.log("Result Data:", resultData);
 
          const jobId = JSON.parse(resultData).jobId;
          console.log("Job ID:", jobId);
 
          const myHeaders1 = new Headers();
          myHeaders1.append(
            "Authorization",
            "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoickhwZVpWczBadGhBRmVBVFZ4V1dpVXltVThoY2hhS2YxdnVWV2laaGp2bDBha083WFFuYXdVU0NIT2tFQ0FhUiIsImV4cCI6MTczODY3NDYyMiwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.j-D1IRq8rI3_clntTNUs7frtwg5yzBKLJPVjHtO-Px8I4JOHdXGhuPugRoCOiljG_SBx28_UDw1d8Gi2aH7DDggkRreJb11YqwnzsuzXz7cI8NblNf4KoaExPkDK2lBUgw2i2owjvfMCgeIGAO3CUpwDXFExfyr8J8jEWdTGV5XQr6_WQdP9ueinaDTWGi8KNpd0_eE-qU6VmkM7vFxKcTR2T3on2jwJEV6JK6xsp7qyiKmwPK2STb2XpzQMfpQp2U88b_KKL85NPdsU4Ub2xFNtY0_9zlaUxWnQXuQMDySThurB0aFnpKGqsJ-xcB1qtk060x1GiLUX9siPbrKE_w"
          );
 
          const requestOptions1 = {
            method: "GET",
            headers: myHeaders1,
            redirect: "follow",
          };
 
          const checkJobStatus = async (jobId) => {
            try {
              const response = await fetch(
                `https://developer.api.autodesk.com/pes/v2/projects/f514557e-3b26-434b-98fc-b743936e2aa0/jobs/${jobId}`,
                requestOptions1
              );
 
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch job status: ${response.statusText}`
                );
              }
 
              const jobStatus = await response.json();
              console.log("Job Status:", jobStatus);
 
              if (jobStatus.status === "successful") {
                const downloadUrl = jobStatus.result.output.signedUrl;
                const fileName = jobStatus.result.output.fileName || "data.pdf";
                console.log("Download URL:", downloadUrl);
                console.log("File Name:", fileName);
 
                // Download the file
                chrome.downloads.download(
                  {
                    url: downloadUrl,
                    filename: fileName,
                    saveAs: true,
                  },
                  function (downloadId) {
                    console.log("Download started with ID:", downloadId);
                    chrome.tabs.executeScript(
                      activeTab.id,
                      { file: "index.js" },
                      () => {
                        if (chrome.runtime.lastError) {
                          console.error(
                            `Error executing index.js: ${chrome.runtime.lastError}`
                          );
                        } else {
                          console.log("index.js executed successfully");
                        }
                      }
                    );
                  }
                );
              } else if (jobStatus.status === "processing") {
                console.log(
                  "Job is still processing, checking again in 5 seconds..."
                );
                setTimeout(() => checkJobStatus(jobId), 5000);
              } else {
                console.error("Unexpected job status:", jobStatus.status);
              }
            } catch (error) {
              console.error("Error checking job status:", error);
            }
          };
 
          checkJobStatus(jobId);
        } catch (error) {
          console.error("Error:", error);
        }
      };
 
      fetchData();
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  });
});