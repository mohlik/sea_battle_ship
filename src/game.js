class Game {
    constructor(scene) {
        this.scene = scene;
        this.windows = {};
        this.current_window = 'game_menu';
    }

    update_window_visible() {
        for(let window_name in this.windows) {
            this.windows[window_name].visible = false;
        }
        this.windows[this.current_window].visible = true;
    }

    switch_window(window_name, params) {
        this.current_window = window_name;
        let anim = this.anim_utils.create_to_window_anim(() => {
            this.scene.destroy_loader();
            this.update_window_visible();
            this.windows[this.current_window].show(params);
        });
        anim.x = loading_vars['W'] / 2;
        anim.y = loading_vars['H'] / 2;
        this.scene.add.existing(anim);
    }

    add_new_window(window) {
        window.visible = false;
        this.windows[window.name] = window;
        this.scene.add.existing(window);
    }

    prepare_game() {
        this.anim_utils = new AnimUtils(this.scene);

        this.add_new_window(new GameMenu(this.scene));
        this.add_new_window(new PrepareField(this.scene));
        this.add_new_window(new Gameplay(this.scene));

        this.start_game();
    }

    start_game() {
        this.audio_sprite = this.scene.sound.addAudioSprite('sprite');
        this.audio_sprite.play('silence');
        let anim = this.anim_utils.create_to_window_anim(() => {
            this.scene.destroy_loader();
            this.update_window_visible();
        });
        anim.x = loading_vars['W'] / 2;
        anim.y = loading_vars['H'] / 2;
        this.scene.add.existing(anim);
    }
}