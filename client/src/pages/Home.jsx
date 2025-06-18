import Testimonials from '../components/Testimonials'
import Description from '../components/Description'
import Header from '../components/Header'
import Steps from '../components/Steps'
import React from 'react'
import GenerateButton from '../components/GenerateButton'

const Home = () => {
  return (
    <div>
        <Header />
        <Steps />
        <Description />
        <Testimonials />
        <GenerateButton />
    </div>
  )
}

export default Home