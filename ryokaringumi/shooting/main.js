phina.globalize();

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 720;
const magnification = 2;
var player;
var scene = 0;
var mainscene;
var enemies = new Set();
var players = new Set();
var hp_display;

var Assets = {
  "image":{
    "background":"image/background.png",
    "Player":"image/player.png",
    "PlayerBullet":"image/player_bullet_1.png",
    "title":"image/title.png",
    "clear":"image/clear.png",
    "gameover":"image/gameover.png",
    "enemy_1":"image/enemy_1.png",
    "enemy_bullet_1":"image/enemy_bullet_1.png"
  },
  "sound":{
    "title":"sound/title.mp3",
    "music_1":"sound/music_1.mp3",
    "player_shoot":"sound/player_shoot.mp3",
    "player_death":"sound/player_death.mp3",
    "player_damage":"sound/player_damage.mp3",
    "enemy_shoot":"sound/enemy_shoot.mp3",
    "enemy_damage":"sound/enemy_damage.mp3",
    "enemy_death":"sound/enemy_death.mp3"
  }
}

phina.define("Enemy",{
  "superClass":"Sprite",
  "init":function(option){
    this.superInit(option);
    
    enemies.add(this);
  },
  "update":function(){
    
  },
  "damage":function(){
    player.score += this.score;
    player.score_display_update();
  }
});

phina.define("Enemy1",{
  "superClass":"Enemy",
  "init":function(option){
    this.superInit("enemy_1");
    this.x = option;
    this.y = 0;
    this.rotation = 90;
    this.bulletCT = 0;
    this.score = 10;
  },
  "update":function(){
    if(this.y >= SCREEN_HEIGHT) this.remove();
    this.y+= 10;
    this.superMethod("update");
    if(this.bulletCT == 0){
      EnemyBullet({"x":this.x,"y":this.y,"rotation":this.rotation,"speed":20}).addChildTo(mainscene);
      this.bulletCT = 20;
    }else{
      this.bulletCT -= 1;
    }
  },
  "damage":function(){
    this.superMethod("damage");
    SoundManager.play("enemy_damage");
    enemies.delete(this);
    this.remove();
    
  }
})

phina.define("Player",{
  "superClass":"Sprite",
  "init":function(option){
    this.superInit(option);
    
    players.add(this);
    this.x = SCREEN_WIDTH / 2;
    this.y = SCREEN_HEIGHT / 2 + (120 * magnification);
    this.speed = 10;
    this.rotation = 0;
    this.bulletCT = 0;
    this.score = 0;
    
    //hp表示の準備をする
    this.hp = 100;
    hp_display = Label("HPDisplay").addChildTo(mainscene);
    hp_display.left = 0;
    hp_display.top = 0;
    hp_display.origin.x = 0;
    hp_display.origin.y = 0;
    hp_display.fill = "white"
    this.hp_display_update();
    
    //score表示の準備をする
    this.score = 0;
    score_display = Label("ScoreDisplay").addChildTo(mainscene);
    score_display.left = 0;
    score_display.botton = 0;
    score_display.origin.x = 0;
    score_display.origin.y = 0;
    score_display.fill = "white"
    this.score_display_update();
  },
  "update":function(arg){
    if(scene == 1){
      player.bulletCT -= 1;
      if(arg.keyboard.getKey("w")){
        player.y -= player.speed;
      }
      if(arg.keyboard.getKey("s")){
        player.y += player.speed;
      }
      if(arg.keyboard.getKey("a")){
        player.x -= player.speed;
      }
      if(arg.keyboard.getKey("d")){
        player.x += player.speed;
      }
      if(arg.keyboard.getKey("j")){
        if(player.bulletCT <= 0 ){
          PlayerBullet("PlayerBullet").addChildTo(mainscene);
          player.bulletCT = 4;
        }
      }
      if(player.top < 0){
        player.top = 0;
      }
      if(player.bottom > SCREEN_HEIGHT){
        player.bottom = SCREEN_HEIGHT;
      }
      if(player.left < 0){
        player.left = 0;
      }
      if(player.right > SCREEN_WIDTH){
        player.right = SCREEN_WIDTH;
      }
    }
  },
  "hp_display_update":function(){
    hp_display.text = "hp " + this.hp;
  },
  "score_display_update":function(){
    score_display.text = "score " + this.score;
  },
  "damage":function(damage){
    this.hp -= damage;
    this.hp_display_update();
    SoundManager.play("player_damage");
    if(this.hp <= 0){
      SoundManager.play("player_death");
    }
  }
  
})

