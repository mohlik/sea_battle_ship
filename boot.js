let phaser_game;
let game_scene;
let game_data = {
	volume: 1,
	last_ai_level: 0,
	game_play: {
		with_bot: false,
		fields: [],
		default_rules: {
			ships: {
				boats: [
					4,
					3,
					2,
					1
				],
				bombs: 0
			},
			filling: 20
		}
	}
};
let files_preloaded = false;
let total_errors = 0;
let game = null;
let landscape = loading_vars['orientation'] == 'landscape';
let is_localhost = (location.hostname == '127.0.0.1' || location.hostname == 'localhost');
window.onload = () => {
	initialize(() => {
		let audioContext = new ((window).AudioContext || (window).webkitAudioContext)();
		window.addEventListener("blur", (event) => {
				audioContext = phaser_game.sound.context;
				if (audioContext.state==='running') {
					audioContext.suspend();
				}
			}, false);
		window.addEventListener("focus", (event) => {
			setTimeout(() => {
				audioContext = phaser_game.sound.context;
				if (audioContext.state==='suspended') {
					audioContext.resume();
				}
			}, 500);
		}, false);
		window.focus();
		let gameConfig = get_game_config(audioContext);
		gameConfig['scene'] = Boot;
		phaser_game = new Phaser.Game(gameConfig);						
	});
}	

class Boot extends Phaser.Scene{
	constructor(){
		super("Boot");
		game_scene = this;
	}

	preload(){	
		set_game_size();

		this.load.plugin('rexroundrectangleplugin', `${loading_vars.urls.external}rexroundrectangleplugin.min.js`, true);
		this.load.plugin('rexrepeatimageplugin', `${loading_vars.urls.external}rexrepeatimageplugin.min.js`, true);
		this.load.image('main_logo', `${loading_vars.urls.preload}SeaBattleshipTeaser.jpg`);
		this.load.image('smooth_logo', `${loading_vars.urls.preload}SeaBattleshipTeaser_smooth.jpg`);
		this.load.once('complete', this.create_play_button, this);
	}

	create_play_button() {
		const bg = this.add.image(
			0, 
			0, 
			'smooth_logo'
		);
		bg.setOrigin(0, 0);
		bg.setScale(loading_vars['W'] / bg.width);

		const logo = this.add.image(
			loading_vars['W'] / 2, 
			loading_vars['H'] / 2, 
			'main_logo'
		);
		logo.setScale(loading_vars['mobile'] ? 0.5 : 1);

		let round_radius = 20;
		let padding = 20;
		let height = 60;

		const round_rect = this.add.rexRoundRectangle(
			logo.x, 
			logo.y, 
			logo.displayWidth, 
			logo.displayWidth, 
			round_radius, 
			0x000000
		);
		round_rect.visible = false;
		const logo_mask = round_rect.createGeometryMask();
		logo.setMask(logo_mask);


		const button = this.add.rexRoundRectangle(
			logo.x, 
			logo.y + logo.displayHeight / 2 + padding + height / 2, 
			logo.displayWidth, 
			height, 
			round_radius, 
			0x00aa00
		);
		const play_img = this.add.triangle(
			button.x, 
			button.y, 
			0, 
			0, 
			20, 
			10, 
			0, 
			20, 
			0xffffff
		);

		button.setInteractive();
		button.on('pointerup', () => {
			this.create_loader(() => {
				bg.destroy();
				logo.destroy();
				round_rect.destroy();
				logo_mask.destroy();
				play_img.destroy();
				button.destroy();
			});
		})

	}

	set_loading_progress(val) {
		console.log(val);
		if(this.loader_progress) {
			this.loader_progress.setCrop(0, 0, this.loader_progress.width * val, this.loader_progress.height);
		}
	}

