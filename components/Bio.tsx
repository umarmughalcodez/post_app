"use client"
import React from 'react'
import { Input } from './ui/input'

const Bio = () => {
  return (
    <div>
            <Input type="text" className="mt-2 mb-2" placeholder="Tell about yourself" onClick={() => console.log("Input Clicked")} />
        
    </div>
  )
}

export default Bio