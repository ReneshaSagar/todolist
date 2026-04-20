import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = await params;

  // Flatten nested objects to JSON strings if they exist
  const data: any = { ...body };
  if (data.tags) data.tags = JSON.stringify(data.tags);
  if (data.subtasks) data.subtasks = JSON.stringify(data.subtasks);

  const task = await prisma.task.update({
    where: { id, userId: session.user.id },
    data
  });

  return NextResponse.json({
    ...task,
    tags: JSON.parse(task.tags),
    subtasks: JSON.parse(task.subtasks)
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.task.delete({
    where: { id, userId: session.user.id }
  });

  return NextResponse.json({ success: true });
}
