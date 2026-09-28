import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
  // enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

const MakeToCourseCodes = (student: Student, courses: Course[]): Student => {
  const uniCodes: string[] = [];

  for(let i=0;i<student.enrolledCourses.length;i++){
    const courseId = student.enrolledCourses[i];
    let found;
    for(let j=0;j<courses.length;j++){
      if(courses[j].courseId === courseId){
        found = courses[j];
        break;
      }
    }
    if(found && found.courseCode && !uniCodes.includes(found.courseCode)) uniCodes.push(found.courseCode);
  }

  return{
    ...student,
    enrolledCoursesCode: uniCodes,
  };
};


type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  // enrollments: Enrollment[];
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  // enroll: (studentId: string, courseId: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  // drop: (studentId: string, courseId: string) => void;

  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string) => void;
  
  addCourse: (course: Course) => void;

  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  // removeCourseInStudent = (student: string[], courseId: string) => void;
  removeCourse: (courseId: string) => void;

  addEnrollCourse: (studentId: string, courseId: string) => void;
  removeEnrollCourse: (studentId: string, courseId: string) => void;

  removeInstructor: (courseId: string, instructorsname: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents.map((student) => MakeToCourseCodes(student, initialCourses)),
      courses: initialCourses,
      // enrollments: initialEnrollments,

  // enroll: (studentId, courseId) =>
  //   set((state) => ({
  //     enrollments: state.enrollments.some(
  //       (e) => e.studentId === studentId && e.courseId === courseId,
  //     )
  //       ? state.enrollments
  //       : [...state.enrollments, { studentId, courseId }],
  //   })),

  // drop: (studentId, courseId) =>
  //   set((state) => ({
  //     enrollments: state.enrollments.filter(
  //       (e) => !(e.studentId === studentId && e.courseId === courseId),
  //     ),
  //   })),

  removeStudent: (studentId) =>
    set((state) => ({
      students:
        state.students.filter((student) => student.studentId !== studentId),
    })),

  addCourse: (course) =>
    set((state) => ({
      courses: 
        [...state.courses, course],
    })),

  // removeCourseFromStudent = (student, courseId) => ({
  //   ...student,
  //   enrolledCourses : student.enrolledCourses.filter((id) => id !== courseId),
  // });

  removeCourse: (courseId) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.courseId !== courseId),
      students: state.students.map((student) => {
        const nextStudent = {
          ...student,
          enrolledCourses: student.enrolledCourses.filter(
            (enrolledCourseId) => enrolledCourseId !== courseId,
          ),
        };

        return MakeToCourseCodes(nextStudent, state.courses.filter((course) => course.courseId !== courseId));
      }),
    })),

  addEnrollCourse: (studentId, courseId) =>
    set((state) => ({
      students: state.students.map((student) => {
        if (student.studentId !== studentId) return student;
        if (student.enrolledCourses.includes(courseId)) return student;

        const nextStudent = {
          ...student,
          enrolledCourses: [...student.enrolledCourses, courseId],
        };

        return MakeToCourseCodes(nextStudent, state.courses);
      }),
    })),

  removeEnrollCourse: (studentId, courseId) =>
    set((state) => ({
      students: state.students.map((student) => {
        if (student.studentId !== studentId) return student;

        const nextStudent = {
          ...student,
          enrolledCourses: student.enrolledCourses.filter(
            (enrolledCourseId) => enrolledCourseId !== courseId,
          ),
        };

            return MakeToCourseCodes(nextStudent, state.courses);
          }),
        })),

    removeInstructor: (courseId, instructorName) =>
      set((state) => ({
        courses: state.courses.map((course) => {
          if (course.courseId !== courseId) return course;

          const instructors = course.instructors ?? [];
          let hasInstructor = false;

          for (let i = 0; i < instructors.length; i++) {
            if (instructors[i] === instructorName) {
              hasInstructor = true;
              break;
            }
          }
          if (!hasInstructor) return course;
          return {
            ...course,
            instructors: instructors.filter((name) => name !== instructorName),
          };
        }),
      })),
    }),
    {
      name: "lab16-2569-680610695",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
