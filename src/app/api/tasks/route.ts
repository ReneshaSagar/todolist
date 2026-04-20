import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // Access control is now handled on the client-side via Firebase Security Rules.
  // This route is maintained for legacy compatibility or background ops.
  return NextResponse.json({ message: "Task API is now handled via Firestore." });
}

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
