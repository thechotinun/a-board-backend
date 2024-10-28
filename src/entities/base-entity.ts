import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'uuid' })
  createdBy?: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  @Column({ type: 'uuid' })
  updatedBy?: string;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive?: boolean;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedDate?: Date;
}
