// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH  = 480;
var SCREEN_HEIGHT = 360;

var ASSETS = {
  image: {
    background: './img/bg.png',
  },
};

// MainScene クラスを定義
phina.define(
  'MainScene', {
    
    superClass: 'DisplayScene',
    init: function(option) {
      this.superInit(option);
      
      // 背景色を指定
      this.backgroundColor = '#ffffff';
      
      var background = Sprite('background').addChildTo(this);
      this.background = background;
      
      background.x = this.gridX.center();
      background.y = this.gridY.center();
      background.width = SCREEN_WIDTH*2;
      background.height = SCREEN_HEIGHT*2;
    },
  }
);

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
