var M_WIDTH=800, M_HEIGHT=450;
var app, fbs, assets={},client_id, IAM_CALLED=0, objects={},SERVER_TM=0,state='',game_tick=0, game_id=0, my_turn=0, connected = 1,opponent=0, LANG = 0, hidden=0, game_platform="", git_src = '',room_name = 'room0', pending_player='',tm={}, some_process = {}, my_data={opp_id : ''},opp_data={}, game_name='domino';

const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2
const MAX_NO_AUTH_RATING=1950
const MAX_NO_REP_RATING=1900
const MAX_NO_CONF_RATING=1950

const shift_w=55;
const shift_h=105;

const DOMINO_CEN_X=400;
const DOMINO_CEN_Y=200;
const SHADOW_SHIFT=3;
const SHADOW_DISP_XY={'0':[3,3],'90':[3,-3],'-90':[-3,3],'180':[-3,-3]}

my_log={
	log_arr:[],
	add(data){
		this.log_arr.push(data);
		if (this.log_arr.length>50)
			this.log_arr.shift();
	}

};

SKINS_DATA={
	0:{tint:0x262626,rating:0,games:0},
	1:{tint:0xF2F2F2,rating:0,games:20},
	2:{tint:0xF2F2F2,rating:1450,games:50},
	3:{tint:0xffffff,rating:1550,games:150},
	4:{tint:0x77370B,rating:1700,games:300},
	5:{tint:0x333333,rating:1900,games:500},
	6:{tint:0x203864,rating:2000,games:700}
}

BCG_DATA={
	0:{rating:0,games:0},
	1:{rating:1500,games:150},
	2:{rating:1600,games:500},
	3:{rating:1900,games:600},
	4:{rating:2000,games:700},
	5:{rating:2100,games:1000}
}

const map_next_place={

	'HORLINE':{
		'DUB':{
			'LEFT':{
				'NOR':{
					dx:-shift_h,
					dy:0,
					ang:[90,-90]
				}
			},
			'RIGHT':{
				'NOR':{
					dx:shift_h,
					dy:0,
					ang:[-90,90]
				}
			},
			'UP':{
				'NOR':{
					dx:0,
					dy:-shift_w*0.5-shift_h*0.5,
					ang:[180,0]
				}
			},
			'DOWN':{
				'NOR':{
					dx:0,
					dy:shift_w*0.5+shift_h*0.5,
					ang:[0,180]
				}
			},
			'LEFT_UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				}
			},
			'LEFT_DOWN':{
				'NOR':{
					dx:0,
					dy:+shift_h,
					ang:[0,180]
				}
			},
			'DOWN_LEFT':{
				'NOR':{
					dx:-shift_h,
					dy:0,
					ang:[90,-90]
				}
			},
			'DOWN_RIGHT':{
				'NOR':{
					dx:shift_h,
					dy:0,
					ang:[-90,90]
				}
			},
			'UP_RIGHT':{
				'NOR':{
					dx:shift_h,
					dy:0,
					ang:[-90,90]
				}
			},
			'UP_LEFT':{
				'NOR':{
					dx:-shift_h,
					dy:0,
					ang:[-90,90]
				}
			},
			'RIGHT_UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				}
			},
			'RIGHT_DOWN':{
				'NOR':{
					dx:0,
					dy:shift_h,
					ang:[0,180]
				}
			}
		},
		'NOR':{
			'LEFT':{
				'NOR':{
					dx:-shift_h,
					dy:0,
					ang:[90,-90]
				},
				'DUB':{
					dx:-shift_h*0.5-shift_w*0.5,
					dy:0,
					ang:[0,0]
				}
			},
			'RIGHT':{
				'NOR':{
					dx:shift_h,
					dy:0,
					ang:[-90,90]
				},
				'DUB':{
					dx:shift_h*0.5+shift_w*0.5,
					dy:0,
					ang:[0,0]
				}
			},
			'LEFT_UP':{
				'NOR':{
					dx:-shift_w*0.5,
					dy:-shift_w*0.5-shift_h*0.5,
					ang:[180,0]
				},
				'DUB':{
					dx:-shift_w*0.5-shift_h*0.5,
					dy:0,ang:[180,0],
					ang:[0,0]
				}
			},
			'LEFT_DOWN':{
				'NOR':{
					dx:-shift_w*0.5,
					dy:shift_w*0.5+shift_h*0.5,
					ang:[0,180]
				},
				'DUB':{
					dx:-shift_w*0.5-shift_h*0.5,
					dy:0,
					ang:[0,0]
				}
			},
			'RIGHT_DOWN':{
				'NOR':{
					dx:+shift_w*0.5,
					dy:+shift_w*0.5+shift_h*0.5,
					ang:[0,180]
				},
				'DUB':{
					dx:shift_w*0.5+shift_h*0.5,
					dy:0,
					ang:[0,0]
				}
			},
			'RIGHT_UP':{
				'NOR':{
					dx:shift_w*0.5,
					dy:-shift_w*0.5-shift_h*0.5,
					ang:[180,0]
				},
				'DUB':{
					dx:shift_w*0.5+shift_h*0.5,
					dy:0,
					ang:[0,0]
				}
			}
		}
	},

	'VERLINE':{
		'NOR':{
			'UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				},
				'DUB':{
					dx:0,
					dy:-shift_h*0.5-shift_w*0.5,
					ang:[90,90]
				}
			},
			'DOWN':{
				'NOR':{
					dx:0,
					dy:shift_h,
					ang:[0,180]
				},
				'DUB':{
					dx:0,
					dy:shift_h*0.5+shift_w*0.5,
					ang:[90,90]
				}
			},
			'UP_RIGHT':{
				'NOR':{
					dx:shift_w*0.5,
					dy:-shift_h*0.5-shift_w*0.5,
					ang:[-90,90]
				},
				'DUB':{
					dx:0,
					dy:-shift_h*0.5-shift_w*0.5,
					ang:[-90,-90]
				}
			},
			'UP_LEFT':{
				'NOR':{
					dx:-shift_w*0.5,
					dy:-shift_h*0.5-shift_w*0.5,
					ang:[90,-90]
				},
				'DUB':{
					dx:0,
					dy:-shift_h*0.5-shift_w*0.5,
					ang:[-90,-90]
				}
			},
			'DOWN_LEFT':{
				'NOR':{
					dx:-shift_w*0.5,
					dy:shift_h*0.5+shift_w*0.5,
					ang:[90,-90]
				},
				'DUB':{
					dx:0,
					dy:shift_h*0.5+shift_w*0.5,
					ang:[-90,-90]
				}
			},
			'DOWN_RIGHT':{
				'NOR':{
					dx:shift_w*0.5,
					dy:shift_w*0.5+shift_h*0.5,
					ang:[-90,90]
				},
				'DUB':{
					dx:0,
					dy:shift_h*0.5+shift_w*0.5,
					ang:[90,90]
				}
			}
		},
		'DUB':{
			'UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				},
			},
			'DOWN':{
				'NOR':{
					dx:0,
					dy:shift_h,
					ang:[0,180]
				},
			},
			'UP_RIGHT':{
				'NOR':{
					dx:shift_h*0.5+shift_w*0.5,
					dy:0,
					ang:[-90,90]
				},
			},
			'UP_LEFT':{
				'NOR':{
					dx:-shift_h*0.5-shift_w*0.5,
					dy:0,
					ang:[90,-90]
				},
			},
			'DOWN_LEFT':{
				'NOR':{
					dx:-shift_h,
					dy:0,
					ang:[90,-90]
				},
			},
			'LEFT_DOWN':{
				'NOR':{
					dx:0,
					dy:shift_h,
					ang:[0,180]
				},
			},
			'RIGHT_UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				},
			},
			'RIGHT_DOWN':{
				'NOR':{
					dx:0,
					dy:shift_h,
					ang:[0,180]
				},
			},
			'LEFT_UP':{
				'NOR':{
					dx:0,
					dy:-shift_h,
					ang:[180,0]
				},
			},
			'LEFT':{
				'NOR':{
					dx:-shift_h*0.5-shift_w*0.5,
					dy:0,
					ang:[90,-90]
				},
			},
			'RIGHT':{
				'NOR':{
					dx:shift_h*0.5+shift_w*0.5,
					dy:0,
					ang:[-90,90]
				},
			},
			'DOWN_RIGHT':{
				'NOR':{
					dx:shift_h*0.5+shift_w*0.5,
					dy:0,
					ang:[-90,90]
				},
			}
		}
	}

}

let bazar_chips=[];

fbs_once=async function(path){
	const info=await fbs.ref(path).get();
	return info.val();
}

my_log={
	log_arr:[],
	add(data){
		this.log_arr.push(data);
		if (this.log_arr.length>40)
			this.log_arr.shift();
	}

};

irnd = function(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class domino_class extends PIXI.Container{

	constructor(is_skin){

		super();

		if(is_skin)
			this.pointerdown=function(){pref.skin_down(this)};

		this.shadow=new PIXI.Sprite(assets.domino_shadow);
		this.shadow.width=70;
		this.shadow.height=120;
		this.shadow.x=this.shadow.y=3;

		this.bcg=new PIXI.Sprite();
		this.bcg.width=70;
		this.bcg.height=120;

		this.v1=0;
		this.v2=0;
		this.skin_id=0;

		this.icon1=new PIXI.Sprite()
		this.icon1.width=50
		this.icon1.height=50
		this.icon1.x=10
		this.icon1.y=10
		this.icon1.tint=0xffffff

		this.icon2=new PIXI.Sprite()
		this.icon2.width=50
		this.icon2.height=50
		this.icon2.x=10
		this.icon2.y=60
		this.icon2.tint=0xffffff

		this.lock=new PIXI.Sprite(assets.lock)
		this.lock.width=70
		this.lock.height=70
		this.lock.anchor.set(0.5,0.5)
		this.lock.x=50
		this.lock.y=95
		this.lock.angle=30
		this.lock.visible=false

		this.interactive=true
		this.visible=false

		this.pivot.x=35
		this.pivot.y=60

		this.mine=0

		this.double=0

		this.set_skin(0)

		this.addChild(this.shadow,this.bcg,this.icon1,this.icon2,this.lock)

	}

	crop(){

		this.pivot.x=0;
		this.pivot.y=0;

		const bcg_BT=this.bcg.texture.baseTexture;
		const shadow_BT=this.shadow.texture.baseTexture;

		this.bcg.texture=new PIXI.Texture(bcg_BT,new PIXI.Rectangle(0,0,140,60));
		this.bcg.height*=0.25;

		this.shadow.texture=new PIXI.Texture(shadow_BT,new PIXI.Rectangle(0,0,105,45));
		this.shadow.height*=0.25;

	}

	set_skin(skin_id){

		this.skin_id=skin_id;

		this.bcg.texture=assets['skin'+skin_id];
		this.icon1.tint=SKINS_DATA[skin_id].tint;
		this.icon2.tint=SKINS_DATA[skin_id].tint;

	}

	hide_values(){
		this.icon1.visible=false;
		this.icon2.visible=false;
	}

	show_values(){
		this.icon1.visible=true;
		this.icon2.visible=true;
	}

	set(v1,v2){

		if (v1){
			this.icon1.texture=assets['d'+v1];
		}else
			this.icon1.texture=PIXI.Texture.EMPTY;

		if (v2){
			this.icon2.texture=assets['d'+v2];
		}else
			this.icon2.texture=PIXI.Texture.EMPTY;

		this.double=+(v1===v2);

		this.v1=v1;
		this.v2=v2;

	}

	pointerdown(){
		my_player.try_make_move(this);
	}

}

class bcg_class extends PIXI.Container{

	constructor(){

		super();
		this.shadow=new PIXI.Sprite(assets.bcg_icon_shadow);
		this.shadow.width=120;
		this.shadow.height=80;
		this.shadow.x=-10;
		this.shadow.y=-10;


		this.bcg=new PIXI.Sprite(assets.bcg_0);
		this.bcg.width=120;
		this.bcg.height=80;
		this.bcg.x=-10;
		this.bcg.y=-10;

		this.lock=new PIXI.Sprite(assets.lock);
		this.lock.width=70;
		this.lock.height=70;
		this.lock.anchor.set(0.5,0.5);
		this.lock.x=90;
		this.lock.y=50;
		this.lock.angle=30;
		this.lock.visible=false;

		this.id=0;

		this.interactive=true;
		this.buttonMode=true;
		this.pointerdown=function(){pref.bcg_down(this)};

		this.addChild(this.shadow,this.bcg,this.lock)

	}

	set_bcg(id){
		this.id=id;
		this.bcg.texture=assets['bcg_'+id];
	}

}

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = 'single';
		this.x=x;
		this.y=y;


		this.bcg=new PIXI.Sprite(assets.mini_player_card);
		this.bcg.width=200;
		this.bcg.height=90;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};

		this.table_rating_hl=new PIXI.Sprite(assets.table_rating_hl);
		this.table_rating_hl.width=200;
		this.table_rating_hl.height=90;

		this.avatar=new PIXI.Graphics();
		this.avatar.x=16;
		this.avatar.y=16;
		this.avatar.w=this.avatar.h=58.2;

		this.avatar_frame=new PIXI.Sprite(assets.circle_frame50);
		this.avatar_frame.x=16-11.64;
		this.avatar_frame.y=16-11.64;
		this.avatar_frame.width=this.avatar_frame.height=81.48;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(1,0.5);
		this.rating_text.x=180;
		this.rating_text.y=64.5;
		this.rating_text.tint=0xffff00;

		//аватар первого игрока
		this.avatar1=new PIXI.Graphics();
		this.avatar1.x=19;
		this.avatar1.y=16;
		this.avatar1.w=this.avatar1.h=58.2;

		this.avatar1_frame=new PIXI.Sprite(assets.circle_frame50);
		this.avatar1_frame.x=this.avatar1.x-11.64;
		this.avatar1_frame.y=this.avatar1.y-11.64;
		this.avatar1_frame.width=this.avatar1_frame.height=81.48;



		//аватар второго игрока
		this.avatar2=new PIXI.Graphics();
		this.avatar2.x=121;
		this.avatar2.y=16;
		this.avatar2.w=this.avatar2.h=58.2;

		this.avatar2_frame=new PIXI.Sprite(assets.circle_frame50);
		this.avatar2_frame.x=this.avatar2.x-11.64;
		this.avatar2_frame.y=this.avatar2.y-11.64;
		this.avatar2_frame.width=this.avatar2_frame.height=81.48;

		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=100;
		this.t_country.y=60;
		this.t_country.tint=0xFFE699;

		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;

		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.t_country,this.avatar,this.avatar_frame,this.avatar1, this.avatar1_frame, this.avatar2,this.avatar2_frame,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffffff;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Graphics()
		this.avatar.x=43
		this.avatar.y=13
		this.avatar.w=this.avatar.h=44
		this.avatar.width=this.avatar.height=44


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xcceeff;
		this.name.x=105;
		this.name.y=22;

		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=305;
		this.rating.tint=0xFFFF00;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class chat_record_class extends PIXI.Container {

	constructor() {

		super();

		this.tm=0;
		this.uid='';


		this.avatar = new PIXI.Graphics();
		this.avatar.w=50;
		this.avatar.h=50;
		this.avatar.x=30;
		this.avatar.y=13;

		this.avatar_bcg = new PIXI.Sprite(assets.chat_avatar_bcg_img);
		this.avatar_bcg.width=70;
		this.avatar_bcg.height=70;
		this.avatar_bcg.x=this.avatar.x-10;
		this.avatar_bcg.y=this.avatar.y-10;
		this.avatar_bcg.interactive=true;
		this.avatar_bcg.pointerdown=()=>chat.avatar_down(this);

		this.avatar_frame = new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.width=70;
		this.avatar_frame.height=70;
		this.avatar_frame.x=this.avatar.x-10;
		this.avatar_frame.y=this.avatar.y-10;

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 17});
		this.name.anchor.set(0,0.5);
		this.name.x=this.avatar.x+72;
		this.name.y=this.avatar.y-1;
		this.name.tint=0xFBE5D6;

		this.gif=new PIXI.Sprite();
		this.gif.x=this.avatar.x+65;
		this.gif.y=22;

		this.gif_bcg=new PIXI.Graphics();
		this.gif_bcg.beginFill(0x111111)
		this.gif_bcg.drawRect(0,0,1,1);
		this.gif_bcg.x=this.gif.x+3;
		this.gif_bcg.y=this.gif.y+3;
		this.gif_bcg.alpha=0.5;



		this.msg_bcg = new PIXI.NineSlicePlane(assets.msg_bcg,50,18,50,28);
		//this.msg_bcg.width=160;
		//this.msg_bcg.height=65;
		this.msg_bcg.scale_xy=0.66666;
		this.msg_bcg.x=this.avatar.x+45;
		this.msg_bcg.y=this.avatar.y+2;

		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 19,lineSpacing:55,align: 'left'});
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;

		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: 15});
		this.msg_tm.tint=0xffffff;
		this.msg_tm.alpha=0.6;
		this.msg_tm.anchor.set(1,0);

		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);

	}

	nameToColor(name) {
		  // Create a hash from the name
		  let hash = 0;
		  for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
			hash = hash & hash; // Convert to 32bit integer
		  }

		  // Generate a color from the hash
		  let color = ((hash >> 24) & 0xFF).toString(16) +
					  ((hash >> 16) & 0xFF).toString(16) +
					  ((hash >> 8) & 0xFF).toString(16) +
					  (hash & 0xFF).toString(16);

		  // Ensure the color is 6 characters long
		  color = ('000000' + color).slice(-6);

		  // Convert the hex color to an RGB value
		  let r = parseInt(color.slice(0, 2), 16);
		  let g = parseInt(color.slice(2, 4), 16);
		  let b = parseInt(color.slice(4, 6), 16);

		  // Ensure the color is bright enough for a black background
		  // by normalizing the brightness.
		  if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
			r = Math.min(r + 128, 255);
			g = Math.min(g + 128, 255);
			b = Math.min(b + 128, 255);
		  }

		  return (r << 16) + (g << 8) + b;
	}

	async update_avatar(uid, tar_sprite) {

		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.set_texture(players_cache.players[uid].texture);
	}

	async set(msg_data) {

		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);

		if (msg_data.uid==='admin'){
			this.msg_bcg.tint=0xffff55;
			this.avatar.set_texture(assets.pc_icon);
		}else{
			this.msg_bcg.tint=0xffffff;
			await this.update_avatar(msg_data.uid, this.avatar);
		}

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;

		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.msg.text=msg_data.msg;
		this.visible = true;

		if (msg_data.msg.startsWith('GIF')){

			const mp4BaseT=await new Promise((resolve, reject)=>{
				const url='https://akukamil.github.io/common/gifs/'+msg_data.msg+'.mp4';
				if(PIXI.utils.BaseTextureCache[url]&&!PIXI.utils.BaseTextureCache[url].valid) resolve(0);
				const baseTexture = PIXI.BaseTexture.from(url);
				if (baseTexture.width>1) resolve(baseTexture);
				baseTexture.on('loaded', () => resolve(baseTexture));
				baseTexture.on('error', (error) => resolve(null));
			});

			if (!mp4BaseT) {
				this.visible=false;
				return 0;
			}

			mp4BaseT.resource.source.play();
			mp4BaseT.resource.source.loop=true;

			this.gif.texture=PIXI.Texture.from(mp4BaseT);
			this.gif.visible=true;
			const aspect_ratio=mp4BaseT.width/mp4BaseT.height;
			this.gif.height=90;
			this.gif.width=this.gif.height*aspect_ratio;
			this.msg_bcg.visible=false;
			this.msg.visible=false;
			this.msg_tm.anchor.set(0,0);
			this.msg_tm.y=this.gif.height+9;
			this.msg_tm.x=this.gif.width+102;

			this.gif_bcg.visible=true;
			this.gif_bcg.height=this.gif.height;
			this.gif_bcg.width=	this.gif.width;
			return this.gif.height+30;

		}else{

			this.gif_bcg.visible=false;
			this.gif.visible=false;
			this.msg_bcg.visible=true;
			this.msg.visible=true;

			//бэкграунд сообщения в зависимости от длины
			const msg_bcg_width=Math.max(this.msg.width,100)+100;
			this.msg_bcg.width=msg_bcg_width*1.5;

			if (msg_bcg_width>300){
				this.msg_tm.anchor.set(1,0);
				this.msg_tm.y=this.avatar.y+52;
				this.msg_tm.x=msg_bcg_width+55;
			}else{
				this.msg_tm.anchor.set(0,0);
				this.msg_tm.y=this.avatar.y+37;
				this.msg_tm.x=msg_bcg_width+62;
			}

			return 70;
		}
	}

}

