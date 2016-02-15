		var ready1;
		var saveCard;
		var saveCard_obj;
		var time = 0;
		var wrong = 0;
		var card = [
				'card1.jpg',
				'card2.jpg',
				'card3.jpg',
				'card4.jpg',
				'card5.jpg',
				'card6.jpg',
				'card7.jpg',
				'card8.jpg',
				'card9.jpg',
				'card10.jpg',
				'card11.jpg',
				'card12.jpg',
				'card13.jpg',
				'card14.jpg',
				'card15.jpg',
				'card16.jpg',
				'card17.jpg',
				'card18.jpg',
				'card1.jpg',
				'card2.jpg',
				'card3.jpg',
				'card4.jpg',
				'card5.jpg',
				'card6.jpg',
				'card7.jpg',
				'card8.jpg',
				'card9.jpg',
				'card10.jpg',
				'card11.jpg',
				'card12.jpg',
				'card13.jpg',
				'card14.jpg',
				'card15.jpg',
				'card16.jpg',
				'card17.jpg',
				'card18.jpg',
			];

		function cardShuffle (d) {
			for(var c = d.length -1; c>0; c--) {
				var b = Math.floor(Math.random() * (c+1));
				var a = d[c]; d[c] = d[b]; d[b]= a;
			}
			return d
		}
		//배열 랜덤 함수 적용
		var card = cardShuffle(card);


		//선택 카드 오픈
		function selectCard () {
			var $card = $('.card');
			var $front = $('.front');
			var $back = $('.back');
			var $this = $(this);
			$this.find('.front').addClass('show');
			$card.click(function() {
				$(this).find('div').toggleClass('show');
			})
		}
		//배열 랜덤 함수
		//초기 게임 셋팅, 랜덤 배열 이미지 뿌리기
		function gameSetting () {
			for (var i = 0; i<card.length; i++) {
				$('#wrap').append('<div class="card"><div class="front">'+'<img src="images/'+card[i]+'" alt="">'+'</div><div class="back"><img src="images/back.jpg" ></div></div>')
				}
			}
		// 시작시 전체 오픈 닫기
		function view_card () {
			$('.back').addClass('show',3000)
			$('.front').removeClass('show',3000);
		}
		//클릭한 값 저장 및 클래스 추가
		function startGame () {
			$('.back').click(function() {
				var $open = $('.open')
				var firstCard = $(this).prev().html();
				$(this).parents('.card:first').addClass('open');
				if($('.open').length !== 1) {
					if(firstCard === saveCard) {
						$(this).parents('.card:first').addClass('please').removeClass('open');
						saveCard_obj.parents('.card:first').addClass('please').removeClass('open');
					} else {
						if($('.open').length === 2) {
							$('.open').removeClass('open');
							setTimeout("wrongCard()",500);
							wrong ++;
							$('.wrong').text('실패 횟수 ' + wrong);
						}
					saveCard = undefined;
					}
				}
				saveCard = firstCard;
				saveCard_obj = $(this).prev();
			});
		}
		function wrongCard() {
			if($('.card').not('.please').find('.front').hasClass('show')) {
				$('.card').not('.please').find('.front.show').removeClass('show')
				$('.card').not('.please').find('.back').addClass('show')
			}
		}
		function startButton () {
			$('.start_btn').one('click',function() {
				gameSetting();
				selectCard();
				startGame();
				clearGame();
				wrongCard();
				$('.front').addClass('show',3000);
				setTimeout('view_card()',3000);
				//타이머 가동.
				setTimeout("timer()",3000);
			});
		}
		function clearGame () {
			$('.card').click(function() {
				if($('.card').filter('.please').length === card.length) {
					console.log('end');
					clearInterval(show_timer);
					alert('수고하셨습니다.(' + time +'초)');
					var checkReset = confirm('ㅇㅇ');
					if(checkReset) {
						location.reload();
					}
				} 
			});
		}
		//타이머 설정
		function timer () {
			show_timer = setInterval("increaseTime()",1000);
		}
		function increaseTime () {
			time++;
			$('#timer').text('시간 '+ time + '초');
		}
		$(document).ready(function() {
			startButton();
		});


var ChatEngine=function(){
	var croom=" ";
    var msg="";
    var oldata ="";
    var sevr=" ";
    var xhr=" ";

    this.init=function(){
        if(EventSource){
        this.setRoom();
        this.initSevr(); 
        } else{
    	    alert("Use latest Chrome or FireFox");
        }
    };

	this.setRoom=function(){
    	croom=prompt("Please enter Chat Room name:","ChatRoom");
    	if (!croom || croom =="") {
    	croom = "ChatRoom";     
    	}
    	croom = croom.replace(/(<([^>]+)>)/ig,"");
    };

    this.sendMsg=function(){ 
        msg=document.getElementById("msg").value;        
        this.ajaxSent(); 
        return false;
    };

    this.ajaxSent=function(){
        try{
            xhr=new XMLHttpRequest();
        }
        catch(err){
            alert(err);
        }
        xhr.open('GET','card.php?msg='+msg+'&croom='+croom,false);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    msg.value="";
                }
            }     
        };
        xhr.send();
    };

    //HTML5 SSE(Server Sent Event) initilization
    this.initSevr=function(){
        sevr = new EventSource('chatprocess.php?croom='+croom);
        sevr.onmessage = function(e){ 
        if(oldata!=e.data){
            chatZone.innerHTML+=e.data;
            oldata = e.data;
        }
        };     
    };
}
var chat= new ChatEngine();
chat.init();