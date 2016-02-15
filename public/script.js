$(document).ready(function() {
	
});
	var card = [];
	var saveCard;
	var time = 0;
	var wrong = 0;
	var m_time = 10000;
	var card = [];
	var allow_open = true;
	var maxCard = 18;
	var chageType = 0;
	var roomData = {};
	var socket = io();

	var userName = prompt('유저 네임이 무엇인가요?');

	roomData.room = Number(getQueryValue('room'));
	roomData.userNum = 1;
	roomData.userName = userName;


	function getQueryValue(value) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == value) {
				return pair[1];
			}
		}
		return false;
	}
	function gameSetting() {
		for (var i = 0; i<card.length; i++) {
			$('.card_wrap').append('<div class="card"><div class="front closed hidden"><img src="images/back.jpg" ></div><div class="back show"><img src="images/'+card[i]+'" alt=""></div></div>');
		}
		//10초뒤에 카드 가리기
		setTimeout(function() {
			$('.front').removeClass('closed hidden').addClass('show');
			$('.back').removeClass('show').addClass('closed hidden');
		},m_time);
	}
	function cardCtrl() {
		var $card = $('.card').not('.collect');
		$card.click(function() {
			var $index = $(this).index();
			if($(this).hasClass('open') || $(this).hasClass('collect')) {
				return false;
			}
			if(allow_open === true) {
				allow_open = false;
				var $this = $(this);
				var $open = $('.open');
				var $openCard = $this.find('.closed').siblings();
				firstCard = $(this).children('.back').html();

				//front,back 클래스를 감싼 div에 open 상태임을 표시.
				$this.addClass('open');

				$this.find('.closed').removeClass('closed').addClass('show');
				$openCard.removeClass('show').addClass('closed');
				$this.find('.closed').removeClass('hidden');
				

				//open 이라는 클래스가 2개 등장했을때.
				setTimeout(function() {
					//ps- 이게 왜 1로 해야하는지 아직도 이해가 가지 않음.
					if($open.length === 1) {
						console.log('saveCard : ' + saveCard + ' //// firstCard : ' + firstCard);
						//open 된 2개의 카드 src 값을 비교하였는데 같을때
						if(saveCard === firstCard) {
							//0.2초뒤 두개의 카드에 collect라는 클래스를 부여한다.
							setTimeout(function() {
								$open.removeClass('open').addClass('collect');
								$this.removeClass('open').addClass('collect');
								//if문으로 전부 맞추었는지 체크합니다.
								clearGame();
							},200);
						} else if(saveCard !== firstCard) {
							socket.emit('change user',roomData);
							setTimeout(function() {
								//왜 open으로 두개가 안잡히지 이유?
								$open.removeClass('open').find('.front').addClass('show').removeClass('closed');
								$open.find('.back').addClass('closed hidden').removeClass('show');
								
								$this.find('.back').addClass('closed hidden').removeClass('show');
								$this.removeClass('open').find('.front').addClass('show').removeClass('closed');
							},200);
							wrong++;
							$('.wrong > span').html(wrong);
						}
					}
					//이 전 카드를 저장해둔다.
					saveCard = firstCard;
					//다음 카드 오픈 허용
					allow_open = true;
				},500);
				//다시 클릭하면 함수 실행하도록 true값 주기.
			} else {
				return false;
			}
			roomData.clickCard = $index;
			socket.emit('click card',roomData);
		});
	}
	function clearGame() {
		if($('.collect').length === card.length) {
			clearInterval(show_timer);
			alert('수고하셨습니다.(' + time +'초)');
		}
	}
	function timer() {
		show_timer = setInterval(function() {
			time++;
			$('#timer').text('시간 '+ time + '초');
		},1000);
	}
	function go() {
		cardCtrl();
		timer();
	}
	function startClick() {
		$('.start_btn').one('click',function() {
			ready();
		});
	}
	function ready() {
		gameSetting();
		setTimeout(function() {
			go();
		},m_time);
	}

	function dice() {
		$('.dice_wrap').fadeIn(500);
		$('.dice_wrap > button').on('click',function() {
			roomData.diceResult = parseInt(Math.random()*100+1);
			alert(roomData.diceResult + '이(가) 나오 셨습니다.');
			$('.dice_wrap').hide();
			socket.emit('dice result',roomData);
		})
	}
	function chat_send() {
		var msg = $('.chat_value').val();
		$('.chat_value').val('');
		roomData.msg = msg;
		socket.emit('chat write',roomData);
	}
	$('.send_btn').on('click',function() {
		console.log('클릭 이벤트');
		chat_send();
	});
	$(document).on('keydown',function(e) {
		if($('.chat_value').val() !== "") {
			if(e.keyCode == 13) {
				chat_send();
			} else {
				return;
			}
		}
	});
	socket.emit('join',roomData);
	socket.on('join room',function(data) {
		card = data;
		$('.start_notice').fadeIn(500);
		setTimeout(function() {
			$('.start_notice').hide();
			$('.dice_wrap').fadeIn(500);
			dice();
		}, 5000);
	});
	socket.on('full user',function(data) {
		alert('풀방 입니당~');
		location.replace("/"); 
	});
	socket.on('start',function(data) {
		var $wrap = $('#wrap');
		var userList = [];
		var room = data.room["room"+roomData.room];
		for(var k in data.room["room"+roomData.room]) {
			if(k !== 'count') {
				userList.push(k);
			}
		}
		ready();
		if( room[userList[0]].dice > room[userList[1]].dice) {
			$('.user1').html("user1 : " + userList[0] + '<br/> <span>Go!</span>');
			$('.user2').html("user2 : " + userList[1] + '<br/> <span>Wait..</span>');
			console.log(roomData.userName + '//' + room[userList[0]]);
			if(roomData.userName == userList[0]) {
				$wrap.addClass('play');
			} else {
				$wrap.addClass('wait');
			}
		} else {
			$('.user1').html("user1 : " + userList[0] + '<br/> <span>Wait..</span>');
			$('.user2').html("user2 : " + userList[1] + '<br/> <span>Go!</span>');
			console.log(roomData.userName + '//' + room[userList[0]]);
			if(roomData.userName == userList[0]) {
				$wrap.addClass('wait');
			} else {
				$wrap.addClass('play');
			}
		}
	});
	socket.on('click ok', function(data) {
		$('.card')[data].click();
	});
	socket.on('change ok',function(data) {
		$wrap = $('#wrap');
		if(chageType === 0) {
			if($wrap.hasClass('play')) {
				console.log('play to wait!!');
				$wrap.removeClass('play');
				$wrap.addClass('wait');
			} else {
				console.log('wait to play!!');
				$wrap.removeClass('wait');
				$wrap.addClass('play');
			}
			if(String($('.user1 > span').html()).indexOf('G') !== -1) {
				$('.user1 > span').html('Wait..');
				$('.user2 > span').html('Go!');
			} else {
				$('.user1 > span').html('Go!');
				$('.user2 > span').html('Wait..');
			}
			chageType++;
		} else {
			chageType = 0;
		}
	});
	socket.on('chat write ok',function(data) {
		$('.chat_show_area').append('<p>' + data.userName + ' : ' + data.msg + '</p>');
	});


	socket.on('list reset',function() {
		if(window.location.pathname == '/room_list') {

		}
	});
	/*socket.on('message',function(data) {
		alert(data+'방 입장');
	});*/