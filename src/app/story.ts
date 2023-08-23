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
export class Story {
  static readonly SHEET_NAME = 'story';
  static readonly DATA_ROW = 4;
  static readonly DATA_COL = 1;
  static readonly NUMBER_COLS = ['row'];
  static readonly GENRE_MAP = new Map([
    ['0', { name: '指定なし', icon: '' }],
    ['1', { name: '異世界ファンタジー', icon: 'fa-dragon' }],
    ['14', { name: '西洋風ファンタジー', icon: 'fa-earth-europe' }],
    ['15', { name: '中華風ファンタジー', icon: 'fa-earth-asia' }],
    ['2', { name: '現代ファンタジー', icon: 'fa-building' }],
    ['17', { name: 'SF', icon: 'fa-shuttle-space' }],
    ['16', { name: 'BL(Boys Love)', icon: 'fa-people-arrows' }],
    ['3', { name: '恋愛', icon: 'fa-heart' }],
    ['4', { name: 'ラブコメディ', icon: 'fa-face-laugh-squint' }],
    ['5', { name: '現代ドラマ', icon: 'fa-person-rays' }],
    ['6', { name: 'ホラー', icon: 'fa-ghost' }],
    ['7', { name: 'ミステリー', icon: 'fa-user-secret' }],
    ['12', { name: '童話', icon: 'fa-children' }],
    ['9', { name: 'ノンフィクション・歴史', icon: 'fa-eye' }],
  ]);
  static readonly COLUMN: { [name: string]: number } = {
    id: 0, // ID
    topic: 1, // トピック
    system: 2, // システム
    user: 3, // ユーザー
    story1: 4, // ストーリー1
    story2: 5, // ストーリー2
    story3: 6, // ストーリー3
    story4: 7, // ストーリー4
  };
  public id: string = '';
  public topic: string = '';
  public system: string = '';
  public user: string = '';
  public story1: string = '';
  public story2: string = '';
  public story3: string = '';
  public story4: string = '';

