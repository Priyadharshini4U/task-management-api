import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('creates a task with pending status by default', () => {
    const task = service.create({ title: 'Review PR' });

    expect(task.id).toBe(1);
    expect(task.title).toBe('Review PR');
    expect(task.status).toBe('pending');
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });

  it('filters and paginates tasks with metadata', () => {
    service.create({ title: 'Pending one' });
    service.create({ title: 'Completed one', status: 'completed' });
    service.create({ title: 'Pending two' });

    const result = service.findAll({ page: 1, limit: 1, status: 'pending' });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Pending one');
    expect(result.meta).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    });
  });

  it('returns an empty page when page is beyond available results', () => {
    service.create({ title: 'One task' });

    const result = service.findAll({ page: 5, limit: 10 });

    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('throws NotFoundException for a missing task', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('updates the updatedAt timestamp when a task changes', () => {
    const task = service.create({ title: 'Original title' });
    const originalUpdatedAt = task.updatedAt;

    const updated = service.update(task.id, { title: 'Updated title' });

    expect(updated.title).toBe('Updated title');
    expect(updated.updatedAt).toBeDefined();
    expect(updated.updatedAt).not.toBe('');
    expect(updated.updatedAt >= originalUpdatedAt).toBe(true);
  });

  it('throws NotFoundException when deleting a missing task', () => {
    expect(() => service.remove(404)).toThrow(NotFoundException);
  });
});
