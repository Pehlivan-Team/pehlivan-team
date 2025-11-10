"use client"

import Image from 'next/image'
import React from 'react'

type Props = {
    src?: string | null
    alt?: string
    fill?: boolean
    width?: number
    height?: number
    className?: string
    fallback?: React.ReactNode
}

export default function ImageWrapper({
    src,
    alt = '',
    fill = false,
    width,
    height,
    className = '',
    fallback = null,
}: Props) {
    if (!src) {
        return (
            <div
                className={`bg-slate-800/40 flex items-center justify-center text-sm text-slate-400 ${className}`}
            >
                {fallback || <span className="px-2">No image</span>}
            </div>
        )
    }

    // Use `fill` when parent is positioned and has fixed size (common in admin cards)
    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <Image src={src} alt={alt} fill className="object-cover" />
            </div>
        )
    }

    // When not using `fill`, prefer a native <img> if explicit width/height aren't provided.
    // next/image requires width/height unless `fill` is used; using a plain <img>
    // avoids the Next.js warning for small admin previews and respects CSS sizing.
    if (!width || !height) {
        return (
            <div className={className}>
                <img src={src} alt={alt} className={`object-cover w-full h-full`} />
            </div>
        )
    }

    return <Image src={src} alt={alt} width={width} height={height} className={className} />
}