  /**
   *
   * @param record
   */
  constructor(record: string[] | null = null) {
    if (record) {
      for (const [name, index] of Object.entries(Story.COLUMN)) {
        const value = record[index];
        if (!value) {
          continue;
        }
        this[name as keyof Story] = value;
      }
    }
  }
  static getDataRange() {
    const sheet = Story.getSheet();
    return sheet.getRange(
      Story.DATA_ROW,
      Story.DATA_COL,
      sheet.getLastRow(),
      sheet.getLastColumn()
    );
  }
  static getAll() {
    const stories = Story.getDataRange()
      .getValues()
      .map(record => new Story(record));
    return stories;
  }
  static getSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      Story.SHEET_NAME
    );
    if (!sheet) {
      throw new Error(`${Story.SHEET_NAME}が見つかりません。`);
    }
    return sheet;
  }

  static updateRows(stories: Story[]) {
    if (!stories || !stories.length) {
      return;
    }
    const dataRange = Story.getDataRange();
    const values = dataRange.getValues();
    for (const value of values) {
      const targetValue = stories.find(story => {
        story.id === value[Story.COLUMN.id];
      });
      if (!targetValue) {
        continue;
      }
      for (const [name, index] of Object.entries(Story.COLUMN)) {
        value[index] = targetValue[name as keyof Story];
      }
    }
    dataRange.setValues(values);
  }
  static appendRow(story: Story) {
    const sheet = Story.getSheet();
    const newData = [];
    newData[Story.COLUMN.id] = Utilities.getUuid();
    for (const [name, index] of Object.entries(Story.COLUMN)) {
      newData[index] = story[name as keyof Story];
    }
    sheet.appendRow(newData);
  }
  static getSystemContent(title: string, genreId: string) {
    const genre = Story.GENRE_MAP.get(genreId.toString());
    let genreName = 'ノンジャンル';
    if (genre) {
      genreName = genre.name;
    }
    const getWriter = (genreId: string) => {
      switch (Number(genreId)) {
        case 1:
          return '上橋菜穂子';
        case 2:
          return '上橋菜穂子';
        case 14:
          return 'J.K.ローリング';
        case 15:
          return '莫言';
        case 17:
          return '上橋菜穂子';
        case 12:
          return '宮沢賢治';
        case 16:
          return '芥川龍之介';
      }
      return '三島由紀夫';
    };
    return `
    ## 依頼書

    * あなたは、${genreName}の分野で受賞経験があるプロの作家です。
    * あなたのタスクは、依頼されたトピックに沿った${genreName}の${getWriter(
      genreId
    )}の作風のシノプシスを作成することです。
    `;
  }
  static getUserRequest(title: string, genreId: string, subTopic: string) {
    const genre = Story.GENRE_MAP.get(genreId.toString());
    let genreName = '';
    if (!genre) {
      genreId = '0';
      genreName = '';
    }

    const reqContent = (genreId: string, genreName: string) => {
      const text = '以下、「トピック」及び「作成条件」から、';
      let subText;
      switch (Number(genreId)) {
        case 4:
          subText = `素晴らしい${genreName}の演劇のシノプシスを作成してください。主人公と恋仲になるヒロインとの恋愛関係に焦点を当て周囲を巻き込んだ事件や混乱が繰り返されるドタバタ喜劇が読みたいです。`;
          break;
        case 6:
          subText = `素晴らしい${genreName}の演劇のシノプシスを恐怖を煽るように作成してください。あなたは、著名な${genreName}を模倣します。`;
          break;
        case 8:
          subText = `人物考察の論文を事実に基づいて作成してください。`;
          break;
        case 9:
          subText = `史実に沿った non-fiction を作成してください。例えば、著名な non-fiction(例えば The dentist of Auschwitz ) を模倣します。`;
          break;
        case 12:
          subText = `子供向け童話のシノプシスを作成してください。例えば、著名な童話(例えば「Grimm Fairy Tales」)を模倣します。`;
          break;
        case 14:
          subText = `神秘的な中世ファンタジー(medieval fantasy)のシノプシスを作成してください。あなたは著名な小説(例えば、ロード・オブ・ザ・リング（The Lord of the Rings）)を模倣します。`;
          break;
        case 15:
          subText = `${genreName}の中華の空想の神話のシノプシスを作成してください。あなたは、著名な古典文学(例えば、封神演義)を模倣します。`;
          break;
        case 16:
          subText = `男性同士の恋愛(boys love)のシノプシスを作成してください。男同士の熱い恋愛ストーリーが読みたいです。`;
          break;
        case 17:
          subText = `遠未来の科学的アイデアと独自の道具が登場するSFのシノプシスを丁寧に作成してください。あなたは、有名なSF(例えば、Philip Kindred Dick)を模倣します。`;
          break;
        default:
          subText = `素晴らしい${genreName}の演劇のシノプシスを作成してください。あなたは、著名な${genreName}を模倣します。`;
          break;
      }
      return text + subText;
    };
    let content = `
    ${reqContent(genreId, genreName)}

    ## トピック

    ${title} 〜${subTopic}〜

    ## 希望フォーマット

    <stories>:<構成>

    1話:主人公とヒロインの名前(姓名)、年齢、現在の状況をストーリー形式で紹介します。
    2話:今後のストーリーの展開に繋がる主人公の特徴を紹介して下さい。
    3話:主人公が、トピックに関して問題提起したり、ヒロインと議論にしたりします。
    4話:トピックに関連した主人公にとって一番不幸な問題・事件を発生させてください。
    5話:主人公は、辛い問題・事件を解決するために行動(新しいことに挑戦するなど)を起こします。
    6話:主人公は、偶然、指導者(mentor)に出会い、 主人公の才能を活かした解決策を協力して発見します。
    7話:今までのストーリー展開を踏まえた解決策を具体的に紹介してください。
    8話:主人公とヒロインが協力して解決策を実行し、主人公の問題・事件を根本から解決します。
    9話:ストーリーの結末を描いてください。

    ## 作成条件
    `;
    content += `
    * あなたの受賞経験を活かしてシノプシスを3回読み直し、よりベストなシノプシスを作成して下さい。
    * 常体「だ・である調」で生成して下さい。
    `;
    return content;
  }
}
