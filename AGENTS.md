# smart_select

Çalışma alanı kuralları: `../../AGENTS.md`. Bu dosyadaki kurallar ondan önceliklidir.

## Amaç
Smart Select Assistant: sayfada seçilen metin için açılır menü gösteren Chrome eklentisi
(Gemini ile özetle/açıkla/paraphrase/özel komut, Türkçeye çeviri, kopyala).
Upstream: https://github.com/ofdemir/SmartSelect-Extension

## Teknoloji yığını
- Chrome eklentisi, Manifest V3; derleme adımı ve npm bağımlılığı yok (düz JS + CSS).
- `background.js`: service worker — Google Translate ve Gemini API istekleri.
- `content.js`: seçim algılama, popup arayüzü, `chrome.runtime` mesajlaşması.
- `style.css`: popup stilleri.
- Testler: Node yerleşik test koşucusu (`node --test`), `tests/` altında; `chrome.*` API'leri sahte nesnelerle.

## Komutlar
Test ve lint komutları `.ai/project.toml` içinde tanımlıdır; orkestratör onları kullanır.

## Kod kuralları
- npm bağımlılığı ya da derleme adımı ekleme (açıkça plana yazılmadıkça).
- API anahtarını koda gömme; repoya anahtar commit'leme.
- `manifest.json` izinlerini genişletmek güvenlik etkisidir: plana gerekçesiyle yaz.
- Geliştirme dalı `develop`; `main` yalnızca sürüm (upstream ile ortak). Sürüm dışında `main`e yazılmaz.
