import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { INITIAL_PROJECTS } from "@/lib/mock-data";

const projectCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string(),
  maxTeamSize: z.number().int().min(2).max(10),
  duration: z.string().min(2),
  experiencePreference: z.enum(["All Levels", "Intermediate+", "Advanced Only"]),
  deadline: z.string().optional(),
  requiredSkills: z
    .array(
      z.object({
        skillName: z.string().min(1),
        weight: z.number().positive(),
        minimumProficiency: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      })
    )
    .min(1, "Must require at least 1 skill"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let filtered = [...INITIAL_PROJECTS];

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.requiredSkills.some((s) => s.skillName.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = projectCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project validated successfully",
      project: {
        id: `proj-${Date.now()}`,
        ...parsed.data,
        status: "Open",
        currentTeamSize: 1,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process project" },
      { status: 500 }
    );
  }
}
