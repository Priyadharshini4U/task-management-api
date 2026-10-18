import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface ListTasksOptions {
  page: number;
  limit: number;
  status?: TaskStatus;
}

export interface PaginatedTasks {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  private nextId = 1;

  findAll(options: ListTasksOptions): PaginatedTasks {
    const filteredTasks = options.status
      ? this.tasks.filter((task) => task.status === options.status)
      : this.tasks;
    const total = filteredTasks.length;
    const startIndex = (options.page - 1) * options.limit;
    const data = filteredTasks.slice(startIndex, startIndex + options.limit);

    return {
      data: [...data],
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }
    return task;
  }

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title: input.title,
      description: input.description,
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, input: UpdateTaskInput): Task {
    const task = this.findOne(id);
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }
    this.tasks.splice(index, 1);
  }
}
