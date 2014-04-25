/*
  Programming and art made by www.lessmilk.com
  You can freely look at the code below, 
  but you are not allowed to use the code or art to make your own games
*/

Game.Play = function (game) { };

Game.Play.prototype = {

	create: function () {
		this.cursor = this.game.input.keyboard.createCursorKeys();

		this.clouds = game.add.group();
	    this.clouds.createMultiple(10, 'cloud');
	    this.clouds.setAll('outOfBoundsKill', true);

	   	if (score > best_score)
	   		best_score = score;

	   	score = 0;

	    if (best_score > 0) {
	    	var x = -best_score*10+h/2;
			this.score_line = game.add.sprite(0, x, 'line');
			this.score_line_label = game.add.text(w-100, x-25, 'best score', { font: '20px Arial', fill: '#fff' });
		}

		this.platforms = game.add.group();
	    this.platforms.createMultiple(15, 'platform');
	    this.platforms.setAll('body.immovable', true);
	    this.platforms.setAll('body.allowCollision.down', false);
	    this.platforms.setAll('body.allowCollision.right', false);
	    this.platforms.setAll('body.allowCollision.left', false);

		this.hearts = game.add.group();
	    this.hearts.createMultiple(5, 'heart');

		this.spikes = game.add.group();
	    this.spikes.createMultiple(10, 'spike');

	    this.emitter = game.add.emitter(0, 0, 200);
	    this.emitter.x = -100;
	    this.emitter.on = false;
	    this.emitter.makeParticles('heart');
		this.emitter.gravity = 10;
		this.emitter.start(false, 2000, 15, 0);
		this.emitter.width = 50;

		this.princess = this.game.add.sprite(w/2+100, h-200, 'princess');
    	this.princess.body.gravity.y = 12;
    	this.princess.anchor.setTo(0.5, 1);

		this.ground = this.game.add.sprite(0, h-56, 'ground');
		this.ground.scale.setTo(15, 1);
		this.ground.body.immovable = true;
		this.ground.outOfBoundsKill = true;

	    this.score_label = game.add.text(10, 10, '0', { font: '20px Arial', fill: '#fff' });
	    this.tutorial_label = game.add.text(w/2+0.5, h-25, 'use the arrow keys to move', { font: '20px Arial', fill: '#fff' });
	    this.tutorial_label.anchor.setTo(0.5, 0.5);

		this.jump_s = game.add.audio('jump');
		this.heart_s = game.add.audio('heart');
		this.hit_s = game.add.audio('hit');
		this.music_s = game.add.audio('music');
		if (sound) this.music_s.play('', 0, 0.2, true);

	    this.maxX = h/2-20;
	    this.next_platform = 10;
	    this.next_cloud = 50;
	    this.took_heart = false;

	    this.init_level();
	},

	update: function() {	
		if (this.princess.alive) {    
			game.physics.collide(this.princess, this.ground);
			game.physics.collide(this.princess, this.platforms);	
			game.physics.overlap(this.princess, this.hearts, this.take_heart, null, this);
			game.physics.overlap(this.princess, this.spikes, this.take_spike, null, this);
		}

		if (this.princess.body.y < this.maxX) {
			this.move_screen_up();
			this.generate_level();				
		}

		this.platforms.forEachAlive(this.update_platform, this);
		this.hearts.forEachAlive(this.update_heart, this);
		this.spikes.forEachAlive(this.update_spike, this);
		
		this.princess_move();
	},

	init_level: function() {
		this.add_platform(h-150, 100);
		this.add_platform(h-300, 200);	
		this.add_platform(h-450, 300);
		this.add_platform(h-550, 300);

		this.add_cloud(h-300);
		this.add_cloud(h-500);
	},

	generate_level: function() {
		if (this.next_platform < this.platforms.y) {
			
			if (score < 250)
				var level = [1, 1, 1, 1, 2, 2, 2, 3, 5, 5];
			else if (score < 500)
				var level = [1, 1, 2, 2, 2, 3, 3, 4, 4, 5];
			else if (score < 1000)
				var level = [1, 2, 2, 3, 3, 3, 4, 4, 4, 5];
			else if (score < 2000)
				var level = [1, 2, 3, 3, 3, 4, 4, 4, 4, 5];
			else if (score < 3000)
				var level = [2, 3, 3, 3, 4, 4, 4, 4, 4, 5];
			else
				var level = [2, 3, 3, 4, 4, 4, 4, 4, 4, 4];


			var type = level[rand(level.length)];
	
			var y = -this.platforms.y-30;
			this.next_platform += rand(80)+70;

			if (type == 1)
				this.add_platform_double(y);
			else if (type == 2)
				this.add_platform(y);
			else if (type == 3)
				this.add_platform_moving(y);
			else if (type == 4) {
				if (rand(3) > 0) this.add_platform_moving(y);
				else this.add_platform_double(y);
				this.add_platform_spike(y-150);
				this.next_platform += 150;
			}
			else if (type == 5)
				this.add_platform_heart(y);
		}
		
		if (this.next_cloud < this.clouds.y) {
			this.add_cloud(-this.clouds.y-70);
			this.next_cloud += 100+rand(200);
		}
	},

	move_screen_up: function() {	    
		var delta = this.maxX - this.princess.body.y;
		this.princess.body.y = this.maxX;
		this.platforms.y += delta;
		this.clouds.y += delta/3;
		this.hearts.y += delta;
		this.spikes.y += delta;

		this.emitter.forEachAlive(function(p){p.y += delta;}, this);

		if (this.score_line) {
			this.score_line.y += delta;
			this.score_line_label.y += delta;
		}

		if (this.ground.y > 0) {
			this.ground.y += delta;
			this.tutorial_label.y += delta; 
		}

		score = Math.floor(this.platforms.y/10);
		this.score_label.content = score;		
	},

	princess_move: function() {
		if(this.princess.body.y > h+200) {
			this.music_s.stop();
			game.state.start('Dead');
			return;
		}

		if (this.princess.x < 20)
			this.princess.x = 20;
		else if(this.princess.x > w-20)
			this.princess.x = w-20; 

		if (this.princess.body.touching.down && this.princess.scale.y == 1) {
			if (sound) this.jump_s.play('', 0, 0.15, false);

			if (this.princess.scale.x == 1)
				var scale_x = 1.3;
			else
				var scale_x = -1.3;

			var tween = game.add.tween(this.princess.scale).to({ y: 0.7, x: scale_x}, 150, Phaser.Easing.Linear.None).start();
			
			tween.onComplete.add(function(){
				if (this.princess.scale.x == 1)
					this.princess.scale.setTo(1, 1);
				else
					this.princess.scale.setTo(-1, 1);
				this.princess.body.velocity.y = -500;
			}, this);
		}

	    this.princess.body.velocity.x = 0;

	    if (this.cursor.left.isDown && this.princess.alive) {
	    	this.princess.frame = 0;
			this.princess.body.velocity.x = -300;
	    	
	    	if (this.princess.scale.x == 1)
	    		this.princess.scale.setTo(-1, 1);
	    }
	    else if (this.cursor.right.isDown && this.princess.alive) {
	    	this.princess.frame = 0;
			this.princess.body.velocity.x = 300;

			if (this.princess.scale.x == -1)
	    		this.princess.scale.setTo(1, 1);
	    }
	    else 
	    	this.princess.frame = 1;

	    if (this.princess.body.velocity.y > -200) {
	    	this.took_heart = false;
	    	this.emitter.on = false;
	    }

	    this.emitter.x = this.princess.x;
	    this.emitter.y = this.princess.y-5;
	},

	add_platform: function(y, x) {
		var platform = this.platforms.getFirstExists(false);

		if (platform) {
			x = typeof x !== 'undefined' ? x : rand(w-platform.width-10)+platform.width/2+5;

			platform.reset(x, y);
			platform.anchor.setTo(0.5, 0.5);
			platform.body.velocity.x = 0;

			return platform;
		}
	},

	add_platform_double: function(y) {
		this.add_platform(y);
		this.add_platform(y);
	},	

	add_platform_heart: function(y) {
		var p = this.add_platform(y);
		var heart = this.hearts.getFirstExists(false);

		if (heart) {
			heart.anchor.setTo(0.5, 0.5);
			heart.reset(p.x, y-29);
		}
	},
	
	add_platform_spike: function(y) {
		var p = this.add_platform(y);
		this.add_spike(p.x, p.y+18);
	},

	add_platform_moving: function(y) {
		var p = this.add_platform(y);
		
		if (rand(2) == 0)
			p.body.velocity.x = -120;
		else 
			p.body.velocity.x = 120;
	},

	add_cloud: function(y) {
		var cloud = this.clouds.getFirstExists(false);

		if (cloud) {
			cloud.reset(rand(w)- cloud.width, y);
			if (rand(2) == 1) cloud.body.velocity.x = 8;
			else cloud.body.velocity.x = -8;
		}	
	},

	add_spike: function(x, y) {
		var spike = this.spikes.getFirstExists(false);

		if (spike) {
			spike.body.setSize(spike.width-6, spike.height-6, 0, 0)
			spike.anchor.setTo(0.5, 0.5);
			spike.reset(x, y);	
		}
	},	

	update_platform: function(p) {
		if (p.x + p.width/2 >= w && p.body.velocity.x > 0) 
			p.body.velocity.x = -120;
		else if (p.x - p.width/2 <= 0 && p.body.velocity.x < 0) 
			p.body.velocity.x = 120;

		if (p.y - p.height > -this.platforms.y+h)
			p.kill();
	},

	update_heart: function(h) {
		if (h.y - h.height > -this.hearts.y+h)
			h.kill();
	},

	update_spike: function(s) {
		if (s.y - s.height > -this.spikes.y+h)
			s.kill();
	},

	take_heart: function(princess, heart) {
		heart.kill();
		if (sound) this.heart_s.play('', 0, 0.2, false);
		this.emitter.on = true;
		this.princess.body.velocity.y = -1200;
		this.took_heart = true;
	},

	take_spike: function(princess, spike) {
		if(!this.took_heart) {
			if (sound) this.hit_s.play('', 0, 0.4, false);
			this.princess.alive = false;
			this.princess.body.velocity.y = - 300;
		}
	}
};
