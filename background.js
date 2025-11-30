// background.js - Düzeltilmiş Versiyon

// DİKKAT: Anahtarını buraya tırnak içinde yapıştır
const API_KEY = "PASTE_YOUR_API_KEY_HERE"; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // --- TRANSLATE ---
    if (request.action === "translate") {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURI(request.text)}`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const result = data[0].map(item => item[0]).join("");
                sendResponse({ success: true, data: result });
            })
            .catch(err => sendResponse({ success: false, error: "Çeviri hatası: " + err.message }));
        
        return true; 
    }

// --- GENEL AI İŞLEMİ (Dinamik Prompt) ---
    if (request.action === "generateContent") {
        
        if (!API_KEY || API_KEY.includes("BURAYA")) {
            sendResponse({ success: false, error: "API Anahtarı eksik!" });
            return true;
        }

        // Güncel modelin (Senin test ettiğin çalışan model)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview-11-2025:generateContent?key=${API_KEY}`;
        
        // Content.js'ten gelen özel komutu (request.prompt) kullanıyoruz
        const userPrompt = request.prompt; 
        const selectedText = request.text;

        const payload = {
            contents: [{
                parts: [{ 
                    text: `${userPrompt}:\n\n"${selectedText}"` 
                }]
            }]
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "API Hatası");

            if (data.candidates && data.candidates[0].content) {
                const result = data.candidates[0].content.parts[0].text;
                sendResponse({ success: true, data: result });
            } else {
                sendResponse({ success: false, error: "Cevap alınamadı." });
            }
        })
        .catch(error => {
            sendResponse({ success: false, error: error.message });
        });

        return true;
    }
});