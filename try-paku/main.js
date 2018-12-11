phina.globalize();

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 360;

var ASSETS = {
  sound: {
    title: 'snd/opening.mp3',
    game: 'snd/game.mp3',
    success: 'snd/clear.mp3',
    miss: 'snd/miss.mp3',
  },
  image: {
    cheese: 'img/cheese_w90h100.png',
    rat: 'img/mouse_w97h130.png',
    telop: 'img/telop_w140h40.png',
    title: 'img/title.png',
    background: 'img/bg.png',
  },
  spritesheet: {
    telop_ss: {
      frame: {
        width: 140,
        height: 40,
        cols: 2,
        rows: 1,
      },
      animations: {
        success: {
          frames: [0],
        },
        miss: {
          frames: [1],
        },
      },
    },
    rat_ss: {
      frame: {
        width: 97,
        height: 130,
        cols: 5,
        rows: 1,
      },
      animations: {
        stay: {
          frames: [0,1],
          frequency: 13,
        },
        miss: {
          frames: [2,4],
          frequency: 13,
        },
        success: {
          frames: [2,3],
          frequency: 13 ,
        },
      },
    },
    cheese_ss: {
      frame: {
        width: 90,
        height: 100,
        cols: 2,
        rows: 1,
      },
      animations: {
        full: {
          frames: [0],
        },
        miss: {
          frames: [1],
        },
      },
    },
  },
};

// チーズのスプライト
phina.define(
  'Cheese',{
    superClass: 'Sprite',
    init: function(){
      this.superInit('cheese');
      var anim = FrameAnimation('cheese_ss').attachTo(this);
      anim.gotoAndStop("full");
      this.animation = anim;
    },
    miss: function(){
      this.animation.gotoAndStop("miss");
    },
    success: function(){
      this.hide();
    },
  }
);

// ネズミのスプライト
phina.define(
  'Rat',{
    superClass: 'Sprite',
    init: function(){
      this.superInit('rat');
      var anim = FrameAnimation('rat_ss').attachTo(this);
      anim.gotoAndPlay("stay");
      this.animation = anim;
    },
    miss: function(){
      this.animation.gotoAndPlay("miss");
    },
    success: function(){
      this.animation.gotoAndPlay("success");
    },
  }
);

// テロップのスプライト
phina.define(
  'Telop',{
    superClass: 'Sprite',
    init: function(){
      this.superInit('telop');
      var anim = FrameAnimation('telop_ss').attachTo(this);
      anim.gotoAndPlay("success");
      this.animation = anim;
      this.hide();
    },
    miss: function miss(){
      this.animation.gotoAndPlay("miss");
      this.show();
    },
    success: function(){
      this.animation.gotoAndPlay("success");
      this.show();
    },
  }
);

// タイトルのシーン
phina.define(
  'TitleScene', {
    superClass: 'DisplayScene',
    init: function(option){
      this.superInit(option);
      this.soundFinished = false;
      this.backgroundSprite = Sprite("title").addChildTo(this);
      this.backgroundSprite.x = this.gridX.center();
      this.backgroundSprite.y = this.gridY.center();
      SoundManager.play("title");
      setTimeout(function(){
        this.soundFinished = true;
      }.bind(this),1000);
    },
    onclick: function(){
      if( this.soundFinished ) this.exit();
    },
  }
);

// ゲームのメイン
phina.define(
  'MainScene', {
    
    superClass: 'DisplayScene',
    init: function(option) {
      this.superInit(option);
      
      // ToDo: phinajsのSoundManagerがstop()の実装をした場合ここを書き換える
      // ゲームのBGMを再生(Fade=0sec,ループ=しない)
      SoundManager.playMusic("game",0,false);
      
      // 背景色
      this.backgroundSprite = Sprite("background").addChildTo(this);
      this.backgroundSprite.x = this.gridX.center();
      this.backgroundSprite.y = this.gridY.center();
      
      // ネズミ
      this.rat = Rat().addChildTo(this);
      this.rat.x = this.gridX.center() - 8;
      this.rat.y = this.gridY.center() - 45;
      
      // チーズ
      this.cheese = Cheese().addChildTo(this);
      this.cheese.x = this.gridX.center();
      this.cheese.y = this.gridY.center();
      
      // ゲージ
      this.gauge = Gauge({
        x: this.gridX.center(),
        y: 25,
        width: 400,
        height: 20,
        cornerRadius: 0,
        maxValue: 100,
        value: 0,
        fill: '#f8da79',
        gaugeColor: '#e41c5a',
        stroke: '#f8da79',
        strokeWidth: 20,
      }).addChildTo(this);
      
      // ゲージのアニメーションを止める
      this.gauge.animation = false;
      
      // テロップ
      this.telop = Telop().addChildTo(this);
      this.telop.x = this.gridX.center();
      this.telop.y = 55;
      
      // クリック判定
      this.playable = true;
      
      // ゲージの増減量
      this.gauge_point = 10;
      
      // 時間制限（5秒）
      setTimeout(function(){
        this.showMiss();
      }.bind(this),5000);
      
    },
    // 成功の表示
    showSuccess: function(){
      if( this.playable ){
        this.playable = false;
        SoundManager.stopMusic();
        SoundManager.play("success");
        this.rat.success();
        this.telop.success();
        this.cheese.hide();
      }
    },
    // 失敗の表示
    showMiss: function(){
      if( this.playable ){
        this.playable = false;
        SoundManager.stopMusic();
        SoundManager.play("miss");
        this.rat.miss();
        this.telop.miss();
      }
    },
    // マウスが押された
    onpointstart: function(){
      
      // プレイ中であれば
      if( this.playable ){
        
        // 最大値と同じであれば
        if( this.gauge.value === this.gauge.maxValue ){
          
          // 成功を表示する
          this.showSuccess();
          
        }
        // それ以外は
        else {
          
          // 失敗を表示する
          this.showMiss();
          
          // 欠けたチーズを表示する
          this.cheese.miss();
          
        }
        
      }
      
    },
    // 各フレームごとに処理される
    update: function(){
      
      // プレイ中であれば
      if( this.playable ){
        
        // ゲージを、変化させる
        this.gauge.value += this.gauge_point;
        
        // 最大値以上の場合
        if( this.gauge.value >= this.gauge.maxValue ){
          
          // 最大値を代入（最大値を超えないように）
          this.gauge.value = this.gauge.maxValue;
          
          // ゲージの変化量を反転する
          this.gauge_point *= -1;
          
        }
        // 0以下の場合
        else if( this.gauge.value <= 0 ){
          
          // 0を代入（0を下回らないように）
          this.gauge.value = 0;
          
          // ゲージの変化量を反転する
          this.gauge_point *= -1;
          
        }
        
      }
      
    },
  }
);

// メイン処理
phina.main(function() {
  
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title',
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scenes: [
      {
        label: 'title',
        className: 'TitleScene',
        nextLabel: 'main',
      },
      {
        label: 'main',
        className: 'MainScene',
        nextLabel: 'title',
      },
    ],
  });
  
  // アプリケーション実行
  app.run();
  
});
