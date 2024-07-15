import { createUserData } from "@/backend/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return new Response("Hi Server is Running");
  } catch (e) {}
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { status } = await createUserData(formData);

    return NextResponse.json({ message: "Hi Server is Running" }, { status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
