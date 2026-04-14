const ABOUT_BG = '#060e33'   // must match AboutSection background exactly
const SERVICES_BG = '#c4dfe8' // must match ServicesSection background exactly

export default function WaveDivider() {
  return (
    <div
      className="relative w-full overflow-hidden leading-none"
      style={{ height: '120px' }}
    >
      <svg
        className="absolute bottom-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: '120px' }}
      >
        <path
          d="M0,60
             C120,10 240,110 480,60
             C720,10 840,110 960,60
             C1080,10 1200,110 1440,60
             L1440,120 L0,120 Z"
          fill={SERVICES_BG}
        />
      </svg>
    </div>
  )
}
