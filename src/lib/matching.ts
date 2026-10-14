import {
  RequiredSkill,
  StudentProfile,
  StudentSkill,
  SkillProficiency,
  PROFICIENCY_LABELS,
  MatchBreakdown,
  ProjectCategory,
} from "@/types";

/**
 * Normalizes a skill name by trimming whitespace, converting to lowercase,
 * and normalizing common variations (e.g., "react.js" -> "react", "c++" -> "c++").
 */
export function normalizeSkillName(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "")
    .replace(/\s+/g, " ");
}

export interface MatchingValidationResult {
  isValid: boolean;
  error?: string;
  normalizedWeights?: number[];
}

/**
 * Validates and normalizes weights for required skills so they sum to 100%.
 * Throws or returns an error if all weights are zero or invalid.
 */
export function validateAndNormalizeWeights(skills: RequiredSkill[]): MatchingValidationResult {
  if (!skills || skills.length === 0) {
    return { isValid: false, error: "At least one required skill must be specified." };
  }

  const rawWeights = skills.map((s) => (typeof s.weight === "number" && !isNaN(s.weight) ? Math.max(0, s.weight) : 0));
  const totalRawWeight = rawWeights.reduce((acc, w) => acc + w, 0);

  if (totalRawWeight <= 0) {
    return {
      isValid: false,
      error: "Skill weights must be greater than zero. Every weight is currently zero or invalid.",
    };
  }

  // Normalize so sum equals 100
  const normalizedWeights = rawWeights.map((w) => (w / totalRawWeight) * 100);
  return { isValid: true, normalizedWeights };
}

export interface MatchingOptions {
  projectCategory?: ProjectCategory;
  experiencePreference?: "All Levels" | "Intermediate+" | "Advanced Only";
}

/**
 * Calculates candidate compatibility score and generates an explainable breakdown.
 */
