let audioContext = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

export async function playCallSound() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    await context.resume();
  }

  const now = context.currentTime;

  playTone(context, now, 740, 0.22);
  playTone(context, now + 0.28, 920, 0.24);
  playTone(context, now + 0.58, 740, 0.28);
}

function playTone(context, startTime, frequency, duration) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.34, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}