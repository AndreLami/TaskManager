import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.status';

@Entity({ name: 'task_dependencies', schema: 'public' })
export class TaskDependencyEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => TaskEntity, (task) => task.parents)
    child: TaskEntity;

    @ManyToOne(() => TaskEntity, (task) => task.children)
    parent: TaskEntity;

}