//===============================================================================
// FC_QuestSystem.js
//===============================================================================
// Copyright (c) 2017-2018 FantasticCreative
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//===============================================================================

/*:
 * ==============================================================================
 * @plugindesc (v0.2.0) 依頼システムプラグイン
 * @author FantasticCreative
 *
 * @help 掲示板タイプの依頼システムを実装します。
 *
 * = 以下、コピペ用プラグインコマンド一覧 =
 *   fc_quest board                       // 掲示板を開く (全ての難易度を表示)
 *   fc_quest board 1 2                   // 掲示板を開く (難易度1,2を表示)
 * = ここまで、プラグインコマンド一覧=
 *
 * = 以下、コピペ用スクリプトコマンド一覧 =
 *   $gameQuest.no()                    // [要プラグイン設定]
 *                                         変数に代入された管理IDを返す
 *   $gameQuest.addQuest(10);           // 管理ID:10の依頼を掲示板に追加
 *   $gameQuest.removeQuest(10);        // 管理ID:10の依頼を掲示板から削除
 *   $gameQuest.isVisible(10)           // 管理ID:10の依頼が
 *                                         掲示板に登録されているか？(true/false)
 *   $gameQuest.isOrder(10)             // 管理ID:10の依頼を受注したか？(true/false)
 *   $gameQuest.isReport(10)            // 管理ID:10の依頼が報告可能か？(true/false)
 *   $gameQuest.isComplete(10)          // 管理ID:10の依頼を達成したか？(true/false)
 *   $gameQuest.hasReport()             // 報告可能な依頼があるか？(true/false)
 *   $gameQuest.gainRewardAll();        // 達成した全依頼の報酬を受け取る
 *   $gameQuest.gainReward(10);         // 管理ID:10の依頼の報酬を受け取る
 *   $gameQuest.getCompleteCount(10)    // 管理ID:10の依頼の達成回数を返す
 *   $gameQuest.getProgress(10)         // 管理ID:10の進捗度を返す
 *   $gameQuest.incProgress(10);        // 管理ID:10の進捗度を1増加させる
 *   $gameQuest.decProgress(10);        // 管理ID:10の進捗度を1減少させる
 *   $gameQuest.openBoardMenu();        // 掲示板メニューを開く
 * = ここまで、スクリプトコマンド一覧=
 *
 *
 * 前提プラグインとして、やな様(https://www6.atwiki.jp/pokotan/pages/3.html )の
 *   汎用ポップアップベース - CommonPopupCore.js
 *   入手インフォメーション - GetInformation.js
 * が必要です。
 *
 * 入手インフォメーションのプラグインパラメータを以下の通り設定します。
 * (これ以外のパラメータは自由に設定してください)
 *   Info Disable Switch Id :
 *     空いてるスイッチ番号、ゲーム開始とコモン10実行時必ずONにすること。
 *
 *   Use Battle Info :
 *     trueに設定。
 *
 *   Info Position :
 *     Up を入力する。ポップアップを画面上部から出すようにする。
 *
 *   Info Slide Action :
 *     Down を入力する。ポップアップが上から下へ表示されるようにする。
 *
 *
 * まずは、プラグインパラメータの[依頼リスト]から依頼を登録してください。
 * 注意点として、[管理ID]は他の依頼と被らない整数を指定してください。
 *
 * [管理ID]が他の依頼と被った場合、ゲーム起動時に
 *
 * 　「[依頼システム] 管理IDが重複しています。管理ID:XXXX リスト:YY番目」
 *
 * というエラーが表示されますので、依頼リストの見直しをお願いします。
 * (XXXXは管理ID、YYは依頼リストの何番目にそのIDがあるかを示しています)
 *
 * この管理IDを使うことで依頼の進捗がゲーム中に確認できます。
 *
 *
 * 登録したばかりの依頼はゲーム内で表示するよう指示する必要があり、
 * 以下のスクリプトを実行することで依頼が掲示板内に表示されます。
 *
 *   $gameQuest.addQuest(XXXX); // XXXXは管理ID
 *
 * ゲーム中に依頼を表示させたいタイミングで実行してください。
 * (ある町に初めて入ったときに依頼を表示させたい場合など)
 *
 * また、依頼を掲示板から非表示にしたい場合は
 * 以下のスクリプトを使用します。
 * (依頼が進捗途中だった場合、進捗状況が初期化されます)
 *
 *   $gameQuest.removeQuest(XXXX); // XXXXは管理ID
 *
 *
 * 依頼を受注するための掲示板画面は、
 * 以下のプラグインコマンドを実行すると開くことができます。
 *
 *   fc_quest board [表示難易度 [表示難易度 表示難易度 ...]]
 *
 * [表示難易度]によって掲示板画面で表示する依頼を
 * 制限することができます。
 * ここで指定した難易度の依頼から、表示登録されたものが
 * 掲示板に表示されることになります。
 *
 * 例えば以下のプラグインコマンドで難易度1,2の依頼を対象にします。
 * (難易度を複数指定する場合は [半角スペース]で区切ります)
 *
 *   fc_quest board 1 2
 *
 * 難易度の指定を行わない場合、全難易度の依頼が対象になります。
 *
 *   fc_quest board
 *
 *
 * 依頼の進捗を表す項目は以下の3つがあります。
 *   ・受注状態(依頼を受注したかどうか)
 *   ・完了可能状態(依頼を完了(報告)可能かどうか)
 *   ・完了状態(依頼完了[=報告済み]かどうか)
 *
 * それぞれスクリプトで状態を取得できます。
 *
 *   ・受注確認(true=依頼を受注した/false=していない)
 *     $gameQuest.isOrder(XXXX); // XXXXは管理ID
 *
 *   ・完了可能確認(true=依頼を完了可能/false=完了できない)
 *     $gameQuest.isReport(XXXX); // XXXXは管理ID
 *
 *   ・完了確認(true=依頼を完了した/false=していない)
 *     $gameQuest.isComplete(XXXX); // XXXXは管理ID
 *
 * 依頼を受注した時に、自動的に受注状態がtrueになります。
 * 何度でも受注可能な依頼の場合、完了状態は常にfalseとなります。
 *
 * また、受注しているいずれかの依頼が完了(報告)可能かどうかを
 * 調べるには以下のスクリプトを使用します。
 *
 *   ・完了可能な依頼があるかどうか
 *       (true=完了可能なものがある/false=すべて完了できない)
 *     $gameQuest.hasReport();
 *
 * 進捗状態は以下のスクリプトでtrue/falseを
 * 切り替えられます。
 *
 * ([その他]依頼で進捗状態を手動更新する場合に使います。
 *  [モンスター討伐]、[アイテム納品]依頼については自動的に
 *  更新されるためenable○○/disable○○系のスクリプトを
 *  実行する必要はありません)
 *
 *   ・受注状態をtrueにする。
 *     (依頼受注時に自動的にtrueになります)
 *     $gameQuest.enableOrder(XXXX); // XXXXは管理ID
 *
 *   ・受注状態をfalseにする。
 *     (依頼をキャンセルする場合などに使用します。
 *      掲示板から依頼をキャンセルした場合は自動的にfalseになります)
 *     $gameQuest.disableOrder(XXXX); // XXXXは管理ID
 *
 *   ・完了可能状態をtrueにする。(依頼報告可能ポップアップを表示)
 *     $gameQuest.enableReport(XXXX); // XXXXは管理ID
 *
 *   ・完了可能状態をfalseにする。
 *     $gameQuest.disableReport(XXXX); // XXXXは管理ID
 *
 *   ・依頼完了状態をtrueにする。
 *     (依頼を報告済みにするときに使用します)
 *     $gameQuest.enableComplete(XXXX); // XXXXは管理ID
 *
 *   ・依頼完了状態をfalseにする。
 *     (依頼が報告不可能な状態になったときに使用します)
 *     $gameQuest.disableComplete(XXXX); // XXXXは管理ID
 *
 * 以下のスクリプトを実行することで、完了可能なクエストの報酬を
 * 獲得することができます。
 * ([アイテム納品]依頼の場合、同時に納品対象アイテムが指定個数減ります。
 *  減ったアイテムについては報酬とともにポップアップで表示されます)
 *
 *   ・すべての報酬を受け取る
 *     $gameQuest.gainRewardAll();
 *
 *   ・指定した依頼の報酬を受け取る
 *     $gameQuest.gainReward(XXXX); // XXXXは管理ID
 *
 * 依頼を完了可能になったとき、画面にポップアップを表示して
 * プレイヤーにそのことを伝えます。
 *
 *
 * 現在、依頼種別として以下を選択できます。
 *   ・エネミー討伐
 *   ・アイテム納品
 *   ・その他
 *
 * [エネミー討伐]依頼について:
 *   依頼種別で[エネミー討伐]を選択し、
 *   [依頼詳細(エネミー)]を設定します。
 *
 *   依頼詳細で討伐対象のエネミーと数を指定します。
 *   (指定した内容は依頼受注時などに表示されます)
 *   リストにより複数の対象を指定することが可能です。
 *
 *   依頼を受注してから対象エネミーを倒すとカウントされ、
 *   指定した数のエネミーを倒すと報告が可能です。
 *
 * [アイテム納品]依頼について:
 *   依頼種別で[アイテム納品]を選択し、
 *   [依頼詳細(アイテム)]を設定します。
 *
 *   依頼詳細で納品に必要なアイテムと個数を指定します。
 *   (指定した内容は依頼受注時などに表示されます)
 *   リストにより複数のアイテムを指定することが可能です。
 *
 *   依頼を受注すると対象アイテム所持数のカウントが行われ、
 *   すでに指定したアイテムを指定した数以上持っている場合はその場で
 *   報告が可能になります。
 *
 *   アイテムの増減が起きるたび対象アイテムの所持数がチェックされ、
 *   依頼が報告可能か判定が行われます。
 *
 * [その他]依頼について
 *   詳細を設定することはできません。
 *   上記種別に当てはまらない依頼を作成したい場合は[その他]を選択し、
 *   依頼の進捗状態の管理を手動で行ってください。
 *
 *   例～NPCと会話することで達成できる依頼の場合～
 *
 *     スイッチなどでNPCと会話したかどうかを判定し、必要NPCと会話済みであれば
 *     依頼報告状態または依頼達成状態をtrueにします。
 *     ↑
 *     上記処理をコモンイベントに設定することで、
 *     NPCと会話、スイッチON後にコモンイベントを呼び出すだけで
 *     判定処理が行なえます。
 *
 *
 * 依頼報酬について:
 *   依頼を完了させると報酬が貰える場合、以下を設定します。
 *     ・報酬(アイテム)
 *     ・報酬(武器)
 *     ・報酬(防具)
 *     ・報酬(お金)
 *     ・報酬(その他)
 *
 *   アイテム～お金は、依頼を完了させると設定したものが自動的に
 *   入手できます。
 *
 *   報酬(その他) については、依頼画面に表示するだけで入手処理等は
 *   自分で作成する必要があります。
 *
 *   例えば、依頼をクリアすることで新たな道が開けたり、次の依頼が
 *   出現するといった感じに、依頼のクリアが何かのフラグになっている場合は
 *   報酬(その他) に表示したい文章を記述すると良いでしょう。
 *
 *
 * 依頼進捗度について:
 *   依頼の進捗具合を数値として依頼ごとに設定できます。
 *   依頼を中止し再受注した場合、イベントの進行具合をリセットするために
 *   使用されることを想定しています。
 *
 *   進捗度の初期値は0から始まり負数は設定できません。
 *   依頼を完了/中止すると0にリセットされます。
 *
 *   ・進捗度を返す
 *     $gameQuest.getProgress(XXXX); // XXXXは管理ID
 *
 *   ・進捗度を1増加させる
 *     $gameQuest.incProgress(XXXX); // XXXXは管理ID
 *
 *   ・進捗度を1減少させる
 *     $gameQuest.decProgress(XXXX); // XXXXは管理ID
 *
 *
 * ==============================================================================
 *
 * @param quest_list
 * @text 依頼リスト
 * @desc 依頼を登録します。
 * @type struct<Quest>[]
 * @default []
 *
 *
 * @param quest_kind
 * @text 依頼種別
 * @desc 依頼種別の表示設定を行います。
 *
 * @param kind_all
 * @text 「全て」表示文字列
 * @desc 依頼種別「全て」で表示する文字列を設定します。
 * @default 全て
 * @parent quest_kind
 *
 * @param kind_enemy
 * @text 「エネミー」表示文字列
 * @desc 依頼種別「エネミー討伐」で表示する文字列を設定します。依頼詳細のラベルとしても使用されます。
 * @default 討伐
 * @parent quest_kind
 *
 * @param kind_item
 * @text 「アイテム納品」表示文字列
 * @desc 依頼種別「アイテム納品」で表示する文字列を設定します。依頼詳細のラベルとしても使用されます。
 * @default 納品
 * @parent quest_kind
 *
 * @param kind_etc
 * @text 「その他」表示文字列
 * @desc 依頼種別「その他」で表示する文字列を設定します。
 * @default その他
 * @parent quest_kind
 *
 * @param quest_var
 * @text クエスト番号変数
 * @desc スクリプト:$gameQuest.no() で参照可能な変数です。クエスト番号を代入し数字記載を減らすことを目的としています。
 * @type variable
 * @default 0
 *
 * @param plugin_message
 * @text 表示メッセージ設定
 * @desc 画面に表示する文字列の設定を行います。
 *
 * @param yes_command
 * @text 確認了解メッセージ
 * @desc 確認ウィンドウ内コマンド:Yesのときに表示される文章を設定します。
 * @type text
 * @default はい
 * @parent plugin_message
 *
 * @param no_command
 * @text 確認拒否メッセージ
 * @desc 確認ウィンドウ内コマンド:Noのときに表示される文章を設定します。
 * @type text
 * @default いいえ
 * @parent plugin_message
 *
 * @param start_message
 * @text 掲示板初期メッセージ
 * @desc 掲示板を開いた際に表示される文章を設定します。
 * @type note
 * @default "カテゴリを選択し、受けたい依頼を指定してください。"
 * @parent plugin_message
 *
 * @param order_message
 * @text 依頼受注確認メッセージ
 * @desc 依頼を受ける際に表示される文章を指定します。
 * @type note
 * @default "この依頼を受けますか？"
 * @parent plugin_message
 *
 * @param cancel_message
 * @text 依頼中止確認メッセージ
 * @desc 依頼をキャンセルする際に表示される文章を指定します。
 * @type note
 * @default "この依頼を中止しますか？"
 * @parent plugin_message
 *
 * @param really_cancel_message
 * @text 依頼中止確認メッセージ2
 * @desc 進行中の依頼をキャンセルする際に表示される文章を指定します。
 * @type note
 * @default "進行状況が初期化されます。\n本当にこの依頼を中止しますか？"
 * @parent plugin_message
 *
 * @param start_menu_message
 * @text メニュー初期メッセージ
 * @desc メニューの掲示板を開いた際に表示される文章を設定します。
 * @type note
 * @default "受けている依頼を確認します。"
 * @parent plugin_message
 *
 *
 * @param quest_popup
 * @text ポップアップ設定
 * @desc 依頼の進行状況が更新されたときにプレイヤーへ表示するポップアップの設定です。
 *
 * @param popup_report_format
 * @text 条件全達成通知
 * @desc 依頼完了条件をすべて満たした際に表示するポップアップメッセージの書式です。制御文字が使えます。($1:依頼名称)
 * @default \c[2]「$1」\c[0]完了条件達成！
 * @parent quest_popup
 *
 * @param popup_report_se
 * @text 条件全達成通知SE
 * @desc 依頼完了条件をすべて満たした際に表示するポップアップのSE設定です。
 * @type struct<se>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * @parent quest_popup
 *
 * @param popup_add_format
 * @text 依頼追加通知
 * @desc 依頼が追加登録された際に表示するポップアップメッセージの書式です。制御文字が使えます。($1:依頼名称)
 * @default 新規依頼追加！\c[2]「$1」\c[0]
 * @parent quest_popup
 *
 * @param popup_add_se
 * @text 依頼追加通知SE
 * @desc 依頼が追加登録された際に表示するポップアップのSE設定です。
 * @type struct<se>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * @parent quest_popup
 *
 * @param popup_lostItem_format
 * @text アイテム納品完了通知
 * @desc アイテムを納品した際に表示するポップアップメッセージの書式です。制御文字が使えます。($1:アイテム名 $2:個数)
 * @default 「$1」を$2個渡した。
 * @parent quest_popup
 *
 * @param popup_update_format_1
 * @text 条件更新通知1(未使用)
 * @desc 依頼完了条件を一部達成した際に表示するポップアップメッセージの書式です。制御文字が使えます。($1:依頼名称)
 * @default \c[2]「$1」\c[0]完了条件更新！
 * @parent quest_popup
 *
 * @param popup_update_format_2
 * @text 条件更新通知2(未使用)
 * @desc 条件更新通知1の後に表示する討伐依頼用詳細メッセージの書式です。制御文字が使えます。($1:エネミー名 $2:必要数)
 * @default $1 -> $2体討伐！
 * @parent quest_popup
 *
 * @param popup_update_format_3
 * @text 条件更新通知3(未使用)
 * @desc 条件更新通知1の後に表示する納品依頼用詳細メッセージの書式です。制御文字が使えます。($1:エネミー名 $:必要数)
 * @default $1 -> $2個入手！
 * @parent quest_popup
 *
 *
 * @param quest_icon
 * @text 掲示板用アイコン
 * @desc 掲示板で使用するアイコンを指定します。
 *
 * @param new_icon
 * @text 新着アイコン
 * @desc 新しい依頼に表示するアイコンを指定します。(ボックスを右クリック→アイコンセットビューア)
 * @type text
 * @min 0
 * @default 238
 * @parent quest_icon
 *
 * @param order_icon
 * @text 進行中アイコン
 * @desc 進行中の依頼に表示するアイコンを指定します。(ボックスを右クリック→アイコンセットビューア)
 * @type text
 * @min 0
 * @default 236
 * @parent quest_icon
 *
 * @param complete_icon
 * @text 報告可能アイコン
 * @desc 報告可能な依頼に表示するアイコンを指定します。(ボックスを右クリック→アイコンセットビューア)
 * @type text
 * @min 0
 * @default 227
 * @parent quest_icon
 *
 *
 * @param quest_detail_setting
 * @text 依頼詳細書式設定
 * @desc 依頼詳細ウィンドウの書式を設定します。
 * @type struct<QuestFormat>
 * @default {"block_space":"10","title":"","title_content":"$1","title_content_font_size":"20","requester":"","requester_label":"　依頼人:","requester_label_font_size":"14","requester_content":"$1","requester_content_font_size":"16","detail":"","detail_label":"依頼内容:","detail_label_font_size":"14","detail_content":"\"　$1\"","detail_content_font_size":"16","detail_content_max_line":"4","target":"","target_label":"$1対象:","target_label_font_size":"14","target_content":"　$1","target_content_font_size":"16","target_number_1":": $1","target_number_font_size_1":"16","target_number_2":": $2 / $1","target_number_font_size_2":"16","target_content_max_line":"4","reward":"","reward_label":"報　　酬:","reward_label_font_size":"14","reward_content":"　$1","reward_content_font_size":"16","reward_number_1":": $1","reward_number_font_size_1":"16","reward_content_max_line":"4"}
 *
 *
 * @param board_setting
 * @text 画面:掲示板設定
 * @desc 掲示板画面の設定を行います。
 * @type struct<Board>
 * @default {"help_window":"{\"x\":\"0\",\"y\":\"0\",\"w\":\"816\",\"h\":\"108\"}","kind_window":"{\"x\":\"0\",\"y\":\"112\",\"w\":\"300\",\"h\":\"108\"}","list_window":"{\"x\":\"0\",\"y\":\"224\",\"w\":\"300\",\"h\":\"396\"}","detail_window":"{\"x\":\"304\",\"y\":\"112\",\"w\":\"512\",\"h\":\"508\"}","background":"","common_event":"0"}
 *
 *
 * @param menu_setting
 * @text 画面:メニュー設定
 * @desc メニューの掲示板画面の設定を行います。
 * @type struct<Menu>
 * @default {"title":"依頼","help_window":"{\"x\":\"0\",\"y\":\"0\",\"w\":\"816\",\"h\":\"108\"}","kind_window":"{\"x\":\"0\",\"y\":\"112\",\"w\":\"300\",\"h\":\"108\"}","list_window":"{\"x\":\"0\",\"y\":\"224\",\"w\":\"300\",\"h\":\"396\"}","detail_window":"{\"x\":\"304\",\"y\":\"112\",\"w\":\"512\",\"h\":\"508\"}","background":""}
 *
*/
/*~struct~Quest:
 *
 * @param questNo
 * @text 管理ID
 * @desc 依頼管理用のIDです。他の依頼IDと被らない整数を指定します。
 * @type number
 * @min 1
 * @max 99999
 *
 * @param questName
 * @text 名称
 * @desc 依頼の名称として表示される文字列です。
 * @type text
 *
 * @param questLevel
 * @text 難易度
 * @desc 依頼の難易度を指定してください。(掲示板にて表示対象とする依頼の難易度を指定できます)
 * @type select
 * @option 1
 * @option 2
 * @option 3
 * @option 4
 * @option 5
 * @option 6
 * @option 7
 * @option 8
 * @option 9
 * @option 10
 * @option 11
 * @option 12
 * @option 13
 * @option 14
 * @option 15
 * @default 1
 *
 * @param questNote
 * @text 内容
 * @desc 依頼の内容として表示される文字列です。複数行記述可能(別のパラメータで最大行の指定あり)で、制御文字に対応します。
 * @type note
 *
 * @param questRequester
 * @text 依頼者
 * @desc 依頼の依頼人として表示される文字列です。
 * @type text
 *
 * @param questKind
 * @text 種類
 * @desc 依頼の種類を選択します。その後、種別に合う[依頼詳細](プラグインパラメータ)を選択して設定してください。
 * @type select
 * @option エネミー討伐
 * @value enemy
 * @option アイテム納品
 * @value item
 * @option その他
 * @value etc
 * @default enemy
 *
 * @param questOrderLimit
 * @text 依頼制限
 * @desc 依頼のクリア可能回数を1度のみにするか、何度でも受注してクリア可能かを選択します。
 * @type select
 * @option 何度でも
 * @value 0
 * @option 1度だけ
 * @value 1
 * @default 0
 *
 * @param questEnemy
 * @text 依頼詳細(エネミー)
 * @desc [エネミー討伐]依頼の詳細を設定します。
 * @type struct<QuestEnemy>[]
 *
 *
 * @param questItemTree
 * @text 依頼詳細(アイテム)
 *
 * @param questItem
 * @text 納品対象(アイテム)
 * @desc [アイテム納品]依頼の納品対象(アイテム)を設定します。
 * @type struct<QuestItem>[]
 * @parent questItemTree
 *
 * @param questWeapon
 * @text 納品対象(武器)
 * @desc [アイテム納品]依頼の納品対象(武器)を設定します。
 * @type struct<QuestWeapon>[]
 * @parent questItemTree
 *
 * @param questArmor
 * @text 納品対象(防具)
 * @desc [アイテム納品]依頼の納品対象(防具)を設定します。
 * @type struct<QuestArmor>[]
 * @parent questItemTree
 *
 * @param questRewardTree
 * @text 報酬詳細
 *
 * @param questRewardItem
 * @text 報酬(アイテム)
 * @desc 依頼達成報酬(アイテム)を指定します。
 * @type struct<RewardItem>[]
 * @parent questRewardTree
 *
 * @param questRewardWeapon
 * @text 報酬(武器)
 * @desc 依頼達成報酬(武器)を指定します。
 * @type struct<RewardWeapon>[]
 * @parent questRewardTree
 *
 * @param questRewardArmor
 * @text 報酬(防具)
 * @desc 依頼達成報酬(防具)を指定します。
 * @type struct<RewardArmor>[]
 * @parent questRewardTree
 *
 * @param questRewardGold
 * @text 報酬(お金)
 * @desc 依頼達成報酬(お金)を指定します。
 * @type number
 * @min 0
 * @max 999999
 * @default 0
 * @parent questRewardTree
 *
 * @param questRewardEtc
 * @text 報酬(その他)
 * @desc 依頼達成報酬を入力します。(報酬付与処理を自作してください)
 * @type text[]
 * @parent questRewardTree
 *
*/
/*~struct~RewardItem:
 *
 * @param item
 * @text アイテム報酬
 * @desc 報酬とするアイテムを指定します。
 * @type item
 * @default 0
 *
 * @param count
 * @text 報酬個数
 * @desc 上で指定したアイテムが貰える個数を指定します。
 * @type number
 * @min 1
 * @max 999
 * @default 1
 *
*/
/*~struct~RewardWeapon:
 *
 * @param weapon
 * @text 武器報酬
 * @desc 報酬とする武器を指定します。
 * @type weapon
 * @default 0
 *
 * @param count
 * @text 報酬個数
 * @desc 上で指定した武器が貰える個数を指定します。
 * @type number
 * @min 1
 * @max 999
 * @default 1
 *
*/
/*~struct~RewardArmor:
 *
 * @param armor
 * @text 防具報酬
 * @desc 報酬とする防具を指定します。
 * @type armor
 * @default 0
 *
 * @param count
 * @text 報酬個数
 * @desc 上で指定した防具が貰える個数を指定します。
 * @type number
 * @min 1
 * @max 999
 * @default 1
 *
*/
/*~struct~QuestEnemy:
 *
 * @param enemy
 * @text 討伐対象
 * @desc 討伐対象のエネミーを指定します。
 * @type enemy
 * @default 0
 *
 * @param count
 * @text 必要討伐数
 * @desc 上で指定したエネミーの必要討伐数を指定します。
 * @type number
 * @min 1
 * @max 999
 * @default 1
 *
*/
/*~struct~QuestItem:
 *
 * @param item
 * @text 納品アイテム
 * @desc 納品に必要なアイテムを指定します。
 * @type item
 * @default 0
 *
 * @param count
 * @text 必要個数
 * @desc 上で指定したアイテムの必要個数を指定します。
 * @type number
 * @min 1
 * @max 99
 * @default 1
 *
*/
/*~struct~QuestWeapon:
 *
 * @param weapon
 * @text 納品武器
 * @desc 納品に必要な武器を指定します。
 * @type weapon
 * @default 0
 *
 * @param count
 * @text 必要個数
 * @desc 上で指定した武器の必要個数を指定します。(装備品は個数に含まれません)
 * @type number
 * @min 1
 * @max 99
 * @default 1
 *
*/
/*~struct~QuestArmor:
 *
 * @param armor
 * @text 納品防具
 * @desc 納品に必要な防具を指定します。
 * @type armor
 * @default 0
 *
 * @param count
 * @text 必要個数
 * @desc 上で指定した防具の必要個数を指定します。(装備品は個数に含まれません)
 * @type number
 * @min 1
 * @max 99
 * @default 1
 *
*/
/*~struct~Board:
 *
 * @param help_window
 * @text ヘルプウィンドウ
 * @desc ヘルプウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param kind_window
 * @text 依頼種別ウィンドウ
 * @desc 依頼種別ウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param list_window
 * @text 依頼リストウィンドウ
 * @desc 依頼リストウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param detail_window
 * @text 依頼詳細ウィンドウ
 * @desc 依頼詳細ウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param background
 * @text 掲示板背景
 * @desc 掲示板画面の背景画像を指定します。
 * @type file
 * @require 1
 * @dir /img/pictures/
 *
 * @param common_event
 * @text クローズ時呼び出しコモン
 * @desc 掲示板画面を閉じたときに呼び出されるコモンイベントを指定します。
 * @type common_event
 *
*/
/*~struct~Menu:
 *
 * @param title
 * @text メニュー表示
 * @desc メニューに掲示板を開くコマンドを追加する際の表示名を指定します。(空白の場合非表示)
 * @default 依頼
 *
 * @param help_window
 * @text ヘルプウィンドウ
 * @desc ヘルプウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param kind_window
 * @text 依頼種別ウィンドウ
 * @desc 依頼種別ウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param list_window
 * @text 依頼リストウィンドウ
 * @desc 依頼リストウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param detail_window
 * @text 依頼詳細ウィンドウ
 * @desc 依頼詳細ウィンドウの設定をします。(デフォルト:0, 0, 816, 108)
 * @type struct<Window>
 *
 * @param background
 * @text メニュー背景
 * @desc 依頼メニュー画面の背景画像を指定します。
 * @type file
 * @require 1
 * @dir /img/pictures/
 *
*/
/*~struct~QuestFormat:
 *
 * @param block_space
 * @text ブロック毎のスペース
 * @desc ブロックの間隔を指定したピクセル分、開けます。
 * @type number
 * @min 0
 * @max 20
 *
 * @param title
 * @text タイトルブロック
 *
 * @param title_content
 * @text 表示文字列
 * @desc $1:依頼名
 * @type text
 * @parent title
 *
 * @param title_content_font_size
 * @text 文字列フォントサイズ
 * @desc 表示文字列のフォントサイズ
 * @type num
 * @min 0
 * @parent title
 *
 *
 * @param requester
 * @text 依頼人ブロック
 *
 * @param requester_label
 * @text ラベル文字
 * @desc 空白でラベル行を非表示にします。
 * @type text
 * @parent requester
 *
 * @param requester_label_font_size
 * @text ラベルフォントサイズ
 * @desc ラベルのフォントサイズ
 * @type num
 * @min 0
 * @parent requester
 *
 * @param requester_content
 * @text 表示文字列
 * @desc $1:依頼人名
 * @type text
 * @parent requester
 *
 * @param requester_content_font_size
 * @text フォントサイズ
 * @desc 表示文字列のフォントサイズ
 * @type num
 * @min 0
 * @parent requester
 *
 *
 * @param detail
 * @text 内容詳細ブロック
 *
 * @param detail_label
 * @text ラベル文字
 * @desc 空白でラベル行を非表示。
 * @type text
 * @parent detail
 *
 * @param detail_label_font_size
 * @text ラベルフォントサイズ
 * @desc ラベルのフォントサイズ
 * @type num
 * @min 0
 * @parent detail
 *
 * @param detail_content
 * @text 表示文字
 * @desc $1:依頼内容
 * @type note
 * @parent detail
 *
 * @param detail_content_font_size
 * @text フォントサイズ
 * @desc 表示文字のフォントサイズ
 * @type num
 * @min 0
 * @parent detail
 *
 * @param detail_content_max_line
 * @text 依頼内容最大行数
 * @desc 依頼内容文字列の最大行数を設定します。ここで指定した行数分、表示領域を確保します。
 * @type number
 * @min 1
 * @max 10
 * @parent detail
 *
 *
 * @param target
 * @text 対象ブロック
 *
 * @param target_label
 * @text ラベル文字
 * @desc 空白でラベル行を非表示。$1:討伐 or 納品
 * @type text
 * @parent target
 *
 * @param target_label_font_size
 * @text ラベルフォントサイズ
 * @desc ラベルのフォントサイズ
 * @type num
 * @min 0
 * @parent target
 *
 * @param target_content
 * @text 表示文字
 * @desc $1:対象(アイテム or エネミー)の名称
 * @type text
 * @parent target
 *
 * @param target_content_font_size
 * @text フォントサイズ
 * @desc 表示文字のフォントサイズ
 * @type num
 * @min 0
 * @parent target
 *
 * @param target_number_1
 * @text 対象数文字1
 * @desc 対象数に関する表示(依頼受注前)。$1:対象の必要数、$2:対象の所持 or 討伐数
 * @type text
 * @parent target
 *
 * @param target_number_font_size_1
 * @text 対象数フォントサイズ1
 * @desc 対象数文字1のフォントサイズ
 * @type num
 * @min 0
 * @parent target
 *
 * @param target_number_2
 * @text 対象数文字2
 * @desc 対象数に関する表示(依頼受注後)。$1:対象の必要数、$2:対象の所持 or 討伐数
 * @type text
 * @parent target
 *
 * @param target_number_font_size_2
 * @text 対象数フォントサイズ2
 * @desc 対象数文字2のフォントサイズ
 * @type num
 * @min 0
 * @parent target
 *
 * @param target_content_max_line
 * @text 対象最大行数
 * @desc 対象文字列の最大行数を設定します。ここで指定した行数分、表示領域を確保します。
 * @type number
 * @min 1
 * @max 10
 * @parent target
 *
 *
 * @param reward
 * @text 報酬ブロック
 *
 * @param reward_label
 * @text ラベル文字
 * @desc 空白でラベル行を非表示。
 * @type text
 * @parent reward
 *
 * @param reward_label_font_size
 * @text ラベルフォントサイズ
 * @type num
 * @min 0
 * @parent reward
 *
 * @param reward_content
 * @text 表示文字
 * @desc $1:対象(アイテム)の名称
 * @type text
 * @parent reward
 *
 * @param reward_content_font_size
 * @text フォントサイズ
 * @desc 表示文字のフォントサイズ
 * @type num
 * @min 0
 * @parent reward
 *
 * @param reward_number_1
 * @text 報酬数文字
 * @desc 報酬の数についての表示。$1:その報酬が貰える数
 * @type text
 * @parent reward
 *
 * @param reward_number_font_size_1
 * @text 報酬数フォントサイズ
 * @desc 報酬数文字のフォントサイズ
 * @type num
 * @min 0
 * @parent reward
 *
 * @param reward_content_max_line
 * @text 報酬最大行数
 * @desc 報酬文字列の最大行数を設定します。ここで指定した行数分、表示領域を確保します。
 * @type number
 * @min 1
 * @max 10
 * @parent reward
 *
*/
/*~struct~Window:
 *
 * @param x
 * @text ウィンドウX座標
 * @desc ウィンドウのX座標を指定します。(左上を0とし、数字が大きいほど右に表示されます)
 * @type combo
 * @option 0
 *
 * @param y
 * @text ウィンドウY座標
 * @desc ウィンドウのY座標を指定します。(左上を0とし、数字が大きいほど下に表示されます)
 * @type combo
 * @option 0
 *
 * @param w
 * @text ウィンドウ横幅
 * @desc ウィンドウの横幅を指定します。
 * @type combo
 * @option 816
 *
 * @param h
 * @text ウィンドウ高さ
 * @desc ウィンドウの高さを指定します。
 * @type combo
 * @option 108
 *
*/
/*~struct~Se:
 *
 * @param name
 * @text ファイル名
 * @desc 再生するSEファイル名を指定します。(audio/se以下のファイルが対象)
 * @type file
 * @require 1
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @desc 再生するSEの音量を指定します。
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 再生するSEのピッチを指定します。
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相
 * @desc 再生するSEの位相を指定します。
 * @type number
 * @min -100
 * @max 100
 *
*/

