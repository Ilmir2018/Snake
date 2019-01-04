"use strict";

/**
 * Объект змейки.
 * @property {{x: int, y: int}[]} body Массив с точками тела змейки.
 * @property {string} lastStepDirection Направление, куда сходила змейка прошлый раз.
 * @property {string} direction Направление, куда пользователь направил змейку.
 * @property {int} maxX Максимальное количество ячеек по X.
 * @property {int} maxY Максимальное количество ячеек по Y.
 */

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,
    maxX: null,
    maxY: null,

    /**
     * Инициализирует змейку, откуда она будет начинать и ее направление.
     * @param {{x: int, y: int}} startPoint Точка начальной позиции змейки.
     * @param {string} direction Начальное направление игрока.
     * @property {int} maxX Максимальное количество ячеек по X.
     * @property {int} maxY Максимальное количество ячеек по Y.
     */

    init(startPoint, direction, maxX, maxY){
        this.body = [startPoint];
        this.direction = direction;
        this.lastStepDirection = direction;
        this.maxX = maxX;
        this.maxY = maxY;
    },

    /**
     * Отдает точку, где будет голова змейки если она сделает шаг.
     * @returns {{x: int, y: int}} Следующая точка куда придет змейка сделав шаг.
     */

    getNextStepHeadPoint(){
        // Получаем в отдельную переменную голову змейки.
        const firstPoint = this.body[0];
        // Возвращаем точку, где окажется голова змейки в зависимости от направления.
        switch (this.direction) {
            case 'up':
                if (firstPoint.y !== 0) {
                    return {x: firstPoint.x, y: firstPoint.y - 1};
                }
                else {
                    return {x: firstPoint.x, y: this.maxY};
                }
            case 'down':
                if (firstPoint.y !== this.maxY) {
                    return {x: firstPoint.x, y: firstPoint.y + 1};
                }
                else {
                    return {x: firstPoint.x, y: 0};
                }
            case 'right':
                if (firstPoint.x !== this.maxX) {
                    return {x: firstPoint.x + 1, y: firstPoint.y};
                }
                else {
                    return {x: 0, y: firstPoint.y};
                }
            case 'left':
                if (firstPoint.x !== 0) {
                    return {x: firstPoint.x - 1, y: firstPoint.y};
                }
                else {
                    return {x: this.maxX, y: firstPoint.y};
                }
        }
    },

    /**
     * Проверяет содержит ли змейка переданную точку.
     * @param {{x: int, y: int}} point Точка, которую проверяем.
     * @returns {boolean} true, если змейка содержит переданную точку, иначе false.
     */

    isBodyPoint(point){
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    /**
     * Двигает змейку на один шаг.
     */

    makeStep(){
        // Записываем направление движения, которое сейчас произойдет как направление прошлого шага.
        this.lastStepDirection = this.direction;
        // Вставляем следующую точку в начало массива.
        this.body.unshift(this.getNextStepHeadPoint());
        // Удаляем последний лишний элемент.
        this.body.pop();
    },

    /**
     * Устанавливает направление змейки.
     * @param {string} direction Направление змейки.
     */
    setDirection(direction){
        this.direction = direction;
    },

    /**
     * Добавляет в конец тела змейки копию последнего элемента змейки.
     */
    incrementBody(){
        // Получаем индекс последней точки в массиве точек змейки (последний элемент this.body).
        const lastBodyIdx = this.body.length - 1;
        // Получаем последнюю точку змейки.
        const lastBodyPoint = this.body[lastBodyIdx];
        // Клонируем последнюю точку змейки (делаем копию).
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        // Добавляем копию в наш массив this.body.
        this.body.push(lastBodyPointClone);
    },


    /**
     * Возвращает точку головы змейки.
     */
    getHeadPoint(){
        //Сделаем копию точки головы и вернём ее.
        return Object.assign({}, this.body[0]);
    }

};

/**
 * Объект отображения.
 */

