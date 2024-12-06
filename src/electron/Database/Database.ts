import { app } from 'electron';
import path from 'path';
import { Level } from 'level';
import { isDev } from '../util.js';

export default class Database {
  private db: Level<string, any>;
  private isOpen: boolean = false;

  constructor(databasePath: string, encoding: string = 'json') {
    this.db = new Level(
      path.join(
          app.getAppPath(),
          isDev() ? '.' : '..',
          databasePath
      ),
      { valueEncoding: encoding },
    );
  }

  async open(onError?: (error: any) => void): Promise<void> {
    try {
      if (!this.isOpen) {
        await this.db.open();
        this.isOpen = true;
      }
    } catch (err) {
      if (onError) {
        return onError(err);
      } else {
        this.handleError(err, onError, 'open');
      }
    }
  }

  private handleError(err: any, onError?: (error: any) => void, methodName?: string): Promise<void> {
    if (onError) {
      onError(err);
    } else {
      console.error(`Error in ${methodName}:`, err);
    }
    throw err;
  }

  async put(key: string, value?: any, onError?: (error: any) => void): Promise<void> {
    try {
      await this.db.put(key, value);
    } catch (err) {
      await this.handleError(err, onError, 'put');
    }
  }

  async get(key: string, onError?: (error: any) => void): Promise<any> {
    try {
      const value = await this.db.get(key);
      return value;
    } catch (err) {
      await this.handleError(err, onError, 'get');
    }
  }

  async getLastRecord(): Promise<any | null> {
    try {
      let lastRecord: any = null;

      for await (const [key, value] of this.db.iterator({ reverse: true, limit: 1 })) {
        lastRecord = { key, value };
      }

      return lastRecord;
    } catch (err) {
      await this.handleError(err, undefined, 'getLastRecord');

      return null;
    }
  }

  async delete(key: string, onError?: (error: any) => void): Promise<boolean> {
    try {
      await this.db.del(key);

      return true;
    } catch (err) {
      await this.handleError(err, onError, 'delete');

      return false;
    }
  }

  async readAll(start: number = 0, limit?: number, onError?: (error: any) => void): Promise<any[]> {
    const allEntries: any[] = [];

    try {
      let count = 0;

      for await (const [key, value] of this.db.iterator({ gt: start })) {
        if (limit && count >= start + limit) break;

        allEntries.push({ key, value });

        count++;
      }

      return allEntries;
    } catch (err) {
      await this.handleError(err, onError, 'readAll');

      return [];
    }
  }

  async has(key: string, onError?: (error: any) => void): Promise<boolean> {
    try {
      await this.db.get(key);

      return true;
    } catch (err) {
      await this.handleError(err, onError, 'has');

      return false;
    }
  }

  async close(onError?: (error: any) => void): Promise<void> {
    try {
      await this.db.close();
    } catch (err) {
      await this.handleError(err, onError, 'close');
    }
  }

  async isEmpty(): Promise<boolean> {
    try {
      let isEmpty = true;

      for await (const _ of this.db.iterator({ limit: 1 })) {
        isEmpty = false;
        break;
      }

      return isEmpty;
    } catch (err) {
      await this.handleError(err, undefined, 'isEmpty');

      return true;
    }
  }

  create32BitKey(value: number): string {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(value, 0);

    return buffer.toString('hex');
  }

  decode32BitKey(key: string): number {
    const buffer = Buffer.from(key, 'hex');

    return buffer.readInt32LE(0);
  }
}
