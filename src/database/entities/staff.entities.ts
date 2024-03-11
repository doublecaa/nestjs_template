import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 500, nullable: true })
    name: string;

    @Column({ length: 50, nullable: true, unique: true })
    email: string;

    @Column({ length: 500 })
    password: string;

    @Column({ length: 500, nullable: true })
    refreshToken: string;

    @Column({ length: 500, nullable: true })
    accessToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}