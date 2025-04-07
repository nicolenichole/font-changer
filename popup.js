document.getElementById("fontSelect").addEventListener("change", (e) => {
    const font = e.target.value;
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (font) => {
          document.body.style.fontFamily = font;
        },
        args: [font],
      });
    });
});
  
  