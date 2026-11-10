import Link from 'next/link'
import { ProductDetails } from '../../../features/products'

export interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  return (
    <div className="section">
      <Link href="/shop" className="text-link back-link">
        ← Back to the shop
      </Link>
      <ProductDetails id={id} />
    </div>
  )
}
