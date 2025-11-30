# Smart Select Assistant

Google Translate ve Google Gemini API'lerini kullanarak sectiginiz metin uzerinde hizli islemler yapmanizi saglayan Chrome uzantisi.

## Ozellikler
- Metin secildiginde ekranda hafif bir acilir menu belirir.
- AI Asistan: ozetle, acikla, paraphrase et veya ozel komutla kendi prompt'unu kullan (Gemini 2.5 Flash).
- Turkceye ceviri (translate.googleapis.com) destegi.
- Secili metni ve AI sonucunu tek tikla kopyalama.

## Kurulum
1. Proje dosyalarini bir klasore indirin/cikarin.
2. `background.js` icindeki `API_KEY` sabitine Google AI Studio/Gemini API anahtarinizi ekleyin.
3. Chrome'da `chrome://extensions` acin, sag ustten `Gelistirici modu` aktif edin ve `Paketlenmemis oge yukle` ile proje klasorunu secin.
4. Uzanti yukuledikten sonra acik sayfalari yenileyin.

<img width="1273" height="677" alt="image" src="https://github.com/user-attachments/assets/c7b51f73-1754-4489-b3e2-57449e283b42" />


## Kullanim
- Herhangi bir metni sectiginizde menu gorunur.
- `AI Asistan` menusunden `Ozet Cikar`, `Bunu Acikla`, `Paraphrase Et` ya da `Ozel Komut` seceneklerini kullanabilirsiniz.
- `Turkceye Cevir` butonu secili metni Turkceye cevirir.
- `Kopyala` secili metni panoya atar; sonuc kartindaki `Kopyala` butonu AI cikisini kopyalar, `Kapat` popup'i gizler.

<img width="1027" height="782" alt="image" src="https://github.com/user-attachments/assets/9b20adc1-7865-4e05-91c1-b8efed1ddb6d" />


## Proje Yapisi
- `manifest.json`: Izinler ve icerik betigi tanimi.
- `background.js`: Ceviri ve Gemini icerik uretimi istekleri burada yonetilir.
- `content.js`: Metin secimi, popup etkilesimi ve mesajlasma akis.
- `style.css`: Popup gorunumu ve menu stilleri.

## Sorun Giderme
- AI islemleri icin gecerli bir Gemini API anahtari girdiginizden ve kota sinirini asmadiginizdan emin olun.
- Ceviri veya AI yaniti gelmezse ag baglantisini ve tarayici konsolundaki hatalari kontrol edin.
