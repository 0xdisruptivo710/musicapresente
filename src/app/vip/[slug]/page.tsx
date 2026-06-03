import { notFound } from "next/navigation";
import { makeGetTributePageUseCase } from "@/infra/composition/factories";
import { toTributePageDTO, type TributePageDTO } from "@/shared/api/tribute-presenter";
import { TributeView } from "@/features/tribute/components/tribute-view";
import { DEMO_TRIBUTE } from "@/features/tribute/demo";

/** Página de Homenagem VIP pública. Slug "exemplo" mostra a demo de venda. */
export default async function VipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let data: TributePageDTO | null = null;
  if (slug === "exemplo") {
    data = DEMO_TRIBUTE;
  } else {
    const result = await makeGetTributePageUseCase().execute({ slug });
    data = result ? toTributePageDTO(result.page, result.audioUrl) : null;
  }

  if (!data) notFound();
  return <TributeView data={data} />;
}
