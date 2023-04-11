"use strict";

const CHRHEIGHT = 32;                     //キャラの高さ
const CHRWIDTH = 32;                      //キャラの幅
const FONT = "38px monospace";           //使用フォント
const HEIGHT = 360;                      //仮想画面のサイズ -> 120px?
const WIDTH = 384;                       //仮想画面のサイズ -> 128px?
const INTERVAL = 33;                     //フレーム呼び出し間隔
const SCR_HEIGHT = 32;                    //画面タイルサイズの半分の高さ　
const SCR_WIDTH = 32;                     //画面タイルサイズの半分の幅
const SCROLL = 4;                        //スクロール速度
const SMOOTH = 0;                        //補完処理
const START_HP = 20;                     //開始HP
const START_X = 15;                      //開始位置
const START_Y = 17;                      //開始位置
const TILECOLUMN = 8;                    //タイル桁数 -> もともとのマップの画像の桁数？
const TILEROW = 30;                       //タイル行数
const TILESIZE = 32;                      //タイルサイズ -> 大きさ？
const MAP_WIDTH = 32;                    //マップ幅　　　->　px
const MAP_HEIGHT = 32;                   //マップ高さ
const WNDSTYLE = "rgba( 0, 0, 0, 0.75 )" //ウィンドウの色
const FONTSTYLE = "#ffffff"              //文字の色

const gKey = new Uint8Array(0x100);      //キー入力バッファー

let flag = 0;                                           //adventure_ringを使用したかの確認
let gAngle = 0;                                         //プレイヤーの向き
let gEx = 0;                                            //プレイヤーの経験値
let gHP = START_HP;                                     //プレイヤーのHP
let gMHP = START_HP;                                    //プレイヤーの最大HP
let gLv = 1;                                            //プレイヤーのレベル
let gCursor = 0;                                        //カーソル位置
let gEnemyHP;                                           //敵のHP
let gEnemyType;                                         //敵種別
let gScreen;                                            //仮想画面
let gFrame = 0;                                         //内部カウンタ
let gWidth;                                             //実画面のサイズ
let gHeight;                                            //実画面のサイズ
let gMessage1 = null;                                   //表示メッセージ
let gMessage2 = null;                                   //表示メッセージ
let gMoveX = 0;                                         //移動量X
let gMoveY = 0;                                         //移動量Y
let gItem = 1;                                          //所持アイテム(鍵の有無)
let gPhase = 0;                                         //戦闘フェーズ
let gImgBoss;                                           //画像．ラスボス
let gImgMap;                                            //画像．マップ
let gImgMonster;                                        //画像．モンスター
let gImgPlayer;                                         //画像．プレイヤー
let gOrder;                                             //プレイヤーとモンスターの行動順
let gPlayerX = START_X * TILESIZE + TILESIZE/2;         //プライヤー座標X
let gPlayerY = START_Y * TILESIZE + TILESIZE/2;         //プライヤー座標Y

const gFileBoss = "img/boss.png";
const gFileMap = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer = "img/player.png";

const	gEncounter = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0 ];	//	敵エンカウント確率

const gMonsterName = ["スライム", "オオカミ", "トロール", "騎士", "魔王"];     //モンスター名称

//マップ
const	gMap = [
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 5, 0, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 1, 0, 1, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 1, 1, 0, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0, 5, 5, 5, 0, 0, 5, 1, 1, 1, 5, 5, 5,
	5, 5, 1, 1, 0, 0, 0, 2, 2, 3, 3, 3, 2, 2, 3, 3, 3, 2, 2, 1, 0, 0, 0, 1, 1, 0, 1,111, 1, 5, 5, 5,
	5, 0, 0,137,138, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 2, 1, 1, 1, 1, 1, 0, 5, 1, 1, 1, 5, 5, 5,
	5, 5, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 4, 4, 1, 1, 1, 1, 0, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 2, 2, 2, 2, 3, 2, 1, 0, 4, 0, 1, 1, 1, 0, 5, 5, 5, 0, 0, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 1, 2, 3, 2, 1, 0, 4, 0, 0, 1, 1, 0, 5, 5, 5, 0, 0, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 2, 2, 2, 1, 0, 4, 4, 0, 0, 1, 0, 0, 5, 5, 0, 0, 0, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 1, 1, 2, 2, 2, 1, 0, 4, 4, 0, 0, 1, 0, 0, 5, 0,0, 0, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 1, 1, 2, 2, 1, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 1, 1, 1, 1, 0, 4, 4, 4, 4, 0, 0, 145,146, 0, 0, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 4, 4, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0,139,140, 0, 0, 0, 1, 1, 1, 0, 0, 0, 4, 4, 4, 4, 4, 0, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0,147,148, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 1, 0, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 1, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1,117, 1, 5, 5, 1, 5, 5, 5, 5,65,65,65,65, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 5, 5,65,155,156,65, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5,65,163,164,65, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,73,73,73,65, 5, 5,107,107, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,73,73,73,73,73, 5, 5,
];

