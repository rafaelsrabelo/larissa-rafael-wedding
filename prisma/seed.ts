import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required in .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const ADMINS = [
  { email: "larissagarciafr@gmail.com" },
  { email: "rafaelrabelodev@gmail.com" },
] as const;
const PASSWORD = "admin123";

async function main() {
  try {
    await prisma.admin.deleteMany({});
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "P2021") {
      console.log("Tabelas ainda não existem. Rode primeiro: npx prisma db push");
      process.exit(1);
    }
    throw e;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  for (const { email } of ADMINS) {
    await prisma.admin.create({
      data: { email, passwordHash },
    });
    console.log("Admin criado:", email);
  }
  console.log("Apenas estes dois usuários têm acesso. Senha: admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