const renderer = {
    cells: null,


    /**
     * Метод инициализирует и выводит карту для игры.
     * @param {int} rowsCount Количество строк в карте.
     * @param {int} colsCount Количество колонок в карте.
     */

    renderMap(rowsCount, colsCount) {
        // Контейнер, где будут наши ячейки, первоначально его очистим.
        const table = document.getElementById('game');
        table.innerHTML = '';
        // Объект-хранилище всех клеток пока пустой.
        this.cells = {};
        // Цикл запустится столько раз, сколько у нас количество строк.
        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            // Создаем строку, добавляем ей класс, после добавляем ее в таблицу.
            tr.classList.add('row');
            table.appendChild(tr);
            // Цикл запустится столько раз, сколько у нас количество колонок.
            for (let col = 0; col < colsCount; col++) {
                // Создаем ячейку, добавляем ячейке класс cell.
                const td = document.createElement('td');
                td.classList.add('cell');

                // Записываем в объект всех ячеек новую ячейку.
                this.cells[`x${col}_y${row}`] = td;
                // Добавляем ячейку в строку.
                tr.appendChild(td);
            }
        }
    },

    /**
     * Отображает все объекты на карте.
     * @param {{x: int, y: int}[]} snakePointsArray Массив с точками змейки.
     * @param {{x: int, y: int}} foodPoint Точка еды.
     * @param {{x: int, y: int}[]} wallsPointsArray Точки стен.
     */

    render(snakePointsArray, wallsPointsArray, foodPoint){
        // Чистим карту от предыдущего рендера, всем ячейкам оставляем только класс cell.
        for (const key of Object.getOwnPropertyNames(this.cells)) {
            this.cells[key].className = 'cell';
        }

        // Отображаем змейку. Перебираем все элементы массива а именно тело змейки.
        snakePointsArray.forEach((point, idx) => {
            // Если первый элемент массива, значит это голова, иначе тело. Красим ячейки в определённые цвета.
            this.cells[`x${point.x}_y${point.y}`].classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
        });

        //Отображаем стены.
        wallsPointsArray.forEach(point => {
            this.cells[`x${point.x}_y${point.y}`].classList.add('wall');
        });

        //Отображаем еду.
        this.cells[`x${foodPoint.x}_y${foodPoint.y}`].classList.add('food');
    }
};

/**
 * Объект с настройками по умолчанию, которые можно будет поменять при инициализации игры.
 * @property {int} rowsCount Количество строк.
 * @property {int} colsCount Количество колонок.
 * @property {int} speed Скорость змейки.
 * @property {int} winLength Длина змейки для победы.
 */

const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 5,
    winLenght: 50,

    /**
     * Проверка значений настроек игры.
     * @returns {boolean} true, если настройки верные, иначе false.
     */
    validate() {
        if (this.rowsCount < 10 || this.rowsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }
        if (this.colsCount < 10 || this.colsCount > 30) {
            console.error('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
            return false;
        }
        if (this.speed < 1 || this.speed > 10) {
            console.error('Неверные настройки, значение speed должно быть в диапазоне [2, 10].');
            return false;
        }
        if (this.winLenght < 5 || this.winLenght > 50) {
            console.error('Неверные настройки, значение winLenght должно быть в диапазоне [5, 50].');
            return false;
        }
        return true;
    },


};

/**
 * Статус игры.
 * @property {string} condition Статус игры.
 */

const status = {
    condition: null,

    /**
     * Устанавливает статус в "playing".
     */
    setPlaying() {
        this.condition = 'playing';
    },

    /**
     * Устанавливает статус в "stopped".
     */
    setStopped() {
        this.condition = 'stopped';
    },

    /**
     * Устанавливает статус в "finished".
     */
    setFinished() {
        this.condition = 'finished';
    },

    /**
     * Проверяет является ли статус "playing".
     * @returns {boolean} true, если статус "playing", иначе false.
     */
    isPlaying() {
        return this.condition === 'playing';
    },

    /**
     * Проверяет является ли статус "stopped".
     * @returns {boolean} true, если статус "stopped", иначе false.
     */
    isStopped() {
        return this.condition === 'stopped';
    },

    /**
     * Проверяет является ли статус "finished".
     * @returns {boolean} true, если статус "finished", иначе false.
     */
    isFinished() {
        return this.condition === 'finished';
    }
};

/**
 * Объект еды.
 * @property {int} x Координата X еды.
 * @property {int} y Координата Y еды.
 */

const food = {
    x: null,
    y: null,

    getFoodCoordinates(){
        return {
            x: this.x,
            y: this.y,
        };
    },

    setFoodCoordinates(point){
        this.x = point.x;
        this.y = point.y;
    },

    isFoodPoint(point){
        return this.x === point.x && this.y === point.y;
    }

};

/**
 * Счет игры пользователя.
 * @property {int} count Счет игры.
 * @property {HTMLElement} scoreCountEl Элемент счетчика.
 */

