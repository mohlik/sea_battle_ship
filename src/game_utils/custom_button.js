class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }

    init(params) {
        if(params.x) this.x = params.x;
        if(params.y) this.y = params.y;
        this.button = new Phaser.GameObjects.Image(this.scene, 0, 0, params.atlas, params.image);
        let button_scale = 1;
        if(params.scale) button_scale = params.scale;
        this.button.setScale(params.scale);
        
        this.button.setInteractive({pixerPerfect: params.pixelPerfect});

        this.button.on('pointerdown', () => {
            this.button.setScale(button_scale - 0.1);
        });

        this.button.on('pointerout', () => {
            this.button.setScale(button_scale);
        });

        this.button.on('pointerup', () => {
            this.button.setScale(button_scale);
            if(params.callback) params.callback();
        });

        this.add(this.button);
    }
}