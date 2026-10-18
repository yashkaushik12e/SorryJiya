import { useMemo, useRef, useState } from 'react'

const params = new URLSearchParams(window.location.search)
// Change these defaults, or use  ?name=Riya&from=Raj  in the link
const NAME = params.get('name') || ''
const FROM = params.get('from') || ''

const STEPS = [
  { e: '🥺', t: 'Please forgive me', s: 'I’m really, truly sorry.' },
  { e: '🧸', t: 'Pretty please?', s: 'I’ll give you all the hugs.' },
  { e: '😢', t: 'Don’t do this to me…', s: 'My heart is already breaking a little.' },
  { e: '😭', t: 'I’m begging you', s: 'I’ll bring chocolates. Lots of them.' },
  { e: '💔', t: 'Just say yes…', s: 'The No button is scared of you anyway.' },
]
const HEARTS = ['💗', '💖', '🌸', '💕', '✨', '🩷']

function BgHearts() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: Math.random() * 100,
        dur: 7 + Math.random() * 8,
        delay: -Math.random() * 12,
        size: 16 + Math.random() * 26,
        icon: HEARTS[i % HEARTS.length],
      })),
    []
  )
  return items.map((o, i) => (
    <span
      key={i}
      className="bg-heart"
      style={{
        left: o.left + '%',
        fontSize: o.size,
        animationDuration: o.dur + 's',
        animationDelay: o.delay + 's',
      }}
    >
      {o.icon}
    </span>
  ))
}

function Burst() {
  const items = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const a = Math.random() * Math.PI * 2
        const r = 140 + Math.random() * 320
        return {
          x: Math.cos(a) * r,
          y: Math.sin(a) * r - 80,
          rot: Math.random() * 720 - 360 + 'deg',
          icon: ['💖', '💗', '🎉', '🌸', '✨', '💕', '🥰'][i % 7],
          delay: Math.random() * 0.25,
        }
      }),
    []
  )
  return items.map((o, i) => (
    <span
      key={i}
      className="burst"
      style={{ '--x': o.x + 'px', '--y': o.y + 'px', '--r': o.rot, animationDelay: o.delay + 's' }}
    >
      {o.icon}
    </span>
  ))
}

export default function App() {
  const [yes, setYes] = useState(false)
  const [tries, setTries] = useState(0)
  const [pos, setPos] = useState(null)
  const noRef = useRef(null)

  const dodge = (e) => {
    if (e && e.cancelable) e.preventDefault()
    const b = noRef.current ? noRef.current.getBoundingClientRect() : { width: 90, height: 52 }
    const pad = 12
    const x = pad + Math.random() * (window.innerWidth - b.width - pad * 2)
    const y = pad + Math.random() * (window.innerHeight - b.height - pad * 2)
    setPos({ x, y })
    setTries((t) => t + 1)
  }

  const step = STEPS[Math.min(tries, STEPS.length - 1)]
  const scale = Math.min(1 + tries * 0.14, 1.9)

  if (yes) {
    return (
      <div className="stage happy">
        <BgHearts />
        <Burst />
        <div className="card">
          <div className="sticker">🥰</div>
          <h1 className="fade">{NAME ? `Thank you, ${NAME}!` : 'Thank you!'}</h1>
          <p className="sub fade">
            "Taras gye aap ke deedar ko, Dil fir Bhi Aap ka intezar karta hai".. "Humse Acha to aap ke ghr ka aiina hai Jo har roz App ka deedar karta hai"
          </p>
          <div className="fade" style={{ fontSize: 34, letterSpacing: 8 }}>🧸💞🌷</div>
          {FROM && (
            <p className="sub fade" style={{ marginTop: 16, marginBottom: 0 }}>
              Forever yours, {FROM}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="stage">
      <BgHearts />
      <div className="card">
        <span className="side" style={{ left: 18, top: 22 }}>🌸</span>
        <span className="side" style={{ right: 18, top: 30, animationDelay: '-1s' }}>💗</span>
        <div key={step.e} className="sticker sad">{step.e}</div>
        <h1>{NAME ? `${step.t}, ${NAME}` : step.t}</h1>
        <p className="sub">{step.s}</p>
        <div className="row">
          <button
            className="yes"
            style={{ transform: `scale(${scale})` }}
            onClick={() => setYes(true)}
          >
            Yes 💖
          </button>
          <button
            ref={noRef}
            className={'no' + (pos ? ' run' : '')}
            style={pos ? { left: pos.x, top: pos.y } : undefined}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            onClick={dodge}
            onFocus={dodge}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
