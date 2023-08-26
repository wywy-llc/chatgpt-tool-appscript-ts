/**
 * Copyright 2023 wywy LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export class Chat {
  static readonly SHEET_NAME = 'chat';
  static readonly DATA_ROW = 4;
  static readonly DATA_COL = 1;
  static readonly COLUMN: { [name: string]: number } = {
    id: 0, // ID
    system: 1, // システム
    user: 2, // ユーザー
    model: 3, // モデル
    maxTokens: 4, // モデル
    temperature: 5, // ユーザー
    result: 6, // 結果
  };
  public id: string = '';
  public system: string = '';
  public user: string = '';
  public model: string = '';
  public maxTokens: number = 3000;
  public temperature: number = 1.0;
  public result: string = '';

  /**
   *
   * @param record
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(record: any[] | null = null) {
    if (record) {
      this.id = record[Chat.COLUMN.id];
      this.system = record[Chat.COLUMN.system];
      this.user = record[Chat.COLUMN.user];
      this.model = record[Chat.COLUMN.model];
      this.maxTokens = Number(record[Chat.COLUMN.maxTokens]);
      this.temperature = Number(record[Chat.COLUMN.temperature]);
      this.result = record[Chat.COLUMN.result];
    }
  }
  static getDataRange() {
    const sheet = Chat.getSheet();
    return sheet.getRange(
      Chat.DATA_ROW,
      Chat.DATA_COL,
      sheet.getLastRow() - Chat.DATA_ROW + 1,
      sheet.getLastColumn()
    );
  }
  static getOneDataRange(rowIndex: number) {
    const sheet = Chat.getSheet();
    return sheet.getRange(rowIndex, Chat.DATA_COL, 1, sheet.getLastColumn());
  }
  static getAll() {
    const chats = Chat.getDataRange()
      .getValues()
      .map(record => new Chat(record));
    return chats;
  }
  static getSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      Chat.SHEET_NAME
    );
    if (!sheet) {
      throw new Error(`${Chat.SHEET_NAME}が見つかりません。`);
    }
    return sheet;
  }

  static clearResult() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const dataRange = sheet.getRange(
      Chat.DATA_ROW,
      Chat.COLUMN.result + 1,
      sheet.getLastRow() - Chat.DATA_ROW + 1,
      1
    );
    dataRange.clearContent();
  }

  static updateRow(chat: Chat) {
    if (!chat) {
      return;
    }
    const dataRange = Chat.getDataRange();
    dataRange.getValues().forEach((value, index) => {
      const rowIndex = index + Chat.DATA_ROW;
      if (chat.id !== value[Chat.COLUMN.id]) {
        return;
      }
      for (const [name, index] of Object.entries(Chat.COLUMN)) {
        value[index] = chat[name as keyof Chat];
      }
      Chat.getOneDataRange(rowIndex).setValues([value]);
    });
  }
}