class feedback_record_class extends PIXI.Container {

	constructor() {

		super();
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {lineSpacing:42,fontName: 'mfont',fontSize: 19,align: 'left'});
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;

		this.name_text=new PIXI.BitmapText('Николай:', {fontName: 'mfont',fontSize: 19,align: 'left'});
		this.name_text.tint=0xFFFFFF;


		this.addChild(this.text,this.name_text)
	}

	set(name, feedback_text){
		this.text.text=name+': '+feedback_text;
		this.name_text.text=name+':';

	}


}

class slider_class extends PIXI.Container{

	constructor(invert) {

		super()

		this.shadow=new PIXI.Sprite(assets.slider_shadow)
		this.shadow.anchor.set(0.5,0.5)
		this.shadow.width=60
		this.shadow.height=70
		if (invert) {this.shadow.scale_xy*=-1;this.shadow.x=3.5;this.shadow.y=3.5}

		this.avatar=new PIXI.Graphics()
		this.avatar.w=44
		this.avatar.h=44
		this.avatar.x=-22
		this.avatar.y=-22
		invert?this.avatar.y=-18:this.avatar.y=-26

		this.frame=new PIXI.Sprite(assets.slider_frame)
		this.frame.anchor.set(0.5,0.5)
		this.frame.width=60
		this.frame.height=70
		if (invert) this.frame.scale_y*=-1

		this.t_score=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'})
		this.t_score.anchor.set(0,0.5)
		this.t_score.tint=0xffffff
		this.t_score.x=30
		this.t_score.y=0

		this.addChild(this.shadow,this.avatar,this.frame,this.t_score)
	}

}

class just_avatar_class extends PIXI.Container{

	constructor(size){

		super();

		this.shadow=new PIXI.Sprite(assets.avatar_shadow);
		this.shadow.width=this.shadow.height=size;

		this.avatar=new PIXI.Sprite();
		this.avatar.width=this.avatar.height=size-20;
		this.avatar.x=this.avatar.y=10;

		this.frame=new PIXI.Sprite(assets.avatar_frame);
		this.frame.width=this.frame.height=size;

		this.avatar_mask=new PIXI.Sprite(assets.avatar_mask);
		this.avatar_mask.width=this.avatar_mask.height=size;

		this.avatar.mask=this.avatar_mask;


		this.addChild(this.shadow,this.avatar_mask,this.avatar,this.frame,this.avatar_mask,)

	}

}

anim2 = {

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0, visible:false, ready:true, alpha:0},

	slot: Array(30).fill(null),


	any_on() {
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;
	},

	linear(x) {
		return x
	},

	kill_anim(obj) {

		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj){
					this.slot[i].p_resolve('finished');
					this.slot[i].obj.ready=true;
					this.slot[i]=null;
				}

	},

	flick(x){

		return Math.abs(Math.sin(x*6.5*3.141593));

	},

	easeBridge(x){

		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1
	},

	ease3peaks(x){

		if (x < 0.16666) {
			return x / 0.16666;
		} else if (x < 0.33326) {
			return 1-(x - 0.16666) / 0.16666;
		} else if (x < 0.49986) {
			return (x - 0.3326) / 0.16666;
		} else if (x < 0.66646) {
			return 1-(x - 0.49986) / 0.16666;
		} else if (x < 0.83306) {
			return (x - 0.6649) / 0.16666;
		} else if (x >= 0.83306) {
			return 1-(x - 0.83306) / 0.16666;
		}
	},

	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},

	easeOutBack2(x) {
		return -5.875*Math.pow(x, 2)+6.875*x;
	},

	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},

	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},

	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},

	easeInQuad(x) {
		return x * x;
	},

	easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},

	easeInCubic(x) {
		return x * x * x;
	},

	ease2back(x) {
		return Math.sin(x*Math.PI);
	},

	easeInOutCubic(x) {

		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},

	shake(x) {

		return Math.sin(x*2 * Math.PI);

	},

	add (obj, params, vis_on_end, time, func, block=true) {

		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];
					obj[key]=params[key][0];
				}

				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back' || func === 'shake' || func === 'ease3peaks')
					for (let key in params)
						params[key][1]=params[key][0];

				this.slot[i] = {
					obj,
					block,
					params,
					vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}

		if (f===0) {
			console.log("Кончились слоты анимации");


			//сразу записываем конечные параметры анимации
			for (let key in params)
				obj[key]=params[key][1];
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;


			return new Promise(function(resolve, reject){
			  resolve();
			});
		}
		else {
			return new Promise(function(resolve, reject){
			  anim2.slot[i].p_resolve = resolve;
			});

		}




	},

	process() {

		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {

				let s=this.slot[i];

				s.progress+=s.speed;

				for (let key in s.params)
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);

				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)
						s.obj[key]=s.params[key][1];

					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;

					s.obj.ready=true;
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}
		}

	},

	async wait(time) {

		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');

	}
}

sound={

	on : 1,

	play(snd_res,is_loop) {

		if (!this.on||document.hidden)
			return;

		if (!assets[snd_res])
			return;

		assets[snd_res].play({loop:is_loop||false});

	},

	switch(){

		if (this.on){
			this.on=0;
			pref.send_info(['Звуки отключены','Sounds is off'][LANG])

		} else{
			this.on=1;
			pref.send_info(['Звуки включены','Sounds is on'][LANG])
		}
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);

	}

}

music={

	on:1,

	activate(){

		this.on=safe_ls('domino_music')??1;
		objects.music_slider.x=this.on?119:80;//-39

		if (!this.on) return;

		if (!assets.music.isPlaying){
			assets.music.play()
			assets.music.loop=true
		}
	},

	switch(){

		if (this.on){
			this.on=0;
			assets.music.stop();
			pref.send_info(['Музыка отключена','Music is off'][LANG])
		} else{
			this.on=1;
			assets.music.play()
			assets.music.loop=true
			pref.send_info(['Музыка включена','Music is on'][LANG])
		}

		safe_ls('domino_music',this.on);
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);
	}

}

big_msg={

	winner:'',
	result:'',
	player_to_process:0,
	t:0,
	timer:0,
	game_end:0,
	score_delta:1,
	wait_init_timer:0,

	round_stop(winner,score,result){

		const title_text=['Раунд завершен (','Round end ('][LANG]+{'my_win':['Победа!','You win!'],'opp_win':['Поражение!','You lose!'],'fish':['Рыба!','Fish!']}[result][LANG]+')';
		objects.big_msg_title.text=title_text;
		objects.big_msg_title2.text=')))';
		this.game_end=0;
		this.winner=winner;
		this.result=result;
		this.player_to_process=this[winner];

		//на всякий случай очищаем
		clearTimeout(big_msg.wait_init_timer);
		clearInterval(big_msg.timer);

		objects.big_msg_fb_btn.visible=false;

		sound.play('round');

		//сразу определяем общее кол-во очков
		this.winner.tot_score=this.winner.cur_score+score;
		if (this.winner.tot_score>50) this.winner.tot_score=50;

		this.show();

		this.wait_init_timer=setTimeout(function(){big_msg.process_info(1)},1500)

	},

	show(){

		objects.big_msg_ok_btn.visible=false

		if (objects.big_msg_cont.visible) return

		anim2.add(objects.big_msg_cont,{scale_y:[0,1],alpha:[0,1]}, true, 0.25,'linear')

		//бонусы пока не покзываем
		objects.big_msg_bonuses_cont.visible=false

		//устанавливаем аватарки в слайдеры
		objects.my_slider.avatar.set_texture(objects.my_avatar.avatar.texture)
		objects.opp_slider.avatar.set_texture(objects.opp_avatar.avatar.texture)
	},

	draw_score(player,score){

		const score_offset=180+score*8.6
		if (player===my_player){
			objects.my_slider.x=score_offset
			objects.my_slider.t_score.text=~~score
		}else{
			objects.opp_slider.x=score_offset
			objects.opp_slider.t_score.text=~~score
		}
	},

	close(){
		clearTimeout(big_msg.wait_init_timer);
		clearInterval(big_msg.timer);
		anim2.add(objects.big_msg_cont,{scale_y:[1,0]}, false, 0.25,'linear');
		some_process.big_msg_process=function(){};
		ad.show();
	},

	show_bonus_anim(text_obj,tar_val){
		
		if (tar_val===0){
			text_obj.text=0			
			return
		}
		
		const interval_time=(tar_val*52+948)/tar_val
		
		let lights=0
		const t=setInterval(()=>{
			lights++
			text_obj.text='+'+lights
			if (lights===tar_val)
				clearInterval(t)
		},interval_time)	
		
	},

	total_stop(result){

		this.show()

		const results_map = {
			'my_win':{type:WIN, desc:['Вы выиграли!','You win! Opponent out of time']},
 			'opp_win':{type:LOSE, desc:['Вы проиграли!','You lose! You out of time']},
 			'draw':{type:DRAW, desc:['Ничья','Draw!']},
 			'timer_error':{type:LOSE, desc:['Ошибка таймера!','Timer error!']},
 			'my_timeout':{type:LOSE, desc:['Вы проиграли! У вас закончилось время','You lose! You out of time']},
 			'opp_timeout':{type:WIN , desc:['Вы выиграли! У соперника закончилось время','You win! Opponent out of time']},
 			'my_giveup':{type:LOSE, desc:['Вы сдались!','You gave up!']},
 			'opp_giveup':{type:WIN , desc:['Вы выиграли! Соперник сдался','You win! Opponent gave up!']},
 			'my_no_sync':{type:NOSYNC , desc:['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']},
 			'opp_no_sync':{type:NOSYNC , desc:['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']},
 			'my_no_connection':{type:LOSE , desc:['Потеряна связь!','Lost connection!']}
		};

		const old_rating=my_data.rating;
		const result_type=results_map[result].type;
		const result_desc=results_map[result].desc[LANG];

		if (result_type===WIN) my_data.rating=my_data.win_rating
		if (result_type===LOSE) my_data.rating=my_data.lose_rating
		if (result_type===DRAW) my_data.rating=my_data.draw_rating
		
		let energy_bonus=0
		let crystals_bonus=0
				
		//показываем бонусы
		objects.big_msg_crystals_t.text=0
		objects.big_msg_energy_t.text=0
		objects.big_msg_rating_t.text=old_rating+' > '+my_data.rating
		anim2.add(objects.big_msg_bonuses_cont,{alpha:[0,1]}, true, 0.5,'linear')

		objects.big_msg_title.text=result_desc
		
		if (opponent===bot)
			objects.big_msg_title2.text=['Играйте с реальными соперниками для получения рейтинга','Play online to get rating'][LANG]
		else
			objects.big_msg_title2.text=')))'
		
		anim2.add(objects.big_msg_title2,{alpha:[0,1]}, true, 0.5,'linear')
		objects.big_msg_fb_btn.visible=!my_data.blocked


		//если это онлайн игре
		if (opponent===online_player){

			//контрольные концовки логируем на виртуальной машине
			if (my_data.rating>1990 || opp_data.rating>1990){
				const duration = Math.floor((Date.now() - opponent.start_time)*0.001);
				const data={uid:my_data.uid,p1:objects.my_card_name.text,p2:objects.opp_card_name.text, res:result_type,f:result,d:duration,bg:opponent.blind_game_flag, r: [old_rating,my_data.rating],gid:game_id,cid:client_id,tm:'TMS'}
				my_ws.safe_send({cmd:'log',logger:`${game_name}_games`,data});
			}
						
			if (result_type === DRAW || result_type === LOSE || result_type === WIN) {
										
				my_data.games++
				fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating)
				fbs.ref('players/'+my_data.uid+'/games').set(my_data.games)
				
				//если это слепая игра
				if (online_player.blind_game_flag){
					energy_bonus+=10
					crystals_bonus+=10
				}
				
				//бонус кристаллов за заход в зону подтверждения
				if (my_data.rating>MAX_NO_CONF_RATING&&old_rating<=MAX_NO_CONF_RATING)
					crystals_bonus+=30
			}			
		}
		
		//бонус за выигрыш до конца
		if (result==='my_win')
			opponent===online_player?energy_bonus+=7:energy_bonus+=2
		if (result==='opp_win')
			opponent===online_player?energy_bonus+=3:energy_bonus+=1

		//разные моменты связанные с соперниками
		opponent.stop(result)

		//утверждаем бонусы
		pref.change_crystals(crystals_bonus)
		pref.change_energy(energy_bonus)
							
		//показываем анимации
		this.show_bonus_anim(objects.big_msg_energy_t,energy_bonus||0)
		this.show_bonus_anim(objects.big_msg_crystals_t,crystals_bonus||0)
				
		//останавливаем таймер		
		timer.stop()
		
		//звуки
		if (result_type===WIN)
			sound.play('win')
		else
			sound.play('lose')
		
		this.game_end=1

		//конпка ок
		objects.big_msg_ok_btn.visible=true

	},

	btn_down(){

		if (anim2.any_on()){
			sound.play('locked')
			return
		}

		sound.play('close_it')

		if(this.game_end){
			this.goto_main_menu();
			return;
		}

		this.confirm_resume()

	},

	eye_btn_down(){		
		if (anim2.any_on()||objects.big_msg_cont.alpha<1) return
		anim2.add(objects.big_msg_cont,{alpha:[1,0.3]}, true, 0.5,'linear',false)
	},	

	goto_main_menu(){

		this.close();
		game.close();
		main_menu.activate();

	},

	async fb_btn_down(){

		if (anim2.any_on()||objects.chat_keyboard_cont.visible) {
			sound.play('locked');
			return;
		}

		//пишем отзыв и отправляем его
		const msg = await keyboard.read();
		if (msg) {
			let fb_id = irnd(0,50);
			await fbs.ref('fb/'+opp_data.uid+'/'+fb_id).set([msg, firebase.database.ServerValue.TIMESTAMP, my_data.name]);
		}

		//закрываем как следует
		this.goto_main_menu();

	},

	process_info(init){

		if (init) {
			some_process.big_msg_process=function(){big_msg.process_info()}
			sound.play('progress',true)

			const delta=this.winner.tot_score-this.winner.cur_score

			if (delta<150) this.score_delta=0.6
			if (delta<50) this.score_delta=0.5
			if (delta<40) this.score_delta=0.4
			if (delta<30) this.score_delta=0.3
			if (delta<20) this.score_delta=0.2
			if (delta<10) this.score_delta=0.1

		}

		//ссылка на выигровшего игрока
		const p=this.winner


		p.cur_score+=this.score_delta
		this.draw_score(p,p.cur_score)

		if(p.cur_score>=p.tot_score){
			p.cur_score=p.tot_score
			this.draw_score(p,p.cur_score)
			assets['progress'].stop()
			some_process.big_msg_process=function(){}
			if (p.cur_score===50){
				this.total_stop(p===my_player?'my_win':'opp_win')
				return
			}

			this.start_count_down()
		}

	},

	start_count_down(){

		//отсчет до автоматического продолжения партии
		objects.big_msg_ok_btn.visible=true

		//общий таймер тоже запускаем чтобы проверять махинации
		my_turn=1
		timer.start({sec:9,check_game_end:0})
		timer.on_tick=(sec_left)=>{
			if(sec_left===0) this.confirm_resume()
		}

	},

	confirm_resume(){

		//нажали кнопку продолжить
		timer.stop()
		this.close()
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'RESUME',tm:Date.now()})
		opponent.resume_game()
	}

}

message={

	promise_resolve :0,

	async add(text, timeout=3000,sound_name='message') {

		if (this.promise_resolve!==0)
			this.promise_resolve("forced");


		//воспроизводим звук
		sound.play(sound_name);

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.25,'easeOutBack',false);

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, timeout)
			}
		);

		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.25,'easeInBack',false);
	},

	clicked() {


		message.promise_resolve();

	}

}

confirm_dialog={

	p_resolve : 0,

	show(msg) {

		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;
		}

		sound.play("confirm_dialog");

		objects.confirm_msg.text=msg;

		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');

		return new Promise(function(resolve){
			confirm_dialog.p_resolve = resolve;
		});
	},

	button_down(res) {

		if (objects.confirm_cont.ready===false)
			return;

		sound.play('click')

		this.close();
		this.p_resolve(res);

	},

	close() {

		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');

	}

}

