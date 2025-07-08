'use client';

export function AnimatedBackground() {
  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none'>
      {/* Main soft background using only blue and orange tones */}
      <div
        className='absolute inset-0'
        style={{
          background: `linear-gradient(135deg, 
            rgba(2,8,44,0.02) 0%, 
            rgba(243,70,2,0.01) 25%, 
            rgba(2,8,44,0.01) 50%, 
            rgba(243,70,2,0.02) 75%, 
            rgba(2,8,44,0.02) 100%
          )`,
        }}
      ></div>

      {/* Warm overlay gradients using only your colors */}
      <div
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle at 20% 20%, rgba(243,70,2,0.03) 0%, transparent 50%)`,
        }}
      ></div>
      <div
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle at 80% 80%, rgba(2,8,44,0.02) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Floating geometric shapes using only blue and orange */}
      <div
        className='absolute top-20 left-10 w-4 h-4 rotate-45 animate-float'
        style={{ backgroundColor: 'rgba(243,70,2,0.15)' }}
      ></div>
      <div
        className='absolute top-40 right-20 w-6 h-6 rounded-full animate-float delay-1000'
        style={{ backgroundColor: 'rgba(2,8,44,0.1)' }}
      ></div>
      <div
        className='absolute bottom-40 left-20 w-3 h-3 animate-float delay-2000'
        style={{ backgroundColor: 'rgba(243,70,2,0.2)' }}
      ></div>
      <div
        className='absolute bottom-20 right-40 w-5 h-5 rotate-12 animate-float delay-3000'
        style={{ backgroundColor: 'rgba(2,8,44,0.08)' }}
      ></div>
      <div
        className='absolute top-60 left-1/3 w-2 h-2 rounded-full animate-float delay-4000'
        style={{ backgroundColor: 'rgba(243,70,2,0.25)' }}
      ></div>
      <div
        className='absolute bottom-60 right-1/3 w-3 h-3 rotate-45 animate-float delay-5000'
        style={{ backgroundColor: 'rgba(2,8,44,0.12)' }}
      ></div>

      {/* Animated gradient orbs using only your colors */}
      <div
        className='absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-8 animate-glow'
        style={{
          background: 'radial-gradient(circle, #F34602 0%, transparent 70%)',
        }}
      ></div>
      <div
        className='absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full opacity-6 animate-glow delay-1500'
        style={{
          background: 'radial-gradient(circle, #02082C 0%, transparent 70%)',
        }}
      ></div>
      <div
        className='absolute top-1/2 right-1/6 w-24 h-24 rounded-full opacity-7 animate-glow delay-3000'
        style={{
          background: 'radial-gradient(circle, #F34602 0%, transparent 80%)',
        }}
      ></div>

      {/* Subtle texture pattern */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
               linear-gradient(rgba(2,8,44,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(2,8,44,0.1) 1px, transparent 1px)
             `,
          backgroundSize: '80px 80px',
        }}
      ></div>

      {/* Organic flowing shapes using only your colors */}
      <div className='absolute top-0 left-0 w-full h-full'>
        <svg
          className='absolute inset-0 w-full h-full'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <pattern
              id='organic'
              x='0'
              y='0'
              width='200'
              height='200'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M0,100 Q50,80 100,100 T200,100'
                stroke='rgba(243,70,2,0.04)'
                strokeWidth='2'
                fill='none'
              />
              <path
                d='M0,120 Q50,140 100,120 T200,120'
                stroke='rgba(2,8,44,0.03)'
                strokeWidth='1'
                fill='none'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#organic)' />
        </svg>
      </div>

      {/* Soft vignette effect using blue tones */}
      <div
        className='absolute inset-0'
        style={{
          background: `radial-gradient(circle, transparent 0%, rgba(2,8,44,0.02) 100%)`,
        }}
      ></div>
    </div>
  );
}
