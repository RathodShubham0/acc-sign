chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  const fetchToken = async () => {
    try {
      const response = await fetch(
        "https://developer.api.autodesk.com/authentication/v2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            Authorization: "Basic VGY0dU9Zc3ZNVjN4RWpBOHVpUUg1QWlYV01YR290Nm4xWFp5cGhFTFRKV1BxNHN6OnM5ZVR4Nm54UG1HeTFsQm1LV1VSVHdyaDFvaDJ6ak1laHc3VXhGMG85cThoWE5CdGFFYWN3eGFDQURPSTBGRXc=", // Replace with your encoded client_id:client_secret
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
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };
  
  chrome.browserAction.onClicked.addListener(() => {
    fetchToken();
  });