keyboard={

	ru_keys:[[49,122.05,79,161.12,'1'],[89,122.05,119,161.12,'2'],[129,122.05,159,161.12,'3'],[169,122.05,199,161.12,'4'],[209,122.05,239,161.12,'5'],[249,122.05,279,161.12,'6'],[289,122.05,319,161.12,'7'],[329,122.05,359,161.12,'8'],[369,122.05,399,161.12,'9'],[409,122.05,439,161.12,'0'],[490,122.05,540,161.12,'<'],[69,170.88,99,209.95,'Й'],[109,170.88,139,209.95,'Ц'],[149,170.88,179,209.95,'У'],[189,170.88,219,209.95,'К'],[229,170.88,259,209.95,'Е'],[269,170.88,299,209.95,'Н'],[309,170.88,339,209.95,'Г'],[349,170.88,379,209.95,'Ш'],[389,170.88,419,209.95,'Щ'],[429,170.88,459,209.95,'З'],[469,170.88,499,209.95,'Х'],[509,170.88,539,209.95,'Ъ'],[89,219.72,119,258.79,'Ф'],[129,219.72,159,258.79,'Ы'],[169,219.72,199,258.79,'В'],[209,219.72,239,258.79,'А'],[249,219.72,279,258.79,'П'],[289,219.72,319,258.79,'Р'],[329,219.72,359,258.79,'О'],[369,219.72,399,258.79,'Л'],[409,219.72,439,258.79,'Д'],[449,219.72,479,258.79,'Ж'],[489,219.72,519,258.79,'Э'],[69,268.56,99,307.63,'!'],[109,268.56,139,307.63,'Я'],[149,268.56,179,307.63,'Ч'],[189,268.56,219,307.63,'С'],[229,268.56,259,307.63,'М'],[269,268.56,299,307.63,'И'],[309,268.56,339,307.63,'Т'],[349,268.56,379,307.63,'Ь'],[389,268.56,419,307.63,'Б'],[429,268.56,459,307.63,'Ю'],[510,268.56,540,307.63,')'],[450,122.05,480,161.12,'?'],[29,317.4,179,356.47,'ЗАКРЫТЬ'],[189,317.4,419,356.47,' '],[429,317.4,569,356.47,'ОТПРАВИТЬ'],[530,219.72,560,258.79,','],[470,268.56,500,307.63,'('],[29,219.72,79,258.79,'EN']],
	en_keys:[[51,120.58,81,159.65,'1'],[91,120.58,121,159.65,'2'],[131,120.58,161,159.65,'3'],[171,120.58,201,159.65,'4'],[211,120.58,241,159.65,'5'],[251,120.58,281,159.65,'6'],[291,120.58,321,159.65,'7'],[331,120.58,361,159.65,'8'],[371,120.58,401,159.65,'9'],[411,120.58,441,159.65,'0'],[492,120.58,542,159.65,'<'],[111,169.42,141,208.49,'Q'],[151,169.42,181,208.49,'W'],[191,169.42,221,208.49,'E'],[231,169.42,261,208.49,'R'],[271,169.42,301,208.49,'T'],[311,169.42,341,208.49,'Y'],[351,169.42,381,208.49,'U'],[391,169.42,421,208.49,'I'],[431,169.42,461,208.49,'O'],[471,169.42,501,208.49,'P'],[131,218.26,161,257.33,'A'],[171,218.26,201,257.33,'S'],[211,218.26,241,257.33,'D'],[251,218.26,281,257.33,'F'],[291,218.26,321,257.33,'G'],[331,218.26,361,257.33,'H'],[371,218.26,401,257.33,'J'],[411,218.26,441,257.33,'K'],[451,218.26,481,257.33,'L'],[472,267.09,502,306.16,'('],[71,267.09,101,306.16,'!'],[151,267.09,181,306.16,'Z'],[191,267.09,221,306.16,'X'],[231,267.09,261,306.16,'C'],[271,267.09,301,306.16,'V'],[311,267.09,341,306.16,'B'],[351,267.09,381,306.16,'N'],[391,267.09,421,306.16,'M'],[512,267.09,542,306.16,')'],[452,120.58,482,159.65,'?'],[31,315.93,181,355,'CLOSE'],[191,315.93,421,355,' '],[431,315.93,571,355,'SEND'],[532,218.26,562,257.33,','],[31,218.26,81,257.33,'RU']],
	layout:0,
	resolver:0,

	MAX_SYMBOLS : 60,

	read(max_symb){

		this.MAX_SYMBOLS=max_symb||60;
		if (!this.layout)this.switch_layout();

		//если какой-то ресолвер открыт
		if(this.resolver) this.resolver('');

		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = `0/${this.MAX_SYMBOLS}`

		anim2.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy]}, true, 0.2,'linear');


		return new Promise(resolve=>{
			this.resolver=resolve;
		})

	},

	keydown (key) {

		//*******это нажатие с клавиатуры
		if(!objects.chat_keyboard_cont.visible) return;

		key = key.toUpperCase();

		if(key==='BACKSPACE') key ='<';
		if(key==='ENTER') key ='ОТПРАВИТЬ';
		if(key==='ESCAPE') key ='ЗАКРЫТЬ';

		var key2 = this.layout.find(k => {return k[4] === key})

		this.process_key(key2)

	},

	get_key_from_touch(e){

		//координаты нажатия в плостоки спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.chat_keyboard_cont.x-10;
		let my = e.data.global.y/app.stage.scale.y - objects.chat_keyboard_cont.y-10;

		//ищем попадание нажатия на кнопку
		let margin = 5;
		for (let k of this.layout)
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin)
				return k;
		return null;
	},

	highlight_key(key_data){

		const [x,y,x2,y2,key]=key_data

		//подсвечиваем клавишу
		objects.chat_keyboard_hl.width=x2-x+20;
		objects.chat_keyboard_hl.height=y2-y+20;

		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x-10;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y-10;

		anim2.add(objects.chat_keyboard_hl,{alpha:[1, 0]}, false, 0.5,'linear');

	},

	pointerdown (e) {

		//if (!game.on) return;

		//получаем значение на которое нажали
		const key=this.get_key_from_touch(e);

		//дальнейшая обработка нажатой команды
		this.process_key(key);
	},

	response_message(uid, name) {

		objects.chat_keyboard_text.text = name.split(' ')[0]+', ';
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${keyboard.MAX_SYMBOLS}`

	},

	switch_layout(){

		if (this.layout===this.ru_keys){
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}

	},

	process_key(key_data){

		if(!key_data) return;

		let key=key_data[4];

		//звук нажатой клавиши
		sound.play('keypress');

		const t=objects.chat_keyboard_text.text;
		if ((key==='ОТПРАВИТЬ'||key==='SEND')&&t.length>0){
			this.resolver(t);
			this.close();
			key ='';
		}

		if (key==='ЗАКРЫТЬ'||key==='CLOSE'){
			this.resolver(0);
			this.close();
			key ='';
		}

		if (key==='RU'||key==='EN'){
			this.switch_layout();
			key ='';
		}

		if (key==='<'){
			objects.chat_keyboard_text.text=t.slice(0, -1);
			key ='';
		}

		if (t.length>=this.MAX_SYMBOLS) return;

		//подсвечиваем...
		this.highlight_key(key_data);

		//добавляем значение к слову
		if (key.length===1) objects.chat_keyboard_text.text+=key;

		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${this.MAX_SYMBOLS}`

	},

	close () {

		//на всякий случай уничтожаем резолвер
		if (this.resolver) this.resolver(0);
		anim2.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450]}, false, 0.2,'linear');

	},

}

bg={
	
	sec_to_start:999,
	timer:0,
	i:0,
	on:0,
	btn_anim_timer:0,
	
	async activate(){
		
		this.on=1
		
		//анимация кнопки
		this.btn_anim_timer=setInterval(()=>{
			if (!objects.invite_waiting_anim.visible)
				anim2.add(objects.invite_waiting_anim,{x:[100, 230],alpha:[1,0]},false,0.5,'linear');
		},2000)	
		
		//просто счетчик секунд
		this.i=0
					
		//обновляем все данные
		this.update_all()
		
		//сразу записываемся в игроки
		my_ws.safe_send({cmd:'set_no_event',path:'bg/p/'+my_data.uid,val:'TMS'})
		
		this.timer=setInterval(()=>{
			this.process()
		},1000)	
		
	},
	
	async update_all(){
		
		//console.log('update_all')
		const bg_data=await my_ws.get('bg')
		this.update_time(bg_data.t)
		this.update_players(bg_data.p)
		
	},	
	
	async update_time(inp_t){
		
		//console.log('update_time')
		const t=inp_t||await my_ws.get('bg/t')||999
		this.sec_to_start=t
		if(inp_t)
			this.draw_sec_to_start()
		
	},
	
	async update_players(inp_p){
		
		//console.log('update_players')
		const p=inp_p||await my_ws.get('bg/p')
		objects.invite_bg_players.text='Количество участников: '+Object.keys(p).length	
		
	},
	
	process(){
		
		//console.log('process_call',Date.now())
		
		this.sec_to_start--
		this.draw_sec_to_start()
		
		my_ws.safe_send({cmd:'set_no_event',path:'bg/p/'+my_data.uid,val:'TMS'})
		
		if (this.i===4||this.i===8)
			this.update_players()
		
		if (this.i===11){
			this.update_time()			
			this.i=0		
		}

		this.i++		
	},
	
	stop(){
		
		this.on=0
		clearInterval(this.timer)
		clearInterval(this.btn_anim_timer)
		my_ws.safe_send({cmd:'remove',path:'bg/p/'+my_data.uid})
	},	
	
	draw_sec_to_start(){		
	
		if (this.sec_to_start<0) this.sec_to_start=0
		
		const minutes = Math.floor(this.sec_to_start/60)
		const remainingSeconds = this.sec_to_start % 60
		const formattedMinutes = String(minutes)
		const formattedSeconds = String(remainingSeconds).padStart(2, '0')		
		objects.invite_rating.text=formattedMinutes+":"+formattedSeconds	
			
	}
	
}

timer={

	t:0,
	prv_tm:0,
	sec_left:0,
	on_tick:()=>{},
	check_game_end:1,

	start({sec=30,check_game_end=1} = {}){

		if (opponent===bot){
			this.just_place()
			return
		}

		clearInterval(this.t)
		this.t=setInterval(()=>this.tick(),1000)
		this.sec_left=sec
		this.check_game_end=check_game_end
		this.prv_tm=Date.now()
		objects.timer_text.tint=objects.timer_text.base_tint
		this.update_text()
		this.on_tick=()=>{}

		this.just_place()

	},

	just_place(){

		objects.timer_cont.visible=true

		if (my_turn)
			objects.timer_cont.x=objects.my_card_cont.sx+objects.my_avatar.x+objects.my_avatar.width*0.5
		else
			objects.timer_cont.x=objects.opp_card_cont.sx+objects.opp_avatar.x+objects.opp_avatar.width*0.5

	},

	update_text(){

		objects.timer_text.text=(this.sec_left>9?'0:':'0:0')+Math.abs(this.sec_left)

	},

	stop(){

		clearInterval(this.t)

	},

	tick(){

		const tm=Date.now()
		if (tm-this.prv_tm>5000||tm<this.prv_tm){
			game.stop('timer_error');
		}
		this.prv_tm=tm

		this.sec_left--

		//обновляем текст на экране
		this.update_text()

		//событие
		this.on_tick(this.sec_left)

		//если не надо проверять
		if(!this.check_game_end) return

		//подсветка текста
		if (this.sec_left===5) {
			objects.timer_text.tint=0xff0000
			sound.play('clock')
		}
		
		
		
		if (this.sec_left === 0 && !my_turn){

			//my_log.add({e:'xxx',state,opp_uid:opp_data.uid,tm:Date.now()})
			//fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,data:{type:'XXX'},tm:Date.now()});
			online_player.forced_inbox_check()
		}

		if (this.sec_left < 0 && my_turn)	{

			if (online_player.me_conf_play)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');

			return;
		}

		if (this.sec_left < -5 && !my_turn) {

			if (online_player.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			return;
		}

	}

}

bot={

	chips:[],
	conf_resume:1,
	cur_score:0,
	tot_score:0,
	start_time:0,
	opp_conf_play:0,
	me_conf_play:0,
	start_move_timer:0,
	on:0,

	activate(){

		//устанавливаем локальный и удаленный статус
		set_state({state : 'b'})
		
		opp_data.name=['Бот','Bot'][LANG]
		opp_data.uid='bot'
		opp_data.rating=1400
		
		this.on=1
		
		anim2.add(objects.sbg_button,{x:[850,objects.sbg_button.sx]}, true, 0.25,'linear')

		//показываем и заполняем карточку оппонента
		opp_data.rating=1400
		objects.opp_card_cont.visible=true
		objects.opp_card_name.text=['Бот','Bot'][LANG]
		objects.opp_card_rating.text=1400
		objects.opp_avatar.avatar.texture=assets.pc_icon
		anim2.add(objects.opp_card_cont,{x:[800, objects.opp_card_cont.sx]}, true, 0.5,'linear')

		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		my_data.lose_rating = my_data.rating
		my_data.win_rating = my_data.rating
		
		opponent=this
		game.activate(this,irnd(1,9999),0)
		
		objects.timer_text.text='---'		
		objects.timer_cont.visible=true

	},
	
	start_move(){
		//бот делает ход
		if (!my_turn)
			this.try_make_move()
		
		this.reset_timer();
	},	

	send_move(data){

		if (data.type==='BAZAR'||data==='B'){
			//если базар пуст и нет хода
			if (!game.have_move(my_player.chips)){
				this.try_make_move();
				return;
			}
			return;
		}

		//бот проиграл
		if(!my_player.chips.length) return;

		//нет хода у бота
		if(!game.have_move(this.chips)) return;

		this.try_make_move()

	},

	async try_make_move(no_delay){

		//чуть ждем
		if (!no_delay){
			this.start_move_timer=setTimeout(()=>{this.try_make_move(1)},1000)
			return
		}

		if (anim2.any_on()){
			this.start_move_timer=setTimeout(()=>{this.try_make_move(1)},1000)
			return
		}

		//ищем кость которая может подойти куда-нибудь
		let fit_dw,fit_uw,empty_board,fit;
		const chip=this.chips.find(function(c){
			[fit_dw,fit_uw,empty_board,fit]=game.get_available_connects(c);
			return fit;
		})

		if (fit){
			if (empty_board){
				my_player.process_incoming_move({c:chip.v1+''+chip.v2,a:0});
			}else if(fit_dw){
				my_player.process_incoming_move({c:chip.v1+''+chip.v2,a:'dw'});
			}else if(fit_uw){
				my_player.process_incoming_move({c:chip.v1+''+chip.v2,a:'uw'});
			}

			//повторный ход
			if (!game.have_move(my_player.chips)){
				this.try_make_move()
				return;
			}

			return;
		}else{

			//если база пуст то пропускаем ход
			if(!bazar_chips.length) return
			my_player.process_incoming_move('B')
			this.try_make_move()
			return;

		}

	},

	have_move(){


	},

	reset_timer(){
		timer.just_place()
	},

	exit_btn_down(){

		if (anim2.any_on()||game.state!=='on'){
			sound.play('locked');
			return
		}

		game.stop('my_giveup')

	},

	round_fin(){

	},

	resume_game(){

		//тупо продолжаем и не ждем подтверждение от бота
		game.activate(opponent,s_random.seed+23,1)

	},

	stop(){
		
		this.on=0
		clearTimeout(this.start_move_timer)
		anim2.add(objects.sbg_button,{x:[objects.sbg_button.x,850]}, false, 0.25,'linear');		
		
	}

}

online_player={

	chips:bot.chips,
	timer:0,
	time_for_move:30,
	start_time:0,
	timer_prv_time:0,
	move_time_start:0,
	disconnect_time:0,
	opp_conf_play:0,
	me_conf_play:0,
	conf_resume:0,
	cur_score:0,
	tot_score:0,
	no_connection_timer:0,
	blind_game_flag:0,
	write_fb_timer:0,

	activate(seed,blind){
		//seed=650333
		//устанавливаем локальный и удаленный статус
		set_state({state:'p'});

		//фиксируем врему начала игры для статистики
		this.move_time_start=Date.now();

		this.me_conf_play=0
		this.opp_conf_play=0

		objects.game_buttons.visible=true
		objects.timer_cont.visible=true

		//время начала игры
		this.start_time=Date.now()
		
		this.blind_game_flag=blind||0
		objects.bcg.tint=blind?0xffaaaa:0xffffff
		
		//показываем и заполняем карточку оппонента
		const player_data=players_cache.players[opp_data.uid]
		opp_data.rating=player_data.rating
		objects.opp_card_cont.visible=true
		objects.opp_card_name.set2(player_data.name,110)
		objects.opp_card_rating.text=player_data.rating
		objects.opp_avatar.avatar.texture=players_cache.players[opp_data.uid].texture;
		anim2.add(objects.opp_card_cont,{x:[800, objects.opp_card_cont.sx]}, true, 0.5,'linear')

		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		my_data.lose_rating = this.calc_new_rating(my_data.rating, LOSE)
		my_data.win_rating = this.calc_new_rating(my_data.rating, WIN)
		my_data.draw_rating = this.calc_new_rating(my_data.rating, DRAW)
		fbs.ref('players/'+my_data.uid+'/rating').set(my_data.lose_rating)
		
		opponent=this
		
		//выключаем бота если открыт
		if (bot.on) bot.stop()
		
		//начинаем основное
		game.activate(this,seed,0)	

		
	},
	
	start_move(seed){
		
		const my_chips=my_player.chips.length?my_player.chips.map(c=>c.v1+''+c.v2).join(' '):'no_chips'
		const opp_chips=opponent.chips.length?opponent.chips.map(c=>c.v1+''+c.v2).join(' '):'no_chips'
		const b_chips=bazar_chips.length?bazar_chips.map(c=>c[0]+''+c[1]).join(' '):'no_chips'
		
		my_log.log_arr=[]
		my_log.add({e:'start',seed:seed||'no_seed',my_chips,opp_chips,b_chips,tm:Date.now()})
		
		//бот делает ход, в game.activate надо вызвать после определения очереди
		this.reset_timer()
		
		
	},	
	
	reset_timer(){
		//my_log.add({e:'reset_timer',tm:Date.now()})
		const game_confirmed=this.me_conf_play&&this.opp_conf_play
		timer.start({sec:game_confirmed?25:15})		
	},

	round_fin(){
		
		my_log.add({e:'round_fin',tm:Date.now()})
		timer.stop()
		this.conf_resume=0

	},

	send_move(data){

		//my_log.add({e:'out',...data,tm:Date.now()})
		this.me_conf_play=1

		//отправляем ход онайлн сопернику (с таймаутом)
		clearTimeout(this.write_fb_timer)
		this.write_fb_timer=setTimeout(function(){game.stop('my_no_connection')}, 8000);
		/*fbs.ref('inbox/'+opp_data.uid).set({message:'MOVE',sender:my_data.uid,data,tm:Date.now()}).then(()=>{
			clearTimeout(this.write_fb_timer)
		})*/
		
		fbs.ref('inbox/'+opp_data.uid).set({m:'M',s:my_data.uid.substring(0,8),d:data,tm:Date.now()}).then(()=>{
			clearTimeout(this.write_fb_timer)
		})

	},

	take_from_bazar(){

		my_log.add({e:'take_from_bazar',tm:Date.now()})
		//к сопернику приходят кости

		//добавляем с базара
		game.take_from_bazar('opp');

		//если базар пуст и нет хода
		if (!game.have_move(opponent.chips)&&!game.have_move(my_player.chips)){
			game.round_fin('fish')
			return
		}

		//если базар пуст и нет хода
		if (!game.have_move(opponent.chips)){
			my_turn=1;
			opponent.reset_timer()
			return
		}

	},

	game_btn_down(e){

		if (anim2.any_on()||game.state!=='on'){
			sound.play('locked');
			return
		};


		my_log.add({e:'game_btn_down',tm:Date.now()})
		let mx = e.data.global.x/app.stage.scale.x - objects.game_buttons.sx;
		let my = e.data.global.y/app.stage.scale.y - objects.game_buttons.sy;

		let buttons_pos = [this.stickers_button_pos, this.chat_button_pos, this.giveup_button_pos];

		let min_dist=999;
		let min_button=-1;

		for (let b = 0 ; b < 3 ; b++) {

			const anchor_pos = buttons_pos[b];
			const dx = mx-anchor_pos[0];
			const dy = my-anchor_pos[1];
			const d = Math.sqrt(dx * dx + dy * dy);

			if (d < 40 && d < min_dist) {
				min_dist = d;
				min_button_id = b;
			}
		}

		//подсветка кнопки
		if (min_button_id !== -1) {
			sound.play('click');
			objects.hl_main_button.x=buttons_pos[min_button_id][0]+objects.game_buttons.sx;
			objects.hl_main_button.y=buttons_pos[min_button_id][1]+objects.game_buttons.sy;
			anim2.add(objects.hl_main_button,{alpha:[1,0]}, false, 0.6,'linear',false);
		}


		if (min_button_id === 0)
			stickers.show_panel();
		if (min_button_id === 1)
			this.send_message();
		if (min_button_id === 2)
			this.exit_button_down();


	},

	async exit_button_down(){

		if (Date.now()-this.start_time<30000){
			message.add(['Нельзя сдаваться в начале игры','can nott give up at the beginning of the game'][LANG])
			return;
		}

		my_log.add({e:'exit_button_down',tm:Date.now()})
		const res = await confirm_dialog.show(['Сдаетесь?','Giveup?'][LANG]);
		if (res==='ok'&&game.state==='on'){
			fbs.ref('inbox/'+opp_data.uid).set({message:'END',sender:my_data.uid,tm:Date.now()});
			game.stop('my_giveup');
		}

	},

	async send_message(){

		if (anim2.any_on()||objects.stickers_cont.visible) {
			sound.play('locked');
			return
		};

		if (my_data.blocked){
			message.add('Вы в черном списке.');
			return;
		}

		
		const msg=await keyboard.read();

		//если есть данные то отправляем из сопернику
		if (msg) {
			my_log.add({e:'send_message',msg,tm:Date.now()})
			fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'CHAT',tm:Date.now(),data:msg})
			message.add(['Сообщение отправлено сопернику','Message was sent'][LANG])
		}

		//console.log(msg);

	},

	connection_change(on){
	
		my_log.add({e:'connection',on:on||'no_on',tm:Date.now()})
		clearInterval(this.no_connection_timer)
		if (on) return
		let no_con_time=0
		this.no_connection_timer=setInterval(()=>{
			no_con_time++
			if (no_con_time>=5&&game.state!=='off'){
				clearInterval(this.no_connection_timer)
				game.stop('my_no_connection')
			}

		},1000)
	},

	calc_new_rating(old_rating, game_result){

		if (game_result === NOSYNC)
			return old_rating;

		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));

	},

	async forced_inbox_check(){

		const opp_inbox_data=await fbs_once('inbox/'+opp_data.uid)||'noinbox'
		const my_inbox_data=await fbs_once('inbox/'+my_data.uid)||'noinbox'
		
		my_log.add({e:'opp_inbox',d:opp_inbox_data})
		my_log.add({e:'my_inbox',d:my_inbox_data})

	},

	resume_game(){

		my_log.add({e:'resume_game',tm:Date.now()})
		//нажали на продолжение и ждем от соперника
		my_turn=0
		timer.start({sec:15,check_game_end:1})
		timer.on_tick=(sec_left)=>{

			//получили подтверждение от соперника
			if (opponent.conf_resume){
				timer.stop()
				game.activate(opponent,s_random.seed+23,1)
			}

			//так и не получили подтверждение от соперника
			if (sec_left===0){
				timer.stop()
				game.stop('opp_timeout')
			}
		}

	},

	chat(data){

		message.add(data, 10000,'online_message');

	},

	stop(res){
		
		const my_chips=my_player.chips.length?my_player.chips.map(c=>c.v1+''+c.v2).join(' '):'no_chips'
		const opp_chips=opponent.chips.length?opponent.chips.map(c=>c.v1+''+c.v2).join(' '):'no_chips'
		
		my_log.add({e:'opp_timeout',my_chips,opp_chips,tm:Date.now()})
		clearTimeout(this.write_fb_timer)
/* 		if (res==='opp_timeout'&&my_data.rating>1700){
			fbs.ref('BAD_CASE/'+my_data.uid+'/'+game_id).set(my_log.log_arr)
		} */
	},

	close(){

	},

	clear(){

	}

}

