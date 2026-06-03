'use client'
import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export function ImageGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const slides = images.map((src) => ({ src }))

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-80">
        {/* รูปหลัก */}
        <div className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => { setIndex(0); setOpen(true) }}>
          <Image src={images[0]} alt="main" fill className="object-cover rounded-lg" />
        </div>
        {/* รูปเล็ก */}
        {images.slice(1, 5).map((src, i) => (
          <div key={i} className="relative cursor-pointer"
            onClick={() => { setIndex(i + 1); setOpen(true) }}>
            <Image src={src} alt={`img-${i}`} fill
              className="object-cover rounded-lg" />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center
                justify-center rounded-lg text-white font-bold">
                +{images.length - 5}
              </div>
            )}
          </div>
        ))}
      </div>
      <Lightbox open={open} close={() => setOpen(false)}
        index={index} slides={slides} />
    </>
  )
}