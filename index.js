var M_WIDTH=800, M_HEIGHT=450;
var app, game_res,fbs, game,gdata={}, client_id, objects={}, state='',chat_path, game_tick=0, made_moves=0, game_id=0, my_turn=0, connected = 1,opponent=0, LANG = 0;
var hidden=0, game_platform="", hidden_state_start = 0, room_name = 'room0';
var moving_chip=null, pending_player='',tm={}, some_process = {};
var my_data={opp_id : ''},opp_data={};
const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

const shift_w=55;
const shift_h=105;

const DOMINO_CEN_X=400;
const DOMINO_CEN_Y=200;
const SHADOW_SHIFT=3;
const SHADOW_DISP_XY={'0':[3,3],'90':[3,-3],'-90':[-3,3],'180':[-3,-3]}

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
	const info=await fbs.ref(path).once('value');
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
		
		this.shadow=new PIXI.Sprite(gres.domino_shadow.texture);
		this.shadow.width=70;
		this.shadow.height=120;
		this.shadow.x=this.shadow.y=3;
		
		this.bcg=new PIXI.Sprite();
		this.bcg.width=70;
		this.bcg.height=120;
		
		this.v1=0;
		this.v2=0;
		this.skin_id=0;
		
		this.icon1=new PIXI.Sprite();
		this.icon1.width=50;
		this.icon1.height=50;
		this.icon1.x=10;
		this.icon1.y=10;
		this.icon1.tint=0xffffff;
		
		this.icon2=new PIXI.Sprite();
		this.icon2.width=50;
		this.icon2.height=50;
		this.icon2.x=10;
		this.icon2.y=60;
		this.icon2.tint=0xffffff;
		
		this.lock=new PIXI.Sprite(gres.lock.texture);
		this.lock.width=70;
		this.lock.height=70;
		this.lock.anchor.set(0.5,0.5);
		this.lock.x=50;
		this.lock.y=95;
		this.lock.angle=30;
		this.lock.visible=false;
		
		this.interactive=true;
		this.visible=false;
		
		this.pivot.x=35;
		this.pivot.y=60;
		
		this.mine=0;
		
		this.double=0;
		
		this.set_skin(0);
				
		this.addChild(this.shadow,this.bcg,this.icon1,this.icon2,this.lock);
		
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
				
		this.bcg.texture=gres['skin'+skin_id].texture;
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
			this.icon1.texture=gres['d'+v1].texture;	
		}else
			this.icon1.texture=PIXI.Texture.EMPTY;
				
		if (v2){
			this.icon2.texture=gres['d'+v2].texture;			
		}else
			this.icon2.texture=PIXI.Texture.EMPTY;
		
		this.double=+(v1===v2);
		
		this.v1=v1;
		this.v2=v2;
				
	}
	
	pointerdown(){		
		
		my_player.try_make_move(this);
		console.log(this.v1,this.v2)
		
	}
		
}

class bcg_class extends PIXI.Container{
	
	constructor(){
		
		super();
		this.shadow=new PIXI.Sprite(gres.bcg_icon_shadow.texture);
		this.shadow.width=120;
		this.shadow.height=80;
		this.shadow.x=-10;
		this.shadow.y=-10;
		
		
		this.bcg=new PIXI.Sprite(gres.bcg_0.texture);
		this.bcg.width=120;
		this.bcg.height=80;
		this.bcg.x=-10;
		this.bcg.y=-10;
		
		this.lock=new PIXI.Sprite(gres.lock.texture);
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
		this.bcg.texture=gres['bcg_'+id].texture;		
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
		
		
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.width=210;
		this.bcg.height=100;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};
		
		this.table_rating_hl=new PIXI.Sprite(gres.table_rating_hl.texture);
		this.table_rating_hl.width=210;
		this.table_rating_hl.height=100;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=18;
		this.avatar.width=this.avatar.height=60;
				
		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.name_text.anchor.set(0,0);
		this.name_text.x=90;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0,0.5);
		this.rating_text.x=95;
		this.rating_text.y=65;		
		this.rating_text.tint=0xffff00;

		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_country.tint=0xffff00;
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=190;
		this.t_country.y=70;		
		this.t_country.tint=0xaaaa99;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=27;
		this.avatar1.y=17;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=125;
		this.avatar2.y=17;
		this.avatar2.width=this.avatar2.height=60;
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=55;
		this.rating_text1.y=60;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=155;
		this.rating_text2.y=60;
		
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2,this.rating_text,this.t_country,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffffff;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=14;
		this.avatar.width=this.avatar.height=44;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xcceeff;
		this.name.x=105;
		this.name.y=22;

		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=0xFFFF00;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class chat_record_class extends PIXI.Container {
	
	constructor() {
		
		super();
		
		this.tm=0;
		this.hash=0;
		this.index=0;
		this.uid='';	
		
		this.msg_bcg = new PIXI.NineSlicePlane(gres.msg_bcg.texture,90,50,45,50);
		this.msg_bcg.width=200;
		this.msg_bcg.height=70;	
		this.msg_bcg.x=100;	

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: gdata.chat_record_name_font_size});
		this.name.anchor.set(0.5,0.5);
		this.name.x=60;
		this.name.y=60;	
		this.name.tint=0xffff00;
		
		
		this.avatar = new PIXI.Sprite(PIXI.Texture.WHITE);
		this.avatar.width=40;
		this.avatar.height=40;
		this.avatar.x=40;
		this.avatar.y=10;
		this.avatar.interactive=true;
		const this_card=this;
		this.avatar.pointerdown=function(){chat.avatar_down(this_card)};		
		this.avatar.anchor.set(0,0)
				
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: gdata.chat_record_text_font_size,align: 'left'}); 
		this.msg.x=150;
		this.msg.y=35;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0x3B3838;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: gdata.chat_record_tm_font_size}); 
		this.msg_tm.x=200;		
		this.msg_tm.y=45;
		this.msg_tm.tint=0x767171;
		this.msg_tm.anchor.set(0,0);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.avatar,this.name,this.msg,this.msg_tm);
		
	}
	
	async update_avatar(uid, tar_sprite) {		
	
		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.texture=players_cache.players[uid].texture;	
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.texture=PIXI.Texture.WHITE;
				
		await this.update_avatar(msg_data.uid, this.avatar);

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;			
		this.hash = msg_data.hash;
		this.index = msg_data.index;
		
		
		this.name.set2(msg_data.name,110)
		this.msg.text=msg_data.msg;		
		
		const msg_bcg_width=Math.max(this.msg.width,100)+100;		
		
		//бэкграунд сообщения в зависимости от длины
		this.msg_bcg.width=msg_bcg_width				
				
		this.msg_tm.x=msg_bcg_width-15;
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.visible = true;	
		
		
	}	
	
}

class feedback_record_class extends PIXI.Container {
	
	constructor() {
		
		super();		
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {lineSpacing:50,fontName: 'mfont',fontSize: 20,align: 'left'}); 
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;
		
		this.name_text=new PIXI.BitmapText('Николай:', {fontName: 'mfont',fontSize: 20,align: 'left'}); 
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
		
		super();
		
		this.shadow=new PIXI.Sprite(gres.slider_shadow.texture);
		this.shadow.anchor.set(0.5,0.5);
		this.shadow.width=this.shadow.height=60;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.anchor.set(0.5,0.5);
		this.avatar.width=this.avatar.height=40;
		
		this.frame=new PIXI.Sprite(gres.slider_frame.texture);
		this.frame.anchor.set(0.5,0.5);
		this.frame.width=60;
		this.frame.height=80;
		if (invert) this.frame.scale_y*=-1;
		
		this.t_score=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_score.anchor.set(0,0.5);
		this.t_score.tint=0x111111;
		this.t_score.x=30;
		this.t_score.y=0;	
		
		
		this.addChild(this.shadow,this.avatar,this.frame,this.t_score)
	}
	
}

class just_avatar_class extends PIXI.Container{
	
	constructor(size){
		
		super();
				
		this.shadow=new PIXI.Sprite(gres.avatar_shadow.texture);
		this.shadow.width=this.shadow.height=size;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.width=this.avatar.height=size-20;
		this.avatar.x=this.avatar.y=10;		
		
		this.frame=new PIXI.Sprite(gres.avatar_frame.texture);
		this.frame.width=this.frame.height=size;

		this.avatar_mask=new PIXI.Sprite(gres.avatar_mask.texture);
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
		
		if (!gres[snd_res]?.data)
			return;
		
		gres[snd_res].sound.play({loop:is_loop||false});	
		
	},
	
	switch(){
		
		if (this.on){
			this.on=0;
			objects.pref_skin_req.text=['Звуки отключены','Sounds is off'][LANG];
			
		} else{
			this.on=1;
			objects.pref_skin_req.text=['Звуки включены','Sounds is on'][LANG];
		}
		anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);		
		
	}
	
}

