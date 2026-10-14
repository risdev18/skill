import { describe, it, expect } from "vitest";
import {
  calculateMatchScore,
  normalizeSkillName,
  validateAndNormalizeWeights,
} from "./matching";
import { RequiredSkill, StudentProfile } from "@/types";

describe("Skill Matching Engine Unit Tests", () => {
  const baseStudent: StudentProfile = {
    id: "student-1",
    fullName: "Alex Rivera",
    email: "alex@college.edu",
    avatarUrl: "",
    college: "State Tech",
    department: "Computer Science",
    academicYear: "3rd Year",
    bio: "Full stack student builder",
    skills: [
      { id: "s1", skillName: "Python", proficiency: 2 },
      { id: "s2", skillName: "SQL", proficiency: 3 },
      { id: "s3", skillName: "React", proficiency: 1 },
    ],
    interests: ["Web", "Data"],
    preferredCategories: ["Data Science"],
    availability: "15+ hrs/week",
    visibility: "public",
    activeProjectsCount: 1,
  };

  it("normalizes skill names across casing and spaces correctly", () => {
    expect(normalizeSkillName("JavaScript")).toBe("javascript");
    expect(normalizeSkillName("  REACT.JS  ")).toBe("react");
    expect(normalizeSkillName("Python 3")).toBe("python 3");
    expect(normalizeSkillName(" Node.js ")).toBe("node");
  });

  it("handles a perfect skill match (100% base coverage)", () => {
    const requiredSkills: RequiredSkill[] = [
      { id: "r1", skillName: "Python", weight: 50, minimumProficiency: 2 },
      { id: "r2", skillName: "SQL", weight: 50, minimumProficiency: 3 },
    ];

    const result = calculateMatchScore(requiredSkills, baseStudent);
    expect(result.baseSkillScore).toBe(100);
    expect(result.missingSkills.length).toBe(0);
    expect(result.underProficientSkills.length).toBe(0);
    expect(result.matchedSkills.length).toBe(2);
    expect(result.matchedSkills[0].isFullyProficient).toBe(true);
    expect(result.matchedSkills[1].isFullyProficient).toBe(true);
    expect(result.explanation).toContain("Outstanding match");
  });

  it("handles a partial skill match when candidate proficiency is lower than required", () => {
    // Student has React at proficiency 1 (Beginner). Required is 3 (Advanced).
    // Proficiency ratio = 1 / 3 = 0.333
    // Contribution = 100 * (1/3) = 33.3
    const requiredSkills: RequiredSkill[] = [
      { id: "r1", skillName: "React", weight: 100, minimumProficiency: 3 },
    ];

    const result = calculateMatchScore(requiredSkills, baseStudent);
    expect(result.baseSkillScore).toBeCloseTo(33.3, 1);
    expect(result.underProficientSkills.length).toBe(1);
    expect(result.underProficientSkills[0].gap).toBe(2);
  });

  it("handles candidate with no matching skills (0% base score)", () => {
    const requiredSkills: RequiredSkill[] = [
      { id: "r1", skillName: "Rust", weight: 50, minimumProficiency: 2 },
      { id: "r2", skillName: "Solidity", weight: 50, minimumProficiency: 2 },
    ];

    const result = calculateMatchScore(requiredSkills, baseStudent);
    expect(result.baseSkillScore).toBe(0);
    expect(result.matchedSkills.length).toBe(0);
    expect(result.missingSkills.length).toBe(2);
    expect(result.explanation).toContain("Low match");
  });

  it("correctly matches skills with different letter casing and whitespace", () => {
    const requiredSkills: RequiredSkill[] = [
      { id: "r1", skillName: "  pYtHon  ", weight: 60, minimumProficiency: 2 },
      { id: "r2", skillName: "sQl", weight: 40, minimumProficiency: 2 },
    ];

    const result = calculateMatchScore(requiredSkills, baseStudent);
    expect(result.baseSkillScore).toBe(100);
    expect(result.missingSkills.length).toBe(0);
  });

  it("validates and normalizes weights when weights don't sum to 100", () => {
    const skills: RequiredSkill[] = [
      { id: "r1", skillName: "Python", weight: 10, minimumProficiency: 2 },
      { id: "r2", skillName: "SQL", weight: 30, minimumProficiency: 2 },
    ];
    // Total raw weight = 40. Normalized: 10/40 = 25%, 30/40 = 75%
    const val = validateAndNormalizeWeights(skills);
    expect(val.isValid).toBe(true);
    expect(val.normalizedWeights?.[0]).toBe(25);
    expect(val.normalizedWeights?.[1]).toBe(75);
  });

  it("rejects zero or negative weights with validation error", () => {
    const skills: RequiredSkill[] = [
      { id: "r1", skillName: "Python", weight: 0, minimumProficiency: 2 },
      { id: "r2", skillName: "SQL", weight: 0, minimumProficiency: 2 },
    ];
    const val = validateAndNormalizeWeights(skills);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain("Every weight is currently zero or invalid");

    expect(() => calculateMatchScore(skills, baseStudent)).toThrow();
  });

  it("handles missing optional fields and fallback safely", () => {
    const studentWithMissing: StudentProfile = {
      ...baseStudent,
      preferredCategories: [],
      skills: [{ id: "s1", skillName: "Python", proficiency: 2 }],
      availability: "Unavailable",
    };

    const requiredSkills: RequiredSkill[] = [
      { id: "r1", skillName: "Python", weight: 10, minimumProficiency: 2 },
    ];

    const result = calculateMatchScore(requiredSkills, studentWithMissing);
    expect(result.baseSkillScore).toBe(100);
    expect(result.bonusScore).toBeLessThanOrEqual(0);
  });
});
