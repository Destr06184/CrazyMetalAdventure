/**
 * Структура лабиринта, представляющая различные сцены и их пути.
 *
 * @type {Object}
 * @property {Object} start - Начальная сцена.
 * @property {Object} scene1 - Первая сцена.
 * @property {Object} scene2 - Вторая сцена.
 * @property {Object} scene3 - Третья сцена.
 * @property {Object} scene4 - Четвертая сцена.
 * @property {Object} scene5 - Пятая сцена.
 * @property {Object} scene6 - Шестая сцена.
 * @property {Object} scene7 - Седьмая сцена.
 * @property {Object} scene8 - Восьмая сцена.
 * @property {Object} scene9 - Девятая сцена.
 * @property {Object} scene10 - Десятая сцена.
 * @property {Object} scene11 - Одиннадцатая сцена.
 * @property {Object} scene12 - Двенадцатая сцена.
 * @property {Object} scene13 - Тринадцатая сцена.
 * @property {Object} scene14 - Четырнадцатая сцена.
 * @property {Object} scene15 - Пятнадцатая сцена.
 * @property {Array} paths - Массив путей для каждой сцены.
 */
const maze = {
    'start': { paths: [] },
    'scene1': { paths: [] },
    'scene2': { paths: [] },
    'scene3': { paths: [] },
    'scene4': { paths: [] },
    'scene5': { paths: [] },
    'scene6': { paths: [] },
    'scene7': { paths: [] },
    'scene8': { paths: [] },
    'scene9': { paths: [] },
    'scene10': { paths: [] },
    'scene11': { paths: [] },
    'scene12': { paths: [] },
    'scene13': { paths: [] },
    'scene14': { paths: [] },
    'scene15': { paths: [] }
};

/**
 * Координаты для туннелей, которые одинаковы для всех сцен.
 *
 * @type {Array}
 * @property {Object} 0 - Позиция для первого туннеля.
 * @property {Object} 1 - Позиция для второго туннеля.
 * @property {Object} 2 - Позиция для третьего туннеля.
 * @property {number} top - Вертикальная позиция туннеля.
 * @property {number} left - Горизонтальная позиция туннеля.
 */
const tunnelPositions = [
    { top: 320, left: 125 }, // Позиция для первого туннеля
    { top: 280, left: 575 }, // Позиция для второго туннеля
    { top: 320, left: 1030 }  // Позиция для третьего туннеля
];

/**
 * Текущая сцена в игре.
 *
 * @type {string}
 */
let currentScene = 'start';

/**
 * Количество пройденных сцен.
 *
 * @type {number}
 */
let scenesPassed = 0;

/**
 * Перемещает игрока к выбранному проходу с использованием анимации.
 *
 * @param {HTMLElement} pathElement - HTML-элемент, представляющий проход, к которому нужно переместить игрока.
 * Этот элемент должен быть доступен в DOM и иметь размеры и позицию, чтобы можно было вычислить конечные координаты.
 *
 * @param {Function} callback - Функция, которая будет вызвана после завершения анимации перемещения.
 * Эта функция может использоваться для выполнения дополнительных действий после перемещения игрока.
 *
 * @example
 * // Пример использования функции
 * const path = document.getElementById('path1');
 * movePlayerToPath(path, function() {
 *     console.log('Игрок достиг прохода!');
 * });
 *
 * Функция вычисляет конечные координаты для перемещения игрока на основе позиции и размеров элемента прохода.
 * Затем она использует CSS-свойство `transform` для анимации перемещения игрока к этим координатам.
 * Анимация длится 0.5 секунды, и после её завершения вызывается переданная функция `callback`.
 */
function movePlayerToPath(pathElement, callback) {
    const player = document.getElementById('player');
    const pathRect = pathElement.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const gameRect = document.getElementById('game').getBoundingClientRect();

    // Вычисляем конечные координаты относительно игрового экрана
    const targetX = pathRect.left - gameRect.left + pathRect.width / 2 - playerRect.width / 2;
    const targetY = pathRect.top - gameRect.top + pathRect.height / 2 - playerRect.height / 2;

    // Вычисляем смещение от текущей позиции
    const offsetX = targetX - (playerRect.left - gameRect.left);
    const offsetY = targetY - (playerRect.top - gameRect.top);

    // Анимация перемещения с использованием translate
    player.style.transition = 'transform 0.5s';
    player.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Вызываем callback после завершения анимации
    setTimeout(callback, 800); // 0.8 секунды — длительность анимации
}

