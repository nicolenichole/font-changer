document.getElementById("fontSelect").addEventListener("change", (e) => {
    const font = e.target.value;

    // Save the font selection to chrome.storage
    chrome.storage.local.set({ selectedFont: font }, () => {
        console.log("Font saved:", font);
    });
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Check if the URL is a chrome:// URL
        if (activeTab.url.startsWith("chrome://")) {
            alert("This extension does not work on Chrome internal pages.");
            return;
        }
        
        let fontURL = "";
        if (font === "OpenDyslexic") {
            fontURL = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.otf");
        }
        
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: (font, fontURL) => {
                const styleId = "global-font-style";
                // Remove any previous style tag if exists
                const existingStyle = document.getElementById(styleId);
                if (existingStyle) {
                    existingStyle.remove();
                }
                
                // If "Original font" is selected, do nothing (or remove our global override)
                if (font === "Original font") {
                    return;
                }
                
                const style = document.createElement("style");
                style.id = styleId;
                
                if (font === "OpenDyslexic") {
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
            },
            args: [font, fontURL],
        }).catch((err) => {
            console.error("Error executing script:", err);
        });
    });
});
