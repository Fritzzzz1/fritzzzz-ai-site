let audioContext: AudioContext | null = null

function getAudioContext() {
  audioContext ??= new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

export function playPageRustle() {
  try {
    const ctx = getAudioContext()
    const duration = 0.55
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      const swell = Math.pow(Math.sin(Math.PI * t), 1.6)
      data[i] = (Math.random() * 2 - 1) * swell
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.Q.value = 0.4
    filter.frequency.setValueAtTime(900, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.25)
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + duration)
    const gain = ctx.createGain()
    gain.gain.value = 0.11
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch {
    /* the flip still happens silently */
  }
}

export function playZoomTick(direction: 1 | -1) {
  try {
    const ctx = getAudioContext()
    const duration = 0.12
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 2)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.Q.value = 0.5
    filter.frequency.value = direction === 1 ? 1100 : 750
    const gain = ctx.createGain()
    gain.gain.value = 0.05
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch {
    /* the zoom still happens silently */
  }
}
