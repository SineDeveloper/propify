'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const fallbackImage = 'https://placehold.co/1200x800.jpg'

export function ImageGallery({ images }: { images: string[] }) {
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)
    const safeImages = images.length ? images : [fallbackImage]
    const slides = safeImages.map((src) => ({ src }))

    return (
        <>
            <div className="grid h-[420px] grid-cols-4 gap-2 overflow-hidden rounded-lg">
                <button
                    type="button"
                    className="relative col-span-4 row-span-2 overflow-hidden bg-zinc-200 md:col-span-2"
                    onClick={() => {
                        setIndex(0)
                        setOpen(true)
                    }}
                >
                    <Image
                        src={safeImages[0]}
                        alt="Property main image"
                        fill
                        priority
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition hover:scale-105"
                    />
                </button>
                {safeImages.slice(1, 5).map((src, i) => (
                    <button
                        key={src}
                        type="button"
                        className="relative hidden overflow-hidden bg-zinc-200 md:block"
                        onClick={() => {
                            setIndex(i + 1)
                            setOpen(true)
                        }}
                    >
                        <Image
                            src={src}
                            alt={`Property image ${i + 2}`}
                            fill
                            sizes="25vw"
                            className="object-cover transition hover:scale-105"
                        />
                        {i === 3 && safeImages.length > 5 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                                +{safeImages.length - 5}
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
        </>
    )
}
