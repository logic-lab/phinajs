// phina.js をグローバル領域に展開
phina.globalize();

phina.define(
  'AScene', {
    superClass: 'DisplayScene',
    init: function(option){
      this.superInit(option);
      this.label = Label("A Scene").addChildTo(this);
      this.label.x = this.gridX.center();
      this.label.y = this.gridY.center();
    },
    onclick: function(){
      this.exit();
    },
  }
);
phina.define(
  'BScene', {
    superClass: 'DisplayScene',
    init: function(option){
      this.superInit(option);
      this.label = Label("B Scene").addChildTo(this);
      this.label.x = this.gridX.center();
      this.label.y = this.gridY.center();
    },
    onclick: function(){
      this.exit();
    },
  }
);
phina.define(
  'CScene', {
    superClass: 'DisplayScene',
    init: function(option){
      this.superInit(option);
      this.label = Label("C Scene").addChildTo(this);
      this.label.x = this.gridX.center();
      this.label.y = this.gridY.center();
    },
    onclick: function(){
      this.exit();
    },
  }
);

// アプリケーション設定
phina.main(function() {
  
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'a',
    scenes: [
      {
        label: 'a',
        className: 'AScene',
        nextLabel: 'b',
      },
      {
        label: 'b',
        className: 'BScene',
        nextLabel: 'c',
      },
      {
        label: 'c',
        className: 'CScene',
        nextLabel: 'a',
      },
    ],
  });
  
  // アプリケーション実行
  app.run();
  
});
