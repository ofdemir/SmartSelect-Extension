console.log("Smart Select: Hazır 🚀");

// --- GLOBAL DEĞİŞKENLER ---
let lastSelectedText = ""; // Seçilen orijinal metin
let currentResultText = ""; // Yapay zekadan dönen son cevap (Kopyalamak için)

// 1. POPUP OLUŞTUR
const popup = document.createElement("div");
popup.id = "smart-select-popup";
document.body.appendChild(popup);

// Ana Menü Şablonu
const mainMenuHTML = `
    <div class="dropdown-wrapper">
        <button id="btn-main-ai" class="smart-select-btn">✨ AI Asistan ▼</button>
        <div class="dropdown-menu">
            <button id="btn-ai-summarize">📝 Özet Çıkar</button>
            <button id="btn-ai-explain">💡 Bunu Açıkla</button>
            <button id="btn-ai-paraphrase">🔄 Paraphrase Et</button>
            <button id="btn-ai-custom">⌨️ Özel Komut...</button>
        </div>
    </div>
    <div class="smart-divider"></div>
    <button id="btn-translate" class="smart-select-btn">🌍 Çevir</button>
    <div class="smart-divider"></div>
    <button id="btn-copy" class="smart-select-btn">📋 Kopyala</button>
`;

popup.innerHTML = mainMenuHTML;

// 2. SEÇİMİ YAKALA (MOUSEUP)
document.addEventListener('mouseup', (event) => {
    if (popup.contains(event.target)) return;

    const selection = window.getSelection();
    const currentText = selection.toString().trim();

    if (currentText.length > 0) {
        lastSelectedText = currentText; // Orijinal metni sakla
        
        popup.innerHTML = mainMenuHTML; // Menüyü sıfırla
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        popup.style.top = `${rect.top + window.scrollY - 50}px`; 
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.display = "flex";
    } else {
        popup.style.display = "none";
    }
});

document.addEventListener('mousedown', (event) => {
    if (event.target.id !== "smart-select-popup" && !popup.contains(event.target)) {
        popup.style.display = "none";
    }
});

// 3. EVENT DELEGATION (TÜM TIKLAMALAR BURADA)
popup.addEventListener('click', (event) => {
    const targetId = event.target.id;

    // --- AI İŞLEMLERİ ---
    if (targetId === 'btn-ai-summarize') runAI("summary");
    else if (targetId === 'btn-ai-explain') runAI("explain");
    else if (targetId === 'btn-ai-paraphrase') runAI("paraphrase");
    else if (targetId === 'btn-ai-custom') showCustomInput();

    // --- ÖZEL KOMUT GÖNDER ---
    else if (targetId === 'btn-custom-submit') {
        const inputVal = document.getElementById("custom-input-box").value.trim();
        if (inputVal) runAI("custom", inputVal);
    }

    // --- ÇEVİRİ ---
    else if (targetId === 'btn-translate') {
        event.target.innerHTML = "⏳";
        chrome.runtime.sendMessage({ action: "translate", text: lastSelectedText }, (res) => {
            event.target.innerHTML = "🌍 Çevir";
            if (res && res.success) showResult(res.data);
        });
    }

    // --- ORİJİNAL METNİ KOPYALA ---
    else if (targetId === 'btn-copy') {
        navigator.clipboard.writeText(lastSelectedText).then(() => {
            event.target.innerHTML = "✅";
            setTimeout(() => event.target.innerHTML = "📋 Kopyala", 1000);
        });
    }

    // --- YENİ: SONUCU KOPYALA ---
    else if (targetId === 'btn-copy-result') {
        // HTML taglerini (<b>, <br>) temizleyip düz metin olarak alıyoruz
        const resultDiv = document.getElementById("ai-result-content");
        if (resultDiv) {
            const textToCopy = resultDiv.innerText; // innerText HTML'i temizler
            navigator.clipboard.writeText(textToCopy).then(() => {
                const btn = document.getElementById("btn-copy-result");
                const oldText = btn.innerHTML;
                btn.innerHTML = "✅ Kopyalandı";
                setTimeout(() => btn.innerHTML = oldText, 1500);
            });
        }
    }

    // --- SONUCU KAPAT ---
    else if (targetId === 'btn-close-result') {
        popup.style.display = "none";
    }
});

// 4. ENTER TUŞU DESTEĞİ
popup.addEventListener('keydown', (event) => {
    if (event.target.id === 'custom-input-box' && event.key === 'Enter') {
        const val = event.target.value.trim();
        if (val) runAI("custom", val);
    }
});


// --- YARDIMCI FONKSİYONLAR ---

function showCustomInput() {
    popup.innerHTML = `
        <div class="custom-input-container">
            <input type="text" id="custom-input-box" class="custom-prompt-input" placeholder="Ne yapayım?" autocomplete="off">
            <button id="btn-custom-submit" class="custom-submit-btn">Git</button>
        </div>
    `;
    setTimeout(() => document.getElementById("custom-input-box").focus(), 50);
}

function runAI(promptType, customText = "") {
    const text = lastSelectedText;
    if (!text) { alert("Metin seçimi algılanamadı."); return; }

    let promptText = "";
    if (promptType === "summary") promptText = "Aşağıdaki metni Türkçe olarak, çok kısa bir şekilde özetle";
    else if (promptType === "explain") promptText = "Aşağıdaki kavramı veya metni, bilmeyen biri için basitçe açıkla";
    else if (promptType === "paraphrase") promptText = "Aşağıdaki metnin anlamını koruyarak, makalede alıntı olarak kullanmak için 'Paraphrasing' yap";
    else if (promptType === "custom") promptText = customText;

    popup.innerHTML = `<div style="padding:8px; color:#fff; font-size:13px;">✨ Gemini Düşünüyor...</div>`;

    chrome.runtime.sendMessage({ 
        action: "generateContent", 
        text: text,
        prompt: promptText 
    }, (response) => {
        if (response && response.success) {
            showResult(convertMarkdownToHtml(response.data));
        } else {
            showResult("Hata: " + (response.error || "Bilinmeyen hata"));
        }
    });
}

function showResult(resultText) {
    // Sonucu değişkene atayabiliriz ama DOM'dan okumak (innerText) daha temiz bir 'düz metin' verir.
    
    popup.innerHTML = `
        <div style="padding: 10px; max-width: 350px;">
            <div id="ai-result-content" style="font-size: 14px; color: #fff; line-height: 1.5; max-height: 300px; overflow-y: auto; margin-bottom: 10px;">
                ${resultText}
            </div>
            
            <div style="display: flex; gap: 8px;">
                <button id="btn-copy-result" style="flex: 1; background: #3c4043; border: 1px solid #5f6368; color: white; padding: 6px; border-radius: 4px; cursor: pointer;">📋 Kopyala</button>
                <button id="btn-close-result" style="flex: 1; background: #8ab4f8; border: none; color: #202124; font-weight:bold; padding: 6px; border-radius: 4px; cursor: pointer;">Kapat</button>
            </div>
        </div>
    `;
}

function convertMarkdownToHtml(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/^\* /gm, '• ');
    html = html.replace(/\n/g, '<br>');
    return html;
}