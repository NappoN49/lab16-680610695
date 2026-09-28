"use client";

import { useState } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { FieldDescription } from "@/components/ui/field";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";

// type Option = { value: string; label: string };

// function InstructorMultiSelect({
//   instructors,
//   value,
//   onChange,
// }: {
//   instructors: string[];
//   value: string[];
//   onChange: (next: string[]) => void;
// }) {
//   const [query, setQuery] = useState("");

//   const suggestions = useMemo(() => {
//     const cleanQuery = query.trim().toLowerCase();

//     if (!cleanQuery) {
//       return instructors.filter((name) => !value.includes(name)).slice(0, 6);
//     }

//     return instructors.filter(
//       (name) =>
//         !value.includes(name) && name.toLowerCase().includes(cleanQuery),
//     );
//   }, [instructors, query, value]);

//   const handleAdd = (name: string) => {
//     const trimmed = name.trim();
//     if (!trimmed || value.includes(trimmed)) return;

//     onChange([...value, trimmed]);
//     setQuery("");
//   };

//   const handleRemove = (name: string) => {
//     onChange(value.filter((item) => item !== name));
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex min-h-10 flex-wrap gap-2 rounded-md border border-input bg-transparent px-2 py-2">
//         {value.length === 0 ? (
//           <span className="text-sm text-muted-foreground">เลือกผู้สอน</span>
//         ) : (
//           value.map((name) => (
//             <Badge
//               key={name}
//               variant="secondary"
//               className="gap-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
//             >
//               {name}
//               <button
//                 type="button"
//                 aria-label={`ลบ ${name}`}
//                 onClick={() => handleRemove(name)}
//                 className="inline-flex items-center"
//               >
//                 <X size={12} />
//               </button>
//             </Badge>
//           ))
//         )}
//       </div>

//       <div className="relative">
//         <Input
//           value={query}
//           onChange={(event) => setQuery(event.target.value)}
//           placeholder="ค้นหาหรือพิมพ์ชื่อผู้สอน"
//           className="w-full"
//         />

