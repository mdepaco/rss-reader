export function speakText(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const plain = tmp.textContent || tmp.innerText || '';

  const utter = new SpeechSynthesisUtterance(plain);
  utter.lang = 'es-ES';
  utter.rate = 0.9;
  utter.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === 'es-ES' && /google/i.test(v.name));
  if (voice) utter.voice = voice;

  window.speechSynthesis.speak(utter);
}