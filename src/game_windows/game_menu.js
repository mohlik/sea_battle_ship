class GameMenu extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.name = 'game_menu';
        this.init(params)
    }

    toogle_ai(ai_level) {
        this.ai_level = ai_level;
        game_data['last_ai_level'] = this.ai_level;
        [this.ai_low, this.ai_high].forEach((ai_button, i) => {
            ai_button.toogle(i === this.ai_level); 
        });
    }

    toogle_volume(volume) {
        this.volume = volume;
        this.scene.sound.volume = this.volume;
        game_data['volume'] = this.volume;
        this.on_audio_button.visible = volume === 0;
        this.off_audio_button.visible = volume === 1;
    }

    show() {
        this.toogle_ai(game_data['last_ai_level']);
        this.toogle_volume(game_data['volume']);
    }

    init(params) {
        let logo = new Phaser.GameObjects.Image(this.scene, loading_vars['W'] / 2, 0, 'big_logo');
        logo.setOrigin(0.5, 0);
        this.add(logo);

        let one_player_button = new CustomButton(this.scene, {
            x: loading_vars['W'] / 2,
            y: logo.y + logo.height + 50,
            atlas: 'common1',
            image: 'onePlayerBtn',
            scale: 0.8,
            callback: () => {
                // game_data['ai_level'] = this.ai_level;
                // game_data['game_play'].with_bot = true;
                // game.switch_window('prepare_field');
            }
        });
        one_player_button.setAlpha(0.7)
        this.add(one_player_button);

        let x_low = one_player_button.x - one_player_button.button.width * 0.8 + 13;
        let x_high = one_player_button.x + one_player_button.button.width * 0.8 - 20;
        let y = one_player_button.y + one_player_button.button.height * 0.8;

        this.ai_low = new ToogleImage(
            this.scene, 
            {
                x: x_low,
                y,
                x_on: x_low,
                y_on: y,
                atlas: 'common1',
                image: 'aiDif1BtnOff',
                image_on: 'aiDif1Btn',
                scale: 0.8
            }
        );
        this.add(this.ai_low);

        this.ai_low.image.setInteractive();
        this.ai_low.image.on('pointerup', () => {
            this.toogle_ai(0);
        });

        this.ai_high = new ToogleImage(
            this.scene, 
            {
                x: x_high,
                y,
                x_on: x_high,
                y_on: y,
                atlas: 'common1',
                image: 'aiDif2BtnOff',
                image_on: 'aiDif2Btn',
                scale: 0.8
            }
        );
        this.add(this.ai_high);

        this.ai_high.image.setInteractive();
        this.ai_high.image.on('pointerup', () => {
            this.toogle_ai(1);
        });

        this.toogle_ai(0);

        this.coop_button = new CustomButton(this.scene, {
            x: loading_vars['W'] / 2,
            y: y + 120,
            atlas: 'common1',
            image: 'twoPlayersBtn',
            scale: 0.8,
            callback: () => {
                game_data['game_play'].with_bot = false;
                game.switch_window('prepare_field');
            }
        });

        this.add(this.coop_button);

        this.on_audio_button = new CustomButton(this.scene, {
            x: loading_vars['W'] / 2,
            y: this.coop_button.y + 100,
            atlas: 'common1',
            image: 'soundOffBtn',
            scale: 0.8,
            callback: () => {
                this.toogle_volume(1);
            }
        });

        this.add(this.on_audio_button);

        this.off_audio_button = new CustomButton(this.scene, {
            x: loading_vars['W'] / 2,
            y: this.coop_button.y + 100,
            atlas: 'common1',
            image: 'soundOnBtn',
            scale: 0.8,
            callback: () => {
                this.toogle_volume(0);
            }
        });

        this.add(this.off_audio_button);

        this.toogle_volume(1);
    }
}