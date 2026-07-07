'use client'

import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Demo from '@/components/Demo'
import Projects from '@/components/Projects'
import React from 'react'

const Page = () => {
  return (
    <>
      <div id="acasa"><Hero /></div>
      <div id="despre"><About /></div>
      <div id="proiecte"><Projects /></div>
      <div id="abonamente"><Demo /></div>
      <div id="contact"><Contact /></div>
      <Footer />
    </>
  )
}

export default Page
