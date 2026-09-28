import type { Student, Course, Enrollment } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    status: "Active",
    enrolledCourses: [],
    enrolledCoursesCode: [],
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    // courses: ["261207", "261497"],
    status: "Active",
    enrolledCourses: ["261207", "261497"],
    enrolledCoursesCode: ["CPE301", "CPE302"],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    // courses: ["269101", "261497"],
    status: "Active",
    enrolledCourses: ["269101", "261497"],
    enrolledCoursesCode: ["ISNE101", "CPE302"],
  },
];

export const courses: Course[] = [
  {
    courseId: "123456",
    courseCode: "CS101",
    courseTitle: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseId: "676767",
    courseCode: "CS201",
    courseTitle: "Data Structures",
    instructors: ["Chanadda"],
  },
  {
    courseId: "261207",
    courseCode: "CPE301",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseId: "261497",
    courseCode: "CPE302",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseId: "269101",
    courseCode: "ISNE101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
];

export const enrollments: Enrollment[] = [
  { studentId: "650610002", courseId: "261207" },
  { studentId: "650610002", courseId: "261497" },
  { studentId: "650610003", courseId: "269101" },
  { studentId: "650610003", courseId: "261497" },
];

export const CURRENT_STUDENT_ID = "650610002";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;
