import React from 'react'
import {Studio} from 'sanity'
import config from '../../sanity.config'

export default function Admin() {
  return (
    <div className="pointer-events-auto min-h-screen bg-neutral-950">
      {/* basePath = route où tu montes le Studio */}
      <Studio config={config} basePath="/admin" />
    </div>
  )
}