const score = {
    count: 0,
    scoreCountEl: document.getElementById('score-count'),

    /**
     * Прибавляет единицу к счетчику.
     */
    increment() {
        //Если змейка увеличивается
        this.count++;
        //Увеличиваем счёт на странице.
        this.scoreCountEl.textContent = `${this.count}`;
    },

    /**
     * Сбрасывает счетчик.
     */
    drop() {
        //Обнуляем счёт игры.
        this.scoreCountEl.textContent = 0;
        this.count = 0;
    },
};

/**
 * Объект, работающий со всеми стенами в игре.
 * @property {{x: int, y: int}[]} points Массив объектов с координатами стен.
 */

const walls = {
  points: [],

    init(wallsPoints){
      this.points = wallsPoints;
    },

    isWallPoint(point){
      return this.points.some(wallPoint => wallPoint.x === point.x && wallPoint.y === point.y);
    },



    /**
     * Меняет позицию случайной стены на переданную точку.
     * @param {{x: int, y: int}} point Точка, куда будет поставлена новая стенка.
     */
    changeRandomWallPosition(point) {
        //Получаем индекс случайной точки в массиве всех стенок, которую надо поменять.
        const wallIndex = Math.floor(Math.random() * this.points.length);
        //Ставим стенке новую точку на карте.
        this.points[wallIndex] = point;
    }
};

/**
 * Объект игры.
 * @property {settings} settings Настройки игры.
 * @property {renderer} renderer Объект отображения.
 * @property {snake} snake Объект змейки.
 * @property {food} food Объект еды.
 * @property {status} status Статус игры.
 * @property {int} tickInterval Номер интервала игры.
 *  @property {int} changeWallTimeout Меняется точка расположения одной сены..
 */

