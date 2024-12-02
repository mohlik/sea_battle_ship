class Gameplay extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.name = 'gameplay';
        this.init(params)
    }

    check_endgame() {
        if(this.first_player_field.all_cells_was_hited() || 
        this.first_player_field.all_ships_was_hited()) {
            console.log('Second Player Wins!');
            game_data['game_play'].fields = [];
            game.switch_window('game_menu');
            return false;
        }
        if(this.second_player_field.all_cells_was_hited() || 
        this.second_player_field.all_ships_was_hited()) {
            console.log('First Player Wins!');
            game_data['game_play'].fields = [];
            game.switch_window('game_menu');
            return false;
        }
        return true;
    }

    show(params) {
        let game_scale = this.scene.bg.scale;
        let cell_width = 41 * game_scale;
        this.first_player_field = new GameField(this.scene, {
            field: params.fields[0].field,
            ships: params.fields[0].ships,
            x: this.first_bg.x - this.first_bg.width * game_scale + cell_width - 2,
            y: this.first_bg.y + cell_width,
            hit_callback: (succsec_hit) => {
                if(!succsec_hit) {
                    this.first_player_field.off_turn();
                    if(this.check_endgame()) this.second_player_field.on_turn();
                } else this.check_endgame();
            }
        });
        this.first_player_field.off_turn();
        this.add(this.first_player_field);

        this.second_player_field = new GameField(this.scene, {
            field: params.fields[1].field,
            ships: params.fields[1].ships,
            x: this.second_bg.x + cell_width - 2,
            y: this.second_bg.y + cell_width,
            hit_callback: (succsec_hit) => {
                if(!succsec_hit) {
                    this.second_player_field.off_turn();
                    if(this.check_endgame()) this.first_player_field.on_turn();
                }
            }
        });
        this.second_player_field.on_turn();

        this.add(this.second_player_field);
    }

    clear_field() {
        if(this.first_player_field) this.first_player_field.destroy();
        if(this.second_player_field) this.second_player_field.destroy();
    }

    init(params) {

        this.return_button = new CustomButton(this.scene, {
            x: 61,
            y: 51,
            atlas: 'common1',
            image: 'backBtn',
            scale: 0.8,
            callback: () => {
                game_data.game_play.fields = [];
                game.switch_window('game_menu');
            }
        });
        this.add(this.return_button);

        let game_scale = this.scene.bg.scale;
        let cell_width = 41 * game_scale;
        
        this.first_bg = new Phaser.GameObjects.Image(this.scene, loading_vars['W'] / 2 - cell_width / 2 + 5, cell_width, 'common1', 'game_frame');
        this.first_bg.scale = game_scale;
        this.first_bg.setOrigin(1,0);
        this.add(this.first_bg);

        

        this.second_bg = new Phaser.GameObjects.Image(this.scene, loading_vars['W'] / 2 + cell_width / 2 + 3, cell_width, 'common1', 'game_frame');
        this.second_bg.scale = game_scale;
        this.second_bg.setOrigin(0,0);
        this.add(this.second_bg);
    }
}