my_player={

	chips:[],
	pending_chip:null,
	opp_conf_next:0,
	cur_score:0,
	tot_score:0,
	timeout:0,

	process_incoming_move(data){


		//ждем если еще не готово
		if (game.state!=='on'){
			this.timeout=setTimeout(function(){my_player.process_incoming_move(data)},250);
			return;
		}
		
		//if (opponent===online_player)
		//	my_log.add({e:'inc',data,tm:Date.now()})

		//соперник сделал ход
		online_player.opp_conf_play=1;

		if(data.type==='BAZAR'||data==='B'){
			game.take_from_bazar('opp');

			//если базар пуст и нет хода
			if (!game.have_move(opponent.chips)&&!game.have_move(my_player.chips)){
				game.round_fin('fish');
				return;
			}

			//если базар пуст и нет хода
			if (!game.have_move(opponent.chips))
				this.skip_move(opponent);

			return;
		}


		try {
			
			//opponent.send_move({с:chip.v1+''+chip.v2,a:anchor_to_send});
			
			if (data.c){
				data.v1=+data.c[0]
				data.v2=+data.c[1]
				data.anchor=data.a
			}
			
			const chip=opponent.chips.find(c=>c.v1===data.v1&&c.v2===data.v2)

			//получаем информацию о возможности коннекта
			const [fit_dw,fit_uw,empty_board,fit]=game.get_available_connects(data);

			//определяем как и куда ставить костяшку
			if(data.anchor){
				game.connect_to_side(chip,{'uw':game.uw_next_place,'dw':game.dw_next_place}[data.anchor]);
			}else if (empty_board){
				game.add_first_chip(chip);
			}else if(fit_dw){
				game.connect_to_side(chip,game.dw_ext_place);
			}else if(fit_uw){
				game.connect_to_side(chip,game.uw_ext_place);
			}

			//убираем костяшку и перераспределяем
			game.drop_chip('opp',chip);
			//throw new TypeError("oops");
						
		} catch(err){					
			my_log.add({d:'ERROR',tm:Date.now()})
			
		}


		//проверяем конец игры
		if(!opponent.chips.length){
			game.round_fin('opp_win');
			return;
		}

		if(!game.have_move(my_player.chips)&&!game.have_move(opponent.chips)){
			game.round_fin('fish');
			return;
		}

		if(!game.have_move(my_player.chips)){
			this.skip_move(my_player);
			return;
		}

		//меняем очередь и ход
		my_turn=1
		opponent.reset_timer()

	},

	skip_move(player){

		sound.play('skip')
		my_turn=1-(player===my_player)
		opponent.reset_timer()
		objects.skip_note.x=65+my_turn*670
		anim2.add(objects.skip_note,{alpha:[0,1]}, false, 3,'easeBridge',false)
	},

	try_make_move(chip,tar_anchor){
						
		if (game.state!=='on'||anim2.any_on()) return

		//получаем информацию о возможности коннекта
		[fit_dw,fit_uw,empty_board,fit]=game.get_available_connects(chip)

		//если нет коннекта или костяшка не моя
		if (!fit||!chip.mine||!my_turn) {
			sound.play('locked');
			anim2.add(chip,{x:[chip.x,chip.x+3]}, true, 0.15,'shake');
			return;
		}

		sound.play('domino2');
		//если нажали на ждущую костяшку то убираем ее
		if (chip===this.pending_chip&&!tar_anchor){
			this.pending_chip=0;
			return;
		}

		//если анкоры остались
		if (objects.dw_anchor.visible)
			game.hide_anchors()

		//если есть выбор к какому концу ставить
		const same_place=game.dw_next_place.val===game.uw_next_place.val;
		if (fit_dw&&fit_uw&&!empty_board&&!tar_anchor&&!same_place){
			this.pending_chip=chip;
			game.show_next(chip);
			return;
		}

		//определяем как и куда ставить костяшку
		let anchor_to_send=''
		if(tar_anchor){
			game.hide_anchors()
			game.connect_to_side(chip,tar_anchor)
			this.pending_chip=0
			anchor_to_send=tar_anchor===game.dw_next_place?'dw':'uw'
		}else if (empty_board){
			game.add_first_chip(chip)
		}else if(fit_dw){
			game.connect_to_side(chip,game.dw_next_place)
			anchor_to_send='dw'
		}else if(fit_uw){
			game.connect_to_side(chip,game.uw_next_place)
			anchor_to_send='uw'
		}

		//убираем мою костяшку и перераспределяем
		game.drop_chip('my',chip);

		//отправляем данные сопернику
		//нужно заменить на 
		opponent.send_move({c:chip.v1+''+chip.v2,a:anchor_to_send})
		//opponent.send_move({v1:chip.v1,v2:chip.v2,type:'CHIP',anchor:anchor_to_send});
		//console.log(anchor_to_send)

		my_turn=0
		opponent.reset_timer()
		
		//если у соперника нет ход, но есть на базаре, то берем сразу с базара
		

		//проверка выигрыша
		if (!my_player.chips.length){
			game.round_fin('my_win');
			return;
		}

		//если рыба
		if(!game.have_move(my_player.chips)&&!game.have_move(opponent.chips)){
			game.round_fin('fish');
			return;
		}

		//если у соперника нет хода
		if (!game.have_move(opponent.chips)){
			this.skip_move(opponent)
			return
		}

	},

	take_from_bazar(){

		if (anim2.any_on()||game.state!=='on'||!my_turn){
			sound.play('locked');
			return
		};

 		//если и так есть чем ходить
		if (game.have_move_to_go(my_player.chips)){

			anim2.add(objects.bazar_button_cont,{x:[objects.bazar_button_cont.x,objects.bazar_button_cont.x+3]}, true, 0.15,'shake');
			sound.play('locked');
			return;
		} 

		//добавляем с базара
		const res=game.take_from_bazar('my');
				
		
		if(res) opponent.send_move('B')
		//if(res) opponent.send_move({type:'BAZAR'});
		
		//если базар пуст и нет хода
		if (!game.have_move(opponent.chips)&&!game.have_move(my_player.chips)){
			game.round_fin('fish');
			return;
		}

		//если базар пуст и нет хода
		if (!game.have_move(my_player.chips)){
			my_turn=0;
			opponent.reset_timer();
		}



	},

	send_message(){



	}

}

s_random={

	prv_val:1,
	seed:0,
	
	set_version(v){
	
		if (v===1){
			this.get=this.get2
		}else{
			this.get=this.get_old
		}
		
	},

	make_seed(v){

		this.prv_val=v;
		this.seed=v;
	},

	get(){

		this.prv_val=Math.round(Math.sin(this.prv_val*313.249)*1000);
		return this.prv_val;
	},

	get2(){

		this.prv_val=(9301 * this.prv_val + 49297) % 233280;
		return this.prv_val;
	},
	
	get_old(){

		this.prv_val=Math.round(Math.sin(this.prv_val*313.249)*1000);
		return this.prv_val;
	},
	
	
}