//	戦闘行動処理
function Action()
{
    gPhase++;                                       //フェーズ経過

    if( ( ( gPhase + gOrder ) & 1 ) == 0 ){
        const d = GetDamage( gEnemyType + 2 );      //敵の攻撃力
        SetMessage(gMonsterName[gEnemyType] + "の攻撃！", d + " のダメージ！");
        gHP -= d;                                   //プレイヤーのHP減少
        if( gHP <= 0 ){                             //HPが0になったらフェーズ7に移動
            gPhase = 7;
        }
        return;
    }
    if( gCursor == 0 ){                             //「戦う」選択時
        const d = GetDamage( gLv + 2 );             //プレイヤーの攻撃力
        SetMessage("あなたの攻撃！", d + " のダメージ！");
        gEnemyHP -= d;                              //モンスターのHP減少
        if( gEnemyHP <= 0 ){                        //HPが0になったらフェーズ5に移動
            gPhase = 5;
        }
        return;
    }


    if( Math.random() < 0.5){                       //逃げる成功した場合
        SetMessage("うまく逃げ出した", null);
        gPhase = 6;
        return;
    }

    //逃げる失敗した場合
    SetMessage("逃げられない！", null);
}


//	経験値加算
function AddExp( val )
{
    gEx += val;                                      //経験値加算
    while( gLv * (gLv + 1) * 2 <= gEx ){             //レベルアップ条件を満たしている場合
        gLv++;                                       //レベルアップ
        gMHP += 4 + Math.floor(Math.random() * 3);   //最大HP上昇 4~6
    }
}


//敵出現処理
function AppearEnemy( t )
{
    gPhase = 1;                                     //敵出現フェーズ
    gEnemyHP = t * 3 + 5;                           //敵のHP
    gEnemyType = t;                                 //敵の種類
    SetMessage("敵が現れた！", null);
}


//戦闘コマンド処理
function CommandFight()
{
    gPhase = 2;                                     //戦闘コマンド選択フェーズ
    gCursor = 0;
    SetMessage("　戦う", "　逃げる");
}

//戦闘画面描画初期
function DrawFight( g )
{
    g.fillStyle = "#000000";                         //背景色
    g.fillRect(0, 0, WIDTH, HEIGHT);                 //画面全体を短形描画

    if(gPhase <= 5){                                   //敵が生存している場合
        if(IsBoss()){                                        //ラスボスの場合の画面描画
            g.drawImage(gImgBoss, WIDTH/2 - gImgBoss.width/2, HEIGHT/2 - gImgBoss.height/2);
        }
        else{                                                //通常モンスターの場合の画面描画
            let w = gImgMonster.width / 4;
            let h = gImgMonster.height;
            g.drawImage( gImgMonster, gEnemyType * w, 0, w, h, Math.floor(WIDTH/2 - w/2), Math.floor(HEIGHT/2 - h/2), w, h);
        }
    }

    DrawStatus( g );                           //ステ－タス描画
    DrawMessage( g );                          //メッセージ描画

    if( gPhase == 2){                          //戦闘フェーズがコマンド選択中の場合
        g.fillText( "＞", 25, 280 + 33 * gCursor );   //戦闘フェーズ時のカーソル描画
    }

}


