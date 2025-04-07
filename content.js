chrome.storage.local.get("selectedFont", (data) => {
    const font = data.selectedFont;
    if (!font || font === "Original font") {
      return; // do nothing if not set or if user wants the original font
    }
  
    // Remove any existing global font style (if needed)
    const styleId = "global-font-style";
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  
    const style = document.createElement("style");
    style.id = styleId;
  
    // For OpenDyslexic, add @font-face rule
    if (font === "OpenDyslexic") {
      // Pass the full URL from chrome.runtime.getURL
      const fontURL = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.otf");
      style.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('${fontURL}') format('opentype');
        }
        html, body, * {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      `;
    } else {
      style.textContent = `
        html, body, * {
          font-family: ${font} !important;
        }
      `;
    }
    document.head.appendChild(style);
});
  