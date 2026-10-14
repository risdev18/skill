import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateMatchScore, rankStudentsForProject } from "@/lib/matching";
import { RequiredSkill, StudentProfile } from "@/types";

const requiredSkillSchema = z.object({
  id: z.string().optional(),
  skillName: z.string().min(1, "Skill name is required"),
  weight: z.number().nonnegative("Weight must be non-negative"),
  minimumProficiency: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

const matchingRequestSchema = z.object({
  requiredSkills: z.array(requiredSkillSchema).min(1, "At least one required skill must be provided"),
  student: z.any().optional(),
  students: z.array(z.any()).optional(),
  options: z
    .object({
      projectCategory: z.string().optional(),
      experiencePreference: z.enum(["All Levels", "Intermediate+", "Advanced Only"]).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = matchingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { requiredSkills, student, students, options } = parsed.data;

    // Single student evaluation
    if (student) {
      const match = calculateMatchScore(
        requiredSkills as RequiredSkill[],
        student as StudentProfile,
        options as any
      );
      return NextResponse.json({ success: true, data: match });
    }

    // Multiple student ranking
    if (students && Array.isArray(students)) {
      const ranked = rankStudentsForProject(
        requiredSkills as RequiredSkill[],
        students as StudentProfile[],
        options as any
      );
      return NextResponse.json({ success: true, data: ranked });
    }

    return NextResponse.json(
      { error: "Must provide either 'student' or 'students' in request body." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during matching" },
      { status: 500 }
    );
  }
}
