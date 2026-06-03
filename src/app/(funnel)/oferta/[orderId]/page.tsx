import { OfferView } from "@/features/offer/components/offer-view";

/** Página de oferta/redirecionamento após a prévia. Controller fino. */
export default async function OfferPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OfferView orderId={orderId} />;
}
