(function(){
	var app = angular.module('memory', []);

	app.controller('GameController', function($scope, $interval, $http)
	{
        // шаблон объекта Cards
        function Card(id){
            this.id = id;
            this.imageURL = $scope.selectedImgSet.folderURL + id + '.png'; // путь к изображению зависит от набора изображений ImgSet и id объекта
            this.enabled = false; // доступность взаимодействия с картов (элементом на игровом поле)
            this.img = null; // переменная в которую запишется элемент игрового поля с тем же индесом что и карта после нажатия кнопки "Start"
        }

        $scope.cards = []; // массив карт
        $scope.imgElem = []; // массив элементов с тэгом <img>
        
        /* загружаем в массив cardBack данные из JSON файла
        "name" - имя отображаемое в выпадающем списке,
        "filePNG" - имя файла с изображением обратной стороны карты */
        $scope.cardBack = [];
        $http.get('back.json').success(function(data) {
            $scope.cardBack = data;
            $scope.currentCardBack = $scope.cardBack[19];
        }).error(function() {
            alert("error loading card back list");
        });
        // выпадающий список выбора размера игрового поля
		$scope.size = [
			{name: '16 cards (4 x 4)', count: 16},
			{name: '24 cards (4 x 6)', count: 24},
			{name: '32 cards (4 x 8)', count: 32}
		];
		$scope.selectedSize = $scope.size[0];
        // выпадающий список выбора набора изображений для игры
        $scope.imgSet = [
            {name: 'Old Gods (4 images)', imgCount: 4, folderURL: 'resources/front/gods/'},
            {name: 'Heroes (9 images)', imgCount: 9, folderURL: 'resources/front/heroes/'},
            {name: 'Murlocks (13 images)', imgCount: 13, folderURL: 'resources/front/murlocks/'},
            {name: 'Dragons (16 images)', imgCount: 16, folderURL: 'resources/front/dragons/'}
        ];
        $scope.selectedImgSet = $scope.imgSet[1];
        // метод меняющий набор изображений для игры и создающий массив карт в зависимости от выбранного размера игрового поля
        function resetCards(cards) {
            cards.forEach(function(card) {
                card.imageURL = $scope.selectedImgSet.folderURL + card.id + '.png';
            });
            cards.splice(0, cards.length); // очищаем массив
            var imgCount = $scope.selectedImgSet.imgCount;
            /* генерируем массив парных чисел от 1 до selectedImgSet.count
            размером selectedSize.count (всегда четное число)
            не оптимизирован цикл создания массива карт,
            расчитан на минимальное количество изображений 4
            при максималном размере игрового поля 32 */
            for (var i = 1; i <= $scope.selectedSize.count / 2; i++){
                if (i <= imgCount){
                    cards.push(new Card(i));
                    cards.push(new Card(i));
                }
                if (i > imgCount && i <= imgCount * 2) { //если порядковый номер индекса дошел до максимального числа изображений
                    cards.push(new Card(i - imgCount));
                    cards.push(new Card(i - imgCount));
                }
                if (i > imgCount * 2 && i <= imgCount * 3) {//если порядковый номер индекса дошел до максимального числа изображений x 2
                    cards.push(new Card(i - imgCount * 2));
                    cards.push(new Card(i - imgCount * 2));
                }
                if (i > imgCount * 3) {//если порядковый номер индекса дошел до максимального числа изображений x 3
                    cards.push(new Card(i - imgCount * 3));
                    cards.push(new Card(i - imgCount * 3));
                }
            }
        }
        $scope.changeSet = function () {
            resetCards($scope.cards); // вызываем метод resetCard при смене набора изображений
        };
        var gameDiv = angular.element(document.getElementById('game'));
        $scope.changeSize = function () {
            var widthTileCount = $scope.selectedSize.count / 4;
            var width = 160 * widthTileCount;
            gameDiv.css('width', width+'px'); // меняем ширину блока "game"
            resetCards($scope.cards); // и вызываем метод resetCard при смене размера игрового поля
        };
        // Метод перетасовки карт
        function shuffle(a) {
            var tmp, r;
            for (var j = 0; j <a.length; j++){
                tmp = a[j];
                r = Math.floor(Math.random() * j);
                a[j] = a[r];
                a[r] = tmp;
            }
        }
        // ---------------------  Управление игрой
        //показать все карты
        function showCards(cards) {
             cards.forEach(function(card) {
                 card.img.src = card.imageURL;
             });
        }
        //скрыть все карты
        function hideCards(cards) {
            cards.forEach(function(card) {
                card.img.src = "resources/back/" + $scope.currentCardBack.filePNG + ".png";
            });
        }
        // сделать все карты доступными
        function enableCards(cards, b) {
            cards.forEach(function(card) {
                card.enabled = b;
            });
        }
        $scope.gameStarted = false; // игра в процессе (boolean)
        $scope.gameEnd = false;
        // начать игру с заданными параметрами
        $scope.startGame = function () {
            $scope.gameStarted = true;
            $scope.imgElem = gameDiv.find('img');
            for (var i = 0; i < $scope.selectedSize.count; i++){
                $scope.cards[i].img = $scope.imgElem[i];
            }
            shuffle($scope.cards);
            // Показать и скрыть карты по истечении 5 секунд
            showCards($scope.cards);
            setTimeout(function() {
                hideCards($scope.cards);
                enableCards($scope.cards, true);
            }, 5000);
            // отсчет времени покаща кард 5 секунд
            $scope.counter = 5;
            var tick = function() {
                $scope.counter--;
            };
            $interval(tick, 1000, 5);
        };
        // сбросить текущую игру
        $scope.resetGame = function () {
            $scope.firstReveal = null;
            $scope.secondReveal = null;
            $scope.gameStarted = false;
            $scope.gameEnd = false;
            enableCards($scope.cards, false);
            hideCards($scope.cards);
            $scope.rounds = 1;
            $scope.score = 0;
            $scope.match = 0;
            $scope.miss = 0;
            $scope.counter = 0;
        };
        // переменные игрового процесса
        var firstReveal;
        var secondReveal;
        $scope.rounds = 1;
        $scope.score = 0;
        $scope.match = 0;
        $scope.miss = 0;
        function cardCtrl(card, enabled, src){
            card.enabled = enabled;
            card.img.src = src;
            return null;
        }
        // скрыть карты, если они совпали
        function dismiss(){
            firstReveal = cardCtrl(firstReveal, false, "resources/null.png");
            secondReveal = cardCtrl(secondReveal, false, "resources/null.png");
        }
        // спрятать обратно карты которые не совпали
        function unrevealed() {
            firstReveal = cardCtrl(firstReveal, true, "resources/back/" + $scope.currentCardBack.filePNG + ".png");
            secondReveal = cardCtrl(secondReveal, true, "resources/back/" + $scope.currentCardBack.filePNG + ".png");
        }
        /* метод срабатывающий при нажатии на элемент страницы <img>,
        который связан с элеметом массива cards через cards.img */
        $scope.flipCard = function (card) {
             if (firstReveal == null){
                 firstReveal = card;
                 if (firstReveal.enabled){
                     card.img.src = card.imageURL;
                     firstReveal.enabled = false;
                } else {
                     firstReveal = null;
                 }
             } else {
                 if (secondReveal == null){
                     secondReveal = card;
                     if (secondReveal.enabled){
                         card.img.src = card.imageURL;
                         secondReveal.enabled = false;
                         if (firstReveal.id == secondReveal.id){
                             $scope.match++;
                             $scope.score +=300;
                             setTimeout(dismiss, 1000);
                             if ($scope.match == $scope.selectedSize.count / 2){
                                 $scope.gameEnd = true;
                             }
                         }
                         else {
                             setTimeout(unrevealed, 1000);
                             $scope.rounds++;
                             $scope.miss++;
                             $scope.score -=100;
                         }
                     } else {
                         secondReveal = null;
                     }
                 }
             }
        }

	});
})();