music={
	
	on:1,
	
	activate(){
		
		if (!this.on) return;
	
		if (!gres.music.sound.isPlaying){
			gres.music.sound.play();
			gres.music.sound.loop=true;
		}
	},
	
	switch(){
		
		if (this.on){
			this.on=0;
			gres.music.sound.stop();
			objects.pref_skin_req.text=['Музыка отключена','Music is off'][LANG];
			
		} else{
			this.on=1;
			gres.music.sound.play();
			objects.pref_skin_req.text=['Музыка включена','Music is on'][LANG];
		}
		anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);			
	}
	
}

res_window={
	
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
		objects.res_window_title.text=title_text;
		objects.res_window_title2.text=')))';
		this.game_end=0;
		this.winner=winner;
		this.result=result;
		this.player_to_process=this[winner];		
		
		//на всякий случай очищаем
		clearTimeout(res_window.wait_init_timer);
		clearInterval(res_window.timer);
		
		objects.res_window_fb_button.visible=false;
		
		sound.play('round');
		
		//сразу определяем общее кол-во очков
		this.winner.tot_score=this.winner.cur_score+score;	
		if (this.winner.tot_score>50) this.winner.tot_score=50;

		this.show();		
		
		this.wait_init_timer=setTimeout(function(){res_window.process_info(1)},1500)		
			
	},
	
	init(opp){
		

	},
	
	show(){
		
		objects.res_window_ok_button.visible=false;
		objects.res_window_ok_button_t.visible=false;
		
		if (objects.res_window_cont.visible) return;
		
		anim2.add(objects.res_window_cont,{scale_y:[0,1]}, true, 0.25,'linear');
		
		//устанавливаем аватарки в слайдеры
		objects.my_slider.avatar.texture=objects.my_avatar.avatar.texture;
		objects.opp_slider.avatar.texture=objects.opp_avatar.avatar.texture;
	},
	
	draw_score(player,score){
						
		const score_offset=180+score*10;
		if (player===my_player){
			objects.my_slider.x=score_offset;
			objects.my_slider.t_score.text=~~score;			
		}else{
			objects.opp_slider.x=score_offset;
			objects.opp_slider.t_score.text=~~score;
		}
	},
	
	close(){
		clearTimeout(res_window.wait_init_timer);
		clearInterval(res_window.timer);
		anim2.add(objects.res_window_cont,{scale_y:[1,0]}, false, 0.25,'linear');
		some_process.res_window_process=function(){};
		ad.show();
	},
	
	total_stop(result){
		
		this.show();
		
		let results_map = {
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
 			'my_no_connection':{type:LOSE , desc:['Потеряна связь! Используйте надежное интернет соединение.','Lost connection! Use a reliable internet connection']}
		};	
		
		const old_rating=my_data.rating;
		const result_type=results_map[result].type;
		const result_desc=results_map[result].desc[LANG];
		
		if (result_type===WIN) my_data.rating=my_data.win_rating;		
		if (result_type===LOSE) my_data.rating=my_data.lose_rating;
		if (result_type===DRAW) my_data.rating=my_data.draw_rating;
		
		objects.res_window_title.text=result_desc;
		objects.res_window_title2.text=['Рейтинг: ','Rating: '][LANG]+old_rating+' >>> '+my_data.rating;
		
		objects.res_window_fb_button.visible=true;
		
		//если выиграли в онлайн игре
		if (opponent===online_player){
			my_data.games++;
			fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating);
			fbs.ref('players/'+my_data.uid+'/games').set(my_data.games);		

			if(my_data.rating>1500||opp_data.rating>1500){
				const duration = ~~((Date.now() - opponent.start_time)*0.001);
				fbs.ref("finishes2").push({uid:my_data.uid,player1:objects.my_card_name.text,player2:objects.opp_card_name.text, res:result_type,fin_type:result,duration:duration, rating: [old_rating,my_data.rating], ts:firebase.database.ServerValue.TIMESTAMP});	
			}
		}
		
		//звуки
		if (result_type===WIN)
			sound.play('win')
		else
			sound.play('lose')
		
		this.game_end=1;
		
		//конпка ок
		objects.res_window_ok_button.visible=true;
		objects.res_window_ok_button_t.visible=true;
		objects.res_window_ok_button_t.text='ОК';
		
	},
	
	button_down(){
		
		if (anim2.any_on()){
			sound.play('locked')
			return			
		}

		sound.play('close_it')
		
		if(this.game_end){
			this.goto_main_menu();
			return;						
		}		
		
		this.confirm_resume();
		
	},	
	
	goto_main_menu(){
		
		this.close();
		game.close();			
		main_menu.activate();
		
	},
	
	async fb_button_down(){
		
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
			some_process.res_window_process=function(){res_window.process_info()};
			sound.play('progress',true);
			
			const delta=this.winner.tot_score-this.winner.cur_score;
			
			if (delta<150) this.score_delta=0.6;
			if (delta<50) this.score_delta=0.5;
			if (delta<40) this.score_delta=0.4;
			if (delta<30) this.score_delta=0.3;
			if (delta<20) this.score_delta=0.2;
			if (delta<10) this.score_delta=0.1;
			
		} 
		
		//ссылка на выигровшего игрока
		const p=this.winner;
		
		
		p.cur_score+=this.score_delta;
		this.draw_score(p,p.cur_score);
		
		if(p.cur_score>=p.tot_score){		
			p.cur_score=p.tot_score;
			this.draw_score(p,p.cur_score);
			gres['progress'].sound.stop();
			some_process.res_window_process=function(){};
			if (p.cur_score===50){
				this.total_stop(p===my_player?'my_win':'opp_win');
				return;
			}
				
			res_window.start_count_down();
		}
		
	},
	
	game_end_event(){
		
		this.game_end=1;
		objects.res_window_title.text='ИГРА ЗАВЕРШЕНА!!!';
		objects.res_window_ok_button.visible=true;
		objects.res_window_ok_button_t.visible=true;
		objects.res_window_ok_button_t.text='ОК';
		
	},
	
	start_count_down(){
		
		objects.res_window_ok_button.visible=true;
		objects.res_window_ok_button_t.visible=true;
		
		this.t=9;
		objects.res_window_ok_button_t.text='ОК ('+res_window.t+')';
		
		res_window.timer=setInterval(function(){
			res_window.t--;
			objects.res_window_ok_button_t.text='ОК ('+res_window.t+')';
			if(res_window.t===0) res_window.confirm_resume();
		},1000)			
		
	},

	confirm_resume(){
		res_window.close();
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'RESUME',tm:Date.now()});
		game.resume_game();
	}
	
}

message =  {
	
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
	
	ru_keys:[[39,135.05,69,174.12,'1'],[79,135.05,109,174.12,'2'],[119,135.05,149,174.12,'3'],[159,135.05,189,174.12,'4'],[199,135.05,229,174.12,'5'],[239,135.05,269,174.12,'6'],[279,135.05,309,174.12,'7'],[319,135.05,349,174.12,'8'],[359,135.05,389,174.12,'9'],[399,135.05,429,174.12,'0'],[480,135.05,530,174.12,'<'],[59,183.88,89,222.95,'Й'],[99,183.88,129,222.95,'Ц'],[139,183.88,169,222.95,'У'],[179,183.88,209,222.95,'К'],[219,183.88,249,222.95,'Е'],[259,183.88,289,222.95,'Н'],[299,183.88,329,222.95,'Г'],[339,183.88,369,222.95,'Ш'],[379,183.88,409,222.95,'Щ'],[419,183.88,449,222.95,'З'],[459,183.88,489,222.95,'Х'],[499,183.88,529,222.95,'Ъ'],[79,232.72,109,271.79,'Ф'],[119,232.72,149,271.79,'Ы'],[159,232.72,189,271.79,'В'],[199,232.72,229,271.79,'А'],[239,232.72,269,271.79,'П'],[279,232.72,309,271.79,'Р'],[319,232.72,349,271.79,'О'],[359,232.72,389,271.79,'Л'],[399,232.72,429,271.79,'Д'],[439,232.72,469,271.79,'Ж'],[479,232.72,509,271.79,'Э'],[59,281.56,89,320.63,'!'],[99,281.56,129,320.63,'Я'],[139,281.56,169,320.63,'Ч'],[179,281.56,209,320.63,'С'],[219,281.56,249,320.63,'М'],[259,281.56,289,320.63,'И'],[299,281.56,329,320.63,'Т'],[339,281.56,369,320.63,'Ь'],[379,281.56,409,320.63,'Б'],[419,281.56,449,320.63,'Ю'],[500,281.56,530,320.63,')'],[440,135.05,470,174.12,'?'],[19,330.4,169,369.47,'ЗАКРЫТЬ'],[179,330.4,409,369.47,' '],[419,330.4,559,369.47,'ОТПРАВИТЬ'],[520,232.72,550,271.79,','],[460,281.56,490,320.63,'('],[19,232.72,69,271.79,'EN']],
	en_keys:[[41,135.05,71,174.12,'1'],[81,135.05,111,174.12,'2'],[121,135.05,151,174.12,'3'],[161,135.05,191,174.12,'4'],[201,135.05,231,174.12,'5'],[241,135.05,271,174.12,'6'],[281,135.05,311,174.12,'7'],[321,135.05,351,174.12,'8'],[361,135.05,391,174.12,'9'],[401,135.05,431,174.12,'0'],[482,135.05,532,174.12,'<'],[101,183.88,131,222.95,'Q'],[141,183.88,171,222.95,'W'],[181,183.88,211,222.95,'E'],[221,183.88,251,222.95,'R'],[261,183.88,291,222.95,'T'],[301,183.88,331,222.95,'Y'],[341,183.88,371,222.95,'U'],[381,183.88,411,222.95,'I'],[421,183.88,451,222.95,'O'],[461,183.88,491,222.95,'P'],[121,232.72,151,271.79,'A'],[161,232.72,191,271.79,'S'],[201,232.72,231,271.79,'D'],[241,232.72,271,271.79,'F'],[281,232.72,311,271.79,'G'],[321,232.72,351,271.79,'H'],[361,232.72,391,271.79,'J'],[401,232.72,431,271.79,'K'],[441,232.72,471,271.79,'L'],[462,281.56,492,320.63,'('],[61,281.56,91,320.63,'!'],[141,281.56,171,320.63,'Z'],[181,281.56,211,320.63,'X'],[221,281.56,251,320.63,'C'],[261,281.56,291,320.63,'V'],[301,281.56,331,320.63,'B'],[341,281.56,371,320.63,'N'],[381,281.56,411,320.63,'M'],[502,281.56,532,320.63,')'],[442,135.05,472,174.12,'?'],[21,330.4,171,369.47,'CLOSE'],[181,330.4,411,369.47,' '],[421,330.4,561,369.47,'SEND'],[522,232.72,552,271.79,','],[21,232.72,71,271.79,'RU']],
	
	layout:0,
	resolver:0,
	
	MAX_SYMBOLS : 60,
	
	read(){
		
		if (!this.layout)this.switch_layout();	
		
		//если какой-то ресолвер открыт
		if(this.resolver) this.resolver('');
		
		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.chat_keyboard_cont,{y:[-400, objects.chat_keyboard_cont.sy]}, true, 0.4,'easeOutBack');	


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
		objects.chat_keyboard_hl.width=x2-x;
		objects.chat_keyboard_hl.height=y2-y;
		
		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y;	
		
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
			objects.chat_keyboard.texture=gres.eng_layout.texture;
		}else{			
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=gres.rus_layout.texture;
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
		anim2.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
}