/**
 * Возвращает персонажа на стартовую позицию.
 *
 * @param {Function} callback - Функция, которая будет вызвана после завершения анимации возврата.
 */
function resetPlayerPosition(callback) {
    const player = document.getElementById('player');
    player.style.transition = 'transform 0.2s';
    player.style.transform = 'translate(0, 0)'; // Центр по горизонтали и стартовая позиция снизу

    // Вызываем callback после завершения анимации
    setTimeout(callback, 200); // 0.2 секунды — длительность анимации
}

/**
 * Инициализирует игру, сбрасывая счетчик пройденных сцен и загружая начальную сцену.
 */
function initializeGame() {
    scenesPassed = 0; // Сбрасываем счетчик при старте игры
    updateScoreCounter(); // Обновляем счетчик
    loadScene(currentScene);
}

/**
 * Генерирует случайные шансы для путей.
 *
 * @returns {Object} Объект со случайными шансами для выигрыша, проигрыша и перехода на следующую сцену.
 */
function generateRandomChances() {
    return {
        winChance: (Math.random() * 0.01 + 0.05).toFixed(2), // 2-6%
        loseChance: (Math.random() * 0.01 + 0.05).toFixed(2), // 2-6%
        nextChance: (Math.random() * 0.06 + 0.88).toFixed(2) // 88-96%
    };
}

/**
 * Обновляет счетчик пройденных сцен на экране.
 */
function updateScoreCounter() {
    const scoreCounter = document.getElementById('score-counter');
    scoreCounter.textContent = `Пройдено сцен: ${scenesPassed}`;
}

/**
 * Создает противника на игровом экране с таймером.
 */
function spawnEnemy() {
    const enemy = document.getElementById('enemy');
    const enemyTimer = document.getElementById('enemy-timer');
    const gameRect = document.getElementById('game').getBoundingClientRect();

    // Ограничиваем зону появления (отступы по 100px от краев)
    const minX = 100;
    const maxX = gameRect.width - 200; // 200 = 100 (отступ) + 100 (ширина спрайта)
    const minY = 100;
    const maxY = gameRect.height - 200; // 200 = 100 (отступ) + 100 (высота спрайта)

    // Случайная позиция на экране
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    // Позиционируем противника и таймер
    enemy.style.left = `${randomX}px`;
    enemy.style.top = `${randomY}px`;
    enemy.style.display = 'block';

    enemyTimer.style.left = `${randomX + 50}px`; // Таймер рядом с противником
    enemyTimer.style.top = `${randomY - 30}px`;
    enemyTimer.style.display = 'block';
    enemyTimer.textContent = '5'; // Начальное значение таймера

    // Таймер на 5 секунд
    let timeLeft = 5;
    const timerInterval = setInterval(() => {
        timeLeft--;
        enemyTimer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showScreen('lose-screen'); // Поражение, если не успели кликнуть
            hideEnemy(); // Скрываем противника и таймер
        }
    }, 1000);

    // Обработчик клика по противнику
    enemy.addEventListener('click', function() {
        clearInterval(timerInterval); // Останавливаем таймер
        hideEnemy(); // Скрываем противника и таймер
    });
}

/**
 * Скрывает противника и таймер.
 */
function hideEnemy() {
    const enemy = document.getElementById('enemy');
    const enemyTimer = document.getElementById('enemy-timer');
    enemy.style.display = 'none';
    enemyTimer.style.display = 'none';
}

/**
 * Загружает сцену, устанавливая задний фон и генерируя пути.
 *
 * @param {string} sceneKey - Ключ сцены, которую нужно загрузить.
 */
