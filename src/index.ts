import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const deleteCourses = prisma.course.deleteMany();
  const deleteCourseCodes = prisma.courseCode.deleteMany();

  // The transaction runs synchronously so deleteCourses must run last.
  const transaction = await prisma.$transaction([
    deleteCourseCodes,
    deleteCourses,
  ]);
  console.log(transaction);

  const course = await prisma.course.create({
    data: {
      title: "Organic Chemistry I",
      canvasId: 308038,
      code: { create: { subject: "CHEM", course: 301, section: 1 } },
    },
  });
  console.log(course);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
