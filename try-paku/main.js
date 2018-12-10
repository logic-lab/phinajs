// phina.js をグローバル領域に展開
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
      
      // ゲームのBGMを再生
      SoundManager.playMusic("game",0,false);
      
      // 背景色を指定
      this.backgroundSprite = Sprite("background").addChildTo(this);
      this.backgroundSprite.x = this.gridX.center();
      this.backgroundSprite.y = this.gridY.center();
      
      // ネズミの追加
      this.rat = Rat().addChildTo(this);
      this.rat.x = this.gridX.center() - 8;
      this.rat.y = this.gridY.center() - 45;
      
      // チーズの追加
      this.cheese = Cheese().addChildTo(this);
      this.cheese.x = this.gridX.center();
      this.cheese.y = this.gridY.center();
      
      // テロップの追加
      this.telop = Telop().addChildTo(this);
      this.telop.x = this.gridX.center();
      this.telop.y = 55;
      
      // クリック判定
      this.playable = true;
      
      // 時間制限
      setTimeout(function(){
        this.showMiss();
      }.bind(this),5000);
      
    },
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
    showMiss: function(){
      if( this.playable ){
        this.playable = false;
        SoundManager.stopMusic();
        SoundManager.play("miss");
        this.rat.miss();
        this.telop.miss();
      }
    },
    onclick: function(){
      if( this.playable ){
        this.showSuccess();
        this.cheese.miss();
      }
    },
  }
);

// メイン処理
phina.main(function() {
  
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main',
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
