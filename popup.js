document.getElementById("fontSelect").addEventListener("change", (e) => {
    const font = e.target.value;
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Check if the URL is a chrome:// URL
        if (activeTab.url.startsWith("chrome://")) {
            alert("This extension does not work on Chrome internal pages.");
            return;
        }
        
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (font) => {
                const styleId = "open-dyslexic-style";
                const existingStyle = document.getElementById(styleId);
    
                if (font === "OpenDyslexic") {
                    if (!existingStyle) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
                        @font-face {
                        font-family: 'OpenDyslexic';
                        src: url('${chrome.runtime.getURL("fonts/OpenDyslexic-Regular.otf")}') format('opentype');
                        }
                    `;
                    document.head.appendChild(style);
                    }
                    document.body.style.fontFamily = "'OpenDyslexic', sans-serif";
                } else if (font === "Original font") {
                    // Remove any custom font styles
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                    document.body.style.fontFamily = "";  // Reset to original font
                } else {
                    // Remove OpenDyslexic style tag if present
                    if (existingStyle) {
                    existingStyle.remove();
                    }
                    document.body.style.fontFamily = font;
                }
            },
            args: [font],
        }).catch((err) => {
            console.error("Error executing script:", err);
        });
    });
});
  