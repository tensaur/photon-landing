import SmoothScroll from './components/SmoothScroll.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/sections/Hero.jsx'
import IndustryContext from './components/sections/IndustryContext.jsx'
import Dashboard from './components/sections/Dashboard.jsx'
import CTA from './components/sections/CTA.jsx'
import Footer from './components/sections/Footer.jsx'

export default function App() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <IndustryContext />
        <Dashboard />
        <CTA />
        <Footer />
      </main>
      <CustomCursor />
      <div className="film-grain" aria-hidden />
    </SmoothScroll>
  )
}