//フィールド画面描画処理
function DrawField( g ) 
{
    let mx = Math.floor(gPlayerX / TILESIZE);         //プレイヤーのタイル座標X
    let my = Math.floor(gPlayerY / TILESIZE);         //プレイヤーのタイル座標Y

    for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
        let ty = my + dy;                            //タイル座標Y
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;     //実画面のマップをループさせる
		for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
            let tx = mx + dx;                         //タイル座標X
            let px = (tx + MAP_WIDTH) % MAP_WIDTH;    //実画面のマップをループさせる
            DrawTile(g, 
                    tx * TILESIZE + WIDTH/2 - gPlayerX,
                    ty * TILESIZE + HEIGHT/2 - gPlayerY, 
                    gMap[ py * MAP_WIDTH + px]);
		}
	}

    //プレイヤーの処理
    g.drawImage(gImgPlayer, 
        (gFrame >> 4 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT, 
        WIDTH/2 - CHRWIDTH/2, HEIGHT/2 - CHRHEIGHT + TILESIZE/2, CHRWIDTH, CHRHEIGHT);


    //ステータスウィンドウ
    g.fillStyle = WNDSTYLE;                    //ウィンドウの色
    g.fillRect(10, 3, 105, 160);                  //短形描画
    
    DrawStatus( g );                           //ステ－タス描画
    DrawMessage( g );                          //メッセージ描画
}


function DrawMain()
{
    const g  = gScreen.getContext("2d");              //仮想画面の2D描画コンテキストの取得

    if(gPhase <= 1){
        if(flag == 0){
            //adventure_ring();
        }
        flag = 1;
        DrawField( g );                               //フィールド画面描画
    }
    else{
        DrawFight( g );                               //戦闘画面
    }
}

function DrawMessage( g )
{
    if( !gMessage1 ){                             //メッセージが存在しない場合
        return;
    }

    g.fillStyle = WNDSTYLE;							//	ウィンドウの色
	g.fillRect( 15, 240, 350, 100 );					//	矩形描画

    g.font = FONT;                               //文字フォントの設定
    g.fillStyle = FONTSTYLE;                     //文字の色
    g.fillText(gMessage1, 25, 280)                 //メッセージ一行目描画
    if( gMessage2 ){                             //2行目にメッセーシが行がされる場合
        g.fillText(gMessage2, 25, 315)            //メッセージ2行目描画
    }

}


//ステータス描画
function DrawStatus( g )
{
    g.font = FONT;									//	文字フォントを設定
	g.fillStyle = FONTSTYLE;						//	文字色
	g.fillText( "Lv " + gLv, 20, 40 );				//	Lv
	g.fillText( "HP " + gHP, 20, 75 );				//	HP
	g.fillText( "Ex " + gEx, 20, 110 );				//	Ex
}


function DrawTextRight( g, str, x, y){
    g.textAlign = "right";
    g.fillText(str, x, y);
    g.textAlign = "left";
}


function DrawTile(g, x, y, idx)
{
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}


//ダメージ量算出
function GetDamage( a )
{
    return( Math.floor( a * ( 1 + Math.random() ) ) );     //敵の攻撃力の算出 1~2倍
}


function IsBoss()
{
    return( gEnemyType == gMonsterName.length - 1 );
}

function LoadImage()
{
    gImgBoss    = new Image(); gImgBoss.src    = gFileBoss;             //ラスボス画像読み込み
    gImgMap     = new Image(); gImgMap.src     = gFileMap;              //マップ画像読み込み
    gImgMonster = new Image(); gImgMonster.src = gFileMonster;          //モンスター画像読み込み
    gImgPlayer  = new Image(); gImgPlayer.src  = gFilePlayer;           //プレイヤー画像読み込み
}


function SetMessage( v1, v2)
{
    gMessage1 = v1;
    gMessage2 = v2;
}

//IE対応
function Sign( val )
{
    if( val == 0){
        return(0);
    }
    if( val < 0){
        return(-1);
    }
    return(1);
}

