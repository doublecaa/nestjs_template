import { DataSource } from 'typeorm';
import { Staff } from '../entities';
import { seedStaff } from './staff';

const dataSource = new DataSource({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: '1Secure*Password1',
    database: 'TemplateDB',
    entities: [
        Staff,
    ],
    synchronize: true,
    extra: {
        encrypt: true,
        trustServerCertificate: true,
    },
});
dataSource.initialize().then(async () => {
    await seedStaff(dataSource.getRepository(Staff));
    console.log('done');
}).catch((e) => {
    console.log('-----error', e)
})