//         {query.trim() && (
//           <div className="mt-2 rounded-md border bg-popover p-1 shadow-sm">
//             {suggestions.length > 0 ? (
//               suggestions.map((name) => (
//                 <button
//                   key={name}
//                   type="button"
//                   className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
//                   onClick={() => handleAdd(name)}
//                 >
//                   <span>{name}</span>
//                   <span className="text-xs text-muted-foreground">เลือก</span>
//                 </button>
//               ))
//             ) : (
//               <button
//                 type="button"
//                 className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
//                 onClick={() => handleAdd(query)}
//               >
//                 <span>+ เพิ่มผู้สอน "{query.trim()}"</span>
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function OptionSelect({
//   id,
//   options,
//   value,
//   onChange,
//   placeholder,
// }: {
//   id: string;
//   options: Option[];
//   value: string | null;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <Select
//       items={options}
//       value={value}
//       onValueChange={(v) => onChange(v as string)}
//     >
//       <SelectTrigger id={id} className="w-full truncate">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>

//       <SelectContent>
//         {options.map((o) => (
//           <SelectItem key={o.value} value={o.value}>
//             {o.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

export default function AdminEnrollmentsPage() {
  const {
    students,
    courses,
    addCourse,
    // addEnrollCourse,
    removeCourse,
    removeInstructor,
  } = useEnrollmentStore();

  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseInstructors, setNewCourseInstructors] = useState<string[]>(
    [],
  );
  const [instructorDraft, setInstructorDraft] = useState("");
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);

  // const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  // const [mode, setMode] = useState<"course" | "student">("course");
  // const [filterCourse, setFilterCourse] = useState("all");
  // const [filterStudent, setFilterStudent] = useState("all");

  // const studentOptions: Option[] = students.map((s) => ({
  //   value: s.studentId,
  //   label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  // }));
  // const courseOptions: Option[] = courses.map((c) => ({
  //   value: c.courseId,
  //   label: `${c.courseId} — ${c.courseTitle}`,
  // }));

  const resetAddCourseForm = () => {
    setNewCourseCode("");
    setNewCourseTitle("");
    setNewCourseInstructors([]);
    setInstructorDraft("");
  };

  const uniqueNames = new Set<string>();
  for (let i = 0; i < courses.length; i++) {
    const instructors = courses[i].instructors ?? [];
    for (let j = 0; j < instructors.length; j++) {
      const name = instructors[j];
      if (name) uniqueNames.add(name);
    }
  }
  const allInstructors: string[] = [];
  for (const name of uniqueNames) allInstructors.push(name);

  const trimmedInstructorDraft = instructorDraft.trim();
  const canAddInstructor =
    !!trimmedInstructorDraft &&
    !newCourseInstructors.some(
      (instructor) =>
        instructor.toLowerCase() === trimmedInstructorDraft.toLowerCase(),
    ) &&
    !allInstructors.some(
      (instructor) =>
        instructor.toLowerCase() === trimmedInstructorDraft.toLowerCase(),
    );

  const handleAddInstructor = () => {
    if (!canAddInstructor) return;

    setNewCourseInstructors((prev) => [...prev, trimmedInstructorDraft]);
    setInstructorDraft("");
  };

  const duplicateCourseCode = (() => {
    const isDuplicate = courses.some(
      (course) =>
        course.courseCode.toUpperCase() === newCourseCode.toUpperCase(),
    );

    return isDuplicate;
  })();

  const handleSaveCourse = () => {
    const courseCode = newCourseCode.trim();
    const courseTitle = newCourseTitle.trim();

    if (!courseCode || !courseTitle || duplicateCourseCode) return;

    addCourse({
      courseId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      courseCode,
      courseTitle,
      instructors: newCourseInstructors,
    });

    resetAddCourseForm();
    setAddCourseDialogOpen(false);
  };

  const NewEnroll = [];

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    const filteredStudents = students.filter((student) => {
      let hasCourse = false;
      for (let j = 0; j < student.enrolledCourses.length; j++) {
        if (student.enrolledCourses[j] === course.courseId) {
          hasCourse = true;
          break;
        }
      }
      return hasCourse;
    });

    const enrolledStudents = filteredStudents.map((student) => {
      return {
        studentId: student.studentId,
        name: student.firstName + " " + student.lastName,
      };
    });

    NewEnroll.push({
      ...course,
      enrolledStudents: enrolledStudents,
    });
  }

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ

  // const handleEnrollDialogOpenChange = (open: boolean) => {
  //   setEnrollDialogOpen(open);
  //   if (!open) {
  //     setFormStudent(null);
  //     setFormCourse(null);
  //   }
  // };

  const anchor = useComboboxAnchor();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {NewEnroll.length} วิชา —
            เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก
            ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>

        <Dialog
          open={addCourseDialogOpen}
          onOpenChange={(open) => {
            setAddCourseDialogOpen(open);
            if (!open) resetAddCourseForm();
          }}
        >
          <DialogTrigger>
            <Button type="button" className="gap-2">
              <PlusCircle size={16} />
              เพิ่มวิชา
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle> เพิ่มวิชาใหม่ </DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">รหัสวิชา</Label>
                <Input
                  aria-invalid={Boolean(duplicateCourseCode)}
                  id="course-code"
                  value={newCourseCode}
                  onChange={(event) => setNewCourseCode(event.target.value)}
                  placeholder="เช่น CS101"
                />
                {duplicateCourseCode && (
                  <FieldDescription className="text-red-500">
                    มีรหัสวิชา {newCourseCode.toUpperCase()} นี้แล้ว
                  </FieldDescription>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-title">ชื่อวิชา</Label>
                <Input
                  id="course-title"
                  value={newCourseTitle}
                  onChange={(event) => setNewCourseTitle(event.target.value)}
                  placeholder="เช่น Introduction to Programming"
                />
              </div>

              <div className="space-y-2">
                <Label>ผู้สอน</Label>
                <Combobox
                  multiple
                  autoHighlight
                  value={newCourseInstructors}
                  onValueChange={(next) =>
                    setNewCourseInstructors(next as string[])
                  }
                  items={allInstructors}
                >
                  <ComboboxChips ref={anchor} className="w-full max-w-xs">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          {newCourseInstructors.length === 0 ? (
                            <ComboboxChipsInput
                              value={instructorDraft}
                              onChange={(event) => setInstructorDraft(event.target.value)}
                              placeholder="เลือกหรือพิมพ์ชื่อผู้สอน (เลือกได้หลายคน)"
                            />
                          ) : (
                            <ComboboxChipsInput
                              value={instructorDraft}
                              onChange={(event) => setInstructorDraft(event.target.value)}
                            />
                          )}
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty></ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>

                    {canAddInstructor && (
                      <div className="border-t border-border px-1 pb-1 pt-1">
                        <button
                          type="button"
                          className="relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={handleAddInstructor}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base leading-none text-muted-foreground">
                              +
                            </span>
                            <span>เพิ่มผู้สอน "{trimmedInstructorDraft}"</span>
                          </span>
                        </button>
                      </div>
                    )}
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddCourseDialogOpen(false)}
              >
                ปิด
              </Button>
              <Button
                type="button"
                onClick={handleSaveCourse}
                disabled={
                  !newCourseCode.trim() ||
                  !newCourseTitle.trim() ||
                  Boolean(duplicateCourseCode)
                }
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> รหัสวิชา </TableHead>
              <TableHead> ชื่อวิชา </TableHead>
              <TableHead> ผู้สอน </TableHead>
              <TableHead> Action </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {NewEnroll.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}

            {NewEnroll.map((e) => (
              <TableRow key={e.courseId}>
                <TableCell> {e.courseCode} </TableCell>
                <TableCell> {e.courseTitle} </TableCell>

                <TableCell>
                  {(() => {
                    if (
                      e.instructors?.length === 0 ||
                      e.instructors === undefined
                    )
                      return "ยังไม่มีผู้สอน";
                    else {
                      return (
                        <div>
                          {e.instructors.map((teacher) => (
                            <Badge
                              key={`${e.courseId}-${teacher}`}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            >
                              {teacher}
                              <button
                                type="button"
                                onClick={() =>
                                  removeInstructor(e.courseId, teacher)
                                }
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      );
                    }
                  })()}
                </TableCell>

                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button type="button" variant="destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle> ลบวิชา? </AlertDialogTitle>
                        <AlertDialogDescription>
                          ลบ {e.courseCode} — {e.courseTitle}{" "}
                          ออกจากรายวิชาที่เปิดสอน
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                          ยกเลิก
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => removeCourse(e.courseId)}
                        >
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
