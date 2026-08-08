import { redirect } from "next/navigation";

export default async function LandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/explore/${encodeURIComponent(id)}`);
}