//フィールド進行処理
function TickField()
{
    if( gPhase != 0 ){
        return;
    }

    if(gMoveX != 0 || gMoveY != 0 || gMessage1){}                //移動中またはメッセージ表示中の場合
    else if( gKey[ 37 ] ){ gAngle = 1;  gMoveX = -TILESIZE;}     //左
    else if( gKey[ 38 ] ){ gAngle = 3;  gMoveY = -TILESIZE;}     //上
    else if( gKey[ 39 ] ){ gAngle = 2;  gMoveX = TILESIZE;}      //右
    else if( gKey[ 40 ] ){ gAngle = 0;  gMoveY = TILESIZE;}      //下

    //移動後のタイル座標判定
    let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE);    //移動後のタイル座標X
    let my = Math.floor((gPlayerY + gMoveY) / TILESIZE);    //移動後のタイル座標Y
    mx += MAP_WIDTH;                                        //マップループ処理X
    mx %= MAP_WIDTH;                                        //マップループ処理X
    my += MAP_HEIGHT;                                       //マップループ処理Y
    my %= MAP_HEIGHT;                                       //マップループ処理Y
    let m = gMap[ my * MAP_WIDTH + mx];                     //タイル番号
    if( m == 3 || m == 4 || m == 5 || 
        m == 8 || m == 9 || m == 12 || m == 13 || m == 14 ){                                            //進入不可の地形の場合
        gMoveX = 0;                                         //移動不可
        gMoveY = 0;                                         //移動不可
    }

    if(Math.abs( gMoveX ) + Math.abs( gMoveY ) == SCROLL){
        if( m == 147 || m == 148 ){               //お城のときのメッセーシ
            gHP = gMHP;                     //HP全回復
            SetMessage("魔王を倒してください", null);
        }
        if(m == 137 || m == 138){             //街のときのメッセージ
            gHP = gMHP;                     //HP全回復
            SetMessage("西の果てにも村が", "あります");
        }
        if( m == 145 || m == 146){                        //村のときのメッセージ
            gHP = gMHP;                     //HP全回復
            SetMessage("鍵は", "洞窟にあります");
        }
        if(m == 111){                        //洞窟のときのメッセージ
            gItem = 1;                      //鍵を入手
            SetMessage("鍵を手に入れた", null);
        }
        if(m == 117){                       //扉のときのメッセージ
            if( gItem == 0 ){              //鍵を持っていない場合
                gPlayerY -= TILESIZE;      //1マス上へ移動
                SetMessage("鍵が必要です", null);
            }
            else{                          //鍵を持っている場合
                SetMessage("扉が開いた", null);
            }
        }
        if(m == 155 || m == 156 || m == 163 || m == 164){                       //ボスのときのメッセージ
            AppearEnemy(gMonsterName.length - 1);
        }
        if(Math.random() * 100 < 10){                       //ランダムエンカウント
            let t = Math.abs( gPlayerX / TILESIZE - START_X) +         //近いところは弱い敵，遠いところは強い敵が出現
                    Math.abs( gPlayerY / TILESIZE - START_Y);
            
                                                                        /*レベル0=スライム レベル1=うさぎ レベル2=ナイト レベル3=ドラゴン*/
            if( m == 1 ){                                               //マップタイプが林の場合
                t += 8;                                                 //敵のレベルを0~0.5上昇
            }
            if( m == 2 ){                                               //マップタイプが山の場合
                t += 16;                                                //敵のレベルを1上昇
            }
            t += Math.random() * 8;                                     //敵レベルを0~0.5上昇
            t = Math.floor( t / 16 );
            t = Math.min( t, gMonsterName.length - 2);                  //ラスボスは道中では出ないようにする(上限処理)
            AppearEnemy( t );                                           //通常モンスターかラスボス化の判定
        }
    }

    gPlayerX += Sign(gMoveX) * SCROLL;  //プレイヤー座標移動X
    gPlayerY += Sign(gMoveY) * SCROLL;  //プレイヤー座標移動Y
    gMoveX -= Sign(gMoveX) * SCROLL;    //移動量消費X
    gMoveY -= Sign(gMoveY) * SCROLL;    //移動量消費Y

    //実画面の座標のループ処理
    gPlayerX += (MAP_WIDTH * TILESIZE);
    gPlayerX %= (MAP_WIDTH * TILESIZE);
    gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);
}


