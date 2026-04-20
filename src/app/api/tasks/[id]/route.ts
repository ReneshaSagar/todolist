import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: "Patching is now handled via Firestore SDK on the client." });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: "Deletion is now handled via Firestore SDK on the client." });
}
