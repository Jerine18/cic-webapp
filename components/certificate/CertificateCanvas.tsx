'use client'

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import NextImage from 'next/image'
import { CertificateTemplate, TextElement, ImageElement } from '@/types/certificates'

interface CertificateCanvasProps {
  template: CertificateTemplate
  textElements: TextElement[]
  imageElements: ImageElement[]
  selectedElement: string | null
  onSelectElement: (id: string, type: 'text' | 'image') => void
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void
  onUpdateImageElement: (id: string, updates: Partial<ImageElement>) => void
}

interface DraggableElementProps {
  id: string
  position: { x: number; y: number }
  onDrag: (x: number, y: number) => void
  onSelect: () => void
  isSelected: boolean
  children: React.ReactNode
}

function DraggableElement({
  id,
  position,
  onDrag,
  onSelect,
  isSelected,
  children
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    onSelect()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        onDrag(Math.max(0, newX), Math.max(0, newY))
      }
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onDrag])

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
        padding: '4px',
        zIndex: isSelected ? 10 : 1
      }}
    >
      {children}
    </div>
  )
}

const CertificateCanvas = forwardRef<HTMLCanvasElement, CertificateCanvasProps>(({
  template,
  textElements,
  imageElements,
  selectedElement,
  onSelectElement,
  onUpdateTextElement,
  onUpdateImageElement
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Expose canvas ref to parent
  useImperativeHandle(ref, () => canvasRef.current!)

  useEffect(() => {
    renderCanvas()
  }, [template, textElements, imageElements])

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const scaleToFit = containerWidth / template.width
      setScale(Math.min(scaleToFit, 1))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [template.width])

  const renderCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = template.width
    canvas.height = template.height

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, template.width, template.height)

      imageElements.forEach((element) => {
        const imgEl = new Image()
        imgEl.crossOrigin = 'anonymous'
        imgEl.src = element.src
        imgEl.onload = () => {
          ctx.drawImage(
            imgEl,
            element.position.x,
            element.position.y,
            element.width,
            element.height
          )
        }
      })

      textElements.forEach((element) => {
        ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`
        ctx.fillStyle = element.color
        ctx.textAlign = element.textAlign
        ctx.textBaseline = 'top'
        ctx.fillText(element.text, element.position.x, element.position.y)
      })
    }
    img.src = template.backgroundImage
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="relative mx-auto"
        style={{
          width: template.width * scale,
          height: template.height * scale
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />

        <div
          className="absolute top-0 left-0"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          {textElements.map((element) => (
            <DraggableElement
              key={element.id}
              id={element.id}
              position={element.position}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id, 'text')}
              onDrag={(x, y) =>
                onUpdateTextElement(element.id, { position: { x, y } })
              }
            >
              <span
                style={{
                  fontFamily: element.fontFamily,
                  fontSize: element.fontSize,
                  color: element.color,
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  whiteSpace: 'nowrap'
                }}
              >
                {element.text || 'Text'}
              </span>
            </DraggableElement>
          ))}

          {imageElements.map((element) => (
            <DraggableElement
              key={element.id}
              id={element.id}
              position={element.position}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id, 'image')}
              onDrag={(x, y) =>
                onUpdateImageElement(element.id, { position: { x, y } })
              }
            >
              <NextImage
                src={element.src}
                alt="Certificate element"
                width={element.width}
                height={element.height}
                unoptimized
                style={{
                  width: element.width,
                  height: element.height,
                  pointerEvents: 'none',
                }}
              />
            </DraggableElement>
          ))}
        </div>
      </div>
    </div>
  )
})

CertificateCanvas.displayName = 'CertificateCanvas'

export default CertificateCanvas
