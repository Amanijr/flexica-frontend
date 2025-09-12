import Hero from './components/reusables/Hero'
import Categories from './components/reusables/Categories'
import ProductGrid from './components/product/ProductGrid'

export default function Home() {
  return (
    <main>
      <Hero/>
      <Categories/>
      <ProductGrid/>
    </main>
  )
}
