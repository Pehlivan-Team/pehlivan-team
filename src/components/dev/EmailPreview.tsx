"use client"

import React from 'react'

type Props = {
  html: string
}

export default function EmailPreview({ html }: Props) {
  return (
    <div style={{ background: '#f2f4f6', padding: 20 }}>
      {/* render the email HTML directly for preview */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