bot={
	
	chips:[],
	conf_resume:1,
	cur_score:0,
	tot_score:0,
	start_time:0,
	opp_conf_play:0,
	my_conf_play:0,
	
	activate(){
		
		//устанавливаем локальный и удаленный статус
		set_state({state : 'b'});
		
		
		if (!my_turn)
			this.try_make_move();
		
		objects.timer_text.text='---';
		this.reset_timer();
		objects.timer_cont.visible=true;
	
		anim2.add(objects.sbg_button,{x:[850,objects.sbg_button.sx]}, true, 0.25,'linear');

		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		my_data.lose_rating = my_data.rating;
		my_data.win_rating = my_data.rating;

	},
	
	send_move(data){
		
		if (data.type==='BAZAR'){			
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
		
		this.try_make_move();
		
	},
	
	async try_make_move(){
		
		await anim2.wait(2);	
					
		//ищем кость которая может подойти куда-нибудь
		let fit_dw,fit_uw,empty_board,fit;
		const chip=this.chips.find(function(c){
			[fit_dw,fit_uw,empty_board,fit]=game.get_available_connects(c);
			return fit;
		})		

		if (fit){
			if (empty_board){
				my_player.process_incoming_move({v1:chip.v1,v2:chip.v2,anchor:0});
			}else if(fit_dw){
				my_player.process_incoming_move({v1:chip.v1,v2:chip.v2,anchor:'dw'});
			}else if(fit_uw){
				my_player.process_incoming_move({v1:chip.v1,v2:chip.v2,anchor:'uw'});
			}	

			//повторный ход
			if (!game.have_move(my_player.chips)){
				this.try_make_move();
				return;
			}
			
			return;
		}else{
			
			//если база пуст то пропускаем ход	
			if(!bazar_chips.length) return;
			
			
			my_player.process_incoming_move({type:'BAZAR'});				
			this.try_make_move();
			return;
			
		}		
	
	},
	
	take_from_bazar(){
					
		//добавляем с базара
		my_player.process_incoming_move({type:'BAZAR'});
		
		//проверка завершения
		if(!game.have_move(opponent.chips)){
			my_turn=1				
			console.log('соперник пропускает ход')
		}			
		
	},
	
	have_move(){
		
		
	},
	
	reset_timer(){
		
		objects.timer_text.tint=objects.timer_text.base_tint;
		
		if (my_turn){
			objects.timer_cont.x = objects.my_card_cont.sx+objects.my_avatar.x+objects.my_avatar.width*0.5;			
			objects.opp_card_cont.alpha=0.5;
			objects.my_card_cont.alpha=1;
		}else{
			objects.timer_cont.x = objects.opp_card_cont.sx+objects.opp_avatar.x+objects.opp_avatar.width*0.5;			
			objects.my_card_cont.alpha=0.5;
			objects.opp_card_cont.alpha=1;
		}
		
	},
	
	exit_button_down(){
		
		if (anim2.any_on()||!game.on){
			sound.play('locked');
			return
		};
		
		game.stop('my_giveup');
		
	},
		
	close(){			


	},
	
	round_fin(){		
		
	},
	
	clear(){

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
	my_conf_play:0,
	conf_resume:0,
	cur_score:0,
	tot_score:0,
	write_fb_timer:0,
	
	activate(){
		
		//устанавливаем локальный и удаленный статус
		set_state({state:'p'});
				
		//фиксируем врему начала игры для статистики
		this.move_time_start=Date.now();		
		
		//перезапускаем таймер
		this.timer_prv_time=Date.now();
		clearInterval(this.timer);
		this.timer = setInterval(function(){online_player.timer_tick()}, 1000);
		
		//обновляем текст на экране
		objects.timer_text.text='0:'+this.time_for_move;
		
		this.reset_timer();		

		
		objects.game_buttons.visible=true;
		
		objects.timer_cont.visible=true;
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		my_data.lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		my_data.win_rating = this.calc_new_rating(my_data.rating, WIN);
		my_data.draw_rating = this.calc_new_rating(my_data.rating, DRAW);
		fbs.ref('players/'+my_data.uid+'/rating').set(my_data.lose_rating);
		
	},
	
	timer_tick(){
		
		
		//проверка таймера
		const cur_time=Date.now();
		if (cur_time-this.timer_prv_time>5000||cur_time<this.prv_tick_time){
			game.stop('timer_error');
			return;
		}
		this.timer_prv_time=cur_time;
		
		//проверка соединения
		if (!connected) {
			this.disconnect_time++;
			if (this.disconnect_time>5) {
				game.stop('my_no_connection');
				return;				
			}
		}
		
		//определяем сколько времени прошло
		const move_time_left=this.time_for_move-~~((Date.now()-this.move_time_start)*0.001);
		
		if (move_time_left < 0 && my_turn)	{
			
			if (this.my_conf_play)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');
			
			return;
		}

		if (move_time_left < -5 && !my_turn) {
			
			if (this.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');			
			return;
		}

		if (connected === 0 && !my_turn) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}		
		
		//подсвечиваем красным если осталость мало времени
		if (move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			sound.play('clock');
		}
		
		//обновляем текст на экране
		objects.timer_text.text=(move_time_left>9?'0:':'0:0')+Math.abs(move_time_left);
	},
	
	reset_timer(){
		
		this.disconnect_time=0;
		this.move_time_start=Date.now();
		objects.timer_text.tint=objects.timer_text.base_tint;
		
		if (my_turn)
			objects.timer_cont.x = objects.my_card_cont.sx+objects.my_avatar.x+objects.my_avatar.width*0.5;
		else
			objects.timer_cont.x = objects.opp_card_cont.sx+objects.opp_avatar.x+objects.opp_avatar.width*0.5;
		
	},
	
	round_fin(){		
		this.conf_resume=0;
		clearInterval(this.timer);		
	},
	
	send_move(data){		
		
		this.my_conf_play=1;
						
		//отправляем ход онайлн сопернику (с таймаутом)
		clearTimeout(this.write_fb_timer);
		this.write_fb_timer=setTimeout(function(){game.stop('my_no_connection');}, 8000);  
		fbs.ref('inbox/'+opp_data.uid).set({message:'MOVE',sender:my_data.uid,data,tm:Date.now()}).then(()=>{	
			clearTimeout(this.write_fb_timer);			
		});	

		
	},
	
	take_from_bazar(){
		
		//к сопернику приходят кости
					
		//добавляем с базара
		game.take_from_bazar('opp');
		
		//если базар пуст и нет хода
		if (!game.have_move(opponent.chips)&&!game.have_move(my_player.chips)){
			game.round_fin('fish');
			return;
		}
		
		//если базар пуст и нет хода
		if (!game.have_move(opponent.chips)){
			console.log('Соперник пропускает ход')	
			my_turn=1;	
			opponent.reset_timer();
			return;
		}
		
		
		
	},
		
	game_buttons_down(e) {
				
		if (anim2.any_on()||!game.on){
			sound.play('locked');
			return
		};	
				
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
		
		let res = await confirm_dialog.show(['Сдаетесь?','Giveup?'][LANG]);
		if (res==='ok'){
			fbs.ref('inbox/'+opp_data.uid).set({message:'END',sender:my_data.uid,tm:Date.now()});		
			game.stop('my_giveup');
		}	
		
	},
	
	async send_message(){
		
		if (anim2.any_on()||objects.stickers_cont.visible) {
			sound.play('locked');
			return
		};	
		
		const msg=await keyboard.read();
		
		//если есть данные то отправляем из сопернику
		if (msg) fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'CHAT',tm:Date.now(),data:msg});	
		
		console.log(msg);	
		
	},
			
	calc_new_rating(old_rating, game_result) {		
		
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

	chat(data) {
		
		message.add(data, 10000,'online_message');
		
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
		
		//соперник подтвердил игру
		online_player.opp_conf_play=1;
		
		//ждем если еще не готово
		if (!game.on){			
			this.timeout=setTimeout(function(){my_player.process_incoming_move(data)},250);
			return;
		}
			
		//соперник сделал ход
		online_player.opp_conf_play=1;
			
		if(data.type==='BAZAR'){
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

		//убираем мою костяшку и перераспределяем
		game.drop_chip('opp',chip);

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
		my_turn=1;
		opponent.reset_timer();
	
	},
	
	skip_move(player){		
	
		sound.play('skip');
		my_turn=1-(player===my_player);			
		opponent.reset_timer();
		objects.skip_note.x=65+my_turn*670;
		anim2.add(objects.skip_note,{alpha:[0,1]}, false, 3,'easeBridge',false);		
	},	
	
	try_make_move(chip,tar_anchor){
		
		//получаем информацию о возможности коннекта
		[fit_dw,fit_uw,empty_board,fit]=game.get_available_connects(chip);
		
		if (anim2.any_on()) return;
		
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
			game.hide_anchors();
				
		//если есть выбор к какому концу ставить
		const same_place=game.dw_next_place.val===game.uw_next_place.val;
		if (fit_dw&&fit_uw&&!empty_board&&!tar_anchor&&!same_place){			
			this.pending_chip=chip;
			game.show_next(chip);
			return;
		}
		
		//определяем как и куда ставить костяшку
		let anchor_to_send='';
		if(tar_anchor){		
			game.hide_anchors();		
			game.connect_to_side(chip,tar_anchor);
			this.pending_chip=0;
			anchor_to_send=tar_anchor===game.dw_next_place?'dw':'uw';
		}else if (empty_board){
			game.add_first_chip(chip);			
		}else if(fit_dw){
			game.connect_to_side(chip,game.dw_next_place);
			anchor_to_send='dw';
		}else if(fit_uw){
			game.connect_to_side(chip,game.uw_next_place);
			anchor_to_send='uw';
		}
		
		//убираем мою костяшку и перераспределяем
		game.drop_chip('my',chip);
		
		my_turn=0;	
		opponent.reset_timer();
		
		//отправляем данные сопернику
		opponent.send_move({v1:chip.v1,v2:chip.v2,type:'CHIP',anchor:anchor_to_send});	
		
		//проверка выигрыша
		if (!my_player.chips.length){
			console.log('я выиграл')	
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
			this.skip_move(opponent);
			return;
		}
		
		
	},		
		
	take_from_bazar(){
				
		if (anim2.any_on()||!game.on||!my_turn){
			sound.play('locked');
			return
		};		
		
		//добавляем с базара
		const res=game.take_from_bazar('my');
		
		if(res) opponent.send_move({type:'BAZAR'});
		
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
	
	make_seed(v){
		
		this.prv_val=v;
		this.seed=v;
	},
	
	get(){
		
		this.prv_val=Math.round(Math.sin(this.prv_val*313.249)*1000);
		return this.prv_val;
	}	
}

game={

	uw_next_place:{},
	dw_next_place:{},
	lines:[],
	on:0,
	initiator:null,
	round:0,
	SHADOW_DISP_XY:{'0':[3,3],'90':[3,-3],'-90':[-3,3],'180':[-3,-3]},

	activate(opp, seed, initiator,resume) {

		//seed=348;
		//предварительный терн
		my_turn=this.initiator=initiator

		objects.desktop.texture=pref.get_game_texture();
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');
		
		//не случайный сид
		s_random.make_seed(seed);

		//если это начало игры
		if(!resume){
			
			if (opponent) opponent.clear();
			
			//если открыт лидерборд то закрываем его
			if (objects.lb_1_cont.visible) lb.close();
			
			//если открыт чат то закрываем его
			if (objects.chat_cont.visible) chat.close();			
						
			[my_player,opponent].forEach(p=>{
				p.cur_score=p.tot_score=0;
				res_window.draw_score(p,0);
			})
			
			//никто не подтвердил
			opponent.opp_conf_play=0;
			opponent.my_conf_play=0;
			
			opponent.start_time=Date.now();
			this.round=0;
			
			opponent = opp;		
		}		
				
		//создаем значения костей и рандомизируем их
		const dominoes_vals = [];
		for (let i = 0; i <= 6; i++)
			for (let j = i; j <= 6; j++)
				dominoes_vals.push([i,j,s_random.get()]);
			
		dominoes_vals.sort((a,b)=>a[2]-b[2])		
		
		bazar_chips=dominoes_vals.slice(14,28);
		//bazar_chips=[];
		
		this.lines=[0,0,0,0,0,1,0,0,0,0];

		this.dw_next_place={val:-1,chip:0,line_dir:1,line_next_turn:{5:'DOWN',6:'LEFT',7:'DOWN',8:'RIGHT',9:'DOWN'}},
		this.uw_next_place={val:-1,chip:0,line_dir:-1,line_next_turn:{5:'UP',4:'RIGHT',3:'UP',2:'LEFT',1:'UP'}},
		
		//скрываем все доминошки
		[...objects.my_chips,...objects.opp_chips].forEach(d=>d.visible=false)
				
		//мои кости		
		my_player.chips=[];
		for (let i=0;i<7;i++){
			const d=objects.my_chips[i];
			d.set(dominoes_vals[i+my_turn*7][0],dominoes_vals[i+my_turn*7][1])		
			d.visible=true;
			d.show_values();
			d.y=0;
			d.x=objects.my_chips[i].tx=i*40;
			d.mine=1;
			my_player.chips.push(d);
		}
		
		//кости соперника		
		opponent.chips=[];
		
		for (let i=0;i<7;i++){
			const d=objects.opp_chips[i];
			d.set(dominoes_vals[i+(1-my_turn)*7][0],dominoes_vals[i+(1-my_turn)*7][1])		
			d.visible=true;
			d.hide_values();
			d.y=45;
			d.x=objects.opp_chips[i].tx=i*40;
			d.mine=0;
			opponent.chips.push(d);			
		}
		
		//определяем чья очередь
		const my_check_val=this.getMaxSum(objects.my_chips.filter(c=>c.visible))*10+this.initiator;
		const opp_check_val=this.getMaxSum(objects.opp_chips.filter(c=>c.visible))*10;
		
		if (my_check_val>opp_check_val)			
			my_turn=1;
		else			
			my_turn=0;
		
		
		objects.opp_chips_cont.y=0;
		objects.my_chips_cont.scale_xy=1;
		
		game.align_chips_cont('my');
		game.align_chips_cont('opp');
		
		objects.t_my_score.text=my_player.cur_score;
		objects.t_opp_score.text=opponent.cur_score;
		
		//ждем немнго пока все загрузится
		setTimeout(function(){game.on=1},1000);
	
		//остальные доминошки
		for (let i=0;i<28;i++){
			objects.my_chips[i].scale_xy=0.7;				
			objects.opp_chips[i].scale_xy=0.7;
			objects.game_chips[i].bcg.tint=0xffffff;
			objects.game_chips[i].y=700;
			objects.game_chips[i].x=400;
			objects.game_chips[i].visible=false;
			objects.game_chips[i].set(dominoes_vals[i][0],dominoes_vals[i][1])
			
		}		
			
		sound.play('note');
		
		//количество костей на базаре
		objects.t_bazar_cnt.text=bazar_chips.length;
		anim2.add(objects.bazar_button_cont,{x:[900, objects.bazar_button_cont.sx]}, true, 0.3,'linear');	
	
		//показываем и заполняем мою карточку	
		objects.my_card_cont.visible=true;
		objects.my_card_name.set2(my_data.name,110);
		objects.my_card_rating.text=my_data.rating;
		objects.my_avatar.avatar.texture=players_cache.players[my_data.uid].texture;	
		anim2.add(objects.my_card_cont,{x:[-100, objects.my_card_cont.sx]}, true, 0.5,'linear');		
				
		//показываем и заполняем карточку оппонента		
		objects.opp_card_cont.visible=true;	
		objects.opp_card_name.set2(opp_data.name,110);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.avatar.texture=players_cache.players[opp_data.uid].texture;	
		anim2.add(objects.opp_card_cont,{x:[800, objects.opp_card_cont.sx]}, true, 0.5,'linear');

		//номер раунда
		objects.t_round.text=['Раунд ','Round '][LANG]+(++this.round);
		anim2.add(objects.t_round,{x:[-100, objects.t_round.sx]}, true, 0.5,'linear');

		//кнопка настроек
		anim2.add(objects.pref_button2,{alpha:[0,1]}, true, 0.3,'linear');	
		
		//полка костей соперника
		objects.opp_chips_shelf.visible=true;
		objects.opp_chips_mask.visible=true;
		objects.opp_chips_cont.mask=objects.opp_chips_mask;
		
		opponent.activate();

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
	
	resume_game(){				
		
		if (!opponent.conf_resume){
			setTimeout(function(){game.resume_game()},1000);
			console.log('Ждем подтверждения...')
			return;			
		}
		
		game.activate(opponent,s_random.seed+23,this.initiator,1)		
	},

	timer_tick() {



	},

	align_chips_cont(p){
		
		const player=p==='my'?my_player:opponent;
		const cur_x=objects[p+'_chips_cont'].x;
		const tar_x=400-40*(player.chips.length-1)*0.5;
		anim2.add(objects[p+'_chips_cont'],{x:[cur_x,tar_x]}, true, 0.25,'linear');
		
		
		
		const tar_map={
			15:{s:0.95,x:120},
			16:{s:0.92,x:100},
			17:{s:0.9,x:70},
			18:{s:0.89,x:50},
			19:{s:0.85,x:45},
			20:{s:0.82,x:35},
			21:{s:0.8,x:25}
		};
		const tar_scale=tar_map[my_player.chips.length]?.s||1;
		const tar_x2=tar_map[my_player.chips.length]?.x||140;
		
		if(my_player.chips.length>14)
			anim2.add(objects.my_chips_cont,{scale_xy:[objects.my_chips_cont.scale_xy,tar_scale],x:[objects.my_chips_cont.x,tar_x2]}, true, 0.25,'linear');
		else{
			if(objects.my_chips_cont.scale_xy!==1)
				anim2.add(objects.my_chips_cont,{scale_x:[objects.my_chips_cont.scale_xy,1],x:[objects.my_chips_cont.x,tar_x2]}, true, 0.25,'linear');
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
		
		const player=p==='my'?my_player:opponent;
		const tar_y=p==='my'?500:-100;
		
		player.chips=player.chips.filter(c=>c!==chip);
				
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
		
		this.on=0;
		
		//это только остановка игры
		if(opponent.timer) clearInterval(opponent.timer);
		clearTimeout(my_player.timeout);
				
		res_window.total_stop(result);		
	},
	
	close(){		
		
		//основные элементы игры
		objects.timer_cont.visible=false;
		anim2.add(objects.my_card_cont,{x:[objects.my_card_cont.x,-100]}, false, 0.5,'linear');	
		anim2.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,800]}, false, 0.5,'linear');

		objects.opp_chips_cont.visible=false;
		objects.my_chips_cont.visible=false;	
		objects.game_chips_cont.visible=false;
		
		objects.game_buttons.visible=false;	
		objects.sbg_button.visible=false;	
		objects.bazar_button_cont.visible=false;
		
		objects.t_round.visible=false;
		anim2.add(objects.pref_button2,{alpha:[1,0]}, false, 0.3,'linear');	
		
		//полка костей соперника и маска
		objects.opp_chips_shelf.visible=false;
		objects.opp_chips_mask.visible=false;
		
		
		set_state({state:'o'});	

	},

	round_fin(res){
		
		const my_score=this.count_score(opponent.chips);
		const opp_score=this.count_score(my_player.chips);
		
		//если рыба
		if (my_score>opp_score)
			res_window.round_stop(my_player,my_score-opp_score,res);
		else
			res_window.round_stop(opponent,opp_score-my_score,res);
		
		opponent.round_fin();
		
		this.on=0;
		
		this.adjust_screen_center(0,300);		
		this.open_opp_chips();
		
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
		const cur_chip=side.chip;
		const cur_line_id=cur_chip.line;		
		const cur_line_or=['HORLINE','VERLINE'][+(cur_chip.angle%180===0)]
		const cur_chip_type=['NOR','DUB'][cur_chip.double];	
		const cur_dir=side.dir;
		const cur_line_len=this.lines[cur_line_id];
				
		//
		let connect_val, other_val, connect_index;
		if (chip.v1===side.val)
			[connect_val,other_val,connect_index]=[chip.v1,chip.v2,0]
		else
			[connect_val,other_val,connect_index]=[chip.v2,chip.v1,1]

		
		const next_chip_type=['NOR','DUB'][chip.double];	
		const max_line_len=[1,8][cur_line_id%2]
		next_dir=cur_dir;
		let turn_flag=0;
		if (cur_line_len>=max_line_len){
			//кость-поворот
			const new_dir=side.line_next_turn[cur_line_id];
			next_dir=cur_dir+'_'+new_dir;
			console.log('ПОВОРОТ: ',next_dir)			
			side.dir=new_dir;
			turn_flag=1;
		}
		
		//определяем параметры коннекта
		const connect_data=map_next_place[cur_line_or][cur_chip_type][next_dir][next_chip_type];
		
				
		//позиционные показатели следующей костяшки
		next_chip.tx=cur_chip.x+connect_data.dx;
		next_chip.ty=cur_chip.y+connect_data.dy;
		next_chip.tar_ang=connect_data.ang[connect_index];
		
		//параметры коннекта новой кости
		side.val=other_val;
		side.chip=next_chip;
		
		//начало движения в пространстве игрового контейнера
		const tsx=(400-objects.game_chips_cont.x)/objects.game_chips_cont.scale_xy;
		const tsy=(540-objects.game_chips_cont.y)/objects.game_chips_cont.scale_xy;
				
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

pref={
	
	bcg_loader:null,
	
	activate(){
		
		if(anim2.any_on()||objects.pref_cont.visible){
			sound.play('locked');
			return;			
		}
		
		sound.play('click');
		
		anim2.add(objects.pref_cont,{scale_x:[0,1]}, true, 0.2,'linear');
		
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
		
		//определяем доступные скиниы
		for (let i in BCG_DATA){			
			const rating_req=BCG_DATA[i].rating;
			const games_req=BCG_DATA[i].games;	
			const av=my_data.rating>=rating_req&&my_data.games>=games_req;
			objects.bcgs[i].lock.visible=!av;
		}
		
		
	},
	
	skin_down(skin){		
		
		const rating_req=SKINS_DATA[skin.skin_id].rating;
		const games_req=SKINS_DATA[skin.skin_id].games;
		
		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			anim2.add(skin.lock,{angle:[skin.lock.angle,skin.lock.angle+10]}, true, 0.15,'shake');
			objects.pref_skin_req.text=[`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);
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
			anim2.add(bcg.lock,{angle:[bcg.lock.angle,bcg.lock.angle+10]}, true, 0.15,'shake');
			objects.pref_skin_req.text=[`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);
			sound.play('locked');
			return;
		}
		
		sound.play('click2');
		this.select_bcg(bcg);	
	},
	
	get_game_texture(){		
		
		return this.bcg_loader?.resources['bcg'+my_data.bcg_id]?.texture||gres.desktop.texture;
		
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
		const tar_x=music.on?143:104;
		anim2.add(objects.music_slider,{x:[objects.music_slider.x,tar_x]}, true, 0.1,'linear');		
		
	},
	
	sound_switch_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.switch();
		sound.play('click3');
		const tar_x=sound.on?299:260;
		anim2.add(objects.sound_slider,{x:[objects.sound_slider.x,tar_x]}, true, 0.1,'linear');	
		
	},
	
	ok_button_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		sound.play('close_it');
		this.close();
		fbs.ref('players/'+my_data.uid+'/skin_id').set(my_data.skin_id);
		fbs.ref('players/'+my_data.uid+'/bcg_id').set(my_data.bcg_id);
		
		this.update_bcg();
		
		[...objects.my_chips,...objects.opp_chips,...objects.game_chips].forEach(chip=>{
			chip.set_skin(my_data.skin_id);			
		})
		
	},
	
	async update_bcg(){
		
		if (!this.bcg_loader) this.bcg_loader=new PIXI.Loader();
		
		//если базовая текстура выбрана которая идет в комплекте с loadlist
		if (!my_data.bcg_id){
			if (game.on) objects.desktop.texture=gres.desktop.texture;
			return;
		}		
		
		const res_name='bcg'+my_data.bcg_id;		
		if (!this.bcg_loader.resources[res_name]){
			this.bcg_loader.add(res_name,'bcg/bcg'+my_data.bcg_id+'.jpg');
			await new Promise(resolve=>pref.bcg_loader.load(resolve));			
		}

		if (game.on) objects.desktop.texture=this.bcg_loader.resources[res_name].texture;
	},
	
	async change_name_down(){
		
		if(anim2.any_on()){
			sound.play('locked');
			return;			
		}
		
		
		const rating_req=1450;
		const games_req=50;
		
		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			objects.pref_skin_req.text=[`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);
			sound.play('locked');
			return;
		}
		
		
		//провряем можно ли менять ник
		const tm=Date.now();
		const days_since_nick_change=~~((tm-my_data.nick_tm)/86400000);
		const days_befor_change=30-days_since_nick_change;
		const ln=days_befor_change%10;
		const opt=[0,5,6,7,8,9].includes(ln)*0+[2,3,4].includes(ln)*1+(ln===1)*2;
		const day_str=['дней','дня','день'][opt];

		if (days_befor_change>0){

			objects.pref_skin_req.text=[`Поменять имя можно через ${days_befor_change} ${day_str}`,`Wait ${days_befor_change} days`][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);	

			sound.play('locked');
			return;
		}
				
					
		const name=await keyboard.read();
		if (name.length>1){
			my_data.name=name;
			fbs.ref('players/'+my_data.uid+'/name').set(my_data.name);
			objects.my_card_name.set2(my_data.name,110);
			set_state({});
			
			objects.pref_skin_req.text=['Имя изменено','Name has been changed'][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);			
			fbs.ref('players/'+my_data.uid+'/nick_tm').set(tm);
			my_data.nick_tm=tm;
		}else{
			
			objects.pref_skin_req.text=['Какая-то ошибка','Unknown error'][LANG];
			anim2.add(objects.pref_skin_req,{alpha:[0,1]}, false, 3,'easeBridge',false);
			
		}

		
	},
	
	close(){
		
		anim2.add(objects.pref_cont,{scale_x:[1,0]}, false, 0.2,'linear');	
		
	}
		
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
	
	if (hidden) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	fbs.ref(room_name+"/"+my_data.uid).remove();
		return;		
	}


	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var kill_game = function() {
	
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==='ACCEPT'  && pending_player===msg.sender && state !== "p") {
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
	if (msg.message==='CLIEND_ID') 
		if (msg.client_id !== client_id)
			kill_game();


	//получение сообщение в состояни игры
	if (state==='p') {

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
			if (msg.message==='MOVE')
				my_player.process_incoming_move(msg.data);
			
			//получение сообщение с ходом игорка
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
	
	async load_pic(uid,pic_url){
		
		//если это мультиаватар
		if(pic_url.includes('mavatar'))
			return PIXI.Texture.from(multiavatar(pic_url));
		
		const loader=new PIXI.Loader;
		loader.add(uid, pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});	
		await new Promise(resolve=> loader.load(resolve))		
		return loader.resources[uid].texture;
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
		if (player.pic_url) player.texture=await this.load_pic(uid, player.pic_url);	
		
	}	
}

req_dialog={

	_opp_data : {} ,
	
	async show(uid) {
		
		//если нет в кэше то загружаем из фб
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		
		const player=players_cache.players[uid];
		
		sound.play('receive_sticker');	
		
		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');
							
		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;		
		req_dialog._opp_data.name=player.name;		
		req_dialog._opp_data.rating=player.rating;
				
		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;
		
		objects.req_avatar.texture=player.texture;

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
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		//раздаем карты мне и оппоненту
		
		
		//отправляем информацию о согласии играть с идентификатором игры и сидом
		game_id=irnd(1,9999);
		let seed = irnd(1,999999);
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'ACCEPT',tm:Date.now(),game_id,seed});

		//заполняем карточку оппонента
		objects.opp_card_name.set2(opp_data.name,150)
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		lobby.close();
		game.activate(online_player,seed,1);

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
		
		objects.desktop.texture=gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');	


		//some_process.main_menu=this.process;
		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[450,objects.main_buttons_cont.sy],alpha:[0,1]}, true, 0.75,'linear');	

	},

	async close() {
		
		//игровой титл
		anim2.add(objects.game_title,{y:[objects.game_title.y,-100],alpha:[1,0]}, false, 0.5,'linear');	
		
		//anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.5,'linear');	

		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y, 450],alpha:[1,0]}, false, 0.5,'linear');	
		
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
	delete_message_mode:0,
	games_to_chat:200,
	
	activate() {	

		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		objects.desktop.texture=gres.desktop.texture;
		objects.chat_enter_button.visible=!my_data.blocked;

	},
	
	init(){
		
		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;		
		objects.desktop.interactive=true;
		objects.desktop.pointermove=this.pointer_move.bind(this);
		objects.desktop.pointerdown=this.pointer_down.bind(this);
		objects.desktop.pointerup=this.pointer_up.bind(this);
		objects.desktop.pointerupoutside=this.pointer_up.bind(this);
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.msg_id = -1;	
			rec.tm=0;
		}			
		
		
		//загружаем чат
		fbs.ref(chat_path).orderByChild('tm').limitToLast(20).once('value', snapshot => {chat.chat_load(snapshot.val());});		
		
	},			

	get_oldest_index () {
		
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;	
		return oldest.index;		
		
	},
	
	get_oldest_or_free_msg () {
		
		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;
		
		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest;		
		
	},
		
	async chat_load(data) {
		
		if (data === null) return;
		
		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);
		
		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});
			
		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);	
		
		//подписываемся на новые сообщения
		fbs.ref(chat_path).on('child_changed', snapshot => {chat.chat_updated(snapshot.val());});
	},	
				
	async chat_updated(data, first_load) {		
	
		//console.log('receive message',data)
		if(data===undefined) return;
		
		//если это сообщение уже есть в чате
		if (objects.chat_records.find(obj => { return obj.hash === data.hash;}) !== undefined) return;
		
		
		//выбираем номер сообщения
		const new_rec=objects.chat_records[data.index||0]
		await new_rec.set(data);
		new_rec.y=this.last_record_end;
		
		this.last_record_end += gdata.chat_record_h;		

		if (!first_load)
			lobby.inst_message(data);
		
		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-gdata.chat_record_h]},true, 0.05,'linear');		
		else
			objects.chat_msg_cont.y-=gdata.chat_record_h
		
	},
						
	avatar_down(player_data){
		
		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}
		
		if (this.block_next_click){			
			fbs.ref('blocked/'+player_data.uid).set(Date.now())
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}
		
		if (this.kill_next_click){			
			fbs.ref('inbox/'+player_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}
		
		if(this.delete_message_mode){			
			fbs.ref(`${chat_path}/${player_data.index}`).remove();
			console.log(`сообщение ${player_data.index} удалено`)
		}
		
		
		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;
		
		if (objects.chat_keyboard_cont.visible)		
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dialog_from_chat(player_data.uid,player_data.name.text);
		
		
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
	
	back_button_down(){
		
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
		
		objects.chat_msg_cont.y-=delta*gdata.chat_record_h*0.5;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*gdata.chat_record_h;
		
		if (objects.chat_msg_cont.y+chat_bottom<430)
			objects.chat_msg_cont.y = 430-chat_bottom;
		
		if (objects.chat_msg_cont.y+chat_top>0)
			objects.chat_msg_cont.y=-chat_top;
		
	},
	
	make_hash() {
	  let hash = '';
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  for (let i = 0; i < 6; i++) {
		hash += characters.charAt(Math.floor(Math.random() * characters.length));
	  }
	  return hash;
	},
		
	async write_button_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		if (my_data.blocked){			
			message.add('Закрыто');
			return;
		}
		
		
		sound.play('click');
		
		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);
				
		if (this.recent_msg.length>3){
			message.add(['Подождите 1 минуту','Wait 1 minute'][LANG])
			return;
		}		
		
		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());
		
		//пишем сообщение в чат и отправляем его		
		const msg = await keyboard.read(70);		
		if (msg) {			
			const hash=this.make_hash();
			const index=chat.get_oldest_index();
			fbs.ref(chat_path+'/'+index).set({uid:my_data.uid,name:my_data.name,msg, tm:firebase.database.ServerValue.TIMESTAMP,index, hash});
		}	
		
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

		objects.desktop.texture=gres.lb_bcg.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');
		
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
			target.avatar.texture=players_cache.players[leader.uid].texture;		
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
	sw_header:{time:0,index:0,header_list:[]},
	
	activate() {
		
		//первый запуск лобби
		if (!this.activated){			
			//расставляем по соответствующим координатам
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=40+iy*83;
			
				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=800+ix*196;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=ix*196;
				}
			}		

			//запускаем чат
			chat.init();
			
			//создаем заголовки
			const room_desc=['КОМНАТА #','ROOM #'][LANG]+{'states':1,'states2':2,'states3':3,'states4':4,'states5':5}[room_name];
			this.sw_header.header_list=[['ДОБРО ПОЖАЛОВАТЬ В ИГРУ ДОМИНО ОНЛАЙН ДУЭЛЬ!','WELCOME!!!'][LANG],room_desc]
			objects.lobby_header.text=this.sw_header.header_list[0];
			this.sw_header.time=Date.now()+12000;
			this.activated=true;
		}
		
		objects.desktop.texture=gres.lobby_bcg.texture;
		anim2.add(objects.lobby_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		
		objects.cards_cont.x=0;
		
		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;
		
		//процессинг
		some_process.lobby=function(){lobby.process()};

		//добавляем карточку ии
		this.add_card_ai();


		
		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name) .on('value', (snapshot) => {lobby.players_list_updated(snapshot.val());});

	},

	players_list_updated(players) {

		//если мы в игре то не обновляем карточки
		if (state==='p'||state==='b')
			return;

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
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
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
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игрокова
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
					
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<objects.mini_cards.length;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name, uid:card_uid});
			}
		}
		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<objects.mini_cards.length;i++) {			
			
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
		for(let i=1;i<objects.mini_cards.length;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
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
			this.place_new_card({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			
			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2,game_id});
		}
		
	},

	get_state_texture(s) {
	
		switch(s) {

			case 'o':
				return gres.mini_player_card.texture;
			break;

			case 'b':
				return gres.mini_player_card_bot.texture;
			break;

			case 'p':
				return gres.mini_player_card.texture;
			break;
			
			case 'b':
				return gres.mini_player_card.texture;
			break;

		}
	},
	
	place_table(params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400,game_id:0}) {
				
		for(let i=1;i<objects.mini_cards.length;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				const card=objects.mini_cards[i];
				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";
				
				
				card.bcg.texture = gres.mini_player_card_table.texture;
				
				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;
												
				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.t_country.visible = false;
				card.name_text.visible = false;

				//Включаем элементы стола 
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
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

	update_existing_card(params={id:0, state:'o' , rating:1400, name:'',uid:0}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state);
		card.state=params.state;

		//добавляем страну и имя из кэша
		const cached_player=players_cache.players[params.uid];
		card.name=params.name;
		card.name_text.set2(cached_player.name,105);
				
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: "o", name: "XXX", rating: rating,uid:0}) {

		for(let i=1;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = 'single';
				
				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.table_rating_hl.visible=false;
				
				//включаем элементы свободного стола
				card.avatar.visible = true;
				card.rating_text.visible = true;	
				card.name_text.visible = true;
				card.t_country.visible = true;
				
				//добавляем страну и имя из кэша
				const cached_player=players_cache.players[params.uid];
				card.t_country.text = cached_player.country||'';;
				card.name=params.name;
				card.name_text.set2(cached_player.name,105);
				
			
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;

				//стираем старые данные
				card.avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async get_texture(pic_url) {
		
		if (!pic_url) PIXI.Texture.WHITE;
		
		//меняем адрес который невозможно загрузить
		if (pic_url==="https://vk.com/images/camera_100.png")
			pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";	
				
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {
					
			let loader=new PIXI.Loader();
			loader.add('pic', pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
			await new Promise((resolve, reject)=> loader.load(resolve))	
			return loader.resources.pic.texture||PIXI.Texture.WHITE;

		}		
		
		return PIXI.utils.TextureCache[pic_url];		
	},
		
	async load_avatar2 (params={}) {		
		
		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);
		
		//устанавливаем если это еще та же карточка
		params.tar_obj.texture=players_cache.players[params.uid].texture;			
	},

	add_card_ai() {

		//убираем элементы стола так как они не нужны
		const card=objects.mini_cards[0];
		card.rating_text1.visible=false;
		card.rating_text2.visible=false;
		card.avatar1.visible=false;
		card.avatar2.visible=false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=gres.mini_player_card_ai.texture;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text=['Бот','Bot'][LANG];

		card.rating=1400;		
		card.rating_text.text = card.rating;
		card.avatar.texture=gres.pc_icon.texture;
		
		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name=['Бот','Bot'][LANG];
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=gres.pc_icon.texture;			
		}
		
		
		if (this.first_run){
			objects.hand.angle=0;
			objects.hint_cont.x=240;
			objects.hint_cont.y=30;
			objects.hint_cont.visible=true;
			objects.t_hint.text=["НАЖМИТЕ ЧТОБЫ ОТКРЫТЬ КАРТОЧКУ ИГРОКА","CLICK TO OPEN THE PLAYER'S CARD"][LANG];
			anim2.add(objects.hand,{x:[230,190],y:[160,120]}, true, 4,'ease3peaks',false);
		}
	},
	
	card_down(card_id) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog(card_id) {
					
		
		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');
		
		const card=objects.mini_cards[card_id];
		
		objects.td_cont.card=card;
		
		objects.td_avatar1.texture = card.avatar1.texture;
		objects.td_avatar2.texture = card.avatar2.texture;
		
		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;
		
		objects.td_name1.set2(card.name1, 240);
		objects.td_name2.set2(card.name2, 240);
		
	},
	
	close_table_dialog() {
		sound.play('close_it');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	show_invite_dialog(card_id) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		const card=objects.mini_cards[card_id];
		
		//копируем предварительные данные
		lobby._opp_data = {uid:card.uid,name:card.name,rating:card.rating};
			
		
		this.show_feedbacks(lobby._opp_data.uid);
		
		objects.invite_button_title.text=['ПРИГЛАСИТЬ','SEND INVITE'][LANG];

		let invite_available=lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (card.state==="o" || card.state==="b");
		invite_available=invite_available || lobby._opp_data.uid==='bot';
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//на моей карточке показываем стастику
		if(lobby._opp_data.uid===my_data.uid){
			objects.invite_my_stat.text=[`Рейтинг: ${my_data.rating}\nИгры: ${my_data.games}`,`Rating: ${my_data.rating}\nGames: ${my_data.games}`][LANG]
			objects.invite_my_stat.visible=true;
		}else{
			objects.invite_my_stat.visible=false;
		}
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=my_data.uid===lobby._opp_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=card.avatar.texture;
		objects.invite_name.set2(lobby._opp_data.name,230);
		objects.invite_rating.text=card.rating_text.text;
		
		
		if (this.first_run){			
			objects.hint_cont.visible=true;
			objects.hint_cont.x=80;
			objects.hint_cont.y=160;
			objects.hand.angle=134;
			objects.t_hint.text=["НАЖМИТЕ ЧТОБЫ НАЧАТЬ ИГРУ","CLICK TO START A GAME"][LANG];
			anim2.add(objects.hand,{x:[425,480],y:[220,220]}, true, 4,'ease3peaks',false)		
		}
	},
	
	fb_delete_down(){
		
		objects.fb_delete_button.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		message.add(['Отзывы удалены','Feedbacks are removed'][LANG])
		
	},
	
	async show_invite_dialog_from_chat(uid,name) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		//await this.update_players_cache_data(uid);
					
		//копируем предварительные данные
		lobby._opp_data = {uid,name:players_cache.players[uid].name,rating:players_cache.players[uid].rating};
											
		this.show_feedbacks(lobby._opp_data.uid);
		
		objects.invite_button_title.text=['ПРИГЛАСИТЬ','SEND INVITE'][LANG];

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=false;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=players_cache.players[uid].texture;
		objects.invite_name.set2(players_cache.players[uid].name,230);
		objects.invite_rating.text=players_cache.players[uid].rating;
	},

	async show_feedbacks(uid) {	


			
		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;		
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {
			let _fb = await fbs.ref("fb/" + uid).once('value');
			fb_obj =_fb.val();	
			
			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};			
			this.fb_cache[uid].tm=Date.now();					
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;				
			}else{
				fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
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
		
		some_process.lobby=function(){};

		//плавно все убираем
		anim2.add(objects.lobby_cont,{alpha:[1, 0]}, false, 0.1,'linear');

		//больше ни ждем ответ ни от кого
		pending_player="";
		
		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},
	
	async inst_message(data){
		
		//когда ничего не видно не принимаем сообщения
		if(!objects.lobby_cont.visible) return;		

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);		
		
		sound.play('inst_msg');		
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		objects.inst_msg_avatar.texture=players_cache.players[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,300);
		objects.inst_msg_cont.tm=Date.now();
	},
	
	async inst_message2(t){
		
		sound.play('locked');		
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		objects.inst_msg_avatar.texture=gres.pc_icon.texture;
		objects.inst_msg_text.text=t;
		objects.inst_msg_cont.tm=Date.now();
	},
	
	process(){
		
		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear');

		if (tm>this.sw_header.time){
			this.switch_header();			
			this.sw_header.time=tm+12000;
			this.sw_header.index=(this.sw_header.index+1)%this.sw_header.header_list.length;
			this.switch_header();
		}

	},
	
	peek_down(){
		
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();	
		
		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
	},
	
	async switch_header(){
		
		await anim2.add(objects.lobby_header,{y:[objects.lobby_header.sy, -60],alpha:[1,0]},false,1,'linear',false);	
		objects.lobby_header.text=this.sw_header.header_list[this.sw_header.index];		
		anim2.add(objects.lobby_header,{y:[-60,objects.lobby_header.sy],alpha:[0,1]},true,1,'linear',false);	

		
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

	close_invite_dialog() {

		sound.play('close_it');

		if (objects.invite_cont.visible===false)
			return;
		
		

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{x:[objects.invite_cont.x, 800]}, false, 0.15,'linear');
	},

	async send_invite() {


		if (!objects.invite_cont.ready||!objects.invite_cont.visible)
			return;

		if (anim2.any_on() === true) {
			sound.play('locked');
			return
		};
		
		//если окошко открыто
		if(objects.hint_cont.visible) this.close_hints();

		if (lobby._opp_data.uid==='bot')
		{
			await this.close();	

			opp_data.name=['Бот','Bot'][LANG];
			opp_data.uid='bot';
			opp_data.rating=1400;
			game.activate(bot,irnd(1,9999),1);
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text=['Ждите ответ..','Waiting...'][LANG];
			fbs.ref('inbox/'+lobby._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite() {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.inst_message2(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG]);
		this.close_invite_dialog();
		//big_message.show(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],'---');


	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data;
		
		//закрываем меню и начинаем игру
		await lobby.close();
		game.activate(online_player,seed,0);
		
	},

	goto_chat_down(){
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();
		chat.activate();
		
	},

	swipe_down(dir){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;
		
		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}
		
		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	close_hints(){
		objects.hint_cont.visible=false;
		anim2.kill_anim(objects.hand);
		objects.hand.visible=false;		
		if(objects.hint_cont.x===80) this.first_run=0;
	},

	async exit_lobby_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

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

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
	
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
		script.onload = resolve
		script.onerror = reject
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
		} catch(e){}

		return country_code;
		
	},
	
	async get_country_code2() {

		let country_code = ''
		try {
			let resp1 = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=1efc1ba695434f2ab24129a98a72a1d4");
			let resp2 = await resp1.json();			
			country_code = resp2.country_code2 || '';			
		} catch(e){}

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
		
			return;
		}
		
		if (game_platform === 'VK') {
			
			try {await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')} catch (e) {alert(e)};
			
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

	fbs.ref(room_name+'/'+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden, opp_id : small_opp_id, game_id});

}

function vis_change() {

	if (document.hidden === true) {
		hidden_state_start = Date.now();			
		PIXI.sound.volumeAll=0;	
	} else {
		PIXI.sound.volumeAll=1;	
	}		
	set_state({hidden : document.hidden});
		
		
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
	
	if (s.includes('yandex')) {
		
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
	LANG = 0//await language_dialog.show();
		

}

async function check_blocked(){
	
	//загружаем остальные данные из файербейса
	let _block_data = await fbs.ref("blocked/" + my_data.uid).once('value');
	let block_data = _block_data.val();
	
	if (block_data) my_data.blocked=1;
		
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
						
	//отображаем шкалу загрузки
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(41,41,41,1);flex-direction: column	}#m_progress {	  background: #1a1a1a;	  justify-content: flex-start;	  border-radius: 5px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;	  border-radius: 5px;	  background: rgb(119, 119, 119);	  height: 70%;	  width: 0%;	}	</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
							
	await load_resources();	

	//подгружаем библиотеку аватаров
	await auth2.load_script('multiavatar.min.js');	
		
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
	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x202020});
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

	//события изменения окна
	resize();
	window.addEventListener("resize", resize);
	
	//идентификатор клиента
	client_id = irnd(10,999999);

	//создаем спрайты и массивы спрайтов и запускаем первую часть кода
	for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }
		
	//обрабатываем вторую часть кода в объектах
	for (var i = 0; i < load_list.length; i++) {
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
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }

	
	//запускаем главный цикл
	main_loop();
	
	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}

	await auth2.init();



	//это разные события
	document.addEventListener('visibilitychange', vis_change);
	window.addEventListener('wheel', (event) => {	
		//lobby.wheel_event(Math.sign(event.deltaY));
		chat.wheel_event(Math.sign(event.deltaY));
	});	
	window.addEventListener('keydown', function(event) { keyboard.keydown(event.key)});
	
	
	//загружаем остальные данные из файербейса
	let _other_data = await fbs.ref('players/' + my_data.uid).once('value');
	let other_data = _other_data.val();
	if(!other_data) lobby.first_run=1;

	//сервисное сообщение
	if(other_data && other_data.s_msg){
		message.add(other_data.s_msg);
		fbs.ref('players/'+my_data.uid+'/s_msg').remove();
	}

	my_data.rating = (other_data?.rating) || 1400;
	my_data.games = (other_data?.games) || 0;
	my_data.nick_tm = (other_data?.nick_tm) || 0;
	my_data.name = (other_data?.name)||my_data.name;
	my_data.skin_id = (other_data?.skin_id) || 0;
	my_data.bcg_id = (other_data?.bcg_id) || 0;
	my_data.country = other_data?.country || await auth2.get_country_code() || await auth2.get_country_code2() 
	
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

	//устанавливаем фотку в попап
	objects.id_avatar.texture=players_cache.players[my_data.uid].texture;
	
	//проверяем блокировку
	check_blocked();
		
	//устанавлием имена
	objects.id_name.set2(my_data.name,150);	
			
	//номер комнаты
	//номер комнаты
	const rooms_ranges = [0,1410,1510,9999]
	if (my_data.rating > rooms_ranges[0] && my_data.rating <= rooms_ranges[1])
		room_name= 'states';
	if (my_data.rating > rooms_ranges[1] && my_data.rating <= rooms_ranges[2])
		room_name= 'states2';
	if (my_data.rating > rooms_ranges[2] && my_data.rating <= rooms_ranges[3])
		room_name= 'states3';
	
	
	//room_name= 'states5';	
	//это путь к чату
	chat_path='chat';
	
	//устанавливаем рейтинг в попап
	objects.id_rating.text=my_data.rating;

	//убираем лупу
	some_process.loup_anim = function(){};
	objects.id_loup.visible=false;

	//обновляем почтовый ящик
	fbs.ref('inbox/'+my_data.uid).set({sender:'-',message:'-',tm:'-',data:9});

	//подписываемся на новые сообщения
	fbs.ref('inbox/'+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

	//обновляем данные в файербейс так как могли поменяться имя или фото
	fbs.ref('players/'+my_data.uid+'/name').set(my_data.name);
	fbs.ref('players/'+my_data.uid+'/pic_url').set(my_data.pic_url);
	fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating);
	fbs.ref('players/'+my_data.uid+'/games').set(my_data.games);
	fbs.ref('players/'+my_data.uid+'/country').set(my_data.country||'');
	fbs.ref('players/'+my_data.uid+'/tm').set(firebase.database.ServerValue.TIMESTAMP);
				
	//устанавливаем мой статус в онлайн
	set_state({state:'o'});
	
	//сообщение для дубликатов
	fbs.ref('inbox/'+my_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id});

	//отключение от игры и удаление не нужного
	fbs.ref('inbox/'+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	//убираем попап
	setTimeout(function(){anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack')},2000);
	
	//контроль за присутсвием
	var connected_control = fbs.ref('.info/connected');
	connected_control.on('value', snap=>{
	  if (snap.val())
		connected = 1;
	  else
		connected = 0;
	});
	
	//показыаем основное меню
	main_menu.activate();	



}

async function load_resources() {

	document.getElementById("m_progress").style.display = 'flex';

	let git_src='https://akukamil.github.io/domino/'
	git_src=''

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];
	
	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/Bahnschrift/font.fnt");
	
	game_res.add('music',git_src+'sounds/music.mp3');

	game_res.add('receive_move',git_src+'sounds/receive_move.mp3');
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('message',git_src+'sounds/message.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('win',git_src+'sounds/win.mp3');
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('click2',git_src+'sounds/click2.mp3');
	game_res.add('click3',git_src+'sounds/click3.mp3');
	game_res.add('close_it',git_src+'sounds/close_it.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('clock',git_src+'sounds/clock.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	game_res.add('online_message',git_src+'sounds/online_message.mp3');
	game_res.add('inst_msg',git_src+'sounds/inst_msg.mp3');
	game_res.add('domino',git_src+'sounds/domino.mp3');
	game_res.add('domino2',git_src+'sounds/domino2.mp3');
	game_res.add('round',git_src+'sounds/round.mp3');
	game_res.add('skip',git_src+'sounds/skip.mp3');
	game_res.add('progress',git_src+'sounds/progress.mp3');
	game_res.add('bazar',git_src+'sounds/bazar.mp3');
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+"."+load_list[i].image_format);		

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	//прогресс
	game_res.onProgress.add(function(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	});

	
	
	await new Promise((resolve, reject)=> game_res.load(resolve))
	
	//убираем элементы загрузки
	document.getElementById("m_progress").outerHTML="";	
	
	
	//короткое обращение к ресурсам
	gres=game_res.resources;

}

function main_loop() {

	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();	
	
	game_tick+=0.016666666;
	anim2.process();
	requestAnimationFrame(main_loop);
}