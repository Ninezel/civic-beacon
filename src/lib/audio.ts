let sharedAudioContext: AudioContext | null = null

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextConstructor = window.AudioContext

  if (!AudioContextConstructor) {
    return null
  }

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextConstructor()
  }

  return sharedAudioContext
}

export async function playAlertTone(volume = 0.45) {
  const context = getAudioContext()

  if (!context) {
    return
  }

  if (context.state === 'suspended') {
    await context.resume()
  }

  const gain = context.createGain()
  const oscillator = context.createOscillator()
  const now = context.currentTime

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(660, now)
  oscillator.frequency.linearRampToValueAtTime(880, now + 0.18)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.02, volume), now + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(now)
  oscillator.stop(now + 0.45)
}
