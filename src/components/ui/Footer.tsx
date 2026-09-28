import type { FooterProps } from "@/lib/Footer";

export default function Footer({fullName, studentId }: FooterProps) {
  return (
    <footer className="w-full text-center">
      <p className="text-foreground bg-secondary p-4 m-0">
        จัดทำโดย {fullName} — รหัสนักศึกษา {studentId}
      </p>
    </footer>
  );
}
