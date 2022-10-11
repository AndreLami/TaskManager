import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskDependencyEntity } from './task.dependency.entity';
import { TaskStatus, TaskVisibility } from './task.status';
import { Exclude } from "class-transformer";

@Entity({ name: 'tasks', schema: 'public' })
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: TaskStatus.Pending })
    status: number;

    @Exclude({toClassOnly: true, toPlainOnly: false})
    @Column({ nullable: false, default: TaskVisibility.Invisible })
    visibility: number;

    @Column({ nullable: false, default: "" })
    name: string;

    @Column({ nullable: false, default: "" })
    description: string;

    @OneToMany(() => TaskDependencyEntity, entity => entity.child)
    public children!: TaskDependencyEntity[];

    @OneToMany(() => TaskDependencyEntity, entity => entity.parent)
    public parents!: TaskDependencyEntity[];

    get isVisible(): Boolean {
        return this.visibility == TaskVisibility.Visible
    }

    get isPending(): Boolean {
        return this.status == TaskStatus.Pending
    }

    get isCompleted(): Boolean {
        return this.status == TaskStatus.Completed
    }

    get isInProgress(): Boolean {
        return this.status == TaskStatus.InProgress
    }
}