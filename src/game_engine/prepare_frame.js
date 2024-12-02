class PrepareFrame {
    constructor() {
        this.field = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.ships = [];
    }

    get_filling() {
        let filling = 0;
        this.field.forEach(row => {
            row.forEach(col => {
                if(col === 1) filling++;
            });
        });
        return filling
    }

    is_posible(x, y, strong) {
        let possible
        if(strong) possible = (this.field[y] && (this.field[y][x] === 0));
        else possible = (!this.field[y] || !this.field[y][x] || (this.field[y][x] !== 1));
        return possible
    }

    is_posible_ship(x, y, x_l, y_l) {
        let possible = true;
        let max_cell = {x: x + x_l, y: y + y_l};

        for(let y_i = y - 1; y_i < y + y_l + 2; y_i++) {
            for(let x_i = x - 1; x_i < x + x_l + 2; x_i++) {
                let is_strong = (y_i >= y && (y_i < y + y_l && (y_l > 0 || y_i === y))) && (x_i >= x && (x_i < x + x_l && (x_l > 0 || x_i === x)));
                if(!this.is_posible(x_i, y_i, is_strong) ||
                    (max_cell.x > 9 || max_cell.y > 9)
                ) possible = false;
            }
        }

        return(possible);
    }

    update_field() {
        this.clear_field();
        // console.log(this.ships);
        this.ships.forEach(ship_data => {
            this.add_ship(ship_data, true);
        });
    }

    remove_ship(params) {
        let {x, y, x_l, y_l} = params;
    
        let index = -1;
        this.ships.forEach((ship, i) => {
            if(
                ship.x == x &&
                ship.y == y &&
                ship.x_l == x_l &&
                ship.y_l == y_l
            ) index = i;
        });
    
        if (index !== -1) {
            this.ships.splice(index, 1);
            this.update_field();

        } else {
            console.trace(this.ships);
            console.trace(params);
            console.trace('Ship not found');
        }
    
        // console.log(this.field);
    }

    clear_ships() {
        this.ships = [];
    }

    clear_field() {
        this.field = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
    }

    clear() {
        this.clear_field();
        this.clear_ships();
    }

    add_ship(params, is_update) {
        let {x, y, x_l, y_l} = params;
        if(this.is_posible_ship(x, y, x_l, y_l)) {

            let stand = true;
            for(let y_i = y; y_i <= y + y_l; y_i++) {
                for(let x_i = x; x_i <= x + x_l; x_i++) {
                    if(y_i >= 0 && y_i <= 9 && x_i >= 0 && x_i <= 9) {
                        this.field[y_i][x_i] = 1;
                    } else stand = false;
                }
            }

            let index = -1;
            this.ships.forEach((ship, i) => {
                if(
                    ship.x == x &&
                    ship.y == y &&
                    ship.x_l == x_l &&
                    ship.y_l == y_l
                ) index = i;
            });

            if(stand && index === -1 && !is_update) {
                this.ships.push({x, y, x_l, y_l});
            } else {
                // console.log(again_ship_data);
            }
            return true;
        }
        return false
    }
}