export function calculateMatchScore(
  requiredSkills: RequiredSkill[],
  student: StudentProfile,
  options?: MatchingOptions
): MatchBreakdown {
  const validation = validateAndNormalizeWeights(requiredSkills);
  if (!validation.isValid || !validation.normalizedWeights) {
    throw new Error(validation.error || "Invalid required skill configuration.");
  }

  const normalizedWeights = validation.normalizedWeights;

  // Build a lookup map of student's skills by normalized name
  const studentSkillMap = new Map<string, StudentSkill>();
  for (const s of student.skills) {
    const key = normalizeSkillName(s.skillName);
    // If student has duplicate, keep the highest proficiency
    if (studentSkillMap.has(key)) {
      const existing = studentSkillMap.get(key)!;
      if (s.proficiency > existing.proficiency) {
        studentSkillMap.set(key, s);
      }
    } else {
      studentSkillMap.set(key, s);
    }
  }

  let baseSkillScore = 0;
  const matchedSkills: MatchBreakdown["matchedSkills"] = [];
  const underProficientSkills: MatchBreakdown["underProficientSkills"] = [];
  const missingSkills: MatchBreakdown["missingSkills"] = [];
  const reasons: string[] = [];
  const suggestions: string[] = [];

  // Iterate over required skills
  requiredSkills.forEach((req, idx) => {
    const normalizedReqName = normalizeSkillName(req.skillName);
    const normalizedWeight = normalizedWeights[idx];
    const studentSkill = studentSkillMap.get(normalizedReqName);

    const minProf: SkillProficiency = (
      [1, 2, 3].includes(req.minimumProficiency) ? req.minimumProficiency : 1
    ) as SkillProficiency;

    if (!studentSkill) {
      // Candidate missing required skill
      missingSkills.push({
        skillName: req.skillName,
        weight: Math.round(normalizedWeight * 10) / 10,
        requiredProficiency: minProf,
      });
    } else {
      const studProf: SkillProficiency = (
        [1, 2, 3].includes(studentSkill.proficiency) ? studentSkill.proficiency : 1
      ) as SkillProficiency;

      // Ratio = min(studentProficiency / minimumRequiredProficiency, 1)
      const proficiencyRatio = Math.min(studProf / minProf, 1);
      const skillContribution = normalizedWeight * proficiencyRatio;
      baseSkillScore += skillContribution;

      matchedSkills.push({
        skillName: req.skillName,
        studentProficiency: studProf,
        requiredProficiency: minProf,
        contribution: Math.round(skillContribution * 10) / 10,
        weight: Math.round(normalizedWeight * 10) / 10,
        isFullyProficient: studProf >= minProf,
      });

      if (studProf < minProf) {
        underProficientSkills.push({
          skillName: req.skillName,
          studentProficiency: studProf,
          requiredProficiency: minProf,
          gap: minProf - studProf,
        });
      }
    }
  });

  // Clamp base skill score between 0 and 100
  baseSkillScore = Math.min(100, Math.max(0, Math.round(baseSkillScore * 10) / 10));

  // Transparent bounded bonus adjustments (max 10 points total):
  let bonusScore = 0;

  // 1. Availability bonus (+0 to 4 pts)
  let availabilityBonus = 0;
  if (student.availability === "15+ hrs/week") {
    availabilityBonus = 4;
    reasons.push("High weekly availability (15+ hrs/week) supports project velocity.");
  } else if (student.availability === "10-15 hrs/week") {
    availabilityBonus = 2.5;
    reasons.push("Solid availability commitment (10-15 hrs/week).");
  } else if (student.availability === "Unavailable") {
    availabilityBonus = -5;
    suggestions.push("Candidate is currently marked as unavailable for new teams.");
  }

  // 2. Category interest match (+0 to 3 pts)
  let categoryMatch = false;
  if (options?.projectCategory && student.preferredCategories?.includes(options.projectCategory)) {
    categoryMatch = true;
    bonusScore += 3;
    reasons.push(`Direct interest in '${options.projectCategory}' projects.`);
  }

  // 3. Experience alignment (+0 to 3 pts)
  if (options?.experiencePreference) {
    if (options.experiencePreference === "All Levels") {
      bonusScore += 2;
    } else if (options.experiencePreference === "Intermediate+") {
      if (student.academicYear === "3rd Year" || student.academicYear === "4th Year" || student.academicYear === "Graduate") {
        bonusScore += 3;
        reasons.push(`Upper-year academic seniority (${student.academicYear}) matches intermediate+ expectation.`);
      }
    } else if (options.experiencePreference === "Advanced Only") {
      if (student.academicYear === "4th Year" || student.academicYear === "Graduate") {
        bonusScore += 3;
      } else {
        suggestions.push("Project prefers advanced candidates; verify practical project experience.");
      }
    }
  }

  bonusScore = Math.max(-5, Math.min(10, bonusScore + availabilityBonus));

  // Overall score: base skill score + bounded bonus clamped to 100
  const overallScore = Math.min(100, Math.max(0, Math.round((baseSkillScore + bonusScore) * 10) / 10));

  // Synthesize explainable dynamic natural language summary
  const strongMatches = matchedSkills.filter((s) => s.isFullyProficient);
  let explanation = "";

  if (overallScore >= 80) {
    const skillList = strongMatches
      .slice(0, 3)
      .map((s) => `${PROFICIENCY_LABELS[s.studentProficiency]} ${s.skillName}`)
      .join(", ");
    explanation = `Outstanding match: Candidate possesses ${skillList || "critical skills"}, covering ${Math.round(
      baseSkillScore
    )}% of the weighted skill requirements with strong availability.`;
  } else if (overallScore >= 60) {
    const coveredPercent = Math.round(baseSkillScore);
    const keyMatched = matchedSkills.map((m) => m.skillName).slice(0, 2).join(" & ");
    explanation = `Solid match: Candidate covers ${coveredPercent}% of technical requirements with proficiency in ${keyMatched}.`;
  } else if (overallScore >= 35) {
    const missingNames = missingSkills.map((m) => m.skillName).slice(0, 2).join(", ");
    explanation = `Moderate match: Covers ${Math.round(baseSkillScore)}% of base requirements, but team will need complementary members for ${missingNames || "missing areas"}.`;
  } else {
    explanation = `Low match (${Math.round(baseSkillScore)}% coverage): Minimal overlap with project skill requirements.`;
  }

  // Detailed suggestions
  if (underProficientSkills.length > 0) {
    const under = underProficientSkills
      .map((u) => `${u.skillName} (Current: ${PROFICIENCY_LABELS[u.studentProficiency]}, Required: ${PROFICIENCY_LABELS[u.requiredProficiency]})`)
      .join("; ");
    suggestions.push(`Skills below required proficiency: ${under}`);
  }

  if (missingSkills.length > 0) {
    const missing = missingSkills.map((m) => `${m.skillName} (${m.weight}% weight)`).join(", ");
    suggestions.push(`Missing requirements: ${missing}`);
  }

  return {
    studentId: student.id,
    studentName: student.fullName,
    overallScore,
    baseSkillScore,
    bonusScore,
    normalizedWeightsTotal: 100,
    matchedSkills,
    underProficientSkills,
    missingSkills,
    reasons,
    suggestions,
    explanation,
    availability: student.availability,
    categoryMatch,
  };
}

/**
 * Ranks an array of students against a project's required skills.
 */
export function rankStudentsForProject(
  requiredSkills: RequiredSkill[],
  students: StudentProfile[],
  options?: MatchingOptions
): MatchBreakdown[] {
  return students
    .map((student) => calculateMatchScore(requiredSkills, student, options))
    .sort((a, b) => b.overallScore - a.overallScore);
}
