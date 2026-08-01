import { NextResponse } from "next/server";
import { createSupabaseReadClient } from "@/lib/supabase/public";

type Props = {
  params: Promise<{ assetId: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { assetId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assetId)) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }

  const supabase = createSupabaseReadClient();
  if (!supabase) {
    return NextResponse.json({ error: "Download service is unavailable." }, { status: 503 });
  }

  const { data, error } = await supabase.rpc("get_public_download_asset", { asset_id: assetId });
  const result = Array.isArray(data) ? data[0] : data;
  if (error || !result?.download_url) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }

  let target: URL;
  try {
    target = new URL(result.download_url);
  } catch {
    return NextResponse.json({ error: "Download target is invalid." }, { status: 502 });
  }

  if (target.protocol !== "https:") {
    return NextResponse.json({ error: "Download target is invalid." }, { status: 502 });
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
