import { ipcMain } from 'electron';
import Database from '../Database/Database.js';

export class RequestHandler {
  private taskDatabase: Database;

  constructor(taskDatabase: Database) {
    this.taskDatabase = taskDatabase;
  }

  
}