var card = [
				'<img src="images/card1.jpg" alt="">',
				'<img src="images/card2.jpg" alt="">',
				'<img src="images/card3.jpg" alt="">',
				'<img src="images/card4.jpg" alt="">',
				'<img src="images/card5.jpg" alt="">',
				'<img src="images/card6.jpg" alt="">',
				'<img src="images/card7.jpg" alt="">',
				'<img src="images/card8.jpg" alt="">',
				'<img src="images/card9.jpg" alt="">',
				'<img src="images/card10.jpg" alt="">',
				'<img src="images/card11.jpg" alt="">',
				'<img src="images/card12.jpg" alt="">',
				'<img src="images/card13.jpg" alt="">',
				'<img src="images/card14.jpg" alt="">',
				'<img src="images/card15.jpg" alt="">',
				'<img src="images/card16.jpg" alt="">',
				'<img src="images/card17.jpg" alt="">',
				'<img src="images/card18.jpg" alt="">',
				'<img src="images/card1.jpg" alt="">',
				'<img src="images/card2.jpg" alt="">',
				'<img src="images/card3.jpg" alt="">',
				'<img src="images/card4.jpg" alt="">',
				'<img src="images/card5.jpg" alt="">',
				'<img src="images/card6.jpg" alt="">',
				'<img src="images/card7.jpg" alt="">',
				'<img src="images/card8.jpg" alt="">',
				'<img src="images/card9.jpg" alt="">',
				'<img src="images/card10.jpg" alt="">',
				'<img src="images/card11.jpg" alt="">',
				'<img src="images/card12.jpg" alt="">',
				'<img src="images/card13.jpg" alt="">',
				'<img src="images/card14.jpg" alt="">',
				'<img src="images/card15.jpg" alt="">',
				'<img src="images/card16.jpg" alt="">',
				'<img src="images/card17.jpg" alt="">',
				'<img src="images/card18.jpg" alt="">'
			]
		var selectCard = function () {
			var $card = $('.card')
			$card.flip({
				trigger: 'manual'
			});
			$card.flip(false);
			$card.click(function() {
				$(this).flip(true);
			})
		}
		var cardShuffle = function (d) {
			for(var c = d.length -1; c>0; c--) {
				var b = Math.floor(Math.random() * (c+1));
				var a = d[c]; d[c] = d[b]; d[b]= a;
			}
			return d
		}
		var card = cardShuffle(card);
		selectCard();
		$('.front,.back').css({'width':'80','height':'91'});