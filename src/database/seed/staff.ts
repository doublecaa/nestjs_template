import * as bcrypt from 'bcrypt';

export async function seedStaff(database: any) {
  const baseData = database.create([
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: await bcrypt.hashSync('123456789', 10),
    },
  ]);
  await database.save(baseData);
}
