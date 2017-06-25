

var TelegramBot = require('node-telegram-bot-api');
/**
Подключаем модули
 **/
var	Cron = require('cron').CronJob;
//var Entities = require('html-entities').XmlEntities;
//var entities = new Entities();
var request = require('request'),
	fs = require('fs');


var token='**********';

/**
Bызываем класс TelegramBot, который определили выше. 
Передаем токен и указываем polling: true, чтобы бот не закрывался
 после выполнения команды, а висел 
 **/

var bot = new TelegramBot(token, {polling: true});

bot.on('message', function(msg){
var id = msg.from.id; //id человека, который нам что-то прислал
var _messageText = msg.text,
	messageText = _messageText.toLowerCase();

if (messageText==='здравствуй') {
	bot.sendMessage(id, 'Привет. Чем могу помочь?');
} else if ((messageText==='курс')||(messageText==='курс валют')||(messageText==='какой сейчас курс валют')) {
	request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error,response,body){
		if (!error && response.statusCode === 200) {
			const data = JSON.parse(body);
			data.forEach(function(value,index){
				// в объекте обращаемся к ключам
				bot.sendMessage(id,(`Валюта: ${value.ccy}`+ "\n" + `Национальная валюта: ${value.base_ccy}` + "\n" + `Покупка: ${value.buy}`)) 
			});
		}
	})
}

//bot.sendMessage(id, msg.text); //отсылаем человеку все назад
//console.log(msg);

if  ((messageText==='меню')||(messageText==='прайс')||(messageText==='я хочу заказать шаурму')) {
	bot.sendMessage(id, 'Конечно! Мы готовы предложить вам:'+"\n" +'<b>1) Шаурма mini (25см) - 100 рублей' +"\n" +'2) Шаурма BIG (30см) - 150 рублей</b>', {parse_mode: 'HTML'});
	bot.sendMessage(id, 'Если хочешь узнать о напитках, которые у нас есть просто скажи мне: Напитки'+ "\n" +'Если тебя интересуют экзотические добавки, то просто напиши мне: Добавки');
} else if ((messageText==='что насчет напитков?')||(messageText==='напитки')||(messageText==='что насчет напитков')){
	bot.sendMessage(id,'<b>1) Кофе со сливками - 15 рублей' +"\n" +'2) Кола (0.33 л) - 30 рублей</b>', {parse_mode: 'HTML'} );
	
}  else if ((messageText==='добавки')||(messageText==='что насчет добавок?')||(messageText==='что насчет добавок')){
	bot.sendMessage(id, '<b>Картошка, сыр, горчица, острый соус и все это бесплатно!</b>', {parse_mode: 'HTML'});
} 

if ((messageText==='как дела?')||(messageText==='как дела')||(messageText==='как дела брат')){
	bot.sendMessage(id, 'У меня отлично! Как сам?');
} else if ((messageText==='спасибо')||(messageText==='поблагодарить бота')||(messageText==='от души')){
	bot.sendMessage(id, 'Пожалуйста!');
} else if ((messageText==='скидки')||(messageText==='акции')||(messageText==='расскажи про ваши акции')){
	bot.sendMessage(id, 'На данный момент никаких скидок нет, но в скором времени обязательно будут!');
} 

if (messageText==='музыка') {
	const song = __dirname + `/audio/ar.mp3`;
	bot.sendMessage(id, 'Под этот трек поедать шаурму в два раза вкуснее!');
	bot.sendAudio(id, song);
} else if (messageText==='фото товара') {
	const img = __dirname + `/image/1.jpg`;
	bot.sendPhoto(id,img);
} else if (messageText === 'состав') {
	const doc = __dirname + `/docs/structure.doc`;
	bot.sendDocument(id,doc);
} else if (messageText === 'адрес') {
	bot.sendLocation(id,45.0393,38.9872);
} else if ((messageText === 'привет')||(messageText === '/start')) {
	const voi = __dirname + `/audio/1.ogg`;
	bot.sendVoice(id,voi);
}

/*
* Создаем клавиатуру, с помощью которой
* пользователь может давать боту команды
*/

switch(messageText){

		/*Если пользователь отправит
		*сообщение "/start" или "вернуться назад",
		*то на экране появится клавиатура 1
		*/ 
		case '/start':
		case 'вернуться назад':
		welcome();
		break;

		/*Если пользователь отправит
		*сообщение "общение",
		*то на экране появится клавиатура 2
		*/
		case 'общение':
		speak();
		break;
	}

// Клавиатура 1
function welcome(){
	bot.sendMessage(id,'Welcome! \n Бот Shaurman к вашим услугам. Чем я могу вам помочь? \n Нажмите на кнопку, чтобы отдать мне приказ', {

	//в качестве ответа посылаем разметку клавиатуры в виде строки (массив кнопок)
	reply_markup: JSON.stringify({
		keyboard: [
		['Прайс'],
		['Курс валют'],
		['Состав'],
		['Общение'] ]
	})

	});
}

// Клавиатура 2
function speak(){
	bot.sendMessage(id,'Ты хочешь поговорить со мной? Я слушаю ', {

	//в качестве ответа посылаем разметку клавиатуры в виде строки (массив кнопок)
	reply_markup: JSON.stringify({
		keyboard: [
		['Как дела?'],
		['Скидки'], 
		['Поблагодарить бота'],
		['Вернуться назад']]
	})

	});
}

//___________________________________________________

});


var job = new Cron('* 30 10 * * *',function(){

	//console.log('Пришло время отведать великолепной шаурмы!');

	var chatId = 304930878; //чат бота

	/*
   * Присылает нам напоминание
   * каждый день
   * в 10:30 утра
   */

	bot.sendMessage(chatId, 'Пришло время отведать великолепной шаурмы!');
});

job.start(); //запускаем таймер
