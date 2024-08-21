import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$productSlug')({
  component: ProductPage
})

function ProductPage() {
  const {productSlug} = Route.useParams();

  return (
    <p>{productSlug}</p>
  )
}