import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tasks.map(t => ({
    ...t,
    tags: JSON.parse(t.tags),
    subtasks: JSON.parse(t.subtasks)
  })));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  
  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      title: body.title,
      description: body.description,
      priority: body.priority || "Medium",
      tags: JSON.stringify(body.tags || []),
      xp: body.xp || 20,
      subtasks: JSON.stringify(body.subtasks || [])
    }
  });

  return NextResponse.json({
    ...task,
    tags: JSON.parse(task.tags),
    subtasks: JSON.parse(task.subtasks)
  });
}
