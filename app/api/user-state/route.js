import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userState = cookieStore.get("user-state");

  return Response.json(userState ? JSON.parse(userState.value) : null);
}

export async function POST(request) {
  const data = await request.json();
  const cookieStore = cookies();

  cookieStore.set("user-state", JSON.stringify(data), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return Response.json({ success: true });
}