phina.define("Bullet",{
  "superClass": "Sprite",
  "init": function(option){
    this.superInit(option);
  },
  "update": function(arg){
    this.move(this.speed);
    
    //端に触れたかどうかboundがtrueの処理は未実装
    if(this.top < 0 || this.left < 0 || this.bottom > SCREEN_HEIGHT || this.rigth > SCREEN_WIDTH){
      if(this.bound == true){
      }else{
        
        this.remove();
        
      }
    }
    
    //弾の当たり判定
    this.targets.forEach(function(value,key){
      
      if(this.hitTestElement(value)){
        value.damage(this.power);
      }
      
    },this);
  },
  "move": function(speed){
    
    this.x += Math.cos(this.rotation * (Math.PI / 180)) * speed;
    this.y += Math.sin(this.rotation * (Math.PI / 180)) * speed;
    
  }
  
});

phina.define("PlayerBullet",{
  "superClass": "Bullet",
  "init": function(option){
    this.superInit(option);
    
    players.add(this);
    SoundManager.play("player_shoot");
    this.targets = enemies;
    this.power = 1;
    this.x = player.x;
    this.y = player.y;
    this.bound = false;
    this.speed = player.speed * 2;
    this.rotation = player.rotation - 90;
    
  },
  "update":function(){
    this.superMethod("update");
  },
  "damage":function(){
    if(this.hp == 0){
      players.delete(this);
      this.remove();
    }else{
      this.hp -= 1;
    }
  }
});

phina.define("EnemyBullet",{
  "superClass":"Bullet",
  "init":function(option){
    this.superInit("enemy_bullet_1");
    
    enemies.add(this);
    
    if(typeof option == "object"){
      
      if(typeof option.x == "number"){
        this.x = option.x;
      }else{
        this.y = 0;
      }
      
      if(typeof option.y == "number"){
        this.y = option.y;
      }else{
        this.y = 0;
      }
      
      if(typeof option.rotation == "number"){
        this.rotation = option.rotation;
      }else{
        this.rotetion = 0;
      }
      
      if(typeof option.power == "number"){
        this.power = option.power;
      }else{
        this.power = 1;
      }
      
      if(typeof option.bound == "boolean"){
        this.bound = option.bound;
      }else{
        this.bound = false;
      }
      
      if(typeof option.speed == "number"){
        this.speed = option.speed;
      }else{
        this.speed = 10;
      }
      
      if(typeof option.hp == "number"){
        this.hp = option.hp;
      }else{
        this.hp = 0;
      }
      
    }
    
    this.targets = players;
  },
  "damage":function(){
    if(this.hp == 0){
      enemies.delete(this);
      this.remove();
    }else{
      this.hp -= 1;
    }
  }
})

phina.define('MainScene', {
  "superClass": 'DisplayScene',
  "init": function(option) {
    this.superInit(option);
    
    mainscene = this;
    
    this.background = Sprite('background').addChildTo(this);
    this.background.x = this.gridX.center();
    this.background.y = this.gridY.center();
    
    player = Player("Player").addChildTo(this);
    
    this.title = Sprite("title").addChildTo(this);
    
    this.title.x = this.gridX.center();
    this.title.y = this.gridY.center();
    this.title.setScale(3,3);
    var this_temp = this;
    this.title.tweener.to({
      "scaleX":1,
      "scaleY":1,
    },1000,"easeInCubic").call(function(){
      SoundManager.play("title");
      this_temp.title.tweener.to({
        "alpha":0
      },1000,"easeInCubic").call(function(){
        SoundManager.playMusic("music_1");
        scene = 1;
        Enemy1(SCREEN_WIDTH / 2).addChildTo(mainscene);
        Enemy1(SCREEN_WIDTH / 2 * 1.5).addChildTo(mainscene);
        Enemy1(SCREEN_WIDTH / 4).addChildTo(mainscene);
      });
    })
    
  },
  "update":function(arg){
    
  }
});

phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    assets:Assets,
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT
  });
  // アプリケーション実行
  app.run();
});