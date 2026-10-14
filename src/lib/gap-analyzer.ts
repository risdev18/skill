import {
  RequiredSkill,
  TeamMember,
  TeamSkillGapReport,
  SkillProficiency,
  PROFICIENCY_LABELS,
} from "@/types";
import { normalizeSkillName, validateAndNormalizeWeights } from "./matching";

/**
 * Analyzes team capabilities vs project requirements.
 * Team's effective proficiency for each skill is defined by the maximum declared proficiency
 * among all current members.
 */
export function analyzeTeamSkillGaps(
  projectId: string,
  projectTitle: string,
  requiredSkills: RequiredSkill[],
  teamMembers: TeamMember[]
): TeamSkillGapReport {
  const validation = validateAndNormalizeWeights(requiredSkills);
  const normalizedWeights = validation.normalizedWeights || requiredSkills.map(() => 100 / requiredSkills.length);

  let coveredCount = 0;
  let partiallyCoveredCount = 0;
  let missingCount = 0;

  const skillsAnalysis: TeamSkillGapReport["skillsAnalysis"] = [];

  requiredSkills.forEach((req, idx) => {
    const normalizedReqName = normalizeSkillName(req.skillName);
    const weight = Math.round(normalizedWeights[idx] * 10) / 10;
    const minRequired = req.minimumProficiency;

    // Find all team members who possess this skill
    const membersWithSkill: {
      studentId: string;
      studentName: string;
      proficiency: SkillProficiency;
    }[] = [];

    let highestProficiency: SkillProficiency | 0 = 0;

    teamMembers.forEach((member) => {
      const match = member.student.skills.find(
        (s) => normalizeSkillName(s.skillName) === normalizedReqName
      );
      if (match) {
        membersWithSkill.push({
          studentId: member.studentId,
          studentName: member.student.fullName,
          proficiency: match.proficiency,
        });
        if (match.proficiency > highestProficiency) {
          highestProficiency = match.proficiency;
        }
      }
    });

    let status: "covered" | "partially_covered" | "missing" = "missing";

    if (highestProficiency === 0) {
      status = "missing";
      missingCount++;
    } else if (highestProficiency >= minRequired) {
      status = "covered";
      coveredCount++;
    } else {
      status = "partially_covered";
      partiallyCoveredCount++;
    }

    skillsAnalysis.push({
      skillName: req.skillName,
      weight,
      requiredProficiency: minRequired,
      teamEffectiveProficiency: highestProficiency,
      status,
      membersWithSkill,
    });
  });

  const totalRequiredSkills = requiredSkills.length;
  const coveragePercentage =
    totalRequiredSkills > 0
      ? Math.round((coveredCount / totalRequiredSkills) * 100)
      : 0;

  // Synthesize dynamic recommendations based on gap calculations
  const recommendations: string[] = [];

  const completelyMissing = skillsAnalysis.filter((s) => s.status === "missing");
  const partiallyCovered = skillsAnalysis.filter((s) => s.status === "partially_covered");
  const covered = skillsAnalysis.filter((s) => s.status === "covered");

  if (completelyMissing.length > 0) {
    const missingList = completelyMissing
      .map((s) => `${PROFICIENCY_LABELS[s.requiredProficiency]} in ${s.skillName} (${s.weight}% priority)`)
      .join(", ");
    recommendations.push(
      `Priority Recruitment Needed: The team has zero coverage for: ${missingList}. Use the Skill Matching Engine to find candidate specialists.`
    );
  }

  if (partiallyCovered.length > 0) {
    const partialList = partiallyCovered
      .map(
        (s) =>
          `${s.skillName} (Current: ${PROFICIENCY_LABELS[s.teamEffectiveProficiency as SkillProficiency]}, Needs: ${PROFICIENCY_LABELS[s.requiredProficiency]})`
      )
      .join(", ");
    recommendations.push(
      `Proficiency Upgrade Recommended: Team members have entry-level exposure to: ${partialList}. Look for an advanced contributor or mentor.`
    );
  }

  if (covered.length > 0 && completelyMissing.length === 0 && partiallyCovered.length === 0) {
    recommendations.push(
      `Excellent Team Balance: All ${totalRequiredSkills} project-required technical competencies are fully met by the current roster.`
    );
  } else if (covered.length > 0) {
    const coveredNames = covered.map((c) => c.skillName).join(", ");
    recommendations.push(
      `Strong Core Competency: Solid coverage achieved for ${coveredNames}.`
    );
  }

  return {
    projectId,
    projectTitle,
    totalRequiredSkills,
    coveredCount,
    partiallyCoveredCount,
    missingCount,
    coveragePercentage,
    skillsAnalysis,
    recommendations,
  };
}
