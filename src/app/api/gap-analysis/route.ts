import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeTeamSkillGaps } from "@/lib/gap-analyzer";
import { RequiredSkill, TeamMember } from "@/types";

const gapAnalysisSchema = z.object({
  projectId: z.string(),
  projectTitle: z.string(),
  requiredSkills: z.array(
    z.object({
      id: z.string().optional(),
      skillName: z.string().min(1),
      weight: z.number().nonnegative(),
      minimumProficiency: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    })
  ),
  teamMembers: z.array(z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = gapAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { projectId, projectTitle, requiredSkills, teamMembers } = parsed.data;

    const report = analyzeTeamSkillGaps(
      projectId,
      projectTitle,
      requiredSkills as RequiredSkill[],
      teamMembers as TeamMember[]
    );

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during gap analysis" },
      { status: 500 }
    );
  }
}
