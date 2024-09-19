import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/$vendorID')({
  component: VendorPage,
});

function VendorPage() {
  const { vendorID } = Route.useParams();

  return (
    <div>
      <p>{vendorID}</p>
    </div>
  )
}