var Imported = Imported || {};
Imported.FC_QuestSystem = true;

(function (_global) {
    'use strict';

    const PN = "FC_QuestSystem";
    const ErrPre = "[依頼システム] ";
    const Kind = {
        All:"all",
        Enemy:"enemy",
        Item:"item",
        Etc:"etc",
        Weapon:"weapon",
        Armor:"armor",
        Gold:"gold",
        None:"none",
    };

    const paramParse = function(obj) {
        return JSON.parse(JSON.stringify(obj, paramReplace));
    }

    const paramReplace = function(key, value) {
        try {
            return JSON.parse(value || null);
        } catch (e) {
            return value;
        }
    };

    const parameters = paramParse(PluginManager.parameters(PN));
    const parameters_info = paramParse(PluginManager.parameters("GetInformation"));

    const Params = {
        "QuestList" : parameters.quest_list,
        "KindSet" : {
            "all" : parameters.kind_all,
            "enemy" : parameters.kind_enemy,
            "item" : parameters.kind_item,
            "etc" : parameters.kind_etc,
        },
        "Var" : parameters.quest_var,
        "Board" : {
            "Background" : parameters.board_setting.background,
            "HelpWindow" : parameters.board_setting.help_window,
            "KindWindow" : parameters.board_setting.kind_window,
            "ListWindow" : parameters.board_setting.list_window,
            "DetailWindow" : parameters.board_setting.detail_window,
            "CommonEvent" : parameters.board_setting.common_event,
        },
        "Menu" : {
            "Title" : parameters.menu_setting.title,
            "Background" : parameters.menu_setting.background,
            "HelpWindow" : parameters.menu_setting.help_window,
            "KindWindow" : parameters.menu_setting.kind_window,
            "ListWindow" : parameters.menu_setting.list_window,
            "DetailWindow" : parameters.menu_setting.detail_window,
        },
        "QuestFormat" : {
            "BlockSpace" : parameters.quest_detail_setting.block_space,
            "Title" : {
                "Content" : parameters.quest_detail_setting.title_content,
                "ContentFontSize" : parameters.quest_detail_setting.title_content_font_size,
            },
            "Requester" : {
                "Content" : parameters.quest_detail_setting.requester_content,
                "ContentFontSize" : parameters.quest_detail_setting.requester_content_font_size,
                "Label" : parameters.quest_detail_setting.requester_label,
                "LabelFontSize" : parameters.quest_detail_setting.requester_label_font_size,
            },
            "Detail" : {
                "Content" : parameters.quest_detail_setting.detail_content,
                "ContentFontSize" : parameters.quest_detail_setting.detail_content_font_size,
                "ContentMaxLine" : parameters.quest_detail_setting.detail_content_max_line,
                "Label" : parameters.quest_detail_setting.detail_label,
                "LabelFontSize" : parameters.quest_detail_setting.detail_label_font_size,
            },
            "Target" : {
                "Content" : parameters.quest_detail_setting.target_content,
                "ContentFontSize" : parameters.quest_detail_setting.target_content_font_size,
                "ContentMaxLine" : parameters.quest_detail_setting.target_content_max_line,
                "Number1" : parameters.quest_detail_setting.target_number_1,
                "NumberFontSize1" : parameters.quest_detail_setting.target_number_font_size_1,
                "Number2" : parameters.quest_detail_setting.target_number_2,
                "NumberFontSize2" : parameters.quest_detail_setting.target_number_font_size_2,
                "Label" : parameters.quest_detail_setting.target_label,
                "LabelFontSize" : parameters.quest_detail_setting.target_label_font_size,
            },
            "Reward" : {
                "Content" : parameters.quest_detail_setting.reward_content,
                "ContentFontSize" : parameters.quest_detail_setting.reward_content_font_size,
                "ContentMaxLine" : parameters.quest_detail_setting.reward_content_max_line,
                "Number1" : parameters.quest_detail_setting.reward_number_1,
                "NumberFontSize1" : parameters.quest_detail_setting.reward_number_font_size_1,
                "Label" : parameters.quest_detail_setting.reward_label,
                "LabelFontSize" : parameters.quest_detail_setting.reward_label_font_size,
            },
        },
        "PopupSet" : {
            "PopupReportFormat" : parameters.popup_report_format,
            "PopupReportSe" : parameters.popup_report_se,
            "PopupAddFormat" : parameters.popup_add_format,
            "PopupAddSe" : parameters.popup_add_se,
            "PopupLostItemFormat" : parameters.popup_lostItem_format,
            "PopupUpdateFormat1" : parameters.popup_update_format_1,
            "PopupUpdateFormat2" : parameters.popup_update_format_2,
            "PopupUpdateFormat3" : parameters.popup_update_format_3,
        },
        "MessageSet" : {
            "YesCommand" : parameters.yes_command,
            "NoCommand" : parameters.no_command,
            "StartMessage" : parameters.start_message,
            "OrderMessage" : parameters.order_message,
            "CancelMessage" : parameters.cancel_message,
            "ReallyCancelMessage" : parameters.really_cancel_message,
            "StartMenuMessage" : parameters.start_menu_message,
        },
        "IconSet" : {
            "NewIcon" : Number(parameters.new_icon || 0),
            "OrderIcon" : Number(parameters.order_icon || 0),
            "ReportIcon" : Number(parameters.complete_icon || 0),
        },
        "Etc" : {
            "InfoSw" : Number(parameters_info["Info Disable Switch Id"] || 0),
        },
    };

    //=========================================================================
    // GameQuest
    //  ・依頼システム クラスを定義します。
    //
    //=========================================================================
    class GameQuest {
        constructor() {
            this.initMember();
            this.setQuestData();
        }
        initMember() {
            this._questStatus = {};
            this._data = {};
        }
        getSystemData() {
            if(this._questStatus == null) {
                return {"questStatus":{}};
            }
            return {"questStatus":this._questStatus};
        }
        setSystemData(data) {
            if(this._questStatus == null) {
                this.initMember();
            }
            if(data && data.questStatus != null) {
                this._questStatus = data.questStatus;
            }
        }
        setQuestData() {
            let quest, questNo, cnt, i, j, text;

            cnt = Params.QuestList.length;
            for(i = 0; i < cnt; i++) {
                quest = Params.QuestList[i];
                questNo = String(quest.questNo);
                if(questNo in this._data) {
                    text = "";
                    for(j = 0; j < cnt; j++) {
                        if(questNo == Params.QuestList[j].questNo) {
                            text = text + (j + 1) + ",";
                        }
                    }
                    text = text.replace(/,$/, "");
                    throw new Error(`${ErrPre}管理IDが重複しています。 管理ID:${questNo} リスト:${text}番目`);
                } else {
                    this.setQuest(quest);
                }
            }
        }
        getQuestData(no) {
            if(no == null) {
                return null;
            }
            no = String(no);
            if(this._data && no in this._data) {
                return this._data[no];
            }
            return null;
        }
        getQuestList(type, kind, levelFilter) {
            let tmp, key, i, cnt, data;
            tmp = {};

            if(type == null) {
                type = "non";
            }
            if(levelFilter == null) {
                levelFilter = [];
            }
            if(kind == null) {
                kind = Kind.None;
            }
            cnt = levelFilter.length;
            for(key in this._data) {
                data = this._data[key];
                if(type != "all"){
                    if(key in this._questStatus) {
                        if(!this._questStatus[key].visible) {
                            data = null;
                        }
                    } else {
                        data = null;
                    }
                    if(type == "order" && data) {
                        if(!this._questStatus[key].order) {
                            data = null;
                        }
                    }
                    if(type == "enable" && data) {
                        if(!this._questStatus[key].enable) {
                            data = null;
                        }
                    }
                    if(type == "disable" && data) {
                        if(this._questStatus[key].enable) {
                            data = null;
                        }
                    }
                }
                if(data && cnt > 0 && !levelFilter.contains(data.level)) {
                    data = null;
                }
                if(data && kind != Kind.None && kind != Kind.All && data.kind != kind) {
                    data = null;
                }
                if(data) {
                    tmp[key] = data;
                }
            }
            return tmp;
        }
        setQuest(quest) {
            let questNo, level, targets, target, rewards, reward, kind, i, cnt;
            targets = [];
            rewards = {
                "weapon": [],
                "armor": [],
                "item": [],
                "etc": [],
                "gold": [],
                "count": 0,
            };
            questNo = String(quest.questNo);

            kind = quest.questKind;
            if(kind == Kind.Enemy && quest.questEnemy) {
                // エネミー討伐
                cnt = quest.questEnemy.length;
                for(i = 0; i < cnt; i++) {
                    target = quest.questEnemy[i];
                    targets.push({"target": target.enemy, "kind":Kind.Enemy, "count": target.count});
                }

            } else if(kind == Kind.Item) {
                if(quest.questItem) {
                    // アイテム納品(Item)
                    cnt = quest.questItem.length;
                    for(i = 0; i < cnt; i++) {
                        target = quest.questItem[i];
                        targets.push({"target": target.item, "kind":Kind.Item, "count": target.count});
                    }
                }
                if(quest.questWeapon) {
                    // アイテム納品(Weapon)
                    cnt = quest.questWeapon.length;
                    for(i = 0; i < cnt; i++) {
                        target = quest.questWeapon[i];
                        targets.push({"target": target.weapon, "kind":Kind.Weapon, "count": target.count});
                    }
                }
                if(quest.questArmor) {
                    // アイテム納品(Armor)
                    cnt = quest.questArmor.length;
                    for(i = 0; i < cnt; i++) {
                        target = quest.questArmor[i];
                        targets.push({"target": target.armor, "kind":Kind.Armor, "count": target.count});
                    }
                }

            } else {
                // Etc
            }

            if(quest.questRewardWeapon && quest.questRewardWeapon.length > 0) {
                // 武器報酬
                cnt = quest.questRewardWeapon.length;
                for(i = 0; i < cnt; i++) {
                    reward = quest.questRewardWeapon[i];
                    rewards.weapon.push({"target": reward.weapon, "kind": Kind.Weapon, "count": reward.count});
                    rewards.count++;
                }

            }
            if(quest.questRewardArmor && quest.questRewardArmor.length > 0) {
                // 防具報酬
                cnt = quest.questRewardArmor.length;
                for(i = 0; i < cnt; i++) {
                    reward = quest.questRewardArmor[i];
                    rewards.armor.push({"target": reward.armor, "kind": Kind.Armor, "count": reward.count});
                    rewards.count++;
                }

            }
            if(quest.questRewardItem && quest.questRewardItem.length > 0) {
                // アイテム報酬
                cnt = quest.questRewardItem.length;
                for(i = 0; i < cnt; i++) {
                    reward = quest.questRewardItem[i];
                    rewards.item.push({"target": reward.item, "kind": Kind.Item, "count": reward.count});
                    rewards.count++;
                }

            }
            if(quest.questRewardGold && quest.questRewardGold > 0) {
                // お金報酬
                rewards.gold.push({"target": 0, "kind": Kind.Gold, "count": quest.questRewardGold});
                rewards.count++;
            }
            if(quest.questRewardEtc && quest.questRewardEtc.length > 0) {
                // その他報酬
                cnt = quest.questRewardEtc.length;
                for(i = 0; i < cnt; i++) {
                    reward = quest.questRewardEtc[i];
                    rewards.etc.push({"target": reward, "kind": Kind.Etc, "count": 0});
                    rewards.count++;
                }

            }

            this._data[questNo] = {
                "no": questNo,
                "name": quest.questName,
                "note": quest.questNote,
                "request": quest.questRequester,
                "limit": quest.questOrderLimit,
                "kind": kind,
                "level": quest.questLevel,
                "targets": targets,
                "rewards": rewards,
                getTargetCount : function(id) {
                    let target;
                    target = this.targets.filter(function(info){
                        return info.target == id;
                    });
                    if(!target) {
                        return 0;
                    }
                    // 対象配列は1つだけ
                    return target[0].count;
                },
            };
        }
        setQuestStatus(no, status) {
            this._questStatus[no] = status;
        }
        createQuestStatus(no) {
            let quest, targets, params, kind, target,i, cnt, subKind;
            quest = this.getQuestData(no);
            params = {
                "visible":true,
                "enable":true,
                "order":false,
                "new":true,
                "report":false,
                "complete":false,
                "completeCount":0,
                "progress": 0,
                "extend":{}
            };
            if(!quest) {
                params.visible = false;
                return params;
            }
            kind = this.getKind(quest);
            targets = quest.targets;
            cnt = 0;
            i = 0;
            if(targets) {
                cnt = targets.length;
            }
            switch(true) {
                case this.isKindEnemy(quest) :
                    if(!targets || targets.length < 1) {
                        break;
                    }
                    while(i < cnt) {
                        target = targets[i++].target;
                        if(target < 1) {
                            continue;
                        }
                        params.extend[kind + '||' + target] = [0, false];
                    }
                    break;
                case this.isKindItem(quest) :
                    if(!targets || targets.length < 1) {
                        break;
                    }
                    while(i < cnt) {
                        target = targets[i].target;
                        subKind = targets[i].kind;
                        i++;
                        if(target < 1) {
                            continue;
                        }
                        params.extend[kind + '||' + subKind + '||' + target] = [0, false];
                    }
                    break;
            }

            if(!this.isKindEtc(quest) && Object.keys(params.extend).length < 1) {
                params.visible = false;
            }
            return params;
        }
        updateEnemyQuestStatus(target, value) {
            let list, status, kind, result, keys, id;
            kind = Kind.Enemy;
            list = Object.keys(this._data).filter(function(no) {
                return this.isOrder(no) && this.isKindEnemy(this._data[no]);
            }, this);
            list.forEach(function(no) {
                status = this.getQuestStatus(no);
                if(Object.keys(status.extend).length < 1) {
                    return;
                }

                Object.keys(status.extend).forEach(function(key) {
                    keys = key.split("||");
                    kind = keys[0];
                    id = Number(keys[1]);
                    if(id == target) {
                        status.extend[key][0] += value;

                        // if(this.isTargetUpdate(no, id, status.extend[key][0])) {
                        //     this.questProgressPopup(no, id, status.extend[key][0]);
                        // }
                    }
                }, this);

                result = this.canReport(no)
                if(!this.isReport(no) && result) {
                    this.enableReport(no);
                }
            }, this);
        }
        updateItemQuestStatus(target, value) {
            let list, status, kind, result;
            kind = Kind.Item;
            if(value == 0) {
                return;
            }
            list = Object.keys(this._data).filter(function(no) {
                return this.isOrder(no) && this.isKindItem(this._data[no]);
            }, this);
            list.forEach(function(no) {
                if((this.isReport(no) && value > 0) || (!this.isReport(no) && value < 0))  {
                    return;
                }
                result = this.canReport(no);

                if(!this.isReport(no) && result) {
                    this.enableReport(no);
                } else  if(this.isReport(no) && !result){
                    this.disableReport(no);
                }
            }, this);
        }
        clearQuestExStatus(no) {
            let status, i, cnt;
            status = this.getQuestStatus(no);
            i = 0;

            if(!status) {
                return;
            }

            cnt = Object.keys(status.extend).length;
            if(cnt < 1) {
                return;
            }

            Object.keys(status.extend).forEach(function(key){
                this[key] = [0, false];
            }, status.extend);
        }
        getQuestStatus(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no];
            }
            return null;
        }
        showQuest(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].visible = true;
            }
        }
        hideQuest(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].visible = false;
            }
        }
        isOnce(no) {
            if(this._data && no in this._data) {
                return this._data[no].limit == 1;
            }
            return true;
        }
        isVisible(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].visible;
            }
            return false;
        }
        isOrder(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].order;
            }
            return false;
        }
        isComplete(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].complete;
            }
            return false;
        }
        isReport(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].report;
            }
            return false;
        }
        isNew(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].new;
            }
            return false;
        }
        enableOrder(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].order = true;
                this.disableNew(no);
                if(this.canReport(no)) {
                    this.enableReport(no);
                }
            }
        }
        disableOrder(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].order = false;
                this.disableNew(no);
                this.disableReport(no);
                this.clearQuestExStatus(no);
                this.resetProgress(no);
            }
        }
        isEnable(no) {
            if(this._questStatus && no in this._questStatus) {
                return this._questStatus[no].enable;
            }
            return false;
        }
        enableQuest(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].enable = true;
            }
        }
        disableQuest(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].enable = false;
            }
        }
        enableReport(no) {
            if(!this._questStatus || !(no in this._questStatus)) {
                return ;
            }
            this._questStatus[no].report = true;
            this.popupReport(no);
        }
        disableReport(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].report = false;
            }
        }
        enableComplete(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].complete = true;
            }
        }
        disableComplete(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].complete = false;
            }
        }
        enableNew(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].new = true;
            }
        }
        disableNew(no) {
            if(this._questStatus && no in this._questStatus) {
                this._questStatus[no].new = false;
            }
        }
        openBoard(levelFilter) {
            SceneManager.push(Scene_Board);
            SceneManager.prepareNextScene(levelFilter);
        }
        openBoardMenu() {
            SceneManager.push(Scene_BoardMenu);
        }
        addQuest(no, popup) {
            let questStatus, questVisibleOld;

            if(no == null) {
                return false;
            }
            if(popup == null) {
                popup = true;
            }
            if(this._questStatus && no in this._questStatus) {
                questStatus = this.getQuestStatus(no);
                questVisibleOld = questStatus.visible;
                this.showQuest(no);
            } else {
                this.setQuestStatus(no, this.createQuestStatus(no));
            }
            if(popup && !questVisibleOld) {
                this.popupAdd(no);
            }
            return true;
        }
        resetQuest(no) {
            if(no == null) {
                return false;
            }
            this.setQuestStatus(no, this.createQuestStatus(no));
        }
        addQuestAll() { // デバッグ用、全ての依頼を表示させる
            if (!Utils.isOptionValid('test') || !Utils.isNwjs()) {
                return;
            }

            let list;
            list = this.getQuestList("all");

            Object.keys(list).forEach(function(no){
                this.addQuest(no, false);
            }, this);
        }
        removeQuest(no) {
            if(no != null && this._questStatus && no in this._questStatus) {
                this.hideQuest(no);
                return true;
            }
            return false;
        }
        removeQuestAll() { // デバッグ用、全ての依頼を非表示にさせる
            if (!Utils.isOptionValid('test') || !Utils.isNwjs()) {
                return;
            }

            let list;
            list = this.getQuestList("all");

            Object.keys(list).forEach(function(no){
                this.removeQuest(no, false);
            }, this);
        }
        getKind(quest) {
            switch(true) {
                case this.isKindEnemy(quest) :
                    return Kind.Enemy;
                case this.isKindItem(quest) :
                    return Kind.Item;
                case this.isKindEtc(quest) :
                    return Kind.Etc;
                default :
                    return null;
            }
        }
        getQuestIcon(no) {
            let status;
            status = this.getQuestStatus(no);

            if(!status) {
                return 0;
            }
            switch(true) {
                case status.report :
                    return Params.IconSet.ReportIcon;
                case status.order :
                    return Params.IconSet.OrderIcon;
                case status.new :
                    return Params.IconSet.NewIcon;
                default :
                    return 0;
            }
        }
        canReport(no) {
            let status, quest, result;
            quest = this.getQuestData(no);
            status = this.getQuestStatus(no);

            if(!status || !status.extend || Object.keys(status.extend).length < 1) {
                return false;
            }

            result = Object.keys(status.extend).every(function(key) {
                let kind, target, keys, cnt, needCnt, subKind;
                keys = key.split("||");
                kind = keys[0];
                cnt = 0;

                switch(true) {
                    case kind == Kind.Enemy :
                        target = Number(keys[1]);
                        cnt = status.extend[key][0];
                        needCnt = this.getTargetCount(target);
                        return cnt >= needCnt;
                    case kind == Kind.Item :
                        subKind = keys[1];
                        target = Number(keys[2]);
                        if(subKind == Kind.Item) {
                        	cnt = $gameParty.numItems($dataItems[target]);
                        } else if(subKind == Kind.Weapon) {
                            cnt = $gameParty.numItems($dataWeapons[target]);
                        } else if(subKind == Kind.Armor) {
                            cnt = $gameParty.numItems($dataArmors[target]);
                        }
                        needCnt = this.getTargetCount(target);
                        return cnt >= needCnt;
                }
            }, quest);

            return result;
        }
        isKindEnemy(info) {
            return info && info.kind == Kind.Enemy;
        }
        isKindItem(info) {
            return info && info.kind == Kind.Item;
        }
        isKindEtc(info) {
            return info && info.kind == Kind.Etc;
        }
        isKindWeapon(info) {
            return info && info.kind == Kind.Weapon;
        }
        isKindArmor(info) {
            return info && info.kind == Kind.Armor;
        }
        isKindGold(info) {
            return info && info.kind == Kind.Gold;
        }
        hasReport() {
            let status;
            return Object.keys(this._questStatus).some(function(no) {
                status = this.getQuestStatus(no);
                return status.report;
            }, this)
        }
        gainRewardAll() {
            let list;
            list = Object.keys(this._data).filter(function(no) {
                return this.isOrder(no) && this.isReport(no);
            }, this);

            list.forEach(function(no) {
                this.gainReward(no);
            }, this);
        }
        gainReward(no) {
            let quest, info, i, cnt, item;
            quest = this.getQuestData(no);

            if(this.isKindItem(quest)) {
                this.loseTarget(no);
            }

            $gameSwitches._data[Params.Etc.InfoSw] = false;
            CommonPopupManager._popEnable = CommonPopupManager.popEnable();

            Object.keys(quest.rewards).forEach(function(kind) {
                info = quest.rewards[kind];
                if(!(info instanceof Array)) {
                    return;
                }
                cnt = info.length;
                if(cnt < 1) {
                    return;
                }
                for(i = 0; i < cnt; i++) {
                    switch(true) {
                        case this.isKindWeapon(info[i]):
                            $gameParty.gainItem($dataWeapons[info[i].target], info[i].count);
                            break;
                        case this.isKindArmor(info[i]):
                            $gameParty.gainItem($dataArmors[info[i].target], info[i].count);
                            break;
                        case this.isKindItem(info[i]):
                            $gameParty.gainItem($dataItems[info[i].target], info[i].count);
                            break;
                        case this.isKindGold(info[i]):
                            $gameParty.gainGold(info[i].count);
                            break;
                        case this.isKindEtc(info[i]):
                            // CommonPopupManager.showInfo({}, info[i].target, null);
                            break;
                    }
                }
            }, this);
            $gameSwitches._data[Params.Etc.InfoSw] = true;
            CommonPopupManager._popEnable = CommonPopupManager.popEnable();
            this.completeQuest(no);
        }
        loseTarget(no) {
            let quest, i, cnt, item;
            quest = this.getQuestData(no);

            quest.targets.forEach(function(info) {
                this.popupLostItem(info);
                switch(true) {
                    case this.isKindItem(info):
                		$gameParty.loseItem($dataItems[info.target], info.count);
                        break;
                    case this.isKindWeapon(info):
                        $gameParty.loseItem($dataWeapons[info.target], info.count);
                        break;
                    case this.isKindArmor(info):
                        $gameParty.loseItem($dataArmors[info.target], info.count);
                        break;
                    case this.isKindGold(info):
                        $gameParty.loseGold(info.count);
                        break;
                }
            }, this);
        }
        completeQuest(no) {
            this.disableOrder(no);
            this.disableReport(no);
            this.disableComplete(no);
            this.incCompleteCount(no);
            this.resetProgress(no);
            if(this.isOnce(no)) {
                this.enableComplete(no);
                this.disableQuest(no);
            }
        }
        incCompleteCount(no){
            let status;
            status = this.getQuestStatus(no);
            status.completeCount++;
        }
        getCompleteCount(no){
            let status;
            status = this.getQuestStatus(no);
            return status.completeCount;
        }
        resetCompleteCount(no){
            let status;
            status = this.getQuestStatus(no);
            status.completeCount = 0;
        }
        getProgress(no){
            let status;
            status = this.getQuestStatus(no);
            if(!status) {
                return 0;
            }
            if(!status.progress) {
                this.resetProgress(no);
            }
            return status.progress;
        }
        resetProgress(no){
            let status;
            status = this.getQuestStatus(no);
            status.progress = 0;
        }
        incProgress(no){
            let status;
            status = this.getQuestStatus(no);
            if(!status) {
                return;
            }
            if(!status.progress) {
                this.resetProgress(no);
            }
            status.progress++;
        }
        decProgress(no){
            let status;
            status = this.getQuestStatus(no);
            if(!status.progress) {
                this.resetProgress(no);
            }
            if(status.progress > 0) {
                status.progress--;
            }
        }
        popupReport(no) {
            let quest, text, se;
            text = "";
            quest = this.getQuestData(no);
            se = Params.PopupSet.PopupReportSe;
            text = Params.PopupSet.PopupReportFormat;
            text = text.replace("$1", quest.name);
            if(se && se.name && !CommonPopupManager.isPlayingSe(se)) {
                text = "_SE[%1,%2,%3,%4]".format(se.name, se.volume, se.pitch, se.pan) + text;
            }

            if(text) {
                CommonPopupManager.showInfo({}, text, null);
            }
        }
        popupAdd(no) {
            let quest, text, se;
            text = "";
            quest = this.getQuestData(no);
            se = Params.PopupSet.PopupAddSe;
            text = Params.PopupSet.PopupAddFormat;
            text = text.replace("$1", quest.name);
            if(se && se.name && !CommonPopupManager.isPlayingSe(se)) {
                text = "_SE[%1,%2,%3,%4]".format(se.name, se.volume, se.pitch, se.pan) + text;
            }

            if(text) {
                CommonPopupManager.showInfo({}, text, null);
            }
        }
        popupLostItem(info) {
            let text, item;
            item = null;
            text = "";

            if(this.isKindItem(info)) {
                item = $dataItems[info.target];
            } else if(this.isKindWeapon(info)) {
                item = $dataWeapons[info.target];
            } else if(this.isKindArmor(info)) {
                item = $dataArmors[info.target];
            }

            text = Params.PopupSet.PopupLostItemFormat;
            if(item) {
	            text = text.replace("$1", item.name);
	            text = text.replace("$2", info.count);
	            text = text;
            }

            if(text) {
                CommonPopupManager.showInfo({}, text, null);
            }
        }
        no() {
            let no;
            no = Params.Var;

            if(!no || !Number.isFinite(no) || no < 1) {
                return 0;
            }

            return $gameVariables.value(no);
        }
    };


    //=========================================================================
    // Game_Interpreter
    //  ・依頼システム用プラグインコマンドを定義します。
    //
    //=========================================================================
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === "fc_quest") {
            switch (args[0].toLowerCase()) {
                case "board":
                    args.splice(0,1)
                    $gameQuest.openBoard(args);
                    break;
            }
        }
    };


    //=========================================================================
    // Game_System
    //  ・依頼システム記録用変数を定義します。
    //
    //=========================================================================
    // const _Game_System_initialize = Game_System.prototype.initialize;
    // Game_System.prototype.initialize = function() {
    //     _Game_System_initialize.call(this);
    //     this.initQsMember();
    // };

    // Game_System.prototype.initQsMember = function() {
    //     this._questStatus = {};
    // };

    // Game_System.prototype.questStatus = function() {
    //     return this._questStatus;
    // };


    //=========================================================================
    // Game_Action
    //  ・依頼システム記録用変数を定義します。
    //
    //=========================================================================
    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage.apply(this, arguments);
        if (target.hp <= 0 && target.isEnemy()) {
            $gameQuest.updateEnemyQuestStatus(target.enemyId(), 1);
        }
    };


    //=========================================================================
    // Game_Party
    //  ・依頼システム記録用変数を定義します。
    //
    //=========================================================================
    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        // var container = this.itemContainer(item);
        // if (container) {
        //     var lastNumber = this.numItems(item);
        //     var newNumber = lastNumber + amount;
        //     container[item.id] = newNumber.clamp(0, this.maxItems(item));
        //     if (container[item.id] === 0) {
        //         delete container[item.id];
        //     }
        //     if (includeEquip && newNumber < 0) {
        //         this.discardMembersEquip(item, -newNumber);
        //     }
        //     $gameMap.requestRefresh();
        // }
        _Game_Party_gainItem.apply(this, arguments);

        if (item) {
            $gameQuest.updateItemQuestStatus(item.id, amount);
        }
    };


    //=========================================================================
    // Scene_Board
    //  ・掲示板シーンを定義します。
    //
    //=========================================================================
    function Scene_Board() {
        this.initialize.apply(this, arguments);
    }

    Scene_Board.prototype = Object.create(Scene_Base.prototype);
    Scene_Board.prototype.constructor = Scene_Board;

    Scene_Board.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this.initMember();
    };

    Scene_Board.prototype.prepare = function(levelFilter) {
        let i, cnt;
        if(Array.isArray(levelFilter)) {
            cnt = levelFilter.length;
            for(i = 0; i < cnt; i++) {
                this._levelFilter.push(parseInt(levelFilter[i]));
            }
        }
    };

    Scene_Board.prototype.initMember = function() {
        this._levelFilter = Array();
        this._confirm = false;
    };

    Scene_Board.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground(Params.Board.Background);
        this.createWindowLayer();
        this.createQuestKindListWindow(Params.Board.KindWindow);
        this.createQuestListWindow(Params.Board.ListWindow);
        this.createQuestDetailWindow(Params.Board.DetailWindow);

        this.createSubWindowLayer();
        this.createHelpWindow(Params.Board.HelpWindow);
        this.createChoiceWindow();
    };

    Scene_Board.prototype.addSubWindow = function(window) {
        this._subWindowLayer.addChild(window);
    };

    Scene_Board.prototype.createSubWindowLayer = function() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._subWindowLayer = new WindowLayer();
        this._subWindowLayer.move(x, y, width, height);
        this.addChildAt(this._subWindowLayer, this.children.length);
    };

    Scene_Board.prototype.createBackground = function(background) {
        this._backgroundSprite = new Sprite();

        if(background){
            this._backgroundSprite.bitmap = ImageManager.loadPicture(background);
        } else {
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        }
        this.addChild(this._backgroundSprite);
    };

    Scene_Board.prototype.createHelpWindow = function(windowSet) {
        this._helpWindow = new Window_Help();
        this._helpWindow.setText(Params.MessageSet.StartMessage);
        this._helpWindow.move(windowSet.x, windowSet.y, windowSet.w, windowSet.h);
        this.addSubWindow(this._helpWindow);
    };

    Scene_Board.prototype.createChoiceWindow = function() {
        this._choiceWindow = new Window_Choice(this._helpWindow);
        this._choiceWindow.setHandler('ok', this.choiceOk.bind(this));
        this._choiceWindow.setHandler('cancel', this.choiceCancel.bind(this));
        this.addSubWindow(this._choiceWindow);
    };

    Scene_Board.prototype.createQuestKindListWindow = function(windowSet) {
        this._questKindWindow = new Window_QuestKindList(windowSet.x, windowSet.y);
        this._questKindWindow.setHandler('ok', this.kindOk.bind(this));
        this._questKindWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._questKindWindow);
    };

    Scene_Board.prototype.createQuestListWindow = function(windowSet) {
        this._questListWindow = new Window_QuestList(windowSet.x, windowSet.y);
        this._questListWindow.setLevelFilter(this._levelFilter);
        this._questListWindow.setHandler('ok', this.listOk.bind(this));
        this._questListWindow.setHandler('pageup', this.kindPrevious.bind(this));
        this._questListWindow.setHandler('pagedown', this.kindNext.bind(this));
        this._questListWindow.setHandler('cancel', this.listCancel.bind(this));
        this.addWindow(this._questListWindow);
        this._questKindWindow.setQuestListWindow(this._questListWindow);
    };

    Scene_Board.prototype.createQuestDetailWindow = function(windowSet) {
        this._questDetailWindow = new Window_QuestDetail(windowSet.x, windowSet.y);
        // this._questDetailWindow.setHandler('ok', this.listOk.bind(this));
        // this._questDetailWindow.setHandler('cancel', this.listCancel.bind(this));
        this.addWindow(this._questDetailWindow);
        this._questListWindow.setQuestDetailWindow(this._questDetailWindow);
    };

    Scene_Board.prototype.kindOk = function() {
        this._questKindWindow.deactivate();
        this._questListWindow.activate();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    };

    Scene_Board.prototype.kindNext = function() {
        this._questKindWindow.nextSymbol();
        this._questListWindow.activate();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    };

    Scene_Board.prototype.kindPrevious = function() {
        this._questKindWindow.previousSymbol();
        this._questListWindow.activate();
        this._questListWindow.select(0);
        this._questDetailWindow.refresh();
    };

    Scene_Board.prototype.listOk = function() {
        let questNo;
        questNo = this._questListWindow.currentSymbol();

        this._questListWindow.deselect();
        this._questListWindow.deactivate();
        this._choiceWindow.start();
        if($gameQuest.isOrder(questNo)) {
            this.enableConfirm();
            this._helpWindow.setText(Params.MessageSet.CancelMessage);
        } else {
        	this._helpWindow.setText(Params.MessageSet.OrderMessage);
    	}
    };

    Scene_Board.prototype.listCancel = function() {
        this.disableConfirm();
        this._questListWindow.deselect();
        this._questListWindow.deactivate();
        this._questDetailWindow.contents.clear();
        this._questKindWindow.activate();
    };

    Scene_Board.prototype.choiceOk = function() {
        let questNo;
        questNo = this._questListWindow.lastSymbol();

        if(this._choiceWindow.currentSymbol() != "yes") {
            this.choiceCancel();
            return;
        }

        if($gameQuest.isOrder(questNo)) {
            if(this.needConfirm()) {
                this.disableConfirm();
                // this._choiceWindow.close();
                this._choiceWindow.start(1);
                this._helpWindow.setText(Params.MessageSet.ReallyCancelMessage);
                return;
            }
            $gameQuest.disableOrder(questNo);
        } else {
            $gameQuest.enableOrder(questNo);
        }

        this._choiceWindow.close();
        this._questListWindow.redrawLastItem();
        this._questDetailWindow.refresh();
        this._helpWindow.setText(Params.MessageSet.StartMessage);
        this._questListWindow.activate();
        this._questListWindow.selectLast();
    };

    Scene_Board.prototype.choiceCancel = function() {
        this.disableConfirm();
        this._choiceWindow.close();
        this._helpWindow.setText(Params.MessageSet.StartMessage);
        this._questListWindow.activate();
        this._questListWindow.selectLast();
    };

    Scene_Board.prototype.enableConfirm = function() {
        this._confirm = true;
    };

    Scene_Board.prototype.disableConfirm = function() {
        this._confirm = false;
    };

    Scene_Board.prototype.needConfirm = function() {
        return this._confirm;
    };

    Scene_Board.prototype.popScene = function() {
        Scene_Base.prototype.popScene.call(this);

        let common = Params.Board.CommonEvent;

        if(common > 0) {
            $gameTemp.reserveCommonEvent(common);
        }
    };


    //=========================================================================
    // Window_QuestKindList
    //  ・依頼種別リストウィンドウを定義します。
    //
    //=========================================================================
    function Window_QuestKindList() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestKindList.prototype = Object.create(Window_Command.prototype);
    Window_QuestKindList.prototype.constructor = Window_QuestKindList;

    Window_QuestKindList.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);

        this._questListWindow = null;
    };

    Window_QuestKindList.prototype.windowWidth = function() {
        return Params.Board.KindWindow.w;
    };

    Window_QuestKindList.prototype.windowHeight = function() {
        return Params.Board.KindWindow.h;
    };

    Window_QuestKindList.prototype.maxCols = function() {
        return 2;
    };

    Window_QuestKindList.prototype.numVisibleRows = function() {
        return 2;
    };

    Window_QuestKindList.prototype.makeCommandList = function() {
        this.addCommand(Params.KindSet.all, Kind.All, true);
        this.addCommand(Params.KindSet.enemy, Kind.Enemy, true);
        this.addCommand(Params.KindSet.item, Kind.Item, true);
        this.addCommand(Params.KindSet.etc, Kind.Etc, true);
    };

    Window_QuestKindList.prototype.nextSymbol = function() {
        let index, cnt;
        index = this.index();
        cnt = this.maxItems();

        if(index == cnt - 1) {
            index = 0;
        } else {
            index++;
        }

        this.select(index);
    };

    Window_QuestKindList.prototype.previousSymbol = function() {
        let index, cnt;
        index = this.index();
        cnt = this.maxItems();

        if(index == 0) {
            index = cnt - 1;
        } else {
            index--;
        }

        this.select(index);
    };

    Window_QuestKindList.prototype.update = function() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._questListWindow) {
            this._questListWindow.setKind(this.currentSymbol());
        }
    };

    Window_QuestKindList.prototype.setQuestListWindow = function(questListWindow) {
        this._questListWindow = questListWindow;
        this.update();
    };


    //=========================================================================
    // Window_QuestList
    //  ・依頼リストウィンドウを定義します。
    //
    //=========================================================================
    function Window_QuestList() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestList.prototype = Object.create(Window_Command.prototype);
    Window_QuestList.prototype.constructor = Window_QuestList;

    Window_QuestList.prototype.initialize = function(x, y) {
        let width, height;
        width = this.windowWidth();
        height = this.windowHeight();

        this.clearCommandList();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);

        this._levelFilter = [];
        this._kind = Kind.None;
        this._lastIndex = 0;

        this.deselect();
        this.deactivate();
    };

    Window_QuestList.prototype.windowWidth = function() {
        return Params.Board.ListWindow.w;
    };

    Window_QuestList.prototype.windowHeight = function() {
        return Params.Board.ListWindow.h;
    };

    Window_QuestList.prototype.maxCols = function() {
        return 1;
    };

    Window_QuestList.prototype.numVisibleRows = function() {
        return 10;
    };

    Window_QuestList.prototype.makeCommandList = function() {
        let list, key;

        list = $gameQuest.getQuestList("enable", this._kind, this._levelFilter);
        for(key in list) {
            this.addCommand(list[key].name, key, true);
        }
        list = $gameQuest.getQuestList("disable", this._kind, this._levelFilter);
        for(key in list) {
            this.addCommand(list[key].name, key, false);
        }
    };

    Window_QuestList.prototype.update = function() {
        let symbol;
        symbol = this.currentSymbol() ? this.currentSymbol() : -1;

        Window_Selectable.prototype.update.call(this);

        if (this._questDetailWindow) {
            this._questDetailWindow.setQuest(symbol);
        }
    };

    Window_QuestList.prototype.setQuestDetailWindow = function(questDetailWindow) {
        this._questDetailWindow = questDetailWindow;
        this.update();
    };

    Window_QuestList.prototype.setKind = function(kind) {
        if (this._kind != kind) {
            this._kind = kind;
            this.refresh();
            this.resetScroll();
        }
    };

    Window_QuestList.prototype.setLevelFilter = function(levelFilter) {
        this._levelFilter = levelFilter;
    };

    Window_QuestList.prototype.selectLast = function() {
        this.select(this._lastIndex);
    };

    Window_QuestList.prototype.lastSymbol = function() {
        let data = this._list[this._lastIndex];
        return data ? data.symbol : null;
    };

    Window_QuestList.prototype.deselect = function() {
        this._lastIndex = this.index();
        Window_Selectable.prototype.deselect.call(this);
    };

    Window_QuestList.prototype.drawItem = function(index) {
        let rect, align, icon, questNo;
        rect = this.itemRectForText(index);
        align = this.itemTextAlign();
        questNo = this.commandSymbol(index);
        icon = $gameQuest.getQuestIcon(questNo);

        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        // this.drawTextEx(this.commandName(index), rect.x, rect.y);
        if(icon > 0) {
            this.drawIcon(icon, rect.x, rect.y + 2);
        }
        this.drawText(this.commandName(index), rect.x + Window_Base._iconWidth, rect.y, rect.width - Window_Base._iconWidth, align);
    };

    Window_QuestList.prototype.redrawLastItem = function() {
        this.redrawItem(this._lastIndex);
    };

    Window_QuestList.prototype.select = function(index) {
        let symbol, maxItems;
        maxItems = this.maxItems();

        if(maxItems <= index) {
            index = maxItems - 1 < 0 ? 0 : maxItems - 1;
        }

        if(this.active && index >= 0 && maxItems > 0) {
            symbol = index == 0 ? this.commandSymbol(0) : this.commandSymbol(index);
            if($gameQuest.isNew(symbol)) {
                $gameQuest.disableNew(symbol);
                this.redrawCurrentItem();
                this.redrawItem(index);
            }
        }
        Window_Selectable.prototype.select.call(this, index);
    };


    //=========================================================================
    // Window_QuestDetail
    //  ・依頼詳細ウィンドウを定義します。
    //
    //=========================================================================
    function Window_QuestDetail() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestDetail.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestDetail.prototype.constructor = Window_QuestDetail;

    Window_QuestDetail.prototype.initialize = function(x, y) {
        let width, height;
        width = this.windowWidth();
        height = this.windowHeight();
        this._data = null;
        this._lineHeight = this.defaultLineHeight();
        this._fontSize = this.defaultFontSize();
        this._heightBias = this._lineHeight - this._fontSize;
        // this._heightBias = 0;

        Window_Selectable.prototype.initialize.call(this, x, y, width, height);

        this.createContents();
        this.refresh();
        this.deselect();
        this.deactivate();
    };

    Window_QuestDetail.prototype.windowWidth = function() {
        return Params.Board.DetailWindow.w;
    };

    Window_QuestDetail.prototype.windowHeight = function() {
        return Params.Board.DetailWindow.h;
    };

    Window_QuestDetail.prototype.setLineHeight = function(fontSize) {
        this._lineHeight = this._heightBias + fontSize;
    };

    Window_QuestDetail.prototype.lineHeight = function() {
        return this._lineHeight;
    };

    Window_QuestDetail.prototype.defaultLineHeight = function() {
        return Window_Base.prototype.lineHeight.call();
    };

    Window_QuestDetail.prototype.setStandardFontSize = function(fontSize) {
        this._fontSize = fontSize;
    };

    Window_QuestDetail.prototype.standardFontSize = function() {
        return this._fontSize;
    };

    Window_QuestDetail.prototype.defaultFontSize = function() {
        return Window_Base.prototype.standardFontSize.call();
    };

    Window_QuestDetail.prototype.setFontSetting = function(fontSize) {
        this.setStandardFontSize(fontSize);
        this.setLineHeight(fontSize);
    };

    Window_QuestDetail.prototype.setQuest = function(questNo) {
        if(questNo < 0 && this._data) {
            this._data = null;
            this.refresh();
            return;
        }
        if (!this._data || this._data.no != questNo) {
            this._data = $gameQuest.getQuestData(questNo);
            this.refresh();
        }
    };

    Window_QuestDetail.prototype.refresh = function() {
        let x, y, contentsWidth, quest, blockSpace;
        contentsWidth = this.contentsWidth();
        quest = this._data;
        blockSpace = Params.QuestFormat.BlockSpace;
        x = 0;
        y = 0;

        this.contents.clear();
        if (quest) {
            y = this.drawQuestName(x, y, contentsWidth);
            y += blockSpace;
            y = this.drawQuestRequester(x, y, contentsWidth);
            y += blockSpace;
            y = this.drawQuestNote(x, y, contentsWidth);
            y += blockSpace;
            if(quest.targets.length) {
                y = this.drawQuestTarget(x, y, contentsWidth);
                y += blockSpace;
            }
            if(quest.rewards.count) {
                y = this.drawQuestReward(x, y, contentsWidth);
                y += blockSpace;
            }
        }
    };

    Window_QuestDetail.prototype.drawQuestName = function(x, y, width) {
        let align, newLine, drawBias, obj, text, fontSize;

        text = this.questNameFormat();
        fontSize = Params.QuestFormat.Title.ContentFontSize;
        align = "center";
        newLine = true;
        drawBias = {"x":0, "y":0};
        obj = this.drawText(text, fontSize, x, y, width, align, drawBias,newLine);

        return obj.y;
    };

    Window_QuestDetail.prototype.questNameFormat = function() {
        let quest, text;
        quest = this._data;
        text = Params.QuestFormat.Title.Content;
        text = text.replace("$1", quest.name);

        return text;
    };

    Window_QuestDetail.prototype.drawQuestRequester = function(x, y, width) {
        let align, newLine, drawBias, obj, text, fontSize, labelFontSize;
        fontSize = Params.QuestFormat.Requester.ContentFontSize;
        labelFontSize = Params.QuestFormat.Requester.LabelFontSize;

        text = Params.QuestFormat.Requester.Label;
        align = "left";
        newLine = false;
        drawBias = {"x":0, "y":0};
        if(labelFontSize < fontSize) {
            drawBias.y -= Math.abs(labelFontSize - fontSize);
        }
        obj = this.drawText(text, labelFontSize, x, y, width, align, drawBias, newLine);
        x = obj.x;
        y = obj.y;

        text = this.questRequesterFormat();
        align = null;
        newLine = true;
        drawBias = {"x":0, "y":0};
        if(labelFontSize > fontSize) {
            drawBias.y -= Math.abs(labelFontSize - fontSize);
        }
        obj = this.drawText(text, fontSize, x, y, width - x, align, drawBias, newLine);

        return obj.y;
    };

    Window_QuestDetail.prototype.questRequesterFormat = function() {
        let quest, text;
        quest = this._data;
        text = Params.QuestFormat.Requester.Content;
        text = text.replace("$1", quest.request);

        return text;
    };

    Window_QuestDetail.prototype.drawQuestNote = function(x, y, width) {
        let align, newLine, drawBias, obj, text, fontSize, labelFontSize, maxLine;
        fontSize = Params.QuestFormat.Detail.ContentFontSize;
        labelFontSize = Params.QuestFormat.Detail.LabelFontSize;

        text = Params.QuestFormat.Detail.Label;
        align = "left";
        newLine = true;
        drawBias = {"x":0, "y":0};
        // if(labelFontSize < fontSize) {
        //     drawBias.y -= Math.abs(labelFontSize - fontSize);
        // }
        obj = this.drawText(text, labelFontSize, x, y, width, align, drawBias, newLine);
        x = obj.x;
        y = obj.y;

        text = this.questDetailFormat();
        align = null;
        newLine = true;
        maxLine = Params.QuestFormat.Detail.ContentMaxLine;
        drawBias = {"x":0, "y":0};
        // if(labelFontSize > fontSize) {
        //     drawBias.y -= Math.abs(labelFontSize - fontSize);
        // }
        obj = this.drawTextEx(text, fontSize, x, y, maxLine);

        return obj.y;


        // text = quest.note;
        // textWidth = this.textWidth(text);
        // if(textWidth > 0) {
        //     this.drawTextEx(text, 0, y + this.lineHeight());
        // }
    };

    Window_QuestDetail.prototype.questDetailFormat = function() {
        let quest, text;
        quest = this._data;
        text = Params.QuestFormat.Detail.Content;
        text = text.replace("$1", quest.note);

        return text;
    };

    Window_QuestDetail.prototype.drawQuestTarget = function(x, y, width) {
        let quest, isOrder, align, newLine, drawBias, obj, text,
            fontSize, labelFontSize, numberFontSize, maxLine, baseY;
        quest = this._data;
        isOrder = $gameQuest.isOrder(quest.no);
        fontSize = Params.QuestFormat.Target.ContentFontSize;
        labelFontSize = Params.QuestFormat.Target.LabelFontSize;
        numberFontSize = isOrder ? Params.QuestFormat.Target.NumberFontSize2 : Params.QuestFormat.Target.NumberFontSize1;
        maxLine = Params.QuestFormat.Target.ContentMaxLine;

        text = this.questTargetLabelFormat();
        align = "left";
        newLine = true;
        drawBias = {"x":0, "y":0};
        // if(labelFontSize < fontSize) {
        //     drawBias.y -= Math.abs(labelFontSize - fontSize);
        // }
        obj = this.drawText(text, labelFontSize, x, y, width, align, drawBias, newLine);
        x = obj.x;
        y = obj.y;
        baseY = y;

        quest.targets.forEach(function(info, i) {
            text = this.questTargetFormat(info);
            align = "left";
            newLine = $gameQuest.isKindEtc(quest) ? true : false;
            drawBias = {"x":0, "y":0};
            // if(labelFontSize < fontSize) {
            //     drawBias.y -= Math.abs(labelFontSize - fontSize);
            // }
            obj = this.drawText(text, fontSize, x, y, width, align, drawBias, newLine);
            x = obj.x;
            y = obj.y;

            if(!$gameQuest.isKindEtc(quest)) {
                text = this.questTargetNumberFormat(info, isOrder);
                align = "right";
                newLine = true;
                drawBias = {"x":0, "y":0};
                // if(labelFontSize < fontSize) {
                //     drawBias.y -= Math.abs(labelFontSize - fontSize);
                // }
                obj = this.drawText(text, numberFontSize, x, y, width, align, drawBias, newLine);
                x = obj.x;
                y = obj.y;
            }
        }, this);

        return baseY + this.lineHeight() * maxLine;
    };

    Window_QuestDetail.prototype.questTargetLabelFormat = function() {
        let quest, text, kind;
        quest = this._data;
        text = Params.QuestFormat.Target.Label;
        kind = "";

        if($gameQuest.isKindEnemy(quest)) {
            kind = Params.KindSet.enemy;
        } else if($gameQuest.isKindItem(quest)) {
            kind = Params.KindSet.item;
        }
        text = text.replace("$1", kind);

        return text;
    };

    Window_QuestDetail.prototype.questTargetFormat = function(info) {
        let quest, text, name;
        quest = this._data;
        text = Params.QuestFormat.Target.Content;
        name = "";

        if($gameQuest.isKindEnemy(quest)) {
            name = $dataEnemies[info.target].name;
        } else if($gameQuest.isKindItem(quest)) {
            if($gameQuest.isKindItem(info)) {
                name = $dataItems[info.target].name;
            } else if($gameQuest.isKindWeapon(info)) {
                name = $dataWeapons[info.target].name;
            } else if($gameQuest.isKindArmor(info)) {
                name = $dataArmors[info.target].name;
        	}
        }
        if(name) {
        	text = text.replace("$1", name);
        }

        return text;
    };

    Window_QuestDetail.prototype.questTargetNumberFormat = function(target, isOrder) {
        let quest, questStatus, text, item, num, key;
        quest = this._data;
        questStatus = $gameQuest.getQuestStatus(quest.no);
        text = isOrder ? Params.QuestFormat.Target.Number2 : Params.QuestFormat.Target.Number1;
        num = 0;
        item = null;

        if($gameQuest.isKindEnemy(quest)) {
            key = Kind.Enemy + "||" + target.target;
            num = questStatus.extend[key][0];
        } else if($gameQuest.isKindItem(quest)) {
            if($gameQuest.isKindItem(target)) {
            	item = $dataItems[target.target];
            } else if($gameQuest.isKindWeapon(target)) {
                item = $dataWeapons[target.target];
            } else if($gameQuest.isKindArmor(target)) {
                item = $dataArmors[target.target];
            }
            if(item) {
            	num = $gameParty.numItems(item);
        	}
        }

        text = text.replace("$2", num);
        text = text.replace("$1", target.count);

        return text;
    };

    Window_QuestDetail.prototype.drawQuestReward = function(x, y, width) {
        let quest, info, align, newLine, drawBias, obj, text,
            fontSize, labelFontSize, numberFontSize, i, cnt, maxLine, baseY;
        fontSize = Params.QuestFormat.Reward.ContentFontSize;
        labelFontSize = Params.QuestFormat.Reward.LabelFontSize;
        numberFontSize = Params.QuestFormat.Reward.NumberFontSize1;
        quest = this._data;
        maxLine = Params.QuestFormat.Target.ContentMaxLine;

        text = this.questRewardLabelFormat();
        align = "left";
        newLine = true;
        drawBias = {"x":0, "y":0};
        // if(labelFontSize < fontSize) {
        //     drawBias.y -= Math.abs(labelFontSize - fontSize);
        // }
        obj = this.drawText(text, labelFontSize, x, y, width, align, drawBias, newLine);
        x = obj.x;
        y = obj.y;
        baseY = y;

        Object.keys(quest.rewards).forEach(function(kind, i) {
            info = quest.rewards[kind];
            if(!(info instanceof Array)) {
                return;
            }
            cnt = info.length;
            if(cnt < 1) {
                return;
            }
            for(i = 0; i < cnt; i++) {
                text = this.questRewardFormat(info[i]);
                align = "left";
                newLine = ($gameQuest.isKindEtc(info[i]) || $gameQuest.isKindGold(info[i])) ? true : false;
                drawBias = {"x":0, "y":0};
                // if(labelFontSize < fontSize) {
                //     drawBias.y -= Math.abs(labelFontSize - fontSize);
                // }
                obj = this.drawText(text, fontSize, x, y, width, align, drawBias, newLine);
                x = obj.x;
                y = obj.y;

                if($gameQuest.isKindWeapon(info[i]) || $gameQuest.isKindArmor(info[i]) || $gameQuest.isKindItem(info[i])) {
                    text = this.questRewardNumberFormat(info[i]);
                    align = "right";
                    newLine = true;
                    drawBias = {"x":0, "y":0};
                    // if(labelFontSize < fontSize) {
                    //     drawBias.y -= Math.abs(labelFontSize - fontSize);
                    // }
                    obj = this.drawText(text, numberFontSize, x, y, width, align, drawBias, newLine);
                    x = obj.x;
                    y = obj.y;
                }
            }
        }, this);

        return baseY + this.lineHeight() * maxLine;
    };

    Window_QuestDetail.prototype.questRewardLabelFormat = function() {
        let text;
        text = Params.QuestFormat.Reward.Label;

        return text;
    };

    Window_QuestDetail.prototype.questRewardFormat = function(reward) {
        let text, value, key;
        key = reward.target;
        text = Params.QuestFormat.Reward.Content;
        value = "";

        if($gameQuest.isKindWeapon(reward)) {
            value = $dataWeapons[key].name;
        } else if($gameQuest.isKindArmor(reward)) {
            value = $dataArmors[key].name;
        } else if($gameQuest.isKindItem(reward)) {
            value = $dataItems[key].name;
        } else if($gameQuest.isKindGold(reward)) {
            value = reward.count + TextManager.currencyUnit;
        } else if($gameQuest.isKindEtc(reward)) {
            value = key;
        }
        text = text.replace("$1", value);

        return text;
    };

    Window_QuestDetail.prototype.questRewardNumberFormat = function(reward) {
        let text;
        text = Params.QuestFormat.Reward.Number1;

        text = text.replace("$1", reward.count);

        return text;
    };

    Window_QuestDetail.prototype.drawText = function(text, fontSize,x, y, width, align, drawBias, newLine) {
        let textWidth;
        this.setFontSetting(fontSize);
        this.contents.fontSize = fontSize;
        textWidth = this.textWidth(text);

        if(textWidth <= 0) {
            return {"x":x, "y":y};
        }

        switch(align) {
            case "left" :
                x = 0;
                break;
            case "center" :
                x = width / 2 - textWidth / 2;
                break;
            case "right" :
                x = width - textWidth;
                break;
        }

        Window_Base.prototype.drawText.call(this, text, x - drawBias.x, y - drawBias.y, width);

        if(newLine) {
            y += this.lineHeight();
            x = 0;
        } else {
            x += textWidth;
        }

        return {"x":x, "y":y};
    };

    Window_QuestDetail.prototype.drawTextEx = function(text, fontSize, x, y, maxLine) {
        let textState;

        if (text) {
            textState = { index: 0, x: x, y: y, left: x };
            textState.text = this.convertEscapeCharacters(text);
            textState.height = this.calcTextHeight(textState, false);

            // this.resetFontSettings();
            this.setFontSetting(fontSize);
            this.contents.fontSize = fontSize;
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return {"x":x, "y":y + this.lineHeight() * maxLine};
        } else {
            return {"x":x, "y":y};
        }
    };

    Window_QuestDetail.prototype.numberWidth = function() {
        if(Imported.FC_GameUtility && _global.Parameter.FC_GameUtility) {
            let params = _global.Parameter.FC_GameUtility;
            return this.textWidth(params.MaxItem);
        }
        return Window_ItemList.prototype.numberWidth.call();
    };

    Window_QuestDetail.prototype.doubleNumberWidth = function() {
        let n, questNo;
        questNo = this._data ? this._data.no : null;

        if(Imported.FC_GameUtility && _global.Parameter.FC_GameUtility) {
            let params = _global.Parameter.FC_GameUtility;
            return this.textWidth(params.MaxItem) * 2 + this.textWidth(" / ");
        }
        return Window_ItemList.prototype.numberWidth.call() * 2 + this.textWidth(" / ");
    };


    //=========================================================================
    // Window_Choice
    //  ・確認ウィンドウを定義します。
    //
    //=========================================================================
    function Window_Choice() {
        this.initialize.apply(this, arguments);
    }

    Window_Choice.prototype = Object.create(Window_Command.prototype);
    Window_Choice.prototype.constructor = Window_Choice;

    Window_Choice.prototype.initialize = function(messageWindow) {
        this._messageWindow = messageWindow;
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.openness = 0;
        this.deactivate();
        // this._background = 0;
        this.setBackgroundType(0);
    };

    Window_Choice.prototype.start = function(defaultSelect) {
        if(!defaultSelect || defaultSelect < 0 || defaultSelect >= this._list.length) {
            defaultSelect = 0;
        }
        this.updatePlacement();
        // this.updateBackground();
        this.refresh();
        this.select(defaultSelect);
        this.open();
        this.activate();
    };

    Window_Choice.prototype.updatePlacement = function() {
        var positionType = 0; // ウィンドウ位置、要検討
        var messageY = this._messageWindow.y;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        switch (positionType) {
        case 0:
            this.x = 0;
            break;
        case 1:
            this.x = (Graphics.boxWidth - this.width) / 2;
            break;
        case 2:
            this.x = Graphics.boxWidth - this.width;
            break;
        }
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height;
        } else {
            this.y = messageY + this._messageWindow.height;
        }
    };

    Window_Choice.prototype.windowWidth = function() {
        return 240;
    };

    Window_Choice.prototype.numVisibleRows = function() {
        // var messageY = this._messageWindow.y;
        // var messageHeight = this._messageWindow.height;
        // var centerY = Graphics.boxHeight / 2;
        // var choices = $gameMessage.choices();
        // var numLines = choices.length;
        // var maxLines = 8;
        // if (messageY < centerY && messageY + messageHeight > centerY) {
        //     maxLines = 4;
        // }
        // if (numLines > maxLines) {
        //     numLines = maxLines;
        // }
        // return numLines;
        return 2;
    };

    Window_Choice.prototype.makeCommandList = function() {
        this.addCommand(Params.MessageSet.YesCommand, 'yes', true);
        this.addCommand(Params.MessageSet.NoCommand, 'no', true);
    };

    Window_Choice.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y);
    };

    Window_Choice.prototype.isOkTriggered = function() {
        return Input.isTriggered('ok');
    };

    Window_Choice.prototype.callOkHandler = function() {
        this.callHandler('ok');
        // this.close();
    };

    Window_Choice.prototype.callCancelHandler = function() {
        this.callHandler('cancel');
        // this.close();
    };


    //=========================================================================
    // Scene_BoardMenu
    //  ・メニュー上の掲示板シーンを定義します。
    //
    //=========================================================================
    function Scene_BoardMenu() {
        this.initialize.apply(this, arguments);
    }

    Scene_BoardMenu.prototype = Object.create(Scene_Board.prototype);
    Scene_BoardMenu.prototype.constructor = Scene_BoardMenu;

    Scene_BoardMenu.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground(Params.Menu.Background);
        this.createWindowLayer();
        this.createQuestKindListWindow(Params.Menu.KindWindow);
        this.createQuestListWindow(Params.Menu.ListWindow);
        this.createQuestDetailWindow(Params.Menu.DetailWindow);
        this.createHelpWindow(Params.Menu.HelpWindow);
    };

    Scene_BoardMenu.prototype.createQuestListWindow = function(windowSet) {
        this._questListWindow = new Window_QuestListMenu(windowSet.x, windowSet.y);
        // this._questListWindow.setHandler('ok', this.listOk.bind(this));
        this._questListWindow.setHandler('pageup', this.kindPrevious.bind(this));
        this._questListWindow.setHandler('pagedown', this.kindNext.bind(this));
        this._questListWindow.setHandler('cancel', this.listCancel.bind(this));
        this.addWindow(this._questListWindow);
        this._questKindWindow.setQuestListWindow(this._questListWindow);
    };

    Scene_BoardMenu.prototype.createHelpWindow = function(windowSet) {
        this._helpWindow = new Window_Help();
        this._helpWindow.setText(Params.MessageSet.StartMenuMessage);
        this._helpWindow.move(windowSet.x, windowSet.y, windowSet.w, windowSet.h);
        this.addWindow(this._helpWindow);
    };

    Scene_BoardMenu.prototype.popScene = function() {
        Scene_Base.prototype.popScene.call(this);
    };


    //=========================================================================
    // Window_QuestListMenuMenu
    //  ・依頼リストウィンドウ(メニュー用)を定義します。
    //
    //=========================================================================
    function Window_QuestListMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestListMenu.prototype = Object.create(Window_QuestList.prototype);
    Window_QuestListMenu.prototype.constructor = Window_QuestListMenu;

    Window_QuestListMenu.prototype.initialize = function(x, y) {
        Window_QuestList.prototype.initialize.call(this, x, y);
    };

    Window_QuestListMenu.prototype.windowWidth = function() {
        return Params.Menu.ListWindow.w;
    };

    Window_QuestListMenu.prototype.windowHeight = function() {
        return Params.Menu.ListWindow.h;
    };

    Window_QuestListMenu.prototype.makeCommandList = function() {
        let list, cnt, key, text, icon, status;
        list = $gameQuest.getQuestList("order", this._kind);
        cnt = Object.keys(list).length;
        icon = 0;

        for(key in list) {
            this.addCommand(list[key].name, key, true);
        }
    };

    Window_QuestListMenu.prototype.isOkEnabled = function() {
        return false;
    };


    //=========================================================================
    // Scene_Menu
    //  ・メニューコマンドを追加します。
    //
    //=========================================================================
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);

        this.addOriginalHandler();
    };

    Scene_Menu.prototype.addOriginalHandler = function() {
        this._commandWindow.setHandler('boardmenu',   this.commandBoardMenu.bind(this));
    };

    Scene_Menu.prototype.commandBoardMenu = function() {
        SceneManager.push(Scene_BoardMenu);
    };


    //=========================================================================
    // Window_MenuCommand
    //  ・メニューコマンドを追加します。
    //
    //=========================================================================
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);

        if (Params.Menu.Title) {
            this.addCommand(Params.Menu.Title, 'boardmenu');
        }
    };


    //=========================================================================
    // DataManager
    //  ・グローバル変数を再定義します。
    //  ・セーブオブジェクトに依頼システム用データを追加します。
    //
    //=========================================================================
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        _global.$gameQuest = (_global.$gameQuest || new GameQuest());
    }

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        let contents = _DataManager_makeSaveContents.call(this);
        contents.gameQuest = _global.$gameQuest.getSystemData();
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        _global.$gameQuest.setSystemData(contents.gameQuest);
    };


    //=========================================================================
    // CommonPopupManager
    //  ・Se再生中判定用関数を追加します。
    //
    //=========================================================================
    CommonPopupManager.isPlayingSe = function(se) {
        let list, url, isPlaying;
        isPlaying = false;

        if (!se || !se.name) {
            return isPlaying;
        }

        list = CommonPopupManager._tempCommonSprites.filter(function(sprite) {
            return sprite.se && sprite.se.name;
        });

        isPlaying = list.some(function(sprite) {
            if(sprite.se.name == se.name) {
                return true;
            }
        });

        return isPlaying;
    };

})(this);