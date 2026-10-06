import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { DealTypeId } from './flyersOffersData'
import { dealTypes, warehouses } from './flyersOffersData'

const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&-.'
const TICK_MS = 85
const FLAP_MS = 40
const ROW_REFRESH_MS = 8000

/** Deal shown first for each warehouse row, before the board starts cycling. */
const initialDeals: DealTypeId[] = ['monthly', 'bulk', 'weekly']

const charIndex = (c: string) => Math.max(0, CHARSET.indexOf(c.toUpperCase()))

// --- Optional click sound -------------------------------------------------------------------

let audioCtx: AudioContext | null = null
let lastClick = 0

function playClick() {
  if (!audioCtx) return
  const now = audioCtx.currentTime
  if (now - lastClick < 0.03) return
  lastClick = now
  const length = Math.floor(audioCtx.sampleRate * 0.012)
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3
  const source = audioCtx.createBufferSource()
  const gain = audioCtx.createGain()
  gain.gain.value = 0.25
  source.buffer = buffer
  source.connect(gain).connect(audioCtx.destination)
  source.start()
}

// --- Split-flap text ------------------------------------------------------------------------

type FlapState = { cur: number[]; prev: number[]; flips: number[] }

/**
 * Drives a row of split-flap tiles towards `text`. Like a real board, each tile flips forward
 * through the character set one step at a time, starting a little after its left neighbour.
 */
function useSplitFlap(
  text: string,
  length: number,
  startDelay: number,
  sound: React.MutableRefObject<boolean>,
) {
  const reduceMotion = useReducedMotion()
  const target = text.toUpperCase().padEnd(length).slice(0, length)
  const [state, setState] = useState<FlapState>(() => ({
    cur: Array(length).fill(0),
    prev: Array(length).fill(0),
    flips: Array(length).fill(0),
  }))

  useEffect(() => {
    const goal = [...target].map(charIndex)
    if (reduceMotion) {
      setState((s) => ({ cur: goal, prev: goal, flips: s.flips }))
      return undefined
    }

    // Long spins skip ahead to a few characters before the goal (on the tile's first flip),
    // so every tile still flips a handful of times without taking seconds to settle.
    const spins = goal.map(() => 4 + Math.floor(Math.random() * 8))
    const jumped = goal.map(() => false)

    const started = Date.now()
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - started - startDelay
      setState((s) => {
        let changed = false
        const cur = [...s.cur]
        const prev = [...s.prev]
        const flips = [...s.flips]
        for (let i = 0; i < length; i++) {
          if (elapsed < i * 35 || cur[i] === goal[i]) continue
          const distance = (goal[i] - cur[i] + CHARSET.length) % CHARSET.length
          prev[i] = cur[i]
          cur[i] =
            !jumped[i] && distance > spins[i]
              ? (goal[i] - spins[i] + CHARSET.length) % CHARSET.length
              : (cur[i] + 1) % CHARSET.length
          jumped[i] = true
          flips[i] += 1
          changed = true
        }
        if (cur.every((c, i) => c === goal[i])) window.clearInterval(timer)
        if (!changed) return s
        if (sound.current) playClick()
        return { cur, prev, flips }
      })
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [target, length, startDelay, reduceMotion, sound])

  return state
}

function Half(props: { char: string; position: 'top' | 'bottom'; flap?: boolean; delay?: number }) {
  const { char, position, flap, delay = 0 } = props
  const top = position === 'top'
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: top ? 0 : '50%',
        height: '50%',
        overflow: 'hidden',
        bgcolor: top ? '#232323' : '#1b1b1b',
        borderRadius: top ? 'var(--r) var(--r) 0 0' : '0 0 var(--r) var(--r)',
        backfaceVisibility: 'hidden',
        transformOrigin: top ? 'bottom' : 'top',
        ...(flap && {
          zIndex: 2,
          animation: `${top ? 'flapTop' : 'flapBottom'} ${FLAP_MS}ms ${top ? 'ease-in' : 'ease-out'} ${delay}ms both`,
          '@keyframes flapTop': {
            from: { transform: 'perspective(240px) rotateX(0deg)' },
            to: { transform: 'perspective(240px) rotateX(-90deg)' },
          },
          '@keyframes flapBottom': {
            from: { transform: 'perspective(240px) rotateX(90deg)' },
            to: { transform: 'perspective(240px) rotateX(0deg)' },
          },
        }),
      }}
    >
      <Box
        component='span'
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: top ? 0 : 'calc(var(--h) / -2)',
          height: 'var(--h)',
          lineHeight: 'var(--h)',
          textAlign: 'center',
        }}
      >
        {char === ' ' ? ' ' : char}
      </Box>
    </Box>
  )
}

