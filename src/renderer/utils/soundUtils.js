import chamadaSoundUrl from '../assets/chamada.mp3';

let unlockedAudio = null;

function createAudio() {
  const audio = new Audio(chamadaSoundUrl);

  audio.preload = 'auto';
  audio.volume = 1;

  return audio;
}

export async function unlockCallSound() {
  if (!unlockedAudio) {
    unlockedAudio = createAudio();
  }

  try {
    unlockedAudio.currentTime = 0;
    unlockedAudio.muted = true;

    await unlockedAudio.play();

    unlockedAudio.pause();
    unlockedAudio.currentTime = 0;
    unlockedAudio.muted = false;

    return {
      success: true
    };
  } catch {
    return {
      success: false,
      message: 'O navegador bloqueou o áudio até haver uma interação com a tela.'
    };
  }
}

export async function playCallSound() {
  const audio = createAudio();

  audio.currentTime = 0;
  audio.volume = 1;

  await audio.play();
}