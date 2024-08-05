import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface DayTasks {
  [date: string]: Task[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendar: Date[][] = [];
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  newTask: string = '';
  tasks: DayTasks = {};

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = this.dateAdapter.createDate(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const startingDay = this.dateAdapter.getFirstDayOfWeek();
    const monthStart = (7 + firstDay.getDay() - startingDay) % 7;

    this.calendar = [];
    let date = this.dateAdapter.addCalendarDays(firstDay, -monthStart);

    for (let week = 0; week < 6; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(date);
        date = this.dateAdapter.addCalendarDays(date, 1);
      }
      this.calendar.push(weekDays);
    }
  }

  prevMonth() {
    this.currentMonth = this.dateAdapter.addCalendarMonths(
      this.currentMonth,
      -1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = this.dateAdapter.addCalendarMonths(
      this.currentMonth,
      1
    );
    this.generateCalendar();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }
  selectDate(date: Date) {
    this.selectedDate = date;
    const dateString = this.formatDate(date);
    if (!this.tasks[dateString]) {
      this.tasks[dateString] = [];
    }
  }

  addTask() {
    if (this.selectedDate && this.newTask.trim()) {
      const dateString = this.formatDate(this.selectedDate);
      const newTask: Task = {
        id: Date.now(),
        description: this.newTask.trim(),
        completed: false,
      };
      this.tasks[dateString].push(newTask);
      this.newTask = '';
    }
  }

  toggleTaskCompletion(date: string, taskId: number) {
    const task = this.tasks[date].find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(date: string, taskId: number) {
    this.tasks[date] = this.tasks[date].filter((t) => t.id !== taskId);
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  getTasksForDate(date: Date): Task[] {
    return this.tasks[this.formatDate(date)] || [];
  }
}
