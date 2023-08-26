/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';
import { OpenAiClient } from './app/open-ai-client';
import { Chat } from './app/chat';
import {
  ChatCompletion,
  CompletionCreateParamsBase,
} from 'openai/resources/chat/completions';

/**
 * 初期設定
 * ・トリガー作成
 */
function initialize() {
  const initTriggers = () => {
    // トリガー作成
    const functionNames = ['onOpen'];
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
      const fname = trigger.getHandlerFunction();
      if (functionNames.includes(fname)) {
        ScriptApp.deleteTrigger(trigger);
        switch (fname) {
          case 'onOpen':
            ScriptApp.newTrigger(fname)
              .forSpreadsheet(spreadsheet)
              .onOpen()
              .create();
        }
      }
    }
  };
  initTriggers();
}

/**
 * メニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui
    .createMenu('ChatGPTのAPI設定')
    .addItem('認証情報の設定', 'showApiAuthSetting');
  menu.addToUi();
}

/**
 * APIの認証情報の設定プロンプトの表示
 */
function showApiAuthSetting() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('OpenAI APIのSecret keyを入力してください。');
  if (response.getSelectedButton() === ui.Button.CANCEL) {
    return;
  }
  const secretKey = response.getResponseText();
  if (!secretKey) {
    ui.alert('Secret keyが未入力です。', Browser.Buttons.OK);
    return;
  }
  PropertiesService.getScriptProperties().setProperty(
    OpenAiClient.PROP_OPENAI_API_KEY,
    secretKey
  );

  ui.alert('認証情報の設定が完了しました！', Browser.Buttons.OK);
}

/**
 * チャットGPTを実行する。
 * - システム列、ユーザー列に値が入っている行が実行対象です。
 * - 実行結果は結果列に出力されます。
 */
function createChats() {
  if (!OpenAiClient.API_KEY) {
    showApiAuthSetting();
    return;
  }
  const activeRange = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
  if (!activeRange) {
    return;
  }
  const sheet = activeRange.getSheet();
  if (!sheet) {
    return;
  }
  const ui = SpreadsheetApp.getUi();
  if (activeRange.getRowIndex() < Chat.DATA_ROW) {
    ui.alert(
      `${Chat.DATA_ROW}行目以降を選択してください。`,
      Browser.Buttons.OK
    );
    return;
  }
  const result = ui.alert(
    `${activeRange.getRowIndex()}〜${
      activeRange.getRowIndex() + activeRange.getNumRows() - 1
    }行目を実行します。よろしいですか？`,
    ui.ButtonSet.OK_CANCEL
  );
  if (result === ui.Button.CANCEL) {
    return;
  }
  const rowIndex = activeRange.getRowIndex();
  const range = sheet.getRange(
    rowIndex,
    Chat.DATA_COL,
    activeRange.getNumRows(),
    Object.keys(Chat.COLUMN).length
  );
  // APIの実行
  const client = new OpenAiClient();
  range
    .getValues()
    .map(record => new Chat(record))
    .filter(chat => {
      return chat.id && chat.system && chat.user;
    })
    .forEach(chat => {
      const messages: CreateChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: chat.system,
        },
        {
          role: 'user',
          content: chat.user,
        },
      ];
      const params: CompletionCreateParamsBase = {
        model: chat.model,
        messages: messages,
        max_tokens: chat.maxTokens,
        temperature: chat.temperature,
      };
      console.log(params);
      const chatComp: ChatCompletion = client.createChatCompletion(params);
      const ans = chatComp.choices[0].message.content;
      if (ans) {
        chat.result = ans;
        Chat.updateRow(chat);
        console.log(ans);
      }
    });
  ui.alert('実行が完了しました！', Browser.Buttons.OK);
}

/**
 * 結果をクリアする。
 */
function clearAllResult() {
  Chat.clearResult();
}
