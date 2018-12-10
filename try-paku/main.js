// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 360;

var ASSETS = {
  sound: {
    title: './snd/opening.mp3',
    game: './snd/game.mp3',
  },
  image: {
    cheese: './img/cheese_w90h100.png',
    rat: './img/mouse_w97h130.png',
    title: './img/title.png',
    background: './img/bg.png',
  },
  spritesheet: {
    rat_ss: {
      frame: {
        width: 80,
        height: 108,
        cols: 5,
        rows: 1,
      },
      animations: {
        stay: {
          frames: [0,1],
          frequency: 15,
        },
        miss: {
          frames: [2,4],
          frequency: 15,
        },
        success: {
          frames: [2,3],
          frequency: 15,
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
    miss: function miss(){
      this.animation.gotoAndPlay("miss");
    },
    success: function miss(){
      this.animation.gotoAndPlay("success");
    },
  }
);

// タイトルのシーン
phina.define(
  'TitleScene', {
    superClass: 'DisplayScene',
    init: function(option){
      console.info(option);
      this.superInit(option);
      this.soundFinished = false;
//      this.backgroundColor = '#000000';
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
      console.info(option);
      this.superInit(option);
      
      // ゲームのBGMを再生
      SoundManager.play("game");
      
      // 背景色を指定
//      this.backgroundColor = '#000000';
      this.backgroundSprite = Sprite("background").addChildTo(this);
      this.backgroundSprite.x = this.gridX.center();
      this.backgroundSprite.y = this.gridY.center();
      
      // ネズミの追加
      // ToDo: ネズミの大きさがちがああああああう
      this.rat = Rat().addChildTo(this);
      this.rat.x = this.gridX.center() - 5;
      this.rat.y = this.gridY.center() - 45;
      
      // チーズの追加
      this.cheese = Cheese().addChildTo(this);
      this.cheese.x = this.gridX.center();
      this.cheese.y = this.gridY.center();
      
      setTimeout(function(){
        this.showMiss();
      }.bind(this),5000);
      
    },
    showMiss: function(){
      // 失敗シーンを表示する
//      this.exit("miss",{
//        background: this.backgroundSprite,
//        rat: this.rat,
//        cheese: this.cheese,
//      });
//      this.exit();
    },
    onclick: function(){
        this.showMiss();
    },
    update: function(app){
    },
  }
);

// 失敗のシーン
phina.define(
  'MissScene', {
    
    superClass: 'DisplayScene',
    init: function(option) {
      this.superInit(option);
//      this.backgroundSprite = option.background.addChildTo(this);
//      this.rat = option.rat.addChildTo(this);
//      this.cheese = option.cheese.addChildTo(this);
//      console.info( option );
//      // 背景色を指定
//      this.backgroundColor = '#000000';
      this.backgroundSprite = Sprite("background").addChildTo(this);
      this.backgroundSprite.x = this.gridX.center();
      this.backgroundSprite.y = this.gridY.center();
    },
  }
);

// 成功のシーン
phina.define(
  'SuccessScene', {
    
    superClass: 'DisplayScene',
    init: function(option) {
      this.superInit(option);
      console.info( option );
    },
  }
);

// メイン処理
phina.main(function() {
  
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title', // メインシーンから開始する
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