	create_loader(on_complete = () => {}) {
		this.load.image('main_bg', `${loading_vars.urls.bgs}bg_tile.jpg`);
		this.load.image('loader_back', `${loading_vars.urls.preload}loader_back.png`);
		this.load.image('loader_progress', `${loading_vars.urls.preload}loader_progress.png`);
		this.load.image('big_logo', `${loading_vars.urls.preload}big_logo.png`);
		this.load.once('complete', () => {
			this.bg = this.add.image(
				0, 
				0,
				'main_bg'
			);
			this.bg.setOrigin(0, 0);
			this.bg.setScale(loading_vars['W'] / this.bg.width);

			this.logo = this.add.image(
				loading_vars['W'] / 2, 
				loading_vars['H'] / 2, 
				'big_logo'
			);

			let padding = 20;

			this.loader_back = this.add.image(
				this.logo.x, 
				this.logo.y + this.logo.displayHeight / 2 + padding,
				'loader_back'
			);
			this.loader_back.y += this.loader_back.height / 2;
			
			this.loader_progress = this.add.image(
				this.loader_back.x, 
				this.loader_back.y,
				'loader_progress'
			);
			this.set_loading_progress(0);
			on_complete();
			this.preload_files(() => {
				this.create_game();
			});
		});
		this.load.start();
	}

	destroy_loader() {
		this.logo.destroy();
		this.loader_back.destroy();
		this.loader_progress.destroy();
	}

	preload_files(on_complete){
		const js = [
			{name: 'game', url: `${loading_vars.urls.js}game.js`},
			{name: 'anim_utils', url: `${loading_vars.urls.game_utils}animations.js`},
			{name: 'custom_button', url: `${loading_vars.urls.game_utils}custom_button.js`},
			{name: 'tooggle_image', url: `${loading_vars.urls.game_utils}tooggle_image.js`},

			{name: 'game_menu', url: `${loading_vars.urls.game_windows}game_menu.js`},
			{name: 'prepare_field', url: `${loading_vars.urls.game_windows}prepare_field.js`},
			{name: 'gameplay', url: `${loading_vars.urls.game_windows}gameplay.js`},

			{name: 'prepare_frame', url: `${loading_vars.urls.game_engine}prepare_frame.js`},
			{name: 'prepare_ship', url: `${loading_vars.urls.game_engine}prepare_ship.js`},
			{name: 'game_field', url: `${loading_vars.urls.game_engine}game_field.js`},
		];

		const audio = [
			{name: 'sprite', url: `${loading_vars.urls.audio}sprite.json`, audio_urls: [
				`${loading_vars.urls.audio}sprite.ogg`
			]},
		];

		const image_atlases = [
			{name: 'common1', image_url: `${loading_vars.urls.atlases}MainAtlas.png`, data_url: `${loading_vars.urls.atlases}MainAtlas.xml`},
		];

		const fonts = [
			// {name: 'main', image_url: `${loading_vars.urls.atlases}BIP40.png`, data_url: `${loading_vars.urls.atlases}BIP40.fnt`},
		];

		const all_count = js.length + audio.length + image_atlases.length + fonts.length;
		let progress_counter = 0;

		const load_js = (on_complete = () => {}) => {
			if(js.length > 0) {
				js.forEach((loading_data, i) => {
					this.load.script(loading_data.name, loading_data.url);
				});
				this.load.on('progress', (val) => {
					this.set_loading_progress((progress_counter + val * js.length) / all_count);
				});
				this.load.once('complete', () => {
					progress_counter += js.length;
					this.set_loading_progress(progress_counter / all_count);
					on_complete();
				});
				this.load.start();
			} else {
				on_complete();
			}
		}

		//////////////////////

		const load_audio = (on_complete = () => {}) => {
			if(audio.length > 0) {
				audio.forEach((loading_data, i) => {
					this.load.audioSprite(loading_data.name, loading_data.url,
						loading_data.audio_urls
					);
				});
				this.load.on('progress', (val) => {
					this.set_loading_progress((progress_counter + val * audio.length) / all_count);
				});
				this.load.once('complete', () => {
					progress_counter += audio.length;
					this.set_loading_progress(progress_counter / all_count);
					on_complete();
				});
				this.load.start();
			} else {
				on_complete();
			}
		}

		///////////////////////

		const load_atlses = (on_complete = () => {}) => {
			if(image_atlases.length > 0) {
				image_atlases.forEach((loading_data, i) => {
					this.load.atlasXML(loading_data.name, loading_data.image_url, loading_data.data_url);
				});
				this.load.on('progress', (val) => {
					this.set_loading_progress((progress_counter + val * image_atlases.length) / all_count);
				});
				this.load.once('complete', () => {
					progress_counter += image_atlases.length;
					this.set_loading_progress(progress_counter / all_count);
					on_complete();
				});
				this.load.start();
			} else {
				on_complete();
			}
		}

		///////////////////////

		const load_fonts = (on_complete = () => {}) => {
			if(fonts.length) {
				fonts.forEach((loading_data, i) => {
					
				});
				this.load.on('progress', (val) => {
					this.set_loading_progress((progress_counter + val * fonts.length) / all_count);
				});
				this.load.once('complete', () => {
					progress_counter += fonts.length;
					this.set_loading_progress(progress_counter / all_count);
					on_complete();
				});
				this.load.start();
			} else {
				on_complete();
			}
		}

		load_js(() => load_atlses(() => load_audio(() => load_fonts(on_complete))));
	}

