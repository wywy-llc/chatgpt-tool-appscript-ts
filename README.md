# GoogleスプレッドシートによるChatGPTツール

![ChatGPTツールの使い方](https://github.com/wywy-llc/chatgpt-tool-appscript-ts/assets/10007402/9e14a378-9b42-4fdb-8141-8066a9b22a20)

## ツールの特徴

- スプレッドシートで複数行を一気に実行可能なので、`temperature`、`model`の違いを効率よく検証できます。
- スプレッドシートで効率よく質問内容、回答結果を管理することができます。
- 認証情報(Secret key)をGUIで設定することができます。

## 利用準備

### ChatGPTツール(Googleスプレッドシート)をコピーする

以下の `ChatGPTツールをドライブにコピーする`をクリックして、自分のGoogleドライブにツールをコピーします。

[ChatGPTツールをドライブにコピーする](https://docs.google.com/spreadsheets/d/15FDIxDbliYTV-ziCXUFx4WFsfkBBOBIvH_V5tHpRbS8/copy)

### OpenAI APIの認証情報(Secret key)を取得する

次に、以下サイトを参考にして、OpenAI APIの認証情報(Secret key)を取得してください。

- 1分でわかる！OpenAIのAPIキーを簡単に入手する方法（ChatGPT）
  - https://mattyan.org/openai-key/
- 【2023年版】OpenAIのAPIキー発行手順！ChatGPTや文章生成AI、画像生成AIを利用可能
  - https://auto-worker.com/blog/?p=6988
- OpenAIのAPI Keyの取得方法
  - https://doc.gravio.com/manuals/gravio4/1/ja/topic/openai

### 認証情報(Secret key)を設定する

次に、取得した認証情報(Secret key)をChatGPTツールに設定します。

1. ChatGPTツール(Googleスプレッドシート)を開く
2. `初期設定`を実行する
    - `初期設定`をクリックしてください。
    - 権限の承認画面が開くので許可してください。
      - ![スクリーンショット 2023-08-26 19 15 12](https://github.com/wywy-llc/chatgpt-tool-appscript-ts/assets/10007402/91bc452d-92be-4652-9abf-f0d4c98a4b92)
      - ![スクリーンショット 2023-08-26 19 20 07](https://github.com/wywy-llc/chatgpt-tool-appscript-ts/assets/10007402/7c7b2dac-12f4-4423-9c14-82c4bdb44a35)
    - `OpenAIのAPI設定`がメニューに表示されることを確認してください。
    - ここで表示されない場合は、スプレッドシートをリロード(再読み込み)してください。
3. メニュー > OpenAIのAPI設定 > 認証情報の設定
    - ![スクリーンショット 2023-08-26 18 48 20](https://github.com/wywy-llc/chatgpt-tool-appscript-ts/assets/10007402/92826c1b-6f3b-4d79-869a-1b623ff92d85)
4. 認証情報(Secret key)を入力する。

以上で利用準備は完了です。

## ChatGPTツールの基本的な使い方の紹介

ここでは、ChatGPTツールの基本的な使い方を紹介します。

まずは、それぞれの設定値の意味を解説いたします。

### 設定値の意味

1. ID
    - データを識別するための一意な文字を設定します。
    - 単純に1, 2, 3と順番に振っていくと良いでしょう。
    - ※ 値が重複しないようにしてください。
2. システム
    - ChatGPTの回答方法を設定します。
    - 例えば、"関西弁で回答してください。"と入力するとChatGPTは関西弁で回答してくれます。
3. ユーザー
    - ChatGPTへの質問文を設定します。
    - 例えば、上記システムの設定で、"徳島県の観光名所を5つ挙げてください"と入力すると以下のように回答してくれます。
      ```
      1. 鳴門の渦潮（なるとのうずしお）：なんといっても、鳴門の渦潮は有名やねん。ナルトの名前でも知られているで。潮が激しく渦巻いていて、見ているだけで迫力があるわ。
      2. 阿波おどり会館（あわおどりかいかん）：阿波おどりは徳島の代表的なお祭りやねん。ここではそのおどりの歴史や文化を学べるし、実際におどりも見られるで。
      3. 阿波踊り会場（あわおどりかいじょう）：阿波おどりの本場はやっぱりここやねん。夏のお盆になると、たくさんの人で賑わうで。迫力あるおどりを見るなら、ここがおすすめやで。
      4. 徳島城（とくしまじょう）：徳島市内にあるお城やねん。築城から400年以上も経ってるけど、立派な姿を保ってるで。お城の中に入って、歴史を感じてみてや。
      5. 阿南海岸（あなんかいがん）：美しい海岸が広がってるで。特に夕日が綺麗なんや。散歩したり、海で遊んだりするのも楽しいで。
      ```
4. model
    - ChatGPTで利用するモデルを設定します。
    - 通常は `gpt-3.5-turbo` を使うのが良いでしょう。`gpt-3.5-turbo`は、主流のモデルで利用料金が安くてそこそこ性能が良いです。
    - 他のモデルに関しては、以下、設定できるモデル一覧があるのでそちらを参考にしてください。`GPT-4` は優秀ですが、料金が高いので、ご利用には注意が必要です。
      - [GPT-4](https://platform.openai.com/docs/models/gpt-4)
      - [GPT-3.5](https://platform.openai.com/docs/models/gpt-3-5)
5. max_tokens
    - ChatGPTの回答の最大文字数(最大トークン)を設定できます。
    - 基本的な使い方は、利用料金を制限するために使います。
    - ChatGPTの利用料金はトークンの従量課金なので節約する場合には小さく設定しましょう。
    - 利用料金に関しては以下のサイトがよくまとまっているので参考にしてください
        - [OpenAI API の料金体系](https://book.st-hakky.com/docs/open-ai-api-pricing/)
        - [公式サイトはこちら](https://openai.com/pricing)
6. temperature
    - ChatGTP回答の多様性を設定します。
    - `0.1`から`2.0`を設定することができます。
    - temperatureが高いほど、多様性(ランダム性)のある回答が期待できます。
    - 基本的には、プログラミング解説のような答えが決まっているものは低い値(0.1〜0.5)を設定して、企画を考えてもらうような創造的なものは高い値(0.7〜1.0)を設定すると良いです。
    - この値については色々と解説記事がありますのでそちらも参考にしてください
      - [OpenAI APIで設定するtemperatureは回答のランダム性を指定するもの。実験してみた](https://note.com/eurekachan/n/n68c1b346809c)
      - [GPTのtemperatureとは何なのか](https://qiita.com/suzuki_sh/items/8e449d231bb2f09a510c)
      - [OpenAI APIのパラメータで遊ぶ（temperature編）](https://zenn.dev/agdm/articles/02067751812ba42)
7. 回答
    - ChatGPTからの回答が登録されます。
    - ここの値は自動更新されるので、入力は不要です。

### 基本的な使い方

1. 設定値を入力します。`回答`以外の6項目を入力してください。
    - ID
    - システム
    - ユーザー
    - model
    - max_tokens
    - temperature
2. 実行したい行を範囲選択します。
    - 複数の質問を一気に実行することが可能です。
    - この機能がこのツールの大きな特徴です。
3. `ChatGPTを実行`をクリックします。
4. `回答`にChatGPTからの回答が自動入力されます。

ChatGPTツールの基本的な使い方の紹介は以上です。

## 問い合わせ

何かありましたら以下メールアドレスに送っていただければ回答いたします。

- wywy合同会社
- 藤澤勇樹(ふじさわ ゆうき)
- yuki_fujisawa@wywy.jp