function FlapTile(props: { char: string; prev: string; flipId: number }) {
  const { char, prev, flipId } = props
  return (
    <Box
      aria-hidden
      sx={{
        position: 'relative',
        flexShrink: 0,
        width: 'var(--w)',
        height: 'var(--h)',
        fontSize: 'var(--fs)',
        fontWeight: 700,
        color: 'var(--fg)',
        fontFamily: 'Poppins, sans-serif',
        borderRadius: 'var(--r)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), 0 2px 3px rgba(0,0,0,0.6)',
        // The hinge line across the middle of every flap.
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 'calc(50% - 0.5px)',
          height: '1px',
          bgcolor: 'rgba(0,0,0,0.85)',
          zIndex: 3,
        },
      }}
    >
      <Half char={char} position='top' />
      <Half char={prev} position='bottom' />
      {flipId > 0 && (
        <>
          <Half key={`t${flipId}`} char={prev} position='top' flap />
          <Half key={`b${flipId}`} char={char} position='bottom' flap delay={FLAP_MS} />
        </>
      )}
    </Box>
  )
}

function SplitFlapText(props: {
  text: string
  length: number
  startDelay?: number
  sound: React.MutableRefObject<boolean>
}) {
  const { text, length, startDelay = 0, sound } = props
  const { cur, prev, flips } = useSplitFlap(text, length, startDelay, sound)
  return (
    <Box sx={{ display: 'flex', gap: 'var(--gap)' }}>
      <Box
        component='span'
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      >
        {text}
      </Box>
      {cur.map((c, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <FlapTile key={i} char={CHARSET[c]} prev={CHARSET[prev[i]]} flipId={flips[i]} />
      ))}
    </Box>
  )
}

// --- Board ----------------------------------------------------------------------------------

// Tile sizes are derived from the board's width (container query units), so every row fits.
const titleTiles = {
  '--gap': { xs: '2px', md: '4px' },
  '--w': 'min(58px, calc((100cqw - 14 * var(--gap)) / 15))',
  '--h': 'calc(var(--w) * 1.45)',
  '--fs': 'calc(var(--w) * 0.95)',
  '--r': 'calc(var(--w) * 0.1)',
  '--fg': '#F5F5F5',
}

const rowTiles = {
  '--gap': '2px',
  // Mobile: the deal (18 tiles) is the widest line. Desktop: all 40 tiles plus two column gaps.
  '--w': {
    xs: 'min(18px, calc((100cqw - 17 * 2px) / 18))',
    md: 'min(22px, calc((100cqw - 2 * 16px - 37 * 2px) / 40))',
  },
  '--h': 'calc(var(--w) * 1.6)',
  '--fs': 'calc(var(--w) * 0.9)',
  '--r': '3px',
  '--fg': '#F5F5F5',
}

const WAREHOUSE_LEN = 11
const DEAL_LEN = 18
const STATUS_LEN = 11

const columnLabelSx = {
  fontSize: { xs: '10px', md: '11px' },
  fontWeight: 700,
  letterSpacing: '2px',
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
}