	create_game() {	
		game = new Game(this);	
		game.prepare_game();	
	}
	
	update(){
	}
}

const get_game_size = () => {
	return {'W': window.innerWidth, 'H': window.innerHeight - 20};
}


const set_game_size = () => {
	let canvas = document.querySelector("canvas");	
	let windowWidth;
	let windowHeight;
	
	if (game_scene && game_scene.scale.isFullscreen) {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	}
	else {
		let size = get_game_size();
		windowWidth = size['W'];
		windowHeight = size['H'];
	}
	
	let windowRatio = windowWidth / windowHeight;
	let gameRatio = phaser_game.config.width / phaser_game.config.height;
	if(windowRatio < gameRatio){
		canvas.style.width = windowWidth + "px";
		canvas.style.height = (windowWidth / gameRatio) + "px";
	}
	else{
		canvas.style.height = windowHeight + "px";
		canvas.style.width = (windowHeight * gameRatio) + "px";
	}		
}

const initialize = (on_complete = () => {}) => {

	const canvases = document.getElementsByTagName("phaser_game");
    if (canvases.length === 1) {
      const canvas = canvases[0];
      canvas.addEventListener('webglcontextlost', (event) => {
        window.location.reload();
      });
    }
	window.addEventListener("resize", () => {
		set_game_size();

	});	
	loading_vars['mobile'] = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
		.test(navigator.userAgent);

	on_complete();
}

const get_game_config = (audioContext) => {
	loading_vars['default_W'] = parseInt(loading_vars['W']);
	loading_vars['default_H'] = parseInt(loading_vars['H']);
	loading_vars['extra_W'] = 0;
	loading_vars['extra_H'] = 0;

	let base_ratio = loading_vars['W'] / loading_vars['H'];
	let def_w = parseInt(loading_vars['W']);
	let def_h = parseInt(loading_vars['H']);
	let ratio = window.innerWidth / window.innerHeight;
	if (loading_vars['mobile'] && window.innerWidth < window.innerHeight)
		ratio = window.innerHeight / window.innerWidth;

	if (loading_vars['W'] < loading_vars['H'] * ratio) {
		loading_vars['W'] = parseInt(loading_vars['H'] * ratio);
		loading_vars['extra_W'] = loading_vars['W'] - def_w;
		loading_vars['extra_H'] = loading_vars['H'] - def_h;
	}
	
	let config = {
		type: Phaser.WEBGL,
		parent: 'phaser_game',
		width: loading_vars['W'],
		height: loading_vars['H'],
		backgroundColor: 0x000000,
		audio: {
			context: audioContext
		},
		render: {
			antialiasGL: false,
			batchSize: 512
		}
	};
	if (loading_vars['mobile']) {
		config['scale'] = {mode: Phaser.Scale.FIT};
	}
	else {
		config['autoCenter'] = Phaser.Scale.CENTER_HORIZONTALLY;
		config['fullscreenTarget'] = 'phaser_game';
	}
	return config;	
}