(function(){
	var app = angular.module('memory', []);

	app.controller('GameController', function($scope, $interval)
	{
        
        function Card(id){
            this.id = id;
            this.imageURL = $scope.selectedImgSet.folderURL + id + '.png';
            this.enabled = false;
            this.img = null;
        }

        $scope.cards = [];
        $scope.imgElem = [];
        $scope.cardBack = [
            {name: 'Alleria', filePNG: 'Card_Back_Alleria'},
            {name: 'Black Temple', filePNG: 'Card_Back_BlackTemple'},
            {name: 'Blizzard 2014', filePNG: 'Card_Back_Blizzard2014'},
            {name: 'Blizzard 2015', filePNG: 'Card_Back_Blizzard2015'},
            {name: 'Charm', filePNG: 'Card_Back_Charm'},
            {name: 'Cupcake', filePNG: 'Card_Back_Cupcake'},
            {name: 'Default', filePNG: 'Card_Back_Default'},
            {name: 'Draenei', filePNG: 'Card_Back_Draenei'},
            {name: 'Druid', filePNG: 'Card_Back_Druid'},
            {name: 'E Sports', filePNG: 'Card_Back_Esports'},
            {name: 'Gnome', filePNG: 'Card_Back_Gnome'},
            {name: 'Goblin', filePNG: 'Card_Back_Goblin'},
            {name: 'Golden celebration', filePNG: 'Card_Back_GoldenCelebration'},
            {name: 'Halloween', filePNG: 'Card_Back_Hallows_End'},
            {name: 'Highmaul', filePNG: 'Card_Back_Highmaul'},
            {name: 'Hogger', filePNG: 'Card_Back_Hogger'},
            {name: 'Heroes of the Storm', filePNG: 'Card_Back_HotS'},
            {name: 'Ice Crown', filePNG: 'Card_Back_IceCrown'},
            {name: 'Launch', filePNG: 'Card_Back_Launch'},
            {name: 'Legend', filePNG: 'Card_Back_Legend'},
            {name: 'League of Explorers', filePNG: 'Card_Back_LOE1'},
            {name: 'League of Explorers 2', filePNG: 'Card_Back_LOE2'},
            {name: 'Valentine Day', filePNG: 'Card_Back_Love'},
            {name: 'Lunar', filePNG: 'Card_Back_Lunar'},
            {name: 'Magni', filePNG: 'Card_Back_Magni'},
            {name: 'Maraad', filePNG: 'Card_Back_Maraad'},
            {name: 'Medivh', filePNG: 'Card_Back_Medivh'},
            {name: 'Molton Core', filePNG: 'Card_Back_MoltonCore'},
            {name: 'Naxxramas', filePNG: 'Card_Back_Naxxramas'},
            {name: 'Naxxramas 2', filePNG: 'Card_Back_Naxxramas2'},
            {name: 'Nefarian', filePNG: 'Card_Back_Nefarian'},
            {name: 'Ninja', filePNG: 'Card_Back_Ninja'},
            {name: 'Old Gods', filePNG: 'Card_Back_OG1'},
            {name: 'Old Gods 2', filePNG: 'Card_Back_OG2'},
            {name: 'Overwatch', filePNG: 'Card_Back_Overwatch'},
            {name: 'Pandaria', filePNG: 'Card_Back_Pandaria'},
            {name: 'Pirate', filePNG: 'Card_Back_Pirate'},
            {name: 'Ragnaros', filePNG: 'Card_Back_Ragnaros'},
            {name: 'Samsung', filePNG: 'Card_Back_Samsung'},
            {name: 'Shaman', filePNG: 'Card_Back_Shaman'},
            {name: 'Tauren', filePNG: 'Card_Back_Tauren'},
            {name: 'TeSPA', filePNG: 'Card_Back_TeSPA'},
            {name: 'The Grand Tournament', filePNG: 'Card_Back_TGT'},
            {name: 'The Grand Tournament 2', filePNG: 'Card_Back_TGT2'},
            {name: 'Legacy of the Void', filePNG: 'Card_Back_Void'},
            {name: 'Warlords of Draenor', filePNG: 'Card_Back_Warlords_of_Draenor'},
            {name: 'Winter Veil', filePNG: 'Card_Back_WinterVeil'}
        ];
        $scope.currentCardBack = $scope.cardBack[19];
		$scope.size = [
			{name: '16 cards (4 x 4)', count: 16},
			{name: '24 cards (4 x 6)', count: 24},
			{name: '32 cards (4 x 8)', count: 32}
		];
		$scope.selectedSize = $scope.size[0];
        $scope.imgSet = [
            {name: 'Old Gods (4 images)', imgCount: 4, folderURL: 'resources/front/gods/'},
            {name: 'Heroes (9 images)', imgCount: 9, folderURL: 'resources/front/heroes/'},
            {name: 'Murlocks (13 images)', imgCount: 13, folderURL: 'resources/front/murlocks/'},
            {name: 'Dragons (16 images)', imgCount: 16, folderURL: 'resources/front/dragons/'}

        ];
        $scope.selectedImgSet = $scope.imgSet[1];

        function reSetCardImgURL(cards) {
            cards.forEach(function(card, i, cards) {
                card.imageURL = $scope.selectedImgSet.folderURL + card.id + '.png';
            });
            cards.splice(0, cards.length);
            var imgCount = $scope.selectedImgSet.imgCount;
            // генерируем массив парных чисел от 1 до selectedImgSet.count размером selectedSize.count (всегда четное число)
            for (var i = 1; i <= $scope.selectedSize.count / 2; i++){
                if (i <= imgCount){
                    cards.push(new Card(i));
                    cards.push(new Card(i));
                }
                if (i > imgCount && i <= imgCount * 2) { //если порядковый номер индекса дошел до максимального числа картинок
                    cards.push(new Card(i - imgCount));
                    cards.push(new Card(i - imgCount));
                }
                if (i > imgCount * 2 && i <= imgCount * 3) {//если порядковый номер индекса дошел до максимального числа картинок x 2
                    cards.push(new Card(i - imgCount * 2));
                    cards.push(new Card(i - imgCount * 2));
                }
                if (i > imgCount * 3) {//если порядковый номер индекса дошел до максимального числа картинок x 2
                    cards.push(new Card(i - imgCount * 3));
                    cards.push(new Card(i - imgCount * 3));
                }
            }

        }
        $scope.changeSet = function () {
            reSetCardImgURL($scope.cards);
        };
        var gameDiv;
        $scope.changeSize = function () {
            //$scope.cards.splice(0, $scope.cards.length);
            var widthTileCount = $scope.selectedSize.count / 4;
            var width = 160 * widthTileCount;
            gameDiv = angular.element(document.getElementById('game'));
            gameDiv.css('width', width+'px');
            reSetCardImgURL($scope.cards);

        };

        // Метод перетасовки карт
        function shuffle(a) {
            var l, tmp, r;
            for (j = 0; j <a.length; j++){
                tmp = a[j];
                r = Math.floor(Math.random() * j);
                a[j] = a[r];
                a[r] = tmp;
            }
        }
        //Управление игрой
        function showCards(cards) { //показать карты
             cards.forEach(function(card, i, cards) {
                 card.img.src = card.imageURL;
             });
        }
        function hideCards(cards) { //скрыть карты
            cards.forEach(function(card, i, cards) {
                card.img.src = "resources/back/" + $scope.currentCardBack.filePNG + ".png";
            });
        }
        function enableCards(cards, b) {
            cards.forEach(function(card, i, cards) {
                card.enabled = b;
            });
        }
        $scope.gameStarted = false; // игра в процессе (boolean)
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
            $scope.counter = 5;
            var tick = function() {
                $scope.counter--;
            };
            $interval(tick, 1000, 5);
        };


        $scope.resetGame = function () {
            $scope.firstReveal = null;
            $scope.secondReveal = null;
            $scope.gameStarted = false;
            enableCards($scope.cards, false);
            hideCards($scope.cards);
            $scope.rounds = 1;
            $scope.score = 0;
            $scope.match = 0;
            $scope.miss = 0;
            $scope.counter = 0;
        };



        var firstReveal;
        var secondReveal;
       // $scope.revealCardsName = '';
        $scope.gameResult = '';
        $scope.rounds = 1;
        $scope.score = 0;
        $scope.match = 0;
        $scope.miss = 0;

        function cardCtrl(card, enabled, src){
            card.enabled = enabled;
            card.img.src = src;
            return null;
        }

        function dismiss(){
            firstReveal = cardCtrl(firstReveal, false, "resources/null.png");
            secondReveal = cardCtrl(secondReveal, false, "resources/null.png");
        }

        function unrevealed() {
            firstReveal = cardCtrl(firstReveal, true, "resources/back/" + $scope.currentCardBack.filePNG + ".png");
            secondReveal = cardCtrl(secondReveal, true, "resources/back/" + $scope.currentCardBack.filePNG + ".png");
        }

        $scope.flipCard = function (card) {
             if (firstReveal == null){
                 firstReveal = card;
                 if (firstReveal.enabled){
                     card.img.src = card.imageURL;
                     firstReveal.enabled = false;
                   //  $scope.revealCardsName = 'First card id = ' + firstReveal.id;
                } else {
                     firstReveal = null;
                 }
             } else {
                 if (secondReveal == null){
                     secondReveal = card;
                     if (secondReveal.enabled){
                         card.img.src = card.imageURL;
                         secondReveal.enabled = false;
                        // $scope.revealCardsName += '\nSecond card id = ' + secondReveal.id;
                         if (firstReveal.id == secondReveal.id){
                          //   $scope.revealCardsName = 'Last attempt: ' + $scope.revealCardsName + ' match';
                             $scope.match++;
                             $scope.score +=300;
                             setTimeout(dismiss, 1000);
                         }
                         else {
                             setTimeout(unrevealed, 1000);
                         //    $scope.revealCardsName = 'Last attempt: ' + $scope.revealCardsName + ' miss';
                            // $scope.gameResult = 'Miss';
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


/*	//Директива создающая элементы страницы в зависимости от выбранного размера игрового поля
@deprecated!
	app.directive("tilebuilder", function($compile){
		return function(scope, element, attrs){
			element.bind("click", function(){
                scope.gameStarted = true;
                for (var i = 0; i < scope.selectedSize.count / 2; i++){
                    scope.cards.push(i);
                    scope.cards.push(i);
                }
                function shuffle(a) {
                    var l, tmp, r;
                    for (j = 0; j <a.length; j++){
                        tmp = a[j];
                        r = Math.floor(Math.random() * j);
                        a[j] = a[r];
                        a[r] = tmp;
                    }
                }
                shuffle(scope.cards);
				for (var k = 0; k < scope.selectedSize.count; k++) {
					angular.element(document.getElementById('game')).append($compile(
					"<div class='tile' revealClass=" + scope.cards[k] + " ng-click='flipCard($event)'></div>"
					)(scope));
				}
			});
		};
	});*/
})();
