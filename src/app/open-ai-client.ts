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
import {
  ChatCompletion,
  CompletionCreateParamsBase,
} from 'openai/resources/chat/completions';

export class OpenAiClient {
  static API_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
  static PROP_OPENAI_API_KEY = 'OPENAI_API_KEY';
  static API_KEY = PropertiesService.getScriptProperties().getProperty(
    OpenAiClient.PROP_OPENAI_API_KEY
  );

  constructor() {
    if (!OpenAiClient.API_KEY) {
      throw new Error('OPENAI_API_KEY is not set.');
    }
  }

  getReqHeaders() {
    return {
      'Authorization': `Bearer ${OpenAiClient.API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  createChatCompletion(
    completionCreateParams: CompletionCreateParamsBase
  ): ChatCompletion {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: this.getReqHeaders(),
      payload: JSON.stringify(completionCreateParams),
    };
    const response = UrlFetchApp.fetch(OpenAiClient.API_CHAT_URL, options);
    const chatComp: ChatCompletion = JSON.parse(response.getContentText());
    return chatComp;
  }
}
