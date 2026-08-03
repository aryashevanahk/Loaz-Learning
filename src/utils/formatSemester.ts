export function formatSemester(semester: string): string {
  const parts = semester.split(' ');
  if (parts.length === 2) {
    const [type, number] = parts;
    return `${type} ${number}`;
  }
  return semester;
}

export function getSemesterDisplay(semester: string): string {
  const semesters: Record<string, string> = {
    'GANJIL': 'Semester Ganjil',
    'GENAP': 'Semester Genap',
    'PENDEK': 'Semester Pendek',
  };
  return semesters[semester] || semester;
}