game={

	uw_next_place:{},
	dw_next_place:{},
	lines:[],
	state:'off',
	round:0,
	SHADOW_DISP_XY:{'0':[3,3],'90':[3,-3],'-90':[-3,3],'180':[-3,-3]},

	activate(opp,seed,resume) {

		objects.bcg.texture=pref.get_game_texture()
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.5,'linear')
		//seed=954253
		//не случайный сид
		s_random.make_seed(seed)

		//создаем значения костей и рандомизируем их
		const dominoes_vals = [];
		for (let i = 0; i <= 6; i++)
			for (let j = i; j <= 6; j++)
				dominoes_vals.push([i,j,s_random.get()]);

		dominoes_vals.sort((a,b)=>a[2]-b[2])

		bazar_chips=dominoes_vals.slice(14,28);
		//bazar_chips=[];

		this.lines=[0,0,0,0,0,1,0,0,0,0];

		this.dw_next_place={val:-1,chip:0,line_dir:1,line_next_turn:{5:'DOWN',6:'LEFT',7:'DOWN',8:'RIGHT',9:'DOWN'}}
		this.uw_next_place={val:-1,chip:0,line_dir:-1,line_next_turn:{5:'UP',4:'RIGHT',3:'UP',2:'LEFT',1:'UP'}}

		//скрываем все доминошки
		;[...objects.my_chips,...objects.opp_chips].forEach(d=>d.visible=false)

		//делим кости в зависимости от того кто позвал в игру
		//мои кости
		my_player.chips=[];
		for (let i=0;i<7;i++){
			const d=objects.my_chips[i]
			d.set(dominoes_vals[i+(1-IAM_CALLED)*7][0],dominoes_vals[i+(1-IAM_CALLED)*7][1])			
			d.visible=true
			d.show_values()
			d.y=0
			d.x=objects.my_chips[i].tx=i*40
			d.mine=1
			my_player.chips.push(d)
		}

		//кости соперника
		opp.chips=[]
		for (let i=0;i<7;i++){
			const d=objects.opp_chips[i]
			d.set(dominoes_vals[i+IAM_CALLED*7][0],dominoes_vals[i+IAM_CALLED*7][1])
			d.visible=true
			d.hide_values()
			d.y=45
			d.x=objects.opp_chips[i].tx=i*40
			d.mine=0
			opp.chips.push(d)
		}

		//определяем чья очередь
		const my_check_val=this.getMaxSum(objects.my_chips.filter(c=>c.visible))*10
		const opp_check_val=this.getMaxSum(objects.opp_chips.filter(c=>c.visible))*10

		if (my_check_val>opp_check_val)
			my_turn=1
		if (my_check_val<opp_check_val)
			my_turn=0
		if (my_check_val===opp_check_val)
			my_turn=IAM_CALLED
		
		//console.log({my_check_val,opp_check_val,my_turn})

		//показываем и заполняем мою карточку
		objects.my_card_cont.visible=true
		objects.my_card_name.set2(my_data.name,110)
		objects.my_card_rating.text=my_data.rating
		objects.my_avatar.avatar.texture=players_cache.players[my_data.uid].texture
		anim2.add(objects.my_card_cont,{x:[-100, objects.my_card_cont.sx]}, true, 0.5,'linear')

		//если это начало игры
		if(!resume){

			//если открыт лидерборд то закрываем его
			if (objects.lb_1_cont.visible) lb.close()

			//если открыт чат то закрываем его
			if (objects.chat_cont.visible) chat.close()
				
			//если открыт чат то закрываем его
			if (objects.big_msg_cont.visible) big_msg.close()

			//устанавливаем начальные позиции в окне
			;[my_player,opponent].forEach(p=>{
				p.cur_score=p.tot_score=0
				big_msg.draw_score(p,0)
			})

			this.round=0
		}

		objects.opp_chips_cont.y=0
		objects.my_chips_cont.scale_xy=1

		game.align_chips_cont('my')
		game.align_chips_cont('opp')

		objects.t_my_score.text=my_player.cur_score
		objects.t_opp_score.text=opponent.cur_score

		//ждем немнго пока все загрузится
		setTimeout(function(){game.state='on'},1000)

		//остальные доминошки
		for (let i=0;i<28;i++){
			objects.my_chips[i].scale_xy=0.7
			objects.opp_chips[i].scale_xy=0.7
			objects.game_chips[i].bcg.tint=0xffffff
			objects.game_chips[i].y=700
			objects.game_chips[i].x=400
			objects.game_chips[i].visible=false
			objects.game_chips[i].set(dominoes_vals[i][0],dominoes_vals[i][1])
		}

		sound.play('note')

		//количество костей на базаре
		objects.t_bazar_cnt.text=bazar_chips.length
		anim2.add(objects.bazar_button_cont,{x:[900, objects.bazar_button_cont.sx]}, true, 0.3,'linear')
		
		//полка костей соперника
		objects.opp_chips_shelf.visible=true
		objects.opp_chips_mask.visible=true
		objects.opp_chips_cont.mask=objects.opp_chips_mask
		
		opponent.start_move(seed)
		this.update_round()
		this.update_cards()

	},
	
	async update_round(){
		
		objects.t_round.x=400
		objects.t_round.y=225
		objects.t_round.text=['Раунд ','Round '][LANG]+(++this.round)
		objects.t_round.tint=objects.t_round.base_tint
		await anim2.add(objects.t_round,{alpha:[0,1]}, true, 2,'linear')
		await anim2.add(objects.t_round,{x:[400,64],y:[225,226]}, true, 0.25,'easeOutBack')
		objects.t_round.tint=0xffffff
		
	},
	
	update_cards(){
		//просто обновляем альфы карточек в зависимости от текущих ходов
		if (!objects.opp_card_cont.ready||!objects.my_card_cont.ready){
			setTimeout(()=>game.update_cards(),250)
			return
		}
		
		if (my_turn){
			anim2.add(objects.opp_card_cont,{alpha:[1,0.5]}, true, 0.25,'linear')
			anim2.add(objects.my_card_cont,{alpha:[0.5,1]}, true, 0.25,'linear')
		}else{
			anim2.add(objects.opp_card_cont,{alpha:[0.5,1]}, true, 0.25,'linear')
			anim2.add(objects.my_card_cont,{alpha:[1,0.5]}, true, 0.25,'linear')
		}
	},

	getMaxSum(arr) {
		let maxSum = 0;
		for (let i = 0; i < arr.length; i++) {

			const chip1=arr[i].v1;
			const chip2=arr[i].v2;
			let currentSum = chip1+chip2+(chip1===chip2)*(chip1*100);
			if (currentSum > maxSum)
				maxSum = currentSum;
		}
		return maxSum;
	},

	align_chips_cont(p){

		const player=p==='my'?my_player:opponent
		const cur_x=objects[p+'_chips_cont'].x
		const tar_x=400-40*(player.chips.length-1)*0.5
		anim2.add(objects[p+'_chips_cont'],{x:[cur_x,tar_x]}, true, 0.25,'linear')

		const tar_map={
			15:{s:0.95,x:120},
			16:{s:0.92,x:100},
			17:{s:0.9,x:70},
			18:{s:0.89,x:50},
			19:{s:0.85,x:45},
			20:{s:0.82,x:35},
			21:{s:0.8,x:25}
		}
		const tar_scale=tar_map[my_player.chips.length]?.s||1
		const tar_x2=tar_map[my_player.chips.length]?.x||140

		if(my_player.chips.length>14)
			anim2.add(objects.my_chips_cont,{scale_xy:[objects.my_chips_cont.scale_xy,tar_scale],x:[objects.my_chips_cont.x,tar_x2]}, true, 0.25,'linear')
		else{
			if(objects.my_chips_cont.scale_xy!==1)
				anim2.add(objects.my_chips_cont,{scale_x:[objects.my_chips_cont.scale_xy,1],x:[objects.my_chips_cont.x,tar_x2]}, true, 0.25,'linear')
		}

	},

	take_from_bazar(p){

		if (!bazar_chips.length){
			sound.play('locked');
			return;
		}

		sound.play('bazar');

		//берем костящку из базара
		const chip=bazar_chips.pop();

		//обновляем инфу
		objects.t_bazar_cnt.text=bazar_chips.length;

		//ищем свободный спрайт
		const new_chip=objects[p+'_chips'].find(chip=>!chip.visible);
		if(!new_chip){
			alert('Не нашли...');
			return;
		}

		//добавляем костяшку на экран
		const chips=p==='my'?my_player.chips:opponent.chips;
		const move_y_data=p==='my'?[100,0]:[-100,45];

		new_chip.set(chip[0],chip[1]);
		new_chip.mine=+(p==='my');
		new_chip.x=chips.length*40;
		chips.push(new_chip);
		if (p==='my')
			new_chip.show_values()
		else
			new_chip.hide_values()

		anim2.add(new_chip,{y:move_y_data}, true, 0.25,'linear');

		//обновляем мой контейнер
		this.align_chips_cont(p);

		return 1;

	},

	drop_chip(p,chip){

		const player=p==='my'?my_player:opponent
		const tar_y=p==='my'?500:-100;

		player.chips=player.chips.filter(c=>c!==chip)

		//размещаем кости чтобы не было пустот
		let iter=0;
		for (let i=0;i<player.chips.length;i++){
			const d=player.chips[i];
			const tar_x=iter*40;
			iter++;
			anim2.add(d,{x:[d.x,tar_x]}, true, 0.25,'linear');
		}

		//убираем кость
		anim2.add(chip,{y:[chip.y,tar_y]}, false, 0.25,'linear');

		//обновляем мой контейнер
		this.align_chips_cont(p);

	},

	stop(result){

		this.state='off'
		big_msg.total_stop(result)
		
	},

	close(){

		//основные элементы игры
		objects.timer_cont.visible=false
		anim2.add(objects.my_card_cont,{x:[objects.my_card_cont.x,-100]}, false, 0.5,'linear')
		anim2.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,800]}, false, 0.5,'linear')

		objects.opp_chips_cont.visible=false
		objects.my_chips_cont.visible=false
		objects.game_chips_cont.visible=false

		objects.game_buttons.visible=false
		objects.sbg_button.visible=false
		objects.bazar_button_cont.visible=false

		objects.t_round.visible=false

		//полка костей соперника и маска
		objects.opp_chips_shelf.visible=false
		objects.opp_chips_mask.visible=false
		
		objects.bcg.tint=0xffffff

		set_state({state:'o'});

	},

	round_fin(res){

		const my_score=this.count_score(opponent.chips)
		const opp_score=this.count_score(my_player.chips)

		//если рыба
		if (my_score>opp_score)
			big_msg.round_stop(my_player,my_score-opp_score,res)
		else
			big_msg.round_stop(opponent,opp_score-my_score,res)

		opponent.round_fin()

		this.state='round_fin'

		this.adjust_screen_center(0,300)
		this.open_opp_chips()

	},

	get_available_connects(chip){
		const fit_dw=chip.v1===this.dw_next_place.val||chip.v2===this.dw_next_place.val;
		const fit_uw=chip.v1===this.uw_next_place.val||chip.v2===this.uw_next_place.val
		const empty_board=this.dw_next_place.val===-1;
		const fit=fit_dw||fit_uw||empty_board;
		return [fit_dw,fit_uw,empty_board,fit]
	},

	adjust_screen_center(w,h){

		let left=9999;
		let right=-9999;
		let top=9999;
		let bottom=-9999;
		let dom_x,dom_y,half_w,half_h;

		[objects.dw_anchor,objects.uw_anchor,...objects.game_chips].forEach(d=>{

			if (d.visible){

				dom_x=d.tx||d.x;
				dom_y=d.ty||d.y;

				if (d.tar_ang===0||d.tar_ang===180){
					half_w=shift_w*0.5;
					half_h=shift_h*0.5;
				}else{
					half_w=shift_h*0.5;
					half_h=shift_w*0.5;
				}

				if (dom_x+half_w>right)
					right=dom_x+half_w;

				if (dom_y+half_h>bottom)
					bottom=dom_y+half_h;

				if (dom_x-half_w<left)
					left=dom_x-half_w;

				if (dom_y-half_h<top)
					top=dom_y-half_h;
			}
		})

		const cen_x=(right+left)*0.5;
		const cen_y=(bottom+top)*0.5;
		const width=120+right-left;
		const height=120+bottom-top;

		const tar_scale_x=(w||630)/width;
		const tar_scale_y=(h||350)/height;
		let tar_scale=Math.min(tar_scale_x,tar_scale_y);
		if(tar_scale>1) tar_scale=1;

		const scr_tx=DOMINO_CEN_X-cen_x*tar_scale;
		const scr_ty=DOMINO_CEN_Y-cen_y*tar_scale;

		anim2.add(objects.game_chips_cont,{scale_xy:[objects.game_chips_cont.scale_xy,tar_scale],x:[objects.game_chips_cont.x,scr_tx],y:[objects.game_chips_cont.y,scr_ty]}, true, 0.5,'linear');


	},

	connect_to_side(chip, side){

		//находим кость в игровых костях
		const next_chip=objects.game_chips.find(c=>c.v1===chip.v1&&c.v2===chip.v2);

		//параметры расположения следующей костящки
		const cur_chip=side.chip
		const cur_line_id=cur_chip.line
		const cur_line_or=['HORLINE','VERLINE'][+(cur_chip.angle%180===0)]
		const cur_chip_type=['NOR','DUB'][cur_chip.double]
		const cur_dir=side.dir
		const cur_line_len=this.lines[cur_line_id]

		//
		let connect_val, other_val, connect_index
		if (chip.v1===side.val)
			[connect_val,other_val,connect_index]=[chip.v1,chip.v2,0]
		else
			[connect_val,other_val,connect_index]=[chip.v2,chip.v1,1]


		const next_chip_type=['NOR','DUB'][chip.double]
		const max_line_len=[1,8][cur_line_id%2]
		next_dir=cur_dir
		let turn_flag=0
		if (cur_line_len>=max_line_len){
			//кость-поворот
			const new_dir=side.line_next_turn[cur_line_id];
			next_dir=cur_dir+'_'+new_dir;
			side.dir=new_dir;
			turn_flag=1;
		}

		//определяем параметры коннекта
		const connect_data=map_next_place[cur_line_or][cur_chip_type][next_dir][next_chip_type]


		//позиционные показатели следующей костяшки
		next_chip.tx=cur_chip.x+connect_data.dx
		next_chip.ty=cur_chip.y+connect_data.dy
		next_chip.tar_ang=connect_data.ang[connect_index]

		//параметры коннекта новой кости
		side.val=other_val
		side.chip=next_chip

		//начало движения в пространстве игрового контейнера
		const tsx=(400-objects.game_chips_cont.x)/objects.game_chips_cont.scale_xy
		const tsy=(540-objects.game_chips_cont.y)/objects.game_chips_cont.scale_xy

		//наконец ставим костяшку на место
		anim2.add(next_chip,{x:[tsx,next_chip.tx],y:[chip.mine?tsy:-tsy,next_chip.ty],angle:[next_chip.angle,next_chip.tar_ang]}, true, 0.25,'linear').then(()=>{
			sound.play('domino');
		});

		//определяем линию следующей костяшки и если это поворот переводим ее на следующую
		if (turn_flag)
			next_chip.line=cur_chip.line+side.line_dir;
		else
			next_chip.line=cur_chip.line

		//обноваляем количество костей в линии
		if (!(next_chip_type==='DUB'&&turn_flag))
			this.lines[next_chip.line]++;

		//сразу поворачиваем тень чтобы правильно стяла
		next_chip.shadow.x=SHADOW_DISP_XY[next_chip.tar_ang][0];
		next_chip.shadow.y=SHADOW_DISP_XY[next_chip.tar_ang][1];

		//обновляем вид
		game.adjust_screen_center();
	},

	add_first_chip(chip){

		const line_orientation='HORLINE'
		const chip_type=['NOR','DUB'][chip.double];

		//находим кость в игровых костях
		const tar_chip=objects.game_chips.find(c=>c.v1===chip.v1&&c.v2===chip.v2);

		tar_chip.tx=DOMINO_CEN_X;
		tar_chip.ty=DOMINO_CEN_Y;
		tar_chip.line=5;

		this.uw_next_place.data=map_next_place[line_orientation][chip_type]['LEFT'];
		this.uw_next_place.val=chip.v2;
		this.uw_next_place.chip_type=chip_type;
		this.uw_next_place.dir='LEFT';
		this.uw_next_place.chip=tar_chip;

		this.dw_next_place.data=map_next_place[line_orientation][chip_type]['RIGHT'];
		this.dw_next_place.val=chip.v1;
		this.dw_next_place.chip_type=chip_type;
		this.dw_next_place.dir='RIGHT';
		this.dw_next_place.chip=tar_chip;

		const tar_ang=[90,0][+tar_chip.double];

		anim2.add(tar_chip,{x:[tar_chip.x,tar_chip.tx],y:[chip.mine?500:-100,tar_chip.ty],angle:[tar_chip.angle,tar_ang]}, true, 0.25,'linear').then(()=>{
			sound.play('domino');
		});

		tar_chip.shadow.x=this.SHADOW_DISP_XY[tar_ang][0];
		tar_chip.shadow.y=this.SHADOW_DISP_XY[tar_ang][1];

		//обновляем вид
		game.adjust_screen_center();
	},

	dw_anchor_down(){

		my_player.try_make_move(my_player.pending_chip,game.dw_next_place);

	},

	uw_anchor_down(){

		my_player.try_make_move(my_player.pending_chip,game.uw_next_place);

	},

	show_next(next_chip){

		for (let side of [this.dw_next_place,this.uw_next_place]){

			//параметры расположения следующей костящки
			const cur_chip=side.chip;
			const cur_line_id=cur_chip.line;
			const cur_line_or=['HORLINE','VERLINE'][+(cur_chip.angle%180===0)]
			const cur_chip_type=['NOR','DUB'][cur_chip.double];
			const cur_dir=side.dir;
			const cur_line_len=this.lines[cur_line_id];

			const next_chip_type=['NOR','DUB'][next_chip.double];
			const max_line_len=[1,8][cur_line_id%2]
			let next_dir=cur_dir;
			if (cur_line_len>=max_line_len){
				//поворот
				const new_dir=side.line_next_turn[cur_line_id];
				next_dir=cur_dir+'_'+new_dir;
			}
			//определяем параметры коннекта
			const connect_data=map_next_place[cur_line_or][cur_chip_type][next_dir][next_chip_type];

			let next_place_sprite=side===this.dw_next_place?objects.dw_anchor:objects.uw_anchor;

			//позиционные показатели следующей костяшки
			next_place_sprite.x=cur_chip.x+connect_data.dx;
			next_place_sprite.y=cur_chip.y+connect_data.dy;
			next_place_sprite.angle=connect_data.ang[1-(next_chip.v1===side.val)];
			next_place_sprite.visible=true;

		}

		this.adjust_screen_center();
	},

	hide_anchors(){

		objects.dw_anchor.visible=false;
		objects.uw_anchor.visible=false;

	},

	have_move(chips){

		if(bazar_chips.length)
			return true;

		for (let chip of chips){
			[fit_dw,fit_uw,empty_board,fit]=this.get_available_connects(chip);
			if (fit) return true;
		}
		return false;
	},

	have_move_to_go(chips){

		//если есть фишка чем ходить

		for (let chip of chips){
			[fit_dw,fit_uw,empty_board,fit]=this.get_available_connects(chip);
			if (fit) return true;
		}
		return false;
	},

	count_score(chips){

		let sum=0;
		for (let chip of chips)
			sum+=(chip.v1+chip.v2);
		return sum;

	},

	open_opp_chips(){

		if (!opponent.chips.length) return;
		for (let chip of opponent.chips)
			chip.show_values();
		objects.opp_chips_cont.mask=null
		objects.opp_chips_shelf.visible=false;
		objects.opp_chips_mask.visible=false;

		//anim2.add(objects.opp_chips_cont,{y:[0,60]}, true, 0.25,'linear');
	}

}

top3={
	
	async activate(path){
		
		const top3=await my_ws.get(path||'day_top3')
		if(!top3) return
		const uids=Object.keys(top3)
		if (uids.length!==3) return
		
		const sorted_top3 = Object.entries(top3).sort((a, b) => b[1] - a[1])
		const ordered_uids = [sorted_top3[1][0], sorted_top3[0][0], sorted_top3[2][0]]
		
		await players_cache.update(ordered_uids[0])		
		objects.day_top3_name1.set2(players_cache.players[ordered_uids[0]].name,145)
		
		await players_cache.update(ordered_uids[1])		
		objects.day_top3_name2.set2(players_cache.players[ordered_uids[1]].name,145)
		
		await players_cache.update(ordered_uids[2])
		objects.day_top3_name3.set2(players_cache.players[ordered_uids[2]].name,145)
			
				
		await players_cache.update_avatar(ordered_uids[0])		
		objects.day_top3_avatar1.set_texture(players_cache.players[ordered_uids[0]].texture)
		
		await players_cache.update_avatar(ordered_uids[1])		
		objects.day_top3_avatar2.set_texture(players_cache.players[ordered_uids[1]].texture)
		
		await players_cache.update_avatar(ordered_uids[2])
		objects.day_top3_avatar3.set_texture(players_cache.players[ordered_uids[2]].texture)
		
		objects.day_top3_lights1.text=top3[ordered_uids[0]]
		objects.day_top3_lights2.text=top3[ordered_uids[1]]
		objects.day_top3_lights3.text=top3[ordered_uids[2]]
		
		some_process.top3_anim=()=>{this.process()}
		sound.play('top3')
		anim2.add(objects.day_top3_cont,{alpha:[0, 1]}, true, 0.5,'linear');
		
						
	},
	
	process(){
		
		objects.day_top3_sunrays.rotation+=0.01
		
	},
	
	close(){
		
		if (anim2.any_on()) {
			sound.play('locked')
			return
		}
		
		anim2.add(objects.day_top3_cont,{alpha:[1, 0]}, false, 0.5,'linear');
		
		
	}	
	
}

