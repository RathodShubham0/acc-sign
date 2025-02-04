document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('download').addEventListener('click', async () => {
      const projectId = document.getElementById('project_id').value;
      const itemId = document.getElementById('item_id').value;
      console.log('Project ID:', projectId);
      console.log('Item ID:', itemId);
  
      const fetchToken = async () => {
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
      };
  
      try {
        const accessToken = await fetchToken();
  
        fetch(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${itemId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(response => response.json())
        .then(itemDetails => {
          console.log('Item Details:', itemDetails);
          const versionId = itemDetails.data.relationships.versions.data[0].id;
          return fetch(`https://developer.api.autodesk.com/data/v1/projects/${projectId}/versions/${versionId}/relationships/refs`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        })
        .then(response => response.json())
        .then(refs => {
          console.log('Refs:', refs);
          const storageUrl = refs.data[0].relationships.storage.meta.link.href;
          return fetch(storageUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
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
        .catch(error => console.error('Error:', error));
      } catch (error) {
        console.error('Failed to fetch token and download file:', error);
      }
    });
  });