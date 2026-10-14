import { NextRequest, NextResponse } from "next/server";
import { INITIAL_STUDENTS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const year = searchParams.get("year");
  const availability = searchParams.get("availability");
  const skill = searchParams.get("skill");

  let list = [...INITIAL_STUDENTS];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.skillName.toLowerCase().includes(q))
    );
  }

  if (year && year !== "All") {
    list = list.filter((s) => s.academicYear === year);
  }

  if (availability && availability !== "All") {
    list = list.filter((s) => s.availability === availability);
  }

  if (skill) {
    const skLower = skill.toLowerCase();
    list = list.filter((s) =>
      s.skills.some((sk) => sk.skillName.toLowerCase() === skLower)
    );
  }

  return NextResponse.json({ success: true, count: list.length, data: list });
}