const game = {
    snake,
    renderer,
    settings,
    status,
    food,
    score,
    walls,
    //Хранит число для запуска и остановки игры.
    tickInterval: null,
    changeWallTimeout: null,

    /**
     * Инициализация игры.
     * @param {object} [settings = {}] Настройки игры, которые можно изменить.
     */

    init(settings = {}) {
        Object.assign(this.settings, settings);
        //Если настройки не соответсвуют валидации, то закончим операцию, выдав сообщение об ошибке.
        if (!this.settings.validate()) {
            return;
        }
        //Объект.метод отображает карту.
        //в параметре передаём настройки для метода renderMap объекта renderer, т.к. он о них ничего не знает
        this.renderer.renderMap(this.settings.rowsCount, this.settings.colsCount);
        // Устанавливаем обработчики событий.
        this.setEventHandlers();
        // Ставим игру в начальное положение.
        this.reset();
    },

    /**
     * Ставит обработчики события.
     */

    setEventHandlers(){
        // При клике на кнопку с id playButton вызвать функцию this.playClickHandler.
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        // При клике на кнопку с id newGameButton вызвать функцию this.newGameClickHandler.
        document.getElementById('newGameButton').addEventListener('click', event => this.newGameClickHandler(event));
        // При нажатии кнопки, если статус игры "играем", то вызываем функцию смены направления у змейки.
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },


    /**
     * Ставит игру в начальное положение.
     */

    reset(){
        // Ставим статус игры в "остановлена".
        this.stop();
        // Инициализируем змейку.
        this.snake.init(this.getStartSnakePoint(), 'up', this.settings.colsCount - 1, this.settings.rowsCount - 1);
        // Ставим еду на карту в случайную пустую ячейку.
        this.food.setFoodCoordinates(this.getRandomCoordinates());
        //Обнуляем счётчик.
        this.score.drop();
        //Отображаем стены
        this.walls.init(this.getRandomCoordinates(5, this.getDisabledWallCells()));
        // Отображаем все что нужно для игры.
        this.render();
    },

    /**
     * Ставим статус игры в "играем".
     */


    play() {
        // Ставим статус в 'playing'.
        this.status.setPlaying();
        //Ставим интервал шагов змейки.
        this.tickInterval = setInterval(()=> this.tickHandler(), 1000/this.settings.speed);
        //Вызываем метод, который будет менять местоположение одной случайной стены.
        this.changeWallTimeout = setTimeout(() => this.changeRandomWallPosition(),
            Math.floor(Math.random() * 10000) + 5000);
        // Меняем название кнопки в меню на "Стоп" и делаем ее активной.
        this.changePlayButton('Стоп');
    },

    /**
     * Ставим статус игры в "стоп".
     */

    stop(){
        // Ставим статус в 'stopped'.
        this.status.setStopped();
        // Убираем интервал шагов змейки.
        clearInterval(this.tickInterval);
        //Останавливаем смену стены.
        clearTimeout(this.changeWallTimeout);
        // Меняем название кнопки в меню на "Старт" и делаем ее активной.
        this.changePlayButton('Старт');
    },

    /**
     * Ставим статус игры в "финиш".
     */

    finish(){
        // Ставим статус в 'finished'.
        this.status.setFinished();
        // Убираем интервал шагов змейки.
        clearInterval(this.tickInterval);
        //Останавливаем смену стены.
        clearTimeout(this.changeWallTimeout);
        // Меняем название кнопки в меню на "Игра закончена" и делаем ее неактивной.
        this.changePlayButton('Игра закончена!');
    },


    /**
     * Меняем позицию стены на карте.
     */

    changeRandomWallPosition(){
        //Заносим в переменную выполнение данной функции
        this.changeWallTimeout = setTimeout(() => this.changeRandomWallPosition(),
            Math.floor(Math.random() * 10000) + 5000);
        //Определяем новую позицию для сены.
        const newWallPosition = this.getRandomCoordinates(1, this.getDisabledWallCells());
        this.walls.changeRandomWallPosition(newWallPosition);
        this.render();
    },

    /**
     * Обработчик события тика игры, когда змейка должна перемещаться.
     */

    tickHandler(){
        // Если следующий шаг невозможен, то ставим игру в статус завершенный.
        if (!this.canSnakeMakeStep()) {
            return this.finish();
        }
        // Если следующий шаг будет на еду, то заходим в if.
        if (this.food.isFoodPoint(this.snake.getNextStepHeadPoint())){
            // Прибавляем к змейке ячейку.
            this.snake.incrementBody();
            //Прибавляем к счётчику +1.
            this.score.increment();
            // Ставим еду в свободную ячейку.
            this.food.setFoodCoordinates(this.getRandomCoordinates());
            // Если выиграли, завершаем игру.
            if (this.isGameWon()) {
                this.finish();
            }
        }
        
        // Перемещаем змейку.
        this.snake.makeStep();
        // Отрисовываем что получилось после шага.
        this.render();
    },


    /**
     * Проверяем произошла ли победа, судим по очкам игрока (длине змейки).
     * @returns {boolean} true, если игрок выиграл игру, иначе false.
     */

    isGameWon(){
        return this.snake.body.length > this.settings.winLenght;
    },

    /**
     * Проверяет возможен ли следующий шаг.
     * @returns {boolean} true если следующий шаг змейки возможен, false если шаг не может быть совершен.
     */
    canSnakeMakeStep() {
        // Получаем следующую точку головы змейки в соответствии с текущим направлением.
        const nextHeadPoint = this.snake.getNextStepHeadPoint();
        // Змейка может сделать шаг если следующая точка не на теле змейки и не в стену.
        return !this.snake.isBodyPoint(nextHeadPoint)
            && !this.walls.isWallPoint(nextHeadPoint)/*&&
            nextHeadPoint.x < this.settings.colsCount &&
            nextHeadPoint.y < this.settings.rowsCount &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0*/;
    },

    /**
     * Обработчик события нажатия на кнопку playButton.
     */

    playClickHandler(){
        // Если сейчас статус игры "играем", то игру останавливаем, если игра остановлена, то запускаем.
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    /**
     * Обработчик события нажатия на кнопку "Новая игра".
     */
    newGameClickHandler(event) {
        // Ставим игру в начальное положение.
        this.reset();
    },

    /**
     * Обработчик события нажатия кнопки клавиатуры.
     * @param {KeyboardEvent} event
     */
    keyDownHandler(event) {
        // Если статус игры не "играем", значит обрабатывать ничего не нужно.
        if (!this.status.isPlaying()) {
            return;
        }
        // Получаем направление змейки, больше мы не обрабатываем других нажатий.
        const direction = this.getDirectionByKeyCode(event.keyCode);

        // Змейка не может повернуть на 180 градусов, поэтому делаем проверку, можем ли мы назначить направление.
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    /**
     * Отдает направление змейки в зависимости от переданного кода нажатой клавиши.
     * @param {int} keyCode Код нажатой клавиши.
     * @returns {string} Направление змейки.
     */

    getDirectionByKeyCode(keyCode){
        switch (keyCode) {
            case 38:
            case 87:
                return 'up';
            case 39:
            case 68:
                return 'right';
            case 40:
            case 83:
                return 'down';
            case 37:
            case 65:
                return 'left';
            default:
                return '';
        }
    },

    /**
     * Определяет можно ли назначить переданное направление змейке.
     * @param {string} direction Направление, которое проверяем.
     * @returns {boolean} true, если направление можно назначить змейке, иначе false.
     */

    canSetDirection(direction){
        return direction === 'up' && this.snake.lastStepDirection !== 'down' ||
            direction === 'right' && this.snake.lastStepDirection !== 'left' ||
            direction === 'down' && this.snake.lastStepDirection !== 'up' ||
            direction === 'left' && this.snake.lastStepDirection !== 'right';
    },

    /**
     * Меняем кнопку с классом playButton.
     * @param {string} textContent Текст кнопки.
     * @param {boolean} [isDisabled = false] Необходимо ли заблокировать кнопку.
     */

    changePlayButton(textContent, isDisabled = false){
        // Находим кнопку.
        const playButton = document.getElementById('playButton');
        // Меняем текст внутри кнопки на переданный.
        playButton.textContent = textContent;
        // Если необходимо запретить нажатие кнопку - ставим класс disabled, иначе убираем класс disabled.
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    /**
     * Возвращает начальную позицию змейки в центре карты.
     * @returns {{x: int, y: int}} Точка начальной позиции змейки.
     */

    getStartSnakePoint(){
        return {
            x: Math.floor(this.settings.colsCount/2),
            y: Math.floor(this.settings.rowsCount/2),
        };
    },

    /**
     * Отдает случайную не занятую точку на карте.
     * @return {{x: int, y: int}} Точку с координатами.
     */

    getRandomCoordinates(count = 1, exclude = []){
        // Занятые точки на карте. Массив точек.
        exclude.push([this.food.getFoodCoordinates(), ...this.snake.body, ...this.walls.points]);
        //Массив случайных точек.
        const randomPoint = [];
        // Получаем точку ничем не занятую на карте.
        while (randomPoint.length < count){
            // Случайно сгенерированная точка.
            const rndPoint = {
              x: Math.floor(Math.random() * this.settings.colsCount),
              y: Math.floor(Math.random() * this.settings.rowsCount),
            };
            // Если точка ничем не занята, то возвращаем ее из функции. Функция some вернёт true если условие внтри
            //функциии вернёт true.
            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                //добавляем случайные точки в массив
                randomPoint.push(rndPoint);
                //Записываем эту точку в массив точек.
                exclude.push(rndPoint);
            }
        }
        //Возвращается либо одна либо массив случайных точек
        return count === 1 ? randomPoint[0] : randomPoint;
    },

    /**
     * Отображает все для игры, карту, еду и змейку.
     */

    render(){
        this.renderer.render(this.snake.body, this.walls.points, this.food.getFoodCoordinates());
    },


    /**
     * Метод возвращает массив точек, где не может возникнуть стена.
     */

    getDisabledWallCells(){
        //Получаем голову змейки.
        const snakeHeadPoint = this.snake.getHeadPoint();
        //Массив занятых точек, в которых не может появиться стена.
        const bussyCells = [];

        //Создаём диапазон в котором не могут находиться стены по вертикали и горизонтали.
        for (let x = snakeHeadPoint.x - 2; x <= snakeHeadPoint.x + 2; x++) {
            for (let y = snakeHeadPoint.y - 2; y <= snakeHeadPoint.y + 2; y++) {
                //Дублируем меняющиеся точки.
                let xCoordinate = x, yCoordinate = y;
                //Если мы выходим за пределы карты
                if (xCoordinate < 0) {
                    //в эту переменную прибавляем количество колонок
                    xCoordinate = this.settings.colsCount + xCoordinate;
                    //и наоборот если координата больше или равна количеству колонок
                } else if (xCoordinate >= this.settings.colsCount) {
                    //отнимаем количесвто колонок из этой точки
                    xCoordinate = xCoordinate - this.settings.colsCount;
                }
                //То же самое делаем для коородинаты x.
                if (yCoordinate < 0) {
                    yCoordinate = this.settings.rowsCount + yCoordinate;
                } else if (yCoordinate >= this.settings.rowsCount) {
                    yCoordinate = yCoordinate - this.settings.rowsCount;
                }
                //Загружаем массив точками в которых не могут находиться стены.
                bussyCells.push({x: xCoordinate, y: yCoordinate});
            }
        }
        //Возвращаем эти точки.
        return bussyCells;
    }
};


window.onload = () => game.init({speed: 5, winLenght: 5});