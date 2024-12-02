class AnimUtils {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    create_to_window_anim(on_complete = () => {}) {
        const anim_container = new Phaser.GameObjects.Container(this.scene);
        anim_container.scale = 0;
        anim_container.alpha = 1;
        let anim;
        let anims = [];
        for(let i = 0; i < 3; i++) {
            anim = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'smoke');
            anim_container.add(anim);
            anim.setAngle(Math.random() * 360);
            anim.setScale(1);
            anim.setAlpha(1);
            anims.push(anim);
        }

        anims.forEach(for_anim => {
            this.scene.tweens.add({
                targets: for_anim,
                duration: 1000,
                angle: anim.angle + 10 * Math.random(),
            });
        });

        this.scene.tweens.add({
            targets: anim_container,
            scale: loading_vars['W'] > loading_vars['H'] ? (loading_vars['W'] / anims[0].width) * 2 : (loading_vars['H'] / anims[0].height) * 2,
            alpha: 1,
            duration: 800,
            ease: '',
            onComplete: () => {
                on_complete();
                this.scene.tweens.add({
                    targets: anim_container,
                    // scale: anim_container.scale + 1,
                    alpha: 0,
                    duration: 800,
                    ease: 'quart.out',
                    onComplete: () => {
                        if(this.scene && this.anim_container) {
                            this.anim_container.removeAll(true);
                            this.anim_container.destroy();
                        }
                    }
                })
            }
        });

        return anim_container
    }

    init() {
        this.scene.anims.create({
            key: 'fly',
            frames: this.scene.anims.generateFrameNames('common1', { prefix: 'fly/RocketFly', start: 1, end: 73, zeroPad: 4 }),
            duration: 1000,
            hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'fly_bang',
            frames: this.scene.anims.generateFrameNames('common1', {prefix: 'flyBang/RocketFly', start: 1, end: 73, zeroPad: 4}),
            duration: 1000,
            hideOnComplete: true
        });
    }

    create_fly_rocket_anim(on_complete = () => {}) {
        //
    }
}