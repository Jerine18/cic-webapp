import Image from 'next/image'

const photos = Array.from({ length: 10 }, (_, i) => `/images/Photo_${i + 1}.jpg`)

export default function PhotoStrip() {
  // Duplicate the array so the seamless loop works (50% translate = back to start)
  const doubled = [...photos, ...photos]

  return (
    <div className="relative overflow-hidden bg-gray-50 py-8">
      <div className="flex animate-scroll-photos" style={{ width: `${doubled.length * 276}px` }}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 mx-2 overflow-hidden rounded-lg group"
            style={{ width: '260px', height: '260px' }}
          >
            <Image
              src={src}
              alt={`CIC Photo ${(i % 10) + 1}`}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-umak-blue/20 group-hover:bg-transparent transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  )
}
