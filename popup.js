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
          "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiWlNUczd3TVVKNVRlV201M2VTeUJDcU44ZXJkNEo1WDJzNzQ3bTlOTnZoU21IM3JnY2JqV0o2OGtDb0s3ZUYzeCIsImV4cCI6MTczODY4MzkyNCwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.Mn0Q7zrYrOpLG4OCeI932CMmMYtmGPSTNc9upsmzwLq8xMoXzhbThuwSEJSYjwn0d51yFqGDT_hvUDGtoR5hSwKXR-Mj41ET6Ym_ClC6CPXcHX6w_z7yApWEpMWaM9ATy5rAMt73GSeJ1yYUkokpevfFX1mUGul5odwYYOkCrDh4C3F7n5J_uVDQ00YscQnloBUcv7kLd5W_G4XzSP4ksrbPAABJNierSsGDpvoFnBcT5iZRBP7V7hkJkwnC3SPdydqXXE6IAtbGGmt7Qhx_seMIwOKsuoMCRhqVg_dL0a3ECtTSWmCHDji8xsg-tT0KNybAB9B3nieCH-Mb5a2Z-g"
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
              "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiWlNUczd3TVVKNVRlV201M2VTeUJDcU44ZXJkNEo1WDJzNzQ3bTlOTnZoU21IM3JnY2JqV0o2OGtDb0s3ZUYzeCIsImV4cCI6MTczODY4MzkyNCwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.Mn0Q7zrYrOpLG4OCeI932CMmMYtmGPSTNc9upsmzwLq8xMoXzhbThuwSEJSYjwn0d51yFqGDT_hvUDGtoR5hSwKXR-Mj41ET6Ym_ClC6CPXcHX6w_z7yApWEpMWaM9ATy5rAMt73GSeJ1yYUkokpevfFX1mUGul5odwYYOkCrDh4C3F7n5J_uVDQ00YscQnloBUcv7kLd5W_G4XzSP4ksrbPAABJNierSsGDpvoFnBcT5iZRBP7V7hkJkwnC3SPdydqXXE6IAtbGGmt7Qhx_seMIwOKsuoMCRhqVg_dL0a3ECtTSWmCHDji8xsg-tT0KNybAB9B3nieCH-Mb5a2Z-g"
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
                  const fileName =
                    jobStatus.result.output.fileName || "data.pdf";
                  console.log("Download URL:", downloadUrl);
                  console.log("File Name:", fileName);

                  // Download the file
                  chrome.downloads.download(
                    {
                      url: downloadUrl,
                      filename: fileName,
                      saveAs: true,
                    },
                    async function (downloadId) {
                      console.log("Download started with ID:", downloadId);

                      // Wait for the download to complete
                      chrome.downloads.onChanged.addListener(
                        async function onChanged(downloadDelta) {
                          if (
                            downloadDelta.id === downloadId &&
                            downloadDelta.state &&
                            downloadDelta.state.current === "complete"
                          ) {
                            chrome.downloads.onChanged.removeListener(
                              onChanged
                            );

                            // Read the downloaded PDF file
                            const filePath = `D:/extensions/acc-sign/${fileName}`;
                            const pdfBytes = await fetch(filePath).then((res) =>
                              res.arrayBuffer()
                            );
                            const pdfDoc = await PDFLib.PDFDocument.load(
                              pdfBytes
                            );

                            // Embed the stamp image
                            const imageBytes = await fetch(
                              "sampleStamp.PNG"
                            ).then((res) => res.arrayBuffer());
                            const image = await pdfDoc.embedPng(imageBytes);

                            // Add the stamp to the first page
                            const page = pdfDoc.getPage(0);
                            page.drawImage(image, {
                              x: 300,
                              y: 90,
                              width: 150,
                              height: 90,
                            });

                            // Save the modified PDF
                            const modifiedPdfBytes = await pdfDoc.save();
                            const blob = new Blob([modifiedPdfBytes], {
                              type: "application/pdf",
                            });
                            const url = URL.createObjectURL(blob);

                            // Download the modified PDF
                            chrome.downloads.download({
                              url: url,
                              filename: `stamped_${fileName}`,
                              saveAs: true,
                            });
                                
                            const uploadfilePath = `D:/extensions/acc-sign/stamped_data`;

                            const url1 = document.getElementById("url").textContent;
                            const urlObj = new URL(url1);
                            const pathSegments = urlObj.pathname.split("/");
                        
                            // Extract Project ID from the URL path
                        
                        
                            // Extract Folder URN from entityId parameter
                            const params = new URLSearchParams(urlObj.search);
                            const folderUrn = params.get("folderUrn");
                        
                            try {
                              const myHeaders = new Headers();
                              myHeaders.append(
                                "authorization",
                                "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6IktrSmZwTVoyZ2NBWEEzZ25EUkdod3Z5UDdaSG1tV25aIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiWlNUczd3TVVKNVRlV201M2VTeUJDcU44ZXJkNEo1WDJzNzQ3bTlOTnZoU21IM3JnY2JqV0o2OGtDb0s3ZUYzeCIsImV4cCI6MTczODY4MzkyNCwidXNlcmlkIjoiNkw5MlJNM1VRWDNNSFZXNiJ9.Mn0Q7zrYrOpLG4OCeI932CMmMYtmGPSTNc9upsmzwLq8xMoXzhbThuwSEJSYjwn0d51yFqGDT_hvUDGtoR5hSwKXR-Mj41ET6Ym_ClC6CPXcHX6w_z7yApWEpMWaM9ATy5rAMt73GSeJ1yYUkokpevfFX1mUGul5odwYYOkCrDh4C3F7n5J_uVDQ00YscQnloBUcv7kLd5W_G4XzSP4ksrbPAABJNierSsGDpvoFnBcT5iZRBP7V7hkJkwnC3SPdydqXXE6IAtbGGmt7Qhx_seMIwOKsuoMCRhqVg_dL0a3ECtTSWmCHDji8xsg-tT0KNybAB9B3nieCH-Mb5a2Z-g"
                              );
                              myHeaders.append("Content-Type", "application/vnd.api+json");
                              const raw = JSON.stringify({
                                jsonapi: { version: "1.0" },
                                data: {
                                  type: "versions",
                                  attributes: {
                                    name: "stamped_data.pdf"
                                  },
                                  relationships: {
                                    item: {
                                      data: {
                                        type: "items",
                                        id: "urn:adsk.wipprod:fs.file:vf.ussZBooCS-6aiFbKRuDNGQ" // Replace with the actual item ID
                                      }
                                    }
                                  }
                                }
                              });
                        
                              const requestOptions = {
                                method: "POST",
                                headers: myHeaders,
                                body: raw,
                                redirect: "follow"
                              };
                        
                              const response = await fetch(
                                `https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions`,
                                requestOptions
                              );
                        
                              if (!response.ok) {
                                throw new Error(`Failed to create version: ${response.statusText}`);
                              }
                        
                              const resultData = await response.json();
                              const uploadUrl = resultData.data.relationships.storage.meta.link.href;
                        
                              const file = await fetch(filePath).then(res => res.blob());
                        
                              const formData = new FormData();
                              formData.append("file", file, "stamped_data.pdf");
                        
                              const uploadResponse = await fetch(uploadUrl, {
                                method: "PUT",
                                body: formData
                              });
                        
                              if (!uploadResponse.ok) {
                                throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
                              }
                        
                              console.log("File uploaded successfully!");
                            } catch (error) {
                              console.error("Error uploading file:", error);
                            }
                         
                            
                            console.log("PDF modified successfully!");
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
});
