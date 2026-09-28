import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";

type Option = { value: string; label: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full truncate">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, addEnrollCourse, removeEnrollCourse } = useEnrollmentStore();

  const [formStudents, setFormStudents] = useState<string[]>([]);
  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));

  const availableStudentOptions: Option[] = formCourse
    ? studentOptions.filter(
        (studentOption) =>
          !students.some(
            (student) =>
              student.studentId === studentOption.value &&
              student.enrolledCoursesCode.includes(formCourse),
          ),
      )
    : [];

  const NewEnroll = [];

  for(let i=0;i<courses.length;i++){
    const course = courses[i];

    const filteredStudents = students.filter((student) => {
      let hasCourse = false;
      for(let j=0;j<student.enrolledCourses.length;j++){
        if(student.enrolledCourses[j] === course.courseId){
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

  // const availableCourseOptions = courseOptions.filter(
  //   (targetcourse) =>
  //     !students.some(
  //       (targetstudent) =>
  //         targetstudent.studentId === formStudent &&
  //         targetstudent.enrolledCoursesCode.includes(targetcourse.value),
  //     ),
  // );

  const handleEnroll = () => {
    if (!formCourse || formStudents.length === 0) return;

    const courseId = courses.find((course) => course.courseCode === formCourse)?.courseId;
    if (!courseId) return;

    formStudents.forEach((studentId) => {
      addEnrollCourse(studentId, courseId);
    });

    setFormStudents([]);
    setEnrollDialogOpen(false);
  };

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormStudents([]);
      setFormCourse(null);
    }
  };

//---------------------จัดข้อมูลในตาราง-----------------------
  // const rows = New_enrollments.filter((e) =>
  //   mode === "course"
  //     ? filterCourse === "all" || e.courseCode === filterCourse
  //     : filterStudent === "all" || e.studentId === filterStudent,
  // );

  // const rows = New_enrollments.filter((course) => {
  //   if (mode === "course") {
  //     return filterCourse === "all" || course.courseId === filterCourse;
  //   }
  //   return (
  //     filterStudent === "all" ||
  //     course.enrolledStudents.some((student) => student.studentId === filterStudent)
  //   );
  // });

  // const nameOf = (studentId: string) => {
  //   const s = students.find((x) => x.studentId === studentId);
  //   return s ? `${s.firstName} ${s.lastName}` : "-";
  // };
  // const titleOf = (courseId: string) =>
  //   courses.find((c) => c.courseId === courseId)?.courseTitle ?? "-";

  const rows = NewEnroll.filter((course) => {
    if (mode === "course") return filterCourse === "all" || course.courseCode === filterCourse;
    if (filterStudent === "all") return true;

    let hasDek = false;
    for (let i = 0; i < course.enrolledStudents.length; i++) {
      if (course.enrolledStudents[i].studentId === filterStudent) {
        hasDek = true;
        break;
      }
    }
    return hasDek;
  });

  const anchor = useComboboxAnchor();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog
        open={enrollDialogOpen}
        onOpenChange={handleEnrollDialogOpenChange}
      >
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกวิชาก่อน แล้วจึงเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนได้หลายคน
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">วิชา</Label>
              <OptionSelect
                id="formCourse"
                options={courseOptions}
                value={formCourse}
                placeholder="เลือกวิชา"
                onChange={(value) => {
                  setFormCourse(value);
                  setFormStudents([]);
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="formStudent">นักศึกษา</Label>
              <Combobox
                multiple
                autoHighlight
                value={formStudents}
                onValueChange={(next) => setFormStudents(next as string[])}
                items={availableStudentOptions.map((option) => option.value)}
              >
                <ComboboxChips ref={anchor} className="w-full">
                  <ComboboxValue>
                    {(values) => (
                      <>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>
                            {studentOptions.find((option) => option.value === value)?.label ?? value}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput 
                          placeholder={
                            !formCourse 
                              ? "เลือกวิชาก่อน" 
                              : formStudents.length === 0 
                                ? "เลือกนักศึกษา (เลือกได้หลายคน)" 
                                : ""
                          } 
                        />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {studentOptions.find((option) => option.value === item)?.label ?? item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!formCourse || formStudents.length === 0}
              onClick={handleEnroll}
            >
              <PlusCircle className="h-4 w-4" />
              ลงทะเบียน {formStudents.length > 0 ? `(${formStudents.length} คน)` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>
{/* //-----------------------------------------------------------------------------------------------------// */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> รหัสวิชา </TableHead>
              <TableHead> ชื่อวิชา </TableHead>
              <TableHead> จำนวน นศ. </TableHead>
              <TableHead> นักศึกษาที่ลงทะเบียน </TableHead>
            </TableRow>
          </TableHeader>

          {/* <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {rows.map((e) => (
              <TableRow key={`${e.studentId}-${e.courseId}`}>
                <TableCell>{e.studentId}</TableCell>
                <TableCell>{nameOf(e.studentId)}</TableCell>
                <TableCell>{e.courseId}</TableCell>
                <TableCell>{titleOf(e.courseId)}</TableCell>
              </TableRow>
            ))}
          </TableBody> */}

          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}

            {rows.map((e) => (
              <TableRow key={e.courseId}>
                <TableCell> {e.courseCode} </TableCell>
                <TableCell> {e.courseTitle} </TableCell>
                <TableCell> {e.enrolledStudents.length} </TableCell>

                <TableCell>
                  {(() => {
                    if (e.enrolledStudents.length === 0) return "ยังไม่มีนักศึกษาลงทะเบียน";
                    else {
                      return (
                        <div>
                          {e.enrolledStudents.map((student) => (
                            <Badge key={`${e.courseId}-${student.studentId}`} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {student.name}
                              <button
                                type="button"
                                onClick={() => removeEnrollCourse(student.studentId, e.courseId)}
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

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
