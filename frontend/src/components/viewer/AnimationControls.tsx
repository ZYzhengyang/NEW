import { useState, useEffect } from 'react'

interface AnimationControlsProps {
  animations: { name: string; duration: number }[]
  currentAnimation: number
  onAnimationChange: (index: number) => void
  onPlayPause?: (isPlaying: boolean) => void
  onSpeedChange?: (speed: number) => void
  isPlaying?: boolean
}

const AnimationControls = ({
  animations,
  currentAnimation,
  onAnimationChange,
  onPlayPause,
  onSpeedChange,
  isPlaying = true
}: AnimationControlsProps) => {
  const [playing, setPlaying] = useState(isPlaying)
  const [speed, setSpeed] = useState(1.0)
  const [expanded, setExpanded] = useState(false)

  // 当外部isPlaying状态变化时更新内部状态
  useEffect(() => {
    setPlaying(isPlaying)
  }, [isPlaying])

  const handlePlayPause = () => {
    const newState = !playing
    setPlaying(newState)
    onPlayPause?.(newState)
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    onSpeedChange?.(newSpeed)
  }

  if (animations.length === 0) {
    return <div className="text-center text-gray-500">没有可用的动画</div>
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">动画控制</h3>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {expanded ? (
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* 播放控制 */}
        <button
          onClick={handlePlayPause}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
        >
          {playing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* 当前动画名称 */}
        <div className="text-sm font-medium">
          {currentAnimation >= 0 && currentAnimation < animations.length
            ? animations[currentAnimation].name || `动画 ${currentAnimation + 1}`
            : '无动画'}
        </div>
        
        {/* 速度控制 */}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-gray-500">速度:</span>
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="rounded border border-gray-300 bg-transparent px-1 py-0 text-xs"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* 动画列表 */}
      {expanded && (
        <div className="mt-4 max-h-40 overflow-y-auto border-t pt-3">
          <ul className="space-y-1">
            {animations.map((animation, index) => (
              <li key={index}>
                <button
                  onClick={() => onAnimationChange(index)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    currentAnimation === index
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{animation.name || `动画 ${index + 1}`}</span>
                    <span className="text-xs text-gray-500">
                      {animation.duration.toFixed(1)}s
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AnimationControls 