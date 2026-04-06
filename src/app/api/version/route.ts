const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL || "http://localhost:3002";

export const GET = async () => {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/api/version`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return Response.json({ version: null });
    }

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ version: null });
  }
};