export function DepartureBoard() {
  const sound = useRef(false)
  const [soundOn, setSoundOn] = useState(false)
  const [round, setRound] = useState(0)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString('en-CA', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      )
    update()
    const clockTimer = window.setInterval(update, 10000)
    const roundTimer = window.setInterval(() => setRound((r) => r + 1), ROW_REFRESH_MS)
    return () => {
      window.clearInterval(clockTimer)
      window.clearInterval(roundTimer)
    }
  }, [])

  const toggleSound = () => {
    if (!audioCtx && typeof window !== 'undefined') audioCtx = new AudioContext()
    void audioCtx?.resume()
    sound.current = !sound.current
    setSoundOn(sound.current)
  }

  const dealFor = (rowIndex: number) => {
    const start = dealTypes.findIndex((d) => d.id === initialDeals[rowIndex % initialDeals.length])
    return dealTypes[(start + round) % dealTypes.length]
  }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: { xs: '12px', md: '20px' },
        bgcolor: '#0b0b0b',
        backgroundImage: 'linear-gradient(180deg, #151515 0%, #0b0b0b 100%)',
        border: { xs: '6px solid #1f1f1f', md: '10px solid #1f1f1f' },
        boxShadow: '0 30px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)',
        color: '#fff',
        px: { xs: 1.5, sm: 3, md: 5 },
        py: { xs: 2, md: 4 },
        overflow: 'hidden',
      }}
    >
      {/* Board header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: '#FFD600',
              boxShadow: '0 0 10px #FFD600',
              animation: 'boardBlink 1.4s steps(2, start) infinite',
              '@keyframes boardBlink': { to: { visibility: 'hidden' } },
            }}
          />
          <Typography
            sx={{ ...columnLabelSx, color: '#FFD600', fontSize: { xs: '11px', md: '13px' } }}
          >
            MySupreme · Warehouse deals
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {clock && (
            <Typography
              sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 700,
                color: '#FFD600',
                fontSize: { xs: '13px', md: '16px' },
              }}
            >
              {clock}
            </Typography>
          )}
          <Tooltip title={soundOn ? 'Mute flaps' : 'Hear the flaps'}>
            <IconButton
              size='small'
              onClick={toggleSound}
              aria-label={soundOn ? 'Mute flap sound' : 'Play flap sound'}
              sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
            >
              {soundOn ? <VolumeUpIcon fontSize='small' /> : <VolumeOffIcon fontSize='small' />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ containerType: 'inline-size' }}>
        {/* Title */}
        <Box component='h1' sx={{ m: 0, display: 'flex', justifyContent: 'center', ...titleTiles }}>
          <SplitFlapText text='Flyers & Offers' length={15} startDelay={200} sound={sound} />
        </Box>

        {/* Column labels (desktop) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: 'auto auto auto',
            justifyContent: 'space-between',
            mt: 5,
            mb: 1.5,
            pb: 1,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            ...rowTiles,
          }}
        >
          <Typography
            sx={{ ...columnLabelSx, width: `calc(${WAREHOUSE_LEN} * (var(--w) + var(--gap)))` }}
          >
            Warehouse
          </Typography>
          <Typography
            sx={{ ...columnLabelSx, width: `calc(${DEAL_LEN} * (var(--w) + var(--gap)))` }}
          >
            Deal
          </Typography>
          <Typography
            sx={{ ...columnLabelSx, width: `calc(${STATUS_LEN} * (var(--w) + var(--gap)))` }}
          >
            Status
          </Typography>
        </Box>

        {/* Rows */}
        <Box sx={{ mt: { xs: 3, md: 0 }, display: 'grid', gap: { xs: 2, md: 1.5 }, ...rowTiles }}>
          {warehouses.map((warehouse, index) => {
            const firstDelay = round === 0 ? 1600 + index * 500 : index * 350
            return (
              <Box
                key={warehouse.id}
                sx={{
                  display: 'flex',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  columnGap: 2,
                  rowGap: 0.75,
                  pb: { xs: 2, md: 0 },
                  borderBottom: { xs: '1px solid rgba(255,255,255,0.08)', md: 'none' },
                }}
              >
                <SplitFlapText
                  text={warehouse.name}
                  length={WAREHOUSE_LEN}
                  startDelay={firstDelay}
                  sound={sound}
                />
                <Box sx={{ order: { xs: 3, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
                  <SplitFlapText
                    text={dealFor(index).label}
                    length={DEAL_LEN}
                    startDelay={firstDelay + 150}
                    sound={sound}
                  />
                </Box>
                {/* Status: amber tiles on desktop, a compact blinking label on mobile */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, '--fg': '#FFD600' }}>
                  <SplitFlapText
                    text='Coming soon'
                    length={STATUS_LEN}
                    startDelay={firstDelay + 300}
                    sound={sound}
                  />
                </Box>
                <Typography
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    color: '#FFD600',
                    fontWeight: 800,
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                  }}
                >
                  ● COMING SOON
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
