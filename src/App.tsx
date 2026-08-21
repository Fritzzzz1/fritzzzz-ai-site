import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ResultStrip } from './components/ResultStrip'
import { Problems } from './components/Problems'
import { Method } from './components/Method'
import { Why } from './components/Why'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ResultStrip />
        <Problems />
        <Method />
        <Why />
        <Cta />
      </main>
      <Footer />
    </>
  )
}

export default App
