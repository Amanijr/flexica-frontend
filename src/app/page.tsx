import Image from 'next/image'
import Navbar from './components/layout/navbar'
import Hero from './components/reusables/Hero'
import Categories from './components/reusables/Categories'
import ProductGrid from './components/product/ProductGrid'
import Footer from './components/reusables/Footer'

export default function Home() {
  return (
    <main>
      <>
      <Navbar/>
      <Hero/>
      <Categories/>
      <ProductGrid/>
      <Footer/>
      
      </>
    </main>
  )
}