function WmPaint()
{
    DrawMain();

    const ca = document.getElementById("main");  //mainキャンパスの要素取得
    const g  = ca.getContext("2d");              //2D描画のコンテキストの取得
    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight);    //仮想画面を実画面に転送
}

//ブラウザのサイズ変更イベント
function WmSize()
{
    const	ca = document.getElementById( "main" );	//	mainキャンバスの要素を取得
	ca.width = window.innerWidth;					//	キャンバスの幅をブラウザの幅へ変更
	ca.height = window.innerHeight;		//	キャンバスの高さをブラウザの高さへ変更

    const g = ca.getContext("2d");
    g.imageSmoothingEnabled = g.imageSmoothingEnabled = SMOOTH;    //補完処理

    //実画面のサイズを計測．ドットのアスペクト比を維持し最大サイズを計測
    gWidth  = ca.width;
    gHeight = ca.height;
    if(gWidth / WIDTH < gHeight / HEIGHT){
        gHeight = gWidth * HEIGHT / WIDTH;
    }else{
        gWidth =gHeight * WIDTH / HEIGHT;
    }
}


//タイマーイベント発生時の処理
function WmTimer() {
    if( !gMessage1 ){               //イベントのときはプレイヤーの動きが止まる
        gFrame++;                   //繰り返し処理
        TickField();                //フィールド進行処理
    }
    WmPaint();
}

//キー入力(DOWN)イベント
window.onkeydown = function( ev )
{
    let c = ev.keyCode;             //キーコード取得
    if( gKey[c] != 0 ){             //すでに押下中の場合(キーリピート)
        return;
    }
    gKey[ c ] = 1;

    if(gPhase == 1){                //敵が現れた場合
        //Battle_ring();              //BGM
        CommandFight();             //戦闘コマンド
        return;
    }

    if(gPhase == 2){                                     //戦闘コマンド選択中の場合
        if(c == 13 || c == 90){                          //EnterキーまたはZキーを押した場合
            gOrder = Math.floor(Math.random() * 2);      //プレイヤーとモンスターの戦闘の行動順番決め
            Action();                                    //戦闘行動処理
        }
        else{
            gCursor = 1 - gCursor;  //カーソル移動
        }
        return;
    }

    if(gPhase == 3){                
        Action();                   //戦闘行動処理
        return;
    }

    if( gPhase == 4 ){
        CommandFight();             //戦闘コマンド
        return;
    }

    if( gPhase == 5){
        gPhase = 6;
        AddExp(gEnemyType + 1);                  //経験値加算
        SetMessage("敵を倒した！", null);
        return;
    }

    if( gPhase == 6 ){
        if( IsBoss() && gCursor == 0 ){          //敵がラスボスで，かつ「戦う」を選択した場合
            SetMessage("魔王を倒した", "世界に平和が訪れた");
            return;
        }
        gPhase = 0;                            //マップ移動フェイズ
    }

    if( gPhase == 7){                         //プレイヤーのHPが0になった場合
        gPhase = 8;
        SetMessage("あなたは敗北した", null);
        return;
    }

    if( gPhase == 8){                          //プレイヤーのHPが0になった場合
        SetMessage("Game Over", null);
        return;
    }

    gMessage1 = null;
}

//キー入力(UP)イベント
window.onkeyup = function( ev )
{
    gKey[ ev.keyCode ] = 0;
}


//ブラウザ起動イベント
window.onload = function()
{
    LoadImage();

    gScreen = document.createElement("canvas");  //仮想画面の作成
    gScreen.width = WIDTH;                       //仮想画面のサイズ
    gScreen.height = HEIGHT;                     //仮想画面のサイズ
    
    WmSize();                                                     //画面サイズの初期化 
    window.addEventListener("resize", function(){ WmSize() });    //ブラウザの変更時，WmSizeを呼び出す
    setInterval(function(){ WmTimer() }, INTERVAL);               //33ms間隔でWmTimermTimerを呼び出す
}

