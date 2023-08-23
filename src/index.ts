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
import { Story } from './app/story';
import {
  ChatCompletion,
  CompletionCreateParamsBase,
} from 'openai/resources/chat/completions';

function main() {
  const stories = Story.getAll();
  stories.forEach(story => {
    console.log(story);
  });
}

/**
 * 初期設定
 * ・トリガー作成
 * ・シート作成
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

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui
    .createMenu('OpenAIのAPI設定')
    .addItem('認証情報の設定', 'showApiAuthSetting');
  menu.addToUi();
}

function showApiAuthSetting() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('APIのSecret keyを入力してください。');
  if (response.getSelectedButton() === ui.Button.CANCEL) {
    return;
  }
  const secretKey = response.getResponseText();
  PropertiesService.getScriptProperties().setProperty(
    OpenAiClient.PROP_OPENAI_API_KEY,
    secretKey
  );
  ui.alert('認証情報の設定が完了しました！', Browser.Buttons.OK);
}

function createStory() {
  const client = new OpenAiClient();
  const title = 'AIが尾崎紅葉の「金色夜叉」を完結させる';
  const genreId = '6';
  const subTopic = 'AIが金色夜叉の正体を暴き、恐怖の事実に主人公を直面させる';
  const messages: CreateChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content: Story.getSystemContent(title, genreId),
    },
    {
      role: 'user',
      content: Story.getUserRequest(title, genreId, subTopic),
    },
  ];
  const params: CompletionCreateParamsBase = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 3000,
    temperature: 0.9,
  };
  const chatComp: ChatCompletion = client.createChatCompletion(params);
  console.log(chatComp.choices[0].message.content);
}