pref={

	bcg_loader:null,
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	avatar_changed:0,
	name_changed:0,
	tex_loading:0,
	hours_to_nick_change:999,
	hours_to_photo_change:999,

	activate(){

		//устанавливаем текущий скин
		this.select_skin(objects.skins[my_data.skin_id]);

		//определяем доступные скиниы
		for (let i in SKINS_DATA){
			const rating_req=SKINS_DATA[i].rating;
			const games_req=SKINS_DATA[i].games;
			const av=my_data.rating>=rating_req&&my_data.games>=games_req;
			objects.skins[i].lock.visible=!av;
		}

		//устанавливаем текущий фон
		this.select_bcg(objects.bcgs[my_data.bcg_id]);

		//определяем доступные скины
		for (let i in BCG_DATA){
			const rating_req=BCG_DATA[i].rating;
			const games_req=BCG_DATA[i].games;
			const av=my_data.rating>=rating_req&&my_data.games>=games_req;
			objects.bcgs[i].lock.visible=!av;
		}

		//пока ничего не изменено
		this.avatar_changed=0;
		this.name_changed=0;

		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260)
		objects.pref_avatar.set_texture(players_cache.players[my_data.uid].texture)

		//мои данные
		objects.pref_rating.text=my_data.rating
		objects.pref_games.text=['Игры: ','Games: '][LANG]+my_data.games	
		
		//информация о бонусах
		objects.pref_crystals_info.text=my_data.crystals
		objects.pref_energy_info.text=my_data.energy
		
		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999)

		//обновляем кнопки
		this.update_buttons()

	},

	init(){

		let i=0
		setInterval(()=>{
			
			if(i===25) this.update_server_tm()
			if(i===3) this.check_crystals2()
			if(i===6) this.check_energy2()

			i = (i + 1) % 60
			
		},1000)
		
	},

	change_crystals(amount){
		
		my_data.crystals+=amount
		if (my_data.crystals>120) my_data.crystals=120
		if (my_data.crystals<0) my_data.crystals=0
		
		objects.pref_crystals_info.text=my_data.crystals
		fbs.ref('players/'+my_data.uid+'/crystals').set(my_data.crystals)	
		
	},
	
	change_energy(amount){
		
		if (amount===0) return
						
		my_data.energy+=amount		
		objects.pref_energy_info.text=my_data.energy
		safe_ls('domino_energy',my_data.energy)
			
		//отправляем в топ3		
		my_ws.safe_send({cmd:'top3',path:'_day_top3',val:{uid:my_data.uid,val:my_data.energy}})

	},

	getHoursEnding(hours) {
		hours = Math.abs(hours) % 100;
		let lastDigit = hours % 10;

		if (hours > 10 && hours < 20) {
			return 'часов';
		} else if (lastDigit == 1) {
			return 'час';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа';
		} else {
			return 'часов';
		}
	},

	update_server_tm(){

		//тупо обновляем время
		my_ws.get_tms().then(t=>{
			SERVER_TM=t||SERVER_TM
		})

	},
			
	check_energy2(){
		
		//нужно удалит первую версию
		
		if(!SERVER_TM) return
		const prv_tm=safe_ls('domino_energy_prv_tm')
		
		const cur_msk_day=+new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		const prv_msk_day=+new Date(prv_tm).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		
		if (cur_msk_day!==prv_msk_day){			
			
			//день поменялся начинаем заново
			my_data.energy=0		
			objects.pref_energy_info.text=my_data.energy
			safe_ls('domino_energy',my_data.energy)		

			//обновляем уникальных соперников (начиниаем с начала)
			//mp_game.unique_opps=[]
			//safe_ls(game_name+'_uo', mp_game.unique_opps)
			
		}	

		safe_ls('domino_energy_prv_tm',SERVER_TM)
	
	},
	
	check_crystals2(){		
				
		if(!SERVER_TM) return
		
		//если нет данных (новый игрок)
		if (!my_data.c_prv_tm) {
			my_data.c_prv_tm=SERVER_TM
			fbs.ref('players/'+my_data.uid+'/c_prv_tm').set(SERVER_TM)
			return
		}			
			
		const d=SERVER_TM-my_data.c_prv_tm
		const int_passed=Math.floor(d/(1000*60*60))
		if (int_passed>0){

			this.change_crystals(-int_passed)	

			//уменьшаем только для рейтинговых игроков
			if (my_data.rating>MAX_NO_CONF_RATING){	
								
				//закончились монеты
				if (my_data.crystals<=0){	
					message.add(`У вас закончились кристаллы. Ваш рейтинг понижен до ${MAX_NO_CONF_RATING}`,6000)
					my_data.rating=MAX_NO_CONF_RATING
					fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating)
				}
			}
			
			my_data.c_prv_tm=SERVER_TM
			fbs.ref('players/'+my_data.uid+'/c_prv_tm').set(SERVER_TM)
		}		
	},	
	
	energy_down(e){
		return
		if (anim2.any_on()){
			sound.play('locked')
			return			
		}
		
		const mx = e.data.global.x/app.stage.scale.x
		if (mx<670)
			top3.activate()
	},

	update_buttons(){

		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((')
			return
		}

		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.avatar_tm)*0.001/3600));

		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!SERVER_TM)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;

	},

	check_time(last_time){


		//провряем можно ли менять
		const tm=Date.now();
		const days_since_nick_change=~~((tm-last_time)/86400000);
		const days_befor_change=30-days_since_nick_change;
		const ln=days_befor_change%10;
		const opt=[0,5,6,7,8,9].includes(ln)*0+[2,3,4].includes(ln)*1+(ln===1)*2;
		const day_str=['дней','дня','день'][opt];

		if (days_befor_change>0){
			this.send_info([`Поменять можно через ${days_befor_change} ${day_str}`,`Wait ${days_befor_change} days`][LANG])
			sound.play('locked');
			return 0;
		}

		return 1;
	},

	send_info(t){
		objects.pref_info.text=t
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);
	},

	skin_down(skin){

		const rating_req=SKINS_DATA[skin.skin_id].rating;
		const games_req=SKINS_DATA[skin.skin_id].games;

		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			anim2.add(skin.lock,{angle:[skin.lock.angle,skin.lock.angle+10]}, true, 0.15,'shake')
			this.send_info([`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG])
			sound.play('locked');
			return;
		}

		sound.play('click2');
		this.select_skin(skin);
	},

	bcg_down(bcg){

		const rating_req=BCG_DATA[bcg.id].rating;
		const games_req=BCG_DATA[bcg.id].games;

		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			anim2.add(bcg.lock,{angle:[bcg.lock.angle,bcg.lock.angle+10]}, true, 0.15,'shake')
			this.send_info([`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG])
			sound.play('locked');
			return;
		}

		sound.play('click2');
		this.select_bcg(bcg);
	},

	get_game_texture(){

		return this.bcg_loader?.resources['bcg'+my_data.bcg_id]?.texture||assets.bcg;

	},

	select_skin(skin){
		my_data.skin_id=skin.skin_id;
		objects.selected_skin.x=skin.x;
		objects.selected_skin.y=skin.y;
	},

	select_bcg(bcg){
		my_data.bcg_id=bcg.id;
		objects.selected_bcg.x=bcg.x-10;
		objects.selected_bcg.y=bcg.y-10;
	},

	music_switch_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		music.switch();
		sound.play('click3');
		const tar_x=music.on?119:80;//-39
		anim2.add(objects.music_slider,{x:[objects.music_slider.x,tar_x]}, true, 0.1,'linear');

	},

	sound_switch_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		sound.switch();
		sound.play('click3');
		const tar_x=sound.on?280:241;//-39
		anim2.add(objects.sound_slider,{x:[objects.sound_slider.x,tar_x]}, true, 0.1,'linear');

	},

	ok_btn_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		sound.play('close_it');

		if (this.avatar_changed){

			fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);

			my_data.avatar_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/avatar_tm`).set(SERVER_TM);

			//обновляем аватар в кэше
			players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
				const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
				my_card.avatar.set_texture(players_cache.players[my_data.uid].texture);
			})

		}

		if (this.name_changed){

			my_data.name=this.name_changed;

			//обновляем мое имя в разных системах
			set_state({});

			my_data.nick_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);

		}


		this.switch_to_lobby();
		fbs.ref('players/'+my_data.uid+'/skin_id').set(my_data.skin_id);
		fbs.ref('players/'+my_data.uid+'/bcg_id').set(my_data.bcg_id);

		this.update_bcg();

		[...objects.my_chips,...objects.opp_chips,...objects.game_chips].forEach(chip=>{
			chip.set_skin(my_data.skin_id);
		})

	},

	async reset_avatar_down(){

		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked')
			return;
		}

		this.avatar_changed=1;
		this.cur_pic_url=my_data.orig_pic_url;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
		this.send_info(['Нажмите ОК чтобы сохранить','Press OK to confirm'][LANG])

	},

	async arrow_down(dir){

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked')
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked')
			return;
		}

		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache.players[my_data.uid].pic_url
			this.avatar_changed=0
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur
			this.avatar_changed=1
		}

		this.tex_loading=1
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url))
		objects.pref_avatar.set_texture(t)
		this.tex_loading=0

	},

	async update_bcg(){

		if (!this.bcg_loader) this.bcg_loader=new PIXI.Loader();

		//если базовая текстура выбрана которая идет в комплекте с loadlist
		if (!my_data.bcg_id){
			if (game.state==='on') objects.bcg.texture=assets.bcg;
			return;
		}

		const res_name='bcg'+my_data.bcg_id;
		if (!this.bcg_loader.resources[res_name]){
			this.bcg_loader.add(res_name,'bcg/bcg'+my_data.bcg_id+'.jpg');
			await new Promise(resolve=>pref.bcg_loader.load(resolve));
		}

		if (game.state==='on') objects.bcg.texture=this.bcg_loader.resources[res_name].texture;
	},

	async change_name_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		const rating_req=1450
		const games_req=50

		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			this.send_info([`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG])
			sound.play('locked');
			return;
		}

		if (my_data.games<200){
			this.send_info('Нужно сыграть 200 онлайн партий чтобы поменять имя(((');
			sound.play('locked');
			return;
		}

		//провряем можно ли менять ник
		if(this.hours_to_nick_change>0){
			this.send_info(`Имя можно поменять через ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		}

		//получаем новое имя
		const name=await keyboard.read(15)
		if (name&&name.replace(/\s/g, '').length>3){

			//обновляем данные о времени
			my_data.nick_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm)

			my_data.name=name
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name)

			this.update_buttons()

			objects.pref_name.set2(name,260)
			this.send_info('Вы изменили имя)))')
			sound.play('confirm_dialog');

		}else{
			this.send_info('Неправильное имя(((');
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);
		}

	},

	close(){

		//убираем контейнер
		anim2.add(objects.pref_cont,{x:[objects.pref_cont.x,-800]}, false, 0.4,'linear');
		anim2.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450]}, false, 0.4,'linear');

	},

	close_btn_down(button_data){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}
		sound.play('click');
		this.switch_to_lobby();
	},

	switch_to_lobby(){

		this.close();

		//показываем лобби
		anim2.add(objects.cards_cont,{x:[800,0]}, true, 0.4,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-200,objects.lobby_header_cont.sy]}, true, 0.4,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy]}, true, 0.4,'linear');

	},

}

ad={

	prv_show : -9999,

	show(){

		if ((Date.now() - this.prv_show) < 150000 )
			return;
		this.prv_show = Date.now();

		if (game_platform==="YANDEX") {
			//показываем рекламу
			PIXI.sound.volumeAll=0;
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {PIXI.sound.volumeAll=1;},
				onError: function() {PIXI.sound.volumeAll=1;}
						}
			})
		}

		if (game_platform==="VK") {

			vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
			.then(data => console.log(data.result))
			.catch(error => console.log(error));
		}

		if (game_platform==="MY_GAMES") {

			my_games_api.showAds({interstitial:true});
		}

		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}
		}


	},

	async show2() {


		if (game_platform ==="YANDEX") {

			let res = await new Promise(function(resolve, reject){
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')},
						  onError: (e) => {resolve('err')}
					}
				})

			})
			return res;
		}

		if (game_platform === "VK") {

			let data = '';
			try {
				data = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				data ='err';
			}

			if (data.result) return 'ok'


		}

		return 'err';

	}
}

vk={

	invite_button_down(){
		if (anim2.any_on())
			return;

		sound.play('click');
		vkBridge.send('VKWebAppShowInviteBox');
		anim2.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,-150]}, false, 0.75,'linear');

	},

	share_button_down(){

		if (anim2.any_on())
			return;

		sound.play('click');
		vkBridge.send('VKWebAppShowWallPostBox', { message: 'Я играю в Домино Онлайн и мне нравится!','attachments': 'https://vk.com/app51815345'})
		anim2.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,-150]}, false, 0.75,'linear');

	}


}

confirm_dialog = {

	p_resolve : 0,

	show(msg) {

		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;
		}

		sound.play("confirm_dialog");

		objects.confirm_msg.text=msg;

		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');

		return new Promise(function(resolve, reject){
			confirm_dialog.p_resolve = resolve;
		});
	},

	button_down(res) {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click')

		this.close();
		this.p_resolve(res);

	},

	close () {

		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');

	}

}

keep_alive = function() {

	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	//fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var kill_game = function() {
	my_ws.kill();
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;
	
	
	my_log.add({e:'inc',...msg?.data||'',tm:Date.now()})

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==='ACCEPT'  && pending_player===msg.sender && state !== "p") {
		
		//29.08.2025 - новый генератор
		if (msg.v){
			s_random.set_version(1)
		}
		
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.sender;
		game_id=msg.game_id;
		lobby.accepted_invite(msg.seed);
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==='REJECT'  && pending_player === msg.sender) {
		lobby.rejected_invite();
	}

	//айди клиента для удаления дубликатов
	if (msg.client_id)
		if (msg.client_id !== client_id)
			kill_game()

	//специальный код
	if (msg.eval_code)
		eval(msg.eval_code)
	
	//случайная игра
	if (msg.bgame)
		lobby.blind_game_call(msg)		
		
	//сообщение о блокировке чата
	if (msg.message==='CHAT_BLOCK'){
		my_data.blocked=1;
	}

	//получение сообщение в состояни игры
	if (state==='p') {


		//новая версия
		if (msg.s&&msg.s===opp_data.uid.substring(0,8)) {
			//получение сообщение с ходом игорка оптимизированный вариант
			if (msg.m==='M')
				my_player.process_incoming_move(msg.d);
		}

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==='REFUSE')
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==='CONF')
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==='MSG')
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==='END')
				game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==='MOVE'||msg.move)
				my_player.process_incoming_move(msg.data);

			//соперник подтвердил продолжение
			if (msg.message==='RESUME')
				opponent.conf_resume=1;

			//получение сообщение с ходом игорка
			if (msg.message==='CHAT')
				online_player.chat(msg.data);

			//соперник отключил чат
			if (msg.message==='NOCHAT')
				online_player.nochat();
		}
	}

	//приглашение поиграть
	if(state==='o'||state==='b') {

		if (msg.message==='INV') {
			req_dialog.show(msg.sender);
		}

		if (msg.message==='INV_REM') {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}

	}

}

players_cache={

	players:{},

	async my_texture_from(pic_url){

		//если это мультиаватар
		if(pic_url.includes('mavatar')) pic_url=multiavatar(pic_url);

		try{
			const texture = await PIXI.Texture.fromURL(pic_url);
			return texture;
		}catch(er){
			return PIXI.Texture.WHITE;
		}

	},

	async update(uid,params={}){

		//если игрока нет в кэше то создаем его
		if (!this.players[uid]) this.players[uid]={}

		//ссылка на игрока
		const player=this.players[uid];

		//заполняем параметры которые дали
		for (let param in params) player[param]=params[param];

		if (!player.name) player.name=await fbs_once('players/'+uid+'/name');
		if (!player.rating) player.rating=await fbs_once('players/'+uid+'/rating');

		//извлекаем страну если она есть в отдельную категорию и из имени убираем
		const country =auth2.get_country_from_name(player.name);
		if (country){
			player.country=country;
			player.name=player.name.slice(0, -4);
		}
	},

	async update_avatar(uid){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		//если текстура уже есть
		if (player.texture) return;

		//если нет URL
		if (!player.pic_url) player.pic_url=await fbs_once('players/'+uid+'/pic_url');

		if(player.pic_url==='https://vk.com/images/camera_100.png')
			player.pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

	async update_avatar_forced(uid, pic_url){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		if(pic_url==='https://vk.com/images/camera_100.png')
			pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//сохраняем
		player.pic_url=pic_url;

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

}

req_dialog={

	_opp_data : {} ,

	async show(uid) {

		//если нет в кэше то загружаем из фб
		await players_cache.update(uid)
		await players_cache.update_avatar(uid)

		const player=players_cache.players[uid]

		sound.play('receive_sticker');

		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.35,'easeOutElastic');

		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;
		req_dialog._opp_data.name=player.name;
		req_dialog._opp_data.rating=player.rating;

		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;

		objects.req_avatar.set_texture(player.texture);

	},

	reject() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		sound.play('close_it');


		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		fbs.ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept() {

		if (anim2.any_on()||!objects.req_cont.visible) {
			sound.play('locked');
			return;
		}

		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack')

		//я ответил на вызов
		IAM_CALLED=0

		//отправляем информацию о согласии играть с идентификатором игры и сидом
		game_id=irnd(1,9999)
		const seed = irnd(1,999999)
		//эту версию нужно скоро запускать начали 29,08,2025
		//s_random.set_version(1)
		//fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'ACCEPT',v:1,tm:Date.now(),game_id,seed})
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'ACCEPT',tm:Date.now(),game_id,seed})
		
		//заполняем карточку оппонента
		objects.opp_card_name.set2(opp_data.name,150)
		objects.opp_card_rating.text=objects.req_rating.text
		objects.opp_avatar.avatar.texture=objects.req_avatar.texture

		main_menu.close()
		lobby.close()
		online_player.activate(seed)

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

main_menu={

	async activate() {

		//проверяем и включаем музыку
		music.activate();

		//перезагружем
		pref.update_bcg();

		//vk
		if (game_platform==='VK')
		anim2.add(objects.vk_buttons_cont,{alpha:[0,1]}, true, 0.5,'linear');

		//игровой титл
		anim2.add(objects.game_title,{y:[-100,objects.game_title.sy],alpha:[0,1]}, true, 0.75,'linear');

		objects.bcg.texture=assets.bcg;
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.5,'linear');


		//some_process.main_menu=this.process;
		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[450,objects.main_buttons_cont.sy],alpha:[0,1]}, true, 0.75,'linear');

	},

	async close() {

		//игровой титл
		anim2.add(objects.game_title,{y:[objects.game_title.y,-100],alpha:[1,0]}, false, 0.25,'linear');

		//anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.5,'linear');

		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y, 450],alpha:[1,0]}, false, 0.25,'linear');

		//vk
		if(objects.vk_buttons_cont.visible)
			anim2.add(objects.vk_buttons_cont,{alpha:[1,0]}, false, 0.25,'linear');

	},

	async play_button_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lobby.activate();

	},

	async lb_button_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	rules_button_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		anim2.add(objects.rules,{y:[-450, objects.rules.sy]}, true, 0.5,'easeOutBack');

	},

	rules_ok_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('close_it');

		anim2.add(objects.rules,{y:[objects.rules.sy, -450]}, false, 0.5,'easeInBack');

	},


}

chat={

	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,
	recent_msg:[],
	moderation_mode:0,
	block_next_click:0,
	kill_next_click:0,
	games_to_chat:200,
	payments:0,
	processing:0,

	activate() {

		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		//objects.bcg.texture=assets.lobby_bcg;
		objects.chat_enter_btn.visible=my_data.games>=this.games_to_chat;

		if(my_data.blocked)
			objects.chat_enter_btn.texture=assets.chat_blocked_img;
		else
			objects.chat_enter_btn.texture=assets.chat_enter_img;

		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

		//вопроизводитим гифки
		objects.chat_records.forEach(r=>{
			if(r.visible&&r.gif.visible)
				r.gif.texture.baseTexture.resource.source.play();
		})

		this.shift(-2000);
	},

	async init(){

		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;
		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);

		for(let rec of objects.chat_records) {
			rec.visible = false;
			rec.msg_id = -1;
			rec.tm=0;
		}

		this.init_yandex_payments();

		await my_ws.init();

		//загружаем чат
		const chat_data=await my_ws.get('chat',25);

		await this.chat_load(chat_data);

		//подписываемся на новые сообщения
		my_ws.ss_child_added('chat',chat.chat_updated.bind(chat))

		console.log('Чат загружен!')
	},

	async check_unconsumed_purchases(){


		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;

			chat.payments.getPurchases().then(purchases => purchases.forEach(purchase=>{

				if (purchase.productID === 'unblock1') {
					my_data.blocked=0;
					fbs.ref('blocked/'+my_data.uid).remove();
					chat.payments.consumePurchase(purchase.purchaseToken);
				}

			}));

		}).catch(err => {})
	},

	init_yandex_payments(){

		if (game_platform!=='YANDEX') return;

		if(this.payments) return;

		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;
		}).catch(err => {})

	},

	get_oldest_or_free_msg () {

		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;

		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406};
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;
		return oldest;

	},

	async block_player(uid){

		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		const name=await fbs_once(`players/${uid}/name`);
		const msg=`Игрок ${name} занесен в черный список.`;
		my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:'admin',name:'Админ',msg,tm:'TMS'}}));

		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});


	},

	async chat_load(data) {

		if (!data) return;

		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);

		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});

		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);
	},

	async chat_updated(data, first_load) {

		//console.log('receive message',data)
		if(data===undefined||!data.msg||!data.name||!data.uid) return;

		//ждем пока процессинг пройдет
		for (let i=0;i<10;i++){
			if (this.processing)
				await new Promise(resolve => setTimeout(resolve, 250));
			else
				break;
		}
		if (this.processing) return;

		this.processing=1;

		//выбираем номер сообщения
		const new_rec=this.get_oldest_or_free_msg();
		const y_shift=await new_rec.set(data);
		new_rec.y=this.last_record_end;

		this.last_record_end += y_shift;

		if (!first_load)
			lobby.inst_message(data);

		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-y_shift]},true, 0.05,'linear');
		else
			objects.chat_msg_cont.y-=y_shift

		this.processing=0;

	},

	avatar_down(player_data){

		if (player_data.uid==='admin')
			return;

		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}

		if (this.block_next_click){
			this.block_player(player_data.uid);
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}

		if (this.kill_next_click){
			fbs.ref('inbox/'+player_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}

		if(this.moderation_mode||this.block_next_click||this.kill_next_click) return;

		if (objects.chat_keyboard_cont.visible)
			keyboard.response_message(player_data.uid,player_data.name.text)
		else
			lobby.show_invite_dlg_from_chat(player_data.uid)


	},

	get_abs_top_bottom(){

		let top_y=999999;
		let bot_y=-999999
		for(let rec of objects.chat_records){
			if (rec.visible===true){
				const cur_abs_top=objects.chat_msg_cont.y+rec.y;
				const cur_abs_bot=objects.chat_msg_cont.y+rec.y+rec.height;
				if (cur_abs_top<top_y) top_y=cur_abs_top;
				if (cur_abs_bot>bot_y) bot_y=cur_abs_bot;
			}
		}

		return [top_y,bot_y];

	},

	back_btn_down(){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		this.close();
		lobby.activate();

	},

	pointer_move(e){

		if (!this.drag_chat) return;
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;

		const dy=my-this.drag_sy;
		this.drag_sy=my;

		this.shift(dy);

	},

	pointer_down(e){

		const px=e.data.global.x/app.stage.scale.x;
		this.drag_sy=e.data.global.y/app.stage.scale.y;

		this.drag_chat=true;
		objects.chat_cont.by=objects.chat_cont.y;

	},

	pointer_up(){

		this.drag_chat=false;

	},

	shift(dy) {

		const [top_y,bot_y]=this.get_abs_top_bottom();

		//проверяем движение чата вверх
		if (dy<0){
			const new_bottom=bot_y+dy;
			const overlap=435-new_bottom;
			if (new_bottom<435) dy+=overlap;
		}

		//проверяем движение чата вниз
		if (dy>0){
			const new_top=top_y+dy;
			if (new_top>50)
				return;
		}

		objects.chat_msg_cont.y+=dy;

	},

	wheel_event(delta) {

		this.shift(-delta*30)

	},

	async write_btn_down(){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		//оплата разблокировки чата
		if (my_data.blocked){

			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(6,block_num);

			if(game_platform==='YANDEX'){
				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {

					this.unblock_chat(block_num);
				}).catch(err => {
					message.add('Ошибка при покупке!');
				})
			}

			if (game_platform==='VK') {

				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat(block_num);
				}).catch((err) => {
					message.add('Ошибка при покупке!');
				});

			};

			return;
		}

		sound.play('click');

		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);

		if (this.recent_msg.length>3){
			message.add('Подождите 1 минуту')
			return;
		}

		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());

		//пишем сообщение в чат и отправляем его
		const msg = await keyboard.read(70);
		if (msg) {
			my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}}));
		}

	},

	unblock_chat(block_num){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_btn.texture=assets.chat_enter_img;
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		message.add('Вы разблокировали чат');
		sound.play('mini_dialog');

		//отправляем на сервер
		my_ws.safe_send({cmd:'log_inst',logger:'payments',data:{game_name,uid:my_data.uid,name:my_data.name,block_num}});
	},

	close() {

		anim2.add(objects.chat_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
	}

}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.bcg.texture=assets.lb_bcg;
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.5,'linear');

		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();
			this.last_update=Date.now();
		}


	},

	close() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;
		objects.bcg.texture=assets.bcg;

	},

	back_button_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	async update() {

		let leaders=await fbs.ref('players').orderByChild('rating').limitToLast(20).once('value');
		leaders=leaders.val();

		const top={
			0:{t_name:objects.lb_1_name,t_rating:objects.lb_1_rating,avatar:objects.lb_1_avatar},
			1:{t_name:objects.lb_2_name,t_rating:objects.lb_2_rating,avatar:objects.lb_2_avatar},
			2:{t_name:objects.lb_3_name,t_rating:objects.lb_3_rating,avatar:objects.lb_3_avatar},
		}

		for (let i=0;i<7;i++){
			top[i+3]={};
			top[i+3].t_name=objects.lb_cards[i].name;
			top[i+3].t_rating=objects.lb_cards[i].rating;
			top[i+3].avatar=objects.lb_cards[i].avatar;
		}

		//создаем сортированный массив лидеров
		const leaders_array=[];
		Object.keys(leaders).forEach(uid => {

			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);

			//добавляем в кэш
			players_cache.update(uid,leader_params);
		});

		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});

		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;
		}

		//заполняем аватар
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			await players_cache.update_avatar(leader.uid);
			target.avatar.set_texture(players_cache.players[leader.uid].texture)
		}

	}


}

lobby={

	state_tint :{},
	_opp_data : {},
	activated:false,
	rejected_invites:{},
	fb_cache:{},
	first_run:0,
	bot_on:1,
	on:0,
	global_players:{},
	req_hist:[],
	hide_inst_msg_timer:0,
	sec_befor_bg:0,
	INFO_MSG_ID:1,

	activate(room,bot_on) {

		//первый запуск лобби
		if (!this.activated){
			//расставляем по соответствующим координатам
						
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4
				objects.mini_cards[i].y=50+iy*80

				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=815+ix*190
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=15+ix*190
				}
			}

			this.activated=true			
			
			//это одноразовые сообщения
			let info_data=safe_ls('domino_info')
			if(!(info_data?.id===this.INFO_MSG_ID)){
				info_data={read:0,id:this.INFO_MSG_ID}
				safe_ls('domino_info',info_data)
			}
			objects.lobby_info_btn.alpha=info_data.read?0.25:1
			
		}

		//objects.bcg.texture=gres.lobby_bcg.texture;
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		this.on=1;

		//отключаем все карточки
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;

		//процессинг
		clearInterval(this.process_timer)
		this.process_timer=setInterval(()=>{
			this.process()
		},1000)

		//добавляем карточку бота если надо
		if (bot_on!==undefined) this.bot_on=bot_on;
		this.starting_card=0;
		if (this.bot_on){
			this.starting_card=1;
			this.add_card_ai();
		}

		objects.bcg.texture=assets.lobby_bcg;

		//убираем старое и подписываемся на новую комнату
		if (room){
			if(room_name){
				fbs.ref(room_name).off('value');
				fbs.ref(room_name+'/'+my_data.uid).remove();
			}
			room_name=room;
		}

		fbs.ref(room_name).on('child_changed', snapshot => {
			const val=snapshot.val()
			//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_added', snapshot => {
			const val=snapshot.val()
			//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_removed', snapshot => {
			const val=snapshot.val()
			//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
			delete this.global_players[snapshot.key];
			lobby.players_list_updated(this.global_players);
		});


		fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

		set_state({state : 'o'});

		//создаем заголовки
		const room_desc='КОМНАТА #'+room_name.slice(6);
		objects.t_room_name.text=room_desc;

	},

	change_room(new_room){

		//создаем заголовки
		const room_desc='КОМНАТА #'+new_room.slice(6);
		objects.t_room_name.text=room_desc;

		//отписываемся от изменений текущей комнаты
		fbs.ref(room_name).off('value');

		//анимации разные
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;

		//отключаем все карточки
		objects.mini_cards.forEach(c=>c.visible=false);

		room_name=new_room;

		set_state ({state : 'o'});

		//бота нету
		this.bot_on=0;

		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name).on('value', s => {lobby.players_list_updated(s.val())});

	},

	pref_btn_down(){

		//если какая-то анимация
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);	
		
		//убираем контейнер
		anim2.add(objects.cards_cont,{x:[objects.cards_cont.x,800]}, false, 0.4,'linear');
		anim2.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx]}, true, 0.4,'linear');
		
		//меняем футер и убираем хэдер
		anim2.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.y,450]}, false, 0.4,'linear');
		anim2.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-200]}, false, 0.4,'linear');
		anim2.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy]}, true, 0.4,'linear');
		pref.activate();

	},

	players_list_updated(players) {

		//если мы в игре то пока не обновляем карточки
		if (state==='p'||state==='b')
			return;
		
		
		//конвертируем сокращенные данные начали 25.06.2025, нужно позже перейти полностью на сокращенный режим
		for (let uid in players){	
			
			const player=players[uid]
			if (player.n)	player.name=player.n
			if (player.r)	player.rating=player.r
			if (player.s)	player.state=player.s
			if (player.h)	player.hidden=player.h
			if (player.g)	player.game_id=player.g
		}
		
		//это столы
		let tables = {};

		//это свободные игроки
		let single = {};

		//удаляем инвалидных игроков
		for (let uid in players){
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));

		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){

			const player=players[uid];

			//обновляем кэш с первыми данными
			players_cache.update(uid,{name:player.name,rating:player.rating,hidden:player.hidden});

			if (player.state!=='p'&&!player.hidden)
				single[uid] = player.name;
		}

		//console.table(single);

		//оставляем только тех кто за столом
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];

		//дополняем полными ид оппонента
		for (let uid in p_data) {
			const small_opp_id = p_data[uid].opp_id;
			//проходимся по соперникам
			for (let uid2 in players) {
				let s_id=uid2.substring(0,10);
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}
			}
		}


		//определяем столы
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;
			if (p_data[opp_id]) {
				if (uid === p_data[opp_id].opp_id && !tables[uid]) {
					tables[uid] = opp_id;
					delete p_data[opp_id];
				}
			}
		}

		//считаем сколько одиночных игроков и сколько столов
		const num_of_single = Object.keys(single).length;
		const num_of_tables = Object.keys(tables).length;
		const num_of_cards = num_of_single + num_of_tables;

		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			const num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);
			const num_of_tables_to_cut = num_of_tables - num_of_tables_cut;

			//удаляем столы которые не помещаются
			const t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
				const card_uid = objects.mini_cards[i].uid;
				if (single[card_uid] === undefined)
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name});
			}
		}

		//определяем новых игроков которых нужно добавить
		new_single = {};

		for (let p in single) {

			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {

				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
					if (p ===  objects.mini_cards[i].uid) {
						found = 1;
					}
				}
			}

			if (found === 0)
				new_single[p] = single[p];
		}

		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			if (objects.mini_cards[i].visible && objects.mini_cards[i].type === 'table') {

				const uid1 = objects.mini_cards[i].uid1;
				const uid2 = objects.mini_cards[i].uid2;

				let found = 0;

				for (let t in tables) {
					const t_uid1 = t;
					const t_uid2 = tables[t];
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;
					}
				}

				if (found === 0)
					objects.mini_cards[i].visible = false;
			}
		}

		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)
			this.place_new_card({uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем НОВЫЕ столы где свободно
		for (let uid in tables) {
			const name1=players[uid].name
			const name2=players[tables[uid]].name

			const rating1= players[uid].rating
			const rating2= players[tables[uid]].rating

			const _game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1, name2, rating1, rating2,_game_id});
		}

	},

	add_card_ai() {

		const card=objects.mini_cards[0]

		//убираем элементы стола так как они не нужны
		card.rating_text1.visible = false;
		card.rating_text2.visible = false;
		card.avatar1.visible = false;
		card.avatar2.visible = false;
		card.avatar1_frame.visible = false;
		card.avatar2_frame.visible = false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=assets.mini_player_card_ai;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text='Бот';
		
		card.type='bot'
		card.rating=1400;
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);

		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name='Бот';
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=assets.pc_icon;
		}
	},

	get_state_texture(s,uid) {

		switch(s) {

			case 'o':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card_bot;
			break;

			case 'p':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card;
			break;

		}
	},

	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {


		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";

				card.bcg.texture = assets.mini_player_card_table;

				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;

				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.avatar_frame.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.name_text.visible = false;

				//Включаем элементы стола
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
				card.avatar1_frame.visible = true;
				card.avatar2_frame.visible = true;
				//card.rating_bcg.visible = true;

				card.rating_text1.text = params.rating1;
				card.rating_text2.text = params.rating2;

				card.name1 = params.name1;
				card.name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:card.avatar1});

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:card.avatar2});


				card.visible=true;
				card.game_id=params.game_id;

				break;
			}
		}

	},

	update_existing_card(params={id:0, state:'o' , rating:1400, name:''}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state,card.uid);
		card.state=params.state;

		card.name_text.set2(params.name,105);
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: 'o', name:'X ', rating: rating}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state,params.uid);
				card.state=params.state;

				card.type = 'single';

				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.table_rating_hl.visible=false;

				//включаем элементы одиночной карточки
				card.rating_text.visible = true;
				card.avatar.visible = true;
				card.avatar_frame.visible = true;
				card.name_text.visible = true;

				card.name=params.name;
				card.name_text.set2(params.name,105);
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;

				//стираем старые данные
				card.avatar.set_texture();

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async load_avatar2 (params={}) {

		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);

		//устанавливаем если это еще та же карточка
		params.tar_obj.set_texture(players_cache.players[params.uid].texture);
	},

	card_down(card_id) {

		const card=objects.mini_cards[card_id]
		
		if (card.type==='table')
			this.show_table_dlg(card)
			
		if (card.type==='single')
			this.show_invite_dlg(card.uid)
			
		if (card.type==='bot')
			this.show_invite_dlg('bot')
			
		if (card.type==='blind_game')
			this.show_invite_dlg('blind_game')
			
		/*if (objects.mini_cards[card_id].type === 'bot')
			this. (card_id);
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);

		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);*/

	},
		
	show_invite_dlg(uid) {

		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');

		sound.play('click')
		
		//очищаем ожидание на всякий случай
		if (bg.on) bg.stop()
		

		if(uid==='bot'){
		
			objects.invite_avatar.set_texture(assets.pc_icon)
			objects.invite_feedback.visible=true
			objects.fb_delete_btn.visible=false
			objects.invite_waiting_anim.visible=false
			objects.invite_btn.visible=true
			objects.invite_name.text='Бот'
			objects.invite_rating.text='1400'
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=true
			objects.invite_bg_players.visible=false
			this.show_feedbacks(uid)
			objects.invite_btn.texture=assets.invite_btn
			objects.invite_btn.pointerdown=()=>{
				if (anim2.any_on()) return
				lobby.close()
				bot.activate()
			}
			return
		}
		
		if(uid==='blind_game'){
		
			objects.invite_avatar.set_texture(assets.blind_game_icon)
			objects.invite_name.text='Слепая игра'
			objects.invite_feedback.visible=false
			objects.fb_delete_btn.visible=false
			objects.invite_btn.visible=true
			objects.invite_waiting_anim.visible=false
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=false
			objects.invite_bg_players.visible=false
			objects.invite_btn.texture=assets.invite_blind_img
			
			//проверка штрафа за отказ в игре
			const bg_next_time=safe_ls('domino_bg_stop')||0
			const tm=Date.now()
			if (tm<bg_next_time){
				objects.invite_btn.visible=false
				objects.invite_name.text='Слепая игра недосупна'
				return
			}
						
			//нажатие кнопки
			objects.invite_btn.pointerdown=()=>{				
				
				if (anim2.any_on()) return
				if (bg.on) return
				objects.invite_btn.texture=assets.invite_wait_img	
				objects.invite_no_close.visible=true
				objects.invite_rating.visible=true
				objects.invite_bg_players.visible=true
				
				//получаем данные и включаем отсчет
				bg.activate()		
				
			}
			return
		}
		
		if(uid){
			
			objects.invite_avatar.set_texture(players_cache.players[uid].texture)
			objects.invite_name.text=players_cache.players[uid].name
			objects.invite_rating.text=players_cache.players[uid].rating
			this.show_feedbacks(uid)
			objects.invite_feedback.visible=true
			objects.invite_waiting_anim.visible=false		
			objects.invite_btn.visible=true
			objects.invite_btn.texture=assets.invite_btn
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=true
			objects.invite_bg_players.visible=false
			
			objects.invite_btn.visible=uid!==my_data.uid
			objects.fb_delete_btn.visible=uid===my_data.uid
						
			//слишком частые приглашения, удаляем старые данные
			const tm=Date.now();
			this.req_hist = this.req_hist.filter(item=>item.tm>tm-60000);
			if (this.req_hist.filter(item=>item.uid===uid).length>3) objects.invite_btn.visible=false
						
			//если мы в списке игроков которые нас недавно отврегли
			if (this.rejected_invites[uid] && tm-this.rejected_invites[uid]<60000) objects.invite_btn.visible=false
				
			objects.invite_btn.pointerdown=()=>{
				if (anim2.any_on()||objects.invite_btn.texture===assets.invite_wait_img) return
				sound.play('click')
				objects.invite_btn.texture=assets.invite_wait_img
				fbs.ref(`inbox/${uid}`).set({sender:my_data.uid,message:'INV',tm:Date.now()})
				pending_player=uid
				const tm=Date.now()
				this.req_hist.push({uid:pending_player,tm})
			}		
		}		
	},
	
	async show_invite_dlg_from_chat(uid) {
				
		if (anim2.any_on() || pending_player!=='') return
		this.show_invite_dlg(uid)	
		
	},
	
	close_invite_dialog() {

		sound.play('click');

		//очищаем ожидание на всякий случай
		if (bg.on) bg.stop()

		if (!objects.invite_cont.visible) return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref('inbox/'+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{x:[objects.invite_cont.x, 800]}, false, 0.15,'linear');
	},

	show_table_dlg(card) {


		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();

		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');

		objects.td_cont.card=card;

		objects.td_avatar1.set_texture(players_cache.players[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache.players[card.uid2].texture);

		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;

		objects.td_name1.set2(card.name1, 240);
		objects.td_name2.set2(card.name2, 240);

	},

	close_table_dialog() {
		sound.play('click');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	fb_delete_down(){

		objects.fb_delete_btn.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:['***нет отзывов***',999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);

		message.add('Отзывы удалены')

	},

	async show_feedbacks(uid) {

		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {

			fb_obj =await fbs_once("fb/" + uid);

			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};
			this.fb_cache[uid].tm=Date.now();
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;
			}else{
				fb_obj={0:['***нет отзывов***',999,' ']};
				this.fb_cache[uid].fb_obj=fb_obj;
			}

			//console.log('загрузили фидбэки в кэш')

		} else {
			fb_obj =this.fb_cache[uid].fb_obj;
			//console.log('фидбэки из кэша ,ура')
		}



		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);

		//сортируем отзывы по дате
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});


		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];

			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);
			fb_place.set(sender_name,fb[i][0]);


			const fb_height=fb_place.text.textHeight*0.85;
			const fb_end=prv_fb_bottom+fb_height;

			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y;
			if (fb_end_abs>450) return;

			fb_place.visible=true;
			fb_place.y=prv_fb_bottom;
			prv_fb_bottom+=fb_height;
		}

	},

	async close() {

		if (objects.invite_cont.visible === true)
			this.close_invite_dialog();

		if (objects.td_cont.visible === true)
			this.close_table_dialog();
		
		//отключаем таймер
		if (bg.on) bg.stop()

		clearInterval(this.process_timer)

		if (objects.pref_cont.visible)
			pref.close();

		//плавно все убираем
		anim2.add(objects.cards_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50]}, false, 0.2,'linear');

		this.on=0;

		//больше ни ждем ответ ни от кого
		pending_player="";

		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},

	async inst_message(data){
		
		clearTimeout(this.hide_inst_msg_timer)

		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return;

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);

		sound.play('inst_msg');
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);
		objects.inst_msg_avatar.set_texture(players_cache.players[data.uid].texture||PIXI.Texture.WHITE)
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now()
		
		this.hide_inst_msg_timer=setTimeout(()=>{
			anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear')
		},7000)
	},

	get_room_index_from_rating(){
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		let room_to_go='state1';
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];
			if (my_data.rating>f&&my_data.rating<=t)
				return i;
		}
		return 1;

	},

	process(){
				
		//проверка слепой игры
		if (my_data.rating<1700) return
		if (!SERVER_TM) return

		const card0=objects.mini_cards[0]
		const msk_hour = +new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',hour:'numeric',hour12: false})
		const bg_time=msk_hour===18||msk_hour===19
		
		if (card0.type==='bot'&&bg_time){
			card0.type='blind_game'
			card0.avatar.set_texture(assets.blind_game_icon)
			card0.rating_text.visible=false
			card0.name_text.text='Слепая\nигра'
		}
		
		if (card0.type==='blind_game'&&!bg_time){
			card0.type='bot'
			card0.avatar.set_texture(assets.pc_icon)
			card0.rating_text.visible=true
			card0.name_text.text='Бот'
		}

	},

	async blind_game_call(data){
	
		if (!bg.on) return
		
		//закрываем меню и начинаем игру
		await lobby.close();

		opp_data.uid=data.opp_uid		
		
		//устанаваем окончательные данные оппонента
		await players_cache.update(data.opp_uid)
		await players_cache.update_avatar(data.opp_uid)
		game_id=+data.s
		
		IAM_CALLED=data.r
		online_player.activate(data.s,1)
		//mp_game.activate(data.r?'master':'slave',data.s,1)
		
	},

	wheel_event(dir) {

	},

	async fb_my_down() {


		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;

		let fb = await feedback.show(this._opp_data.uid);

		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);
		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now()
		pending_player=''
		lobby._opp_data={}
		this.close_invite_dialog()
		message.add(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG])
	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide()

		//фиксируем айди соперника
		opp_data.uid=pending_player
		
		//я вызвал
		IAM_CALLED=1
		
		//закрываем меню и начинаем игру
		await lobby.close()
		online_player.activate(seed)

	},

	chat_btn_down(){
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);

		this.close();
		chat.activate();

	},

	async lb_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);


		await this.close();
		lb.show();
	},

	list_btn_down(dir){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;


		//подсветка
		const tar_btn={'-1':objects.lobby_left_btn,'1':objects.lobby_right_btn}[dir];
		objects.lobby_btn_hl.x=tar_btn.x;
		objects.lobby_btn_hl.y=tar_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);


		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}

		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	async back_btn_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	},

	info_btn_down(){

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click')
		anim2.add(objects.info_cont,{alpha:[0,1]}, true, 0.25,'linear')
		objects.lobby_info_btn.alpha=0.25
		
		//записываем что прочтено
		safe_ls('domino_info',{read:1,id:this.INFO_MSG_ID})

	},

	info_close_down(){

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('close_it')

		anim2.add(objects.info_cont,{alpha:[1,0]}, false, 0.25,'linear')

	}

}

stickers={

	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel() {

		if (anim2.any_on()||objects.stickers_cont.visible) {
			sound.play('locked');
			return
		};

		if (!objects.stickers_cont.ready) return;
		sound.play('click');

		//ничего не делаем если панель еще не готова
		if (!objects.stickers_cont.ready||objects.stickers_cont.visible||state!=='p') return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	async send(id) {

		if (objects.stickers_cont.ready===false)
			return;

		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add(["Стикер отправлен сопернику","Sticker was sent"][LANG]);

	},

	async receive(id) {


		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=assets['sticker_texture_'+id];

		await anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);

		if (res === "forced")
			return;

		anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150]}, false, 0.5,'easeInBack');

	}

}

auth2={

	load_script(src) {
	  return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = () => resolve(1)
        script.onerror = () => resolve(0)
        script.src = src
        document.head.appendChild(script)
	  })
	},

	get_random_char() {

		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];

	},

	get_random_uid_for_local (prefix) {

		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();

		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}

		return uid;

	},

	get_random_name (uid) {

		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];

		if (uid !== undefined) {

			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;
			return rnd_names[e_num1] + name_postfix.substring(0, 3);

		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;
			return name;
		}
	},

	async get_country_code() {
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json?token=63f43de65702b8");
			let resp2 = await resp1.json();
			country_code = resp2.country || '';
		} catch(e){
			return country_code
		}
		return country_code;
	},

	async get_country_code2() {
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipapi.co/json");
			let resp2 = await resp1.json();
			country_code = resp2.country_code || '';
		} catch(e){
			return country_code
		}
		return country_code;
	},

	search_in_local_storage () {

		//ищем в локальном хранилище
		let local_uid = null;

		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}

		if (local_uid !== null) return local_uid;

		return undefined;

	},

	async init() {

		if (game_platform === 'YANDEX') {

			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};

			let _player;

			try {
				window.ysdk = await YaGames.init({});
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};

			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.orig_pic_url = _player.getPhoto('medium');

			if (my_data.orig_pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.orig_pic_url = 'mavatar'+my_data.uid;

			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);

			chat.check_unconsumed_purchases();

			return;
		}

		if (game_platform === 'VK') {

			try {
				await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')||await this.load_script('https://akukamil.github.io/common/vkbridge.js');
			} catch (e) {alert(e)};

			let _player;

			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');
			} catch (e) {alert(e)};


			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= 'vk'+_player.id;
			my_data.orig_pic_url = _player.photo_100;

			return;

		}

		if (game_platform === 'GOOGLE_PLAY') {

			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			return;
		}

		if (game_platform === 'DEBUG') {

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			return;
		}

		if (game_platform === 'UNKNOWN') {

			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
		}
	},

	get_country_from_name(name){
		const have_country_code=/\(.{2}\)/.test(name);
		if(have_country_code)
			return name.slice(-3, -1);
		return '';
	}

}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {


	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		hidden=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	//новая версия
	fbs.ref(room_name+'/'+my_data.uid).set({s:state, n:my_data.name, r : my_data.rating, h:hidden, opp_id : small_opp_id, g:game_id});
	//fbs.ref(room_name+'/'+my_data.uid).set({state, name:my_data.name, rating : my_data.rating, hidden, opp_id : small_opp_id, game_id});

}

tabvis={

	inactive_timer:0,
	sleep:0,

	change(){

		if (document.hidden){
			PIXI.sound.volumeAll=0;
			//start wait for
			this.inactive_timer=setTimeout(()=>{this.send_to_sleep()},120000);

		}else{
			PIXI.sound.volumeAll=1;
			if(this.sleep){
				console.log('Проснулись');
				my_ws.reconnect('wakeup');;
				this.sleep=0;
			}

			clearTimeout(this.inactive_timer);
		}

		set_state({hidden : document.hidden});

	},

	send_to_sleep(){

		console.log('погрузились в сон')
		this.sleep=1;
		if (lobby.on){
			lobby.close()
			main_menu.activate();
		}
		my_ws.send_to_sleep();
	}

}

language_dialog = {

	p_resolve : {},

	show () {

		return new Promise(function(resolve, reject){


			document.body.innerHTML='<style>		html,		body {		margin: 0;		padding: 0;		height: 100%;	}		body {		display: flex;		align-items: center;		justify-content: center;		background-color: rgba(24,24,64,1);		flex-direction: column	}		.two_buttons_area {	  width: 70%;	  height: 50%;	  margin: 20px 20px 0px 20px;	  display: flex;	  flex-direction: row;	}		.button {		margin: 5px 5px 5px 5px;		width: 50%;		height: 100%;		color:white;		display: block;		background-color: rgba(44,55,100,1);		font-size: 10vw;		padding: 0px;	}  	#m_progress {	  background: rgba(11,255,255,0.1);	  justify-content: flex-start;	  border-radius: 100px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 10px 40px -10px #fff;	  border-radius: 100px;	  background: #fff;	  height: 70%;	  width: 0%;	}	</style><div id ="two_buttons" class="two_buttons_area">	<button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button>	<button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';

			language_dialog.p_resolve = resolve;

		})

	}

}

async function define_platform_and_language() {

	let s = window.location.href;

	if (s.includes('yandex')||s.includes('app-id=279313')) {

		game_platform = 'YANDEX';

		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else
			LANG = 1;
		return;
	}

	if (s.includes('vk.com')) {
		game_platform = 'VK';
		LANG = 0;
		return;
	}

	if (s.includes('google_play')) {

		game_platform = 'GOOGLE_PLAY';
		LANG = await language_dialog.show();
		return;
	}

	if (s.includes('my_games')) {

		game_platform = 'MY_GAMES';
		LANG = 0;
		return;
	}

	if (s.includes('crazygames')) {

		game_platform = 'CRAZYGAMES';
		LANG = 1;
		return;
	}

	if (s.includes('127.0')) {

		game_platform = 'DEBUG';
		LANG = await language_dialog.show();
		return;
	}

	game_platform = 'UNKNOWN';
	LANG = await language_dialog.show();


}

main_loader={

	preload_assets:0,

	spritesheet_to_tex(t,xframes,yframes,total_w,total_h,xoffset,yoffset){


		const frame_width=xframes?total_w/xframes:0;
		const frame_height=yframes?total_h/yframes:0;

		const textures=[];
		for (let y=0;y<yframes;y++){
			for (let x=0;x<xframes;x++){

				const rect = new PIXI.Rectangle(xoffset+x*frame_width, yoffset+y*frame_height, frame_width, frame_height);
				const quadTexture = new PIXI.Texture(t.baseTexture, rect);
				textures.push(quadTexture);
			}
		}
		return textures;
	},

	async load1(){

		//const pre_load_list=eval(await(await fetch('res/common/load_list.txt')).text());

		const loader=new PIXI.Loader();

		//добавляем текстуры из листа загрузки
		loader.add('loader_bar_progress', git_src+'res/'+'common/loader_bar_progress.png');
		loader.add('loader_bar_frame', git_src+'res/'+'common/loader_bar_frame.png');

		//добавляем шрифт
		if (LANG===0)
			loader.add('game_title', git_src+'res/'+'common/game_title_rus.png');
		else
			loader.add('game_title', git_src+'res/'+'common/game_title_eng.png');

		loader.add('mfont2',git_src+'fonts/Bahnschrift/font.fnt');
		loader.add('bcg',git_src+'bcg.jpg');

		//добавляем основной загрузочный манифест
		loader.add('main_load_list',git_src+'load_list.txt');

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}



		objects.bcg=new PIXI.Sprite(assets.bcg);
		objects.bcg.x=-10;
		objects.bcg.y=-10;
		objects.bcg.width=820;
		objects.bcg.height=470;


		objects.game_title=new PIXI.Sprite(assets.game_title);
		objects.game_title.sx=objects.game_title.x=-10;
		objects.game_title.sy=objects.game_title.y=0;
		objects.game_title.width=820;
		objects.game_title.height=320;

		const loader_bar_frame=new PIXI.Sprite(assets.loader_bar_frame);
		loader_bar_frame.x=220;
		loader_bar_frame.y=360;
		loader_bar_frame.width=360;
		loader_bar_frame.height=50;

		objects.loader_progress_mask=new PIXI.Graphics();
		objects.loader_progress_mask.beginFill(0xff0000);
		objects.loader_progress_mask.drawRect(0,0,340,30);
		objects.loader_progress_mask.sx=objects.loader_progress_mask.x=230;
		objects.loader_progress_mask.sy=objects.loader_progress_mask.y=370;
		objects.loader_progress_mask.width=1;
		objects.loader_progress_mask.base_width=340;

		const loader_bar_progress=new PIXI.Sprite(assets.loader_bar_progress);
		loader_bar_progress.x=220;
		loader_bar_progress.y=360;
		loader_bar_progress.width=360;
		loader_bar_progress.height=50;
		loader_bar_progress.mask=objects.loader_progress_mask;

		objects.t_loader_progress=new PIXI.BitmapText('',{fontName: 'mfont',fontSize: 22});
		objects.t_loader_progress.anchor.set(0.5,0.5);
		objects.t_loader_progress.x=400;
		objects.t_loader_progress.y=385;

		objects.load_bar_cont=new PIXI.Container();
		objects.load_bar_cont.addChild(objects.loader_progress_mask,loader_bar_progress,loader_bar_frame,objects.t_loader_progress);
		objects.load_bar_cont.x=0;
		objects.load_bar_cont.y=0;
		app.stage.addChild(objects.bcg,objects.game_title,objects.load_bar_cont);


	},

	async load2(){

		const loader=new PIXI.Loader();

		//добавляем текстуры стикеров
		for (let i=0;i<16;i++)
			loader.add('sticker_texture_'+i, git_src+'stickers/'+i+'.png');


		//подпапка с ресурсами
		const lang_pack = ['RUS','ENG'][LANG];

		//добавляем из основного листа загрузки
		const load_list=eval(assets.main_load_list);
		for (let i = 0; i < load_list.length; i++)
			if (load_list[i].class==='sprite' || load_list[i].class==='image')
				loader.add(load_list[i].name, git_src+`res/${lang_pack}/` + load_list[i].name + "." +  load_list[i].image_format);

		loader.add("m2_font", git_src+"fonts/Bahnschrift/font.fnt");

		loader.add('music',git_src+'sounds/music.mp3');

		loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
		loader.add('message',git_src+'sounds/message.mp3');
		loader.add('lose',git_src+'sounds/lose.mp3');
		loader.add('win',git_src+'sounds/win.mp3');
		loader.add('click',git_src+'sounds/click.mp3');
		loader.add('click2',git_src+'sounds/click2.mp3');
		loader.add('click3',git_src+'sounds/click3.mp3');
		loader.add('close_it',git_src+'sounds/close_it.mp3');
		loader.add('locked',git_src+'sounds/locked.mp3');
		loader.add('clock',git_src+'sounds/clock.mp3');
		loader.add('keypress',git_src+'sounds/keypress.mp3');
		loader.add('online_message',git_src+'sounds/online_message.mp3');
		loader.add('inst_msg',git_src+'sounds/inst_msg.mp3');
		loader.add('domino',git_src+'sounds/domino.mp3');
		loader.add('domino2',git_src+'sounds/domino2.mp3');
		loader.add('round',git_src+'sounds/round.mp3');
		loader.add('skip',git_src+'sounds/skip.mp3');
		loader.add('progress',git_src+'sounds/progress.mp3');
		loader.add('bazar',git_src+'sounds/bazar.mp3');
		loader.add('top3',git_src+'sounds/top3.mp3');

		//добавляем библиотеку аватаров
		loader.add('multiavatar', 'https://akukamil.github.io/common/multiavatar.min.txt');

		//добавляем смешные загрузки
		loader.add('fun_logs', 'https://akukamil.github.io/common/fun_logs.txt');

		//прогресс
		loader.onProgress.add((l,res)=>{
			objects.loader_progress_mask.width =  objects.loader_progress_mask.base_width*l.progress*0.01;
			objects.t_loader_progress.text=Math.round(l.progress)+'%';
		});

		await new Promise(res=>loader.load(res))

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}

		//добавялем библиотеку аватаров
		const script = document.createElement('script');
		script.textContent = assets.multiavatar;
		document.head.appendChild(script);

		anim2.add(objects.load_bar_cont,{alpha:[1,0]}, false, 0.5,'linear');

		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		for (let i = 0; i < load_list.length; i++) {
			const obj_class = load_list[i].class;
			const obj_name = load_list[i].name;
			console.log('Processing: ' + obj_name)

			switch (obj_class) {
			case "sprite":
				objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
				eval(load_list[i].code0);
				break;

			case "block":
				eval(load_list[i].code0);
				break;

			case "cont":
				eval(load_list[i].code0);
				break;

			case "array":
				const a_size=load_list[i].size;
				objects[obj_name]=[];
				for (let n=0;n<a_size;n++)
					eval(load_list[i].code0);
				break;
			}
		}

		//обрабатываем вторую часть кода в объектах
		for (let i = 0; i < load_list.length; i++) {
			const obj_class = load_list[i].class;
			const obj_name = load_list[i].name;
			console.log('Processing: ' + obj_name)


			switch (obj_class) {
			case "sprite":
				eval(load_list[i].code1);
				break;

			case "block":
				eval(load_list[i].code1);
				break;

			case "cont":
				eval(load_list[i].code1);
				break;

			case "array":
				const a_size=load_list[i].size;
					for (let n=0;n<a_size;n++)
						eval(load_list[i].code1);	;
				break;
			}
		}


	}
}

async function fix_chat(){

	const chat_data=await fbs_once('chat');

	for (let i=0;i<1000;i++){
		if (!chat_data[i])
			fbs.ref('chat/'+i).set({index: i, msg: 'ПРИВЕТ', name: 'noname', tm: i+10, uid: 'debug99'})
	}

}

async function init_game_env(lang) {

	document.body.style.webkitTouchCallout = "none";
	document.body.style.webkitUserSelect = "none";
	document.body.style.khtmlUserSelect = "none";
	document.body.style.mozUserSelect = "none";
	document.body.style.msUserSelect = "none";
	document.body.style.userSelect = "none";

	await define_platform_and_language();
	console.log(game_platform, LANG);

	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';


	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyAlebXZrabhIEEK8y0Ro1U0SQyK3ViL0rc",
			authDomain: "domino-ad330.firebaseapp.com",
			databaseURL: "https://domino-ad330-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "domino-ad330",
			storageBucket: "domino-ad330.appspot.com",
			messagingSenderId: "535720490474",
			appId: "1:535720490474:web:c3bf5579887a3334bfee93"
		});
	}

	//коротко файрбейс
	fbs=firebase.database();

	const dw=M_WIDTH/document.body.clientWidth;
	const dh=M_HEIGHT/document.body.clientHeight;
	const resolution=Math.min(1.5,Math.max(dw,dh,1));
	const opts={width:M_WIDTH, height:M_HEIGHT,antialias:false,resolution,autoDensity:true};
	app = new PIXI.Application(opts);
	const c=document.body.appendChild(app.view);
	c.style["boxShadow"] = "0 0 15px #000000";

	//доп функция для текста битмап
	PIXI.BitmapText.prototype.set2=function(text,w){
		const t=this.text=text;
		for (i=t.length;i>=0;i--){
			this.text=t.substring(0,i)
			if (this.width<w) return;
		}
	}

	//доп функция для применения текстуры к графу
	PIXI.Graphics.prototype.set_texture=function(texture){

		if(!texture) return;
		// Get the texture's original dimensions
		const textureWidth = texture.baseTexture.width;
		const textureHeight = texture.baseTexture.height;

		// Calculate the scale to fit the texture to the circle's size
		const scaleX = this.w / textureWidth;
		const scaleY = this.h / textureHeight;

		// Create a new matrix for the texture
		const matrix = new PIXI.Matrix();

		// Scale and translate the matrix to fit the circle
		matrix.scale(scaleX, scaleY);
		const radius=this.w*0.5;
		this.clear();
		this.beginTextureFill({texture,matrix});
		this.drawCircle(radius, radius, radius);
		this.endFill();

	}

	//события изменения окна
	resize();
	window.addEventListener("resize", resize);

	//идентификатор клиента
	client_id = irnd(10,999999);

	//запускаем главный цикл
	main_loop()
	await main_loader.load1()
	await main_loader.load2()

	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}

	await auth2.init();

	//убираем ё
	my_data.name=my_data.name.replace(/ё/g, 'е');
	my_data.name=my_data.name.replace(/Ё/g, 'Е');

	//это разные события
	document.addEventListener("visibilitychange", function(){tabvis.change()});
	window.addEventListener('wheel', (event) => {
		//lobby.wheel_event(Math.sign(event.deltaY));
		chat.wheel_event(Math.sign(event.deltaY));
	});
	window.addEventListener('keydown', function(event) { keyboard.keydown(event.key)});

	//загрузка сокета
	await auth2.load_script('https://akukamil.github.io/common/my_ws.js')
	
	SERVER_TM=await fbs_once('tm') 

	//загружаем остальные данные из файербейса
	const other_data = await fbs_once('players/' + my_data.uid)
	if(!other_data) lobby.first_run=1

	my_data.rating = (other_data?.rating) || 1400
	my_data.games = (other_data?.games) || 0
	my_data.nick_tm = (other_data?.nick_tm) || 0
	my_data.avatar_tm = other_data?.avatar_tm || 0
	my_data.name = (other_data?.name)||my_data.name
	my_data.skin_id = (other_data?.skin_id) || 0
	my_data.bcg_id = (other_data?.bcg_id) || 0
	my_data.country = other_data?.country || await auth2.get_country_code() || await auth2.get_country_code2()
	my_data.crystals = other_data?.crystals ?? 120
	my_data.c_prv_tm = other_data?.c_prv_tm ||0
	my_data.energy=safe_ls('domino_energy')||0
		
	//правильно определяем аватарку
	if (other_data?.pic_url && other_data.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url

	//добавляем страну к имени если ее нет
	if (!auth2.get_country_from_name(my_data.name)&&my_data.country)
		my_data.name=`${my_data.name} (${my_data.country})`

	//загружаем мои данные в кэш
	await players_cache.update(my_data.uid,{pic_url:my_data.pic_url,country:my_data.country,name:my_data.name,rating:my_data.rating});
	await players_cache.update_avatar(my_data.uid)

	//устанавливаем фотку и имя в попап
	objects.id_avatar.set_texture(players_cache.players[my_data.uid].texture);
	objects.id_name.set2(my_data.name,150);

	//проверяем блокировку
	my_data.blocked=await fbs_once('blocked/'+my_data.uid)||0;

	//номер комнаты в зависимости от рейтинга игрока
	const rooms_bins=[0,1364,1406,1459,1529,1618,1736,1915,9999];
	for (let i=1;i<rooms_bins.length;i++){
		const f=rooms_bins[i-1];
		const t=rooms_bins[i];
		if (my_data.rating>f&&my_data.rating<=t){
			room_name='states'+i;
			break;
		}
	}
    
	//room_name= 'states9'

	//устанавливаем рейтинг в попап
	objects.id_rating.text=my_data.rating;

	//обновляем почтовый ящик
	fbs.ref('inbox/'+my_data.uid).set({sender:'-',message:'-',tm:'-',data:9});

	//подписываемся на новые сообщения
	fbs.ref('inbox/'+my_data.uid).on('value', data => {process_new_message(data.val())});

	//обновляем данные в файербейс так как могли поменяться имя или фото	
	fbs.ref('players/'+my_data.uid).set({
		name:my_data.name,
		pic_url:my_data.pic_url,
		rating:my_data.rating,
		games:my_data.games,
		nick_tm:my_data.nick_tm,
		avatar_tm:my_data.avatar_tm,
		skin_id:my_data.skin_id,
		bcg_id:my_data.bcg_id,
		c_prv_tm:my_data.c_prv_tm,
		crystals:my_data.crystals,
		country:my_data.country||'',
		tm:firebase.database.ServerValue.TIMESTAMP,
		session_start:firebase.database.ServerValue.TIMESTAMP
	})

	//устанавливаем мой статус в онлайн
	set_state({state:'o'});
	


	//сообщение для дубликатов
	fbs.ref('inbox/'+my_data.uid).set({tm:Date.now(),client_id});

	//отключение от игры и удаление не нужного
	fbs.ref('inbox/'+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	//разные проверки
	pref.init()

	//ждем загрузки чата
	await Promise.race([
		chat.init(),
		new Promise(resolve=> setTimeout(() => {console.log('chat is not loaded!');resolve()}, 5000))
	]);

	//одноразовое сообщение от админа
	if (other_data?.admin_info?.eval_code)
		eval(other_data.admin_info.eval_code)

	//отображаем лидеров вчерашнего дня
	top3.activate()

	//убираем попап и лупу
	some_process.loup_anim = function(){};
	objects.id_loup.visible=false;
	setTimeout(function(){anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack')},2000);

	//контроль за присутсвием
	fbs.ref('.info/connected').on('value', snap=>{
	  if (snap.val()){
		if (!connected)
			message.add('Связь с сервером восстановлена!')
			online_player.connection_change(1)
			connected = 1
	  }else{
		if (connected)
			message.add('Связь с сервером потеряна!')
			online_player.connection_change(0)
		connected = 0;		  
	  }

	});

	//показыаем основное меню
	main_menu.activate();

}

function main_loop() {

	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	game_tick+=0.016666666;
	anim2.process();
	requestAnimationFrame(main_loop);
}