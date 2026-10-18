import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { PaginatedTasks, TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() query: ListTasksQueryDto): PaginatedTasks {
    return this.tasksService.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Task {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() input: CreateTaskDto): Task {
    return this.tasksService.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateTaskDto,
  ): Task {
    return this.tasksService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.tasksService.remove(id);
    return { message: 'Task deleted successfully' };
  }
}