function loadScene(sceneKey) {
    const scene = maze[sceneKey];
    if (!scene) return;

    const backgroundElement = document.getElementById('background');
    const backgroundsFolder = 'assets/backgrounds'; // Путь к папке с задниками

    // Выбираем случайный задник из папки
    const backgroundImages = ['background1.png', 'background2.png', 'background3.png', 'background4.png', 'background5.png', 'background6.png'];
    const randomBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    // Устанавливаем задник
    if (randomBackground) {
        backgroundElement.src = `${backgroundsFolder}/${randomBackground}`;
        backgroundElement.classList.add('visible'); // Показываем картинку
    } else {
        backgroundElement.classList.remove('visible'); // Скрываем картинку
    }

    // Генерация путей с случайными шансами
    scene.paths = [
        { label: "Выбрать путь 1", ...generateRandomChances() },
        { label: "Выбрать путь 2", ...generateRandomChances() },
        { label: "Выбрать путь 3", ...generateRandomChances() }
    ];

    // Очищаем старые пути
    const gameDiv = document.getElementById('game');
    document.querySelectorAll('.path').forEach(path => path.remove());

    // Добавляем новые пути
    scene.paths.forEach((path, index) => {
        const pathDiv = document.createElement('div');
        pathDiv.className = 'path';
        pathDiv.style.top = `${tunnelPositions[index].top}px`; // Используем координаты из tunnelPositions
        pathDiv.style.left = `${tunnelPositions[index].left}px`;
        pathDiv.setAttribute('data-win', path.winChance);
        pathDiv.setAttribute('data-lose', path.loseChance);
        pathDiv.setAttribute('data-next', path.nextChance);

        // Добавляем надпись "Выбрать путь"
        const label = document.createElement('span');
        label.textContent = path.label;
        pathDiv.appendChild(label);

        gameDiv.appendChild(pathDiv);
    });

    // Шанс появления противника (например, 20%)
    if (Math.random() < 0.2) {
        spawnEnemy();
    }

    // Добавляем обработчики кликов
    document.querySelectorAll('.path').forEach(path => {
        path.addEventListener('click', function() {
            movePlayerToPath(this, function() {
                const winChance = parseFloat(this.getAttribute('data-win'));
                const loseChance = parseFloat(this.getAttribute('data-lose'));
                const nextChance = parseFloat(this.getAttribute('data-next'));

                // Генерируем случайное число от 0 до 1
                const random = Math.random();

                if (random < winChance) {
                    // Победа
                    showScreen('win-screen');
                } else if (random < winChance + loseChance) {
                    // Поражение
                    showScreen('lose-screen');
                } else {
                    // Переход на следующую сцену
                    if (currentScene !== 'start') {
                        scenesPassed++; // Увеличиваем счетчик только если это не стартовая сцена
                        updateScoreCounter(); // Обновляем счетчик
                    }
                    resetPlayerPosition(function() {
                        currentScene = getRandomScene(); // Выбираем случайную сцену
                        loadScene(currentScene);
                    });
                }
            }.bind(this)); // Привязываем контекст
        });
    });
}

/**
 * Показывает экран (победа/поражение).
 *
 * @param {string} screenId - Идентификатор экрана, который нужно показать.
 */
function showScreen(screenId) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
}

/**
 * Возвращает к стартовому экрану и сбрасывает игру.
 */
function restartGame() {
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('lose-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    currentScene = 'start'; // Сбрасываем текущую сцену
    scenesPassed = 0; // Сбрасываем счетчик
    updateScoreCounter(); // Обновляем счетчик
}

/**
 * Выбирает случайную сцену, кроме текущей.
 *
 * @returns {string} Ключ случайной сцены.
 */
function getRandomScene() {
    const scenes = Object.keys(maze);
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    return randomScene === currentScene ? getRandomScene() : randomScene;
}

// Обработчик для кнопки "Начать игру"
document.getElementById('start-button').addEventListener('click', function() {
    // Скрываем стартовый экран
    document.getElementById('start-screen').style.display = 'none';
    // Показываем игровой экран
    document.getElementById('game').style.display = 'block';
    // Запускаем игру
    initializeGame();
});

// Обработчики для кнопок "Рестарт"
document.getElementById('restart-win-button').addEventListener('click', restartGame);
document.getElementById('restart-lose-button').addEventListener('click', restartGame);

// Инициализация стартового экрана
window.onload = function() {
    // Показ экрана при загрузке страницы
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('lose-screen').style.display = 'none';
};
