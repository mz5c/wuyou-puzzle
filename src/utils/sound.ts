let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
): void {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playMoveSound(difficulty?: 3 | 4 | 5): void {
  const base = difficulty === 5 ? 300 : difficulty === 4 ? 400 : 600
  playTone(base, 0.1, 'sine', 0.12)
  playTone(base * 2, 0.08, 'sine', 0.04)
}

export function playInvalidSound(): void {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, ctx.currentTime)
  osc.frequency.setValueAtTime(80, ctx.currentTime + 0.03)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.06)
}

export function playCompleteSound(): void {
  const ctx = getContext()
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.3)
  })
  // 末尾和弦
  setTimeout(() => {
    ;[262, 330, 392].forEach(freq => playTone(freq, 0.5, 'sine', 0.1))
  }, 650)
}

let bgmInterval: ReturnType<typeof setInterval> | null = null

const MELODY = [262, 294, 330, 349, 392, 349, 330, 294]
const CHORDS: [number, number, number][] = [
  [262, 330, 392],
  [392, 494, 587],
  [220, 262, 330],
  [262, 330, 349],
]

export function startBGM(): void {
  if (bgmInterval) return
  const ctx = getContext()
  let noteIndex = 0
  let chordIndex = 0
  let tick = 0

  bgmInterval = setInterval(() => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(MELODY[noteIndex], ctx.currentTime)
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
    noteIndex = (noteIndex + 1) % MELODY.length

    if (tick % 4 === 0) {
      const chord = CHORDS[chordIndex % CHORDS.length]
      chord.forEach(freq => {
        const chOsc = ctx.createOscillator()
        const chGain = ctx.createGain()
        chOsc.type = 'triangle'
        chOsc.frequency.setValueAtTime(freq, ctx.currentTime)
        chGain.gain.setValueAtTime(0.015, ctx.currentTime)
        chGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8)
        chOsc.connect(chGain)
        chGain.connect(ctx.destination)
        chOsc.start(ctx.currentTime)
        chOsc.stop(ctx.currentTime + 1.8)
      })
      chordIndex++
    }

    tick++
  }, 500)
}

export function stopBGM(): void {
  if (bgmInterval) {
    clearInterval(bgmInterval)
    bgmInterval = null
  }
}
