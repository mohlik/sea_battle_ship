class ToogleImage extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }

    init(params) {
        
        this.off_image = new Phaser.GameObjects.Image(
            this.scene, 
            params.x, 
            params.y, 
            params.atlas, 
            params.image
        );
        if(params.scale) this.off_image.scale = params.scale;
        this.image = this.off_image;
        

        
        this.on_image = new Phaser.GameObjects.Image(
            this.scene, 
            params.x_on ? params.x_on : params.x, 
            params.y_on ? params.y_on : params.y, 
            params.atlas, 
            params.image_on
        );
        if(params.scale) this.on_image.scale = params.scale;
        

        this.add([this.off_image, this.on_image]);
        this.off();
    }

    toogle(val) {
        if(this.on_image) this.on_image.visible = val;
    }
}