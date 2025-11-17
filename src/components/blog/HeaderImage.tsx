"use client"
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

interface Props {
    src?: string | null
    alt?: string
}

export default function HeaderImage({ src, alt }: Props) {
    const [shrunk, setShrunk] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        let ticking = false
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY || 0
                    setShrunk(y > 220)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!src) return null

    const largeClass = 'relative w-full overflow-hidden rounded-lg mb-6 transition-all duration-200 max-h-[560px]'
    const smallPlaceholderClass = 'w-full mb-6 transition-all duration-200'

    // always render an in-place container; when shrunk we render a small placeholder
    const inPlaceContainer = (
        <div aria-hidden={shrunk} className={shrunk ? smallPlaceholderClass : largeClass}>
            {!shrunk ? (
                <Image src={src} alt={alt ?? ''} width={600} height={600} className="object-fill w-full h-full aspect-auto" sizes="50vw" />
            ) : (
                // small reserved space to avoid layout shift when the image is portaled
                <div style={{ height: 200 }} className="w-full bg-transparent" />
            )}
        </div>
    )

    if (!mounted) return inPlaceContainer

    const target = document.getElementById('aside-image-slot')
    if (shrunk && target) {
        // render a small version into the aside slot while keeping the placeholder in place
        const portal = createPortal(
            <div className="w-full flex justify-center lg:justify-start">
                <div className="w-36 overflow-hidden rounded-md border border-slate-700 shadow-sm">
                    <Image src={src} alt={alt ?? ''} width={300} height={180} className="object-cover w-full h-full" />
                </div>
            </div>,
            target
        )
        return (
            <>
                {inPlaceContainer}
                {portal}
            </>
        )
    }

    return inPlaceContainer
}
