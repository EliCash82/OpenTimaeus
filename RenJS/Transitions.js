RenJS.transitions = {
    CUT: function(from,to,position,scaleX){
        if (from){
            from.alpha = 0;
        }
        if (to) {
            to.x = position.x;
            to.y = position.y;
            to.alpha = 1;
            to.scale.x = scaleX ? scaleX : to.scale.x;
        }
        RenJS.resolve();
    },
    FADE: function(from,to,position,scaleX){
        if (!from){
            RenJS.transitions.FADEIN(to,position);
            return;
        } 
        if (!to){
            RenJS.transitions.FADEOUT(from);
            return;
        }
        RenJS.tweenManager.chain([
            {sprite:from,tweenables:{alpha:0},callback:function(){
                to.x = position.x;
                to.y = position.y;
                to.scale.x = scaleX ? scaleX : to.scale.x;
            }},
            {sprite:to,tweenables:{alpha:1},callback:RenJS.resolve}
        ],RenJS.control.fadeTime);               
    },
    FADEOUT: function(from){
        RenJS.tweenManager.tween(from,{ alpha: 0 },RenJS.resolve,RenJS.control.fadeTime,true);
    },
    FADEIN: function(to,position,scaleX){
        to.x = position.x;
        to.y = position.y;
        to.scale.x = scaleX ? scaleX : to.scale.x;
        RenJS.tweenManager.tween(to,{ alpha: 1 },RenJS.resolve,RenJS.control.fadeTime,true);        
    },
    FUSION: function(from,to,position,scaleX){
        if (!from || !to){
            RenJS.transitions.FADE(from,to,position);
            return;
        }   
        to.x = position.x;
        to.y = position.y; 
        to.scale.x = scaleX ? scaleX : to.scale.x;
        RenJS.tweenManager.parallel([
            {sprite:from,tweenables:{alpha:0}},
            {sprite:to,tweenables:{alpha:1},callback:RenJS.resolve}
        ],RenJS.control.fadeTime);
    },
    MOVE: function(from,to,position,scaleX){
        if (!from || !to){
            RenJS.transitions.CUT(from,to,position);
            return;
        } 
        RenJS.tweenManager.tween(from,{ x:position.x,y:position.y },function(){
            to.x = position.x;
            to.y = position.y;
            to.scale.x = scaleX ? scaleX : to.scale.x;
            from.alpha = 0;
            to.alpha = 1;
            RenJS.resolve();
        },RenJS.control.fadeTime,true);
    },

    FADETOCOLOUR: function(from,to,position,scaleX,colour){
        var spr_bg = game.add.graphics(0, 0);
        // this.fadeColor = fadeColor ? fadeColor : 0x000000;
        spr_bg.beginFill(colour, 1);
        spr_bg.drawRect(0, 0, config.stageSize.w, config.stageSize.h);
        spr_bg.alpha = 0;
        spr_bg.endFill();
        RenJS.tweenManager.chain([
            {sprite:spr_bg,tweenables:{alpha:1},callback:function(){
                if (from){
                    from.alpha = 0;
                }
                if (to) {
                    to.x = position.x;
                    to.y = position.y;
                    to.scale.x = scaleX ? scaleX : to.scale.x;
                    to.alpha = 1;
                }
            }},
            {sprite:spr_bg,tweenables:{alpha:0},callback:function() {
                spr_bg.destroy();
                RenJS.resolve();
            }}
        ],RenJS.control.fadeTime);
    },
    FADETOBLACK: function(from,to,position){
        RenJS.transitions.FADETOCOLOUR(from,to,position,0x000000)
    },
    FADETOWHITE: function(from,to,position){
        RenJS.transitions.FADETOCOLOUR(from,to,position,0xFFFFFF)
    },
    FADETOCOLOUROVERLAY: function (colour) {
        RenJS.transitions.overlay = new Phaser.Graphics(0, 0);
        RenJS.transitions.overlay.beginFill(colour, 1);
        RenJS.transitions.overlay.drawRect(0, 0, config.stageSize.w, config.stageSize.h);
        RenJS.transitions.overlay.alpha = 0;
        RenJS.transitions.overlay.endFill();
        RenJS.storyManager.cgsSprites.add(RenJS.transitions.overlay);
        RenJS.tweenManager.tween(RenJS.transitions.overlay,{ alpha: 1 },function() {},RenJS.control.fadeTime,true);  
    },
    FADEOUTCOLOUROVERLAY: function () {
        if (RenJS.transitions.overlay){
            RenJS.tweenManager.tween(RenJS.transitions.overlay,{ alpha: 1 },function() {
                RenJS.transitions.overlay.destroy();
                RenJS.transitions.overlay = null;
            },RenJS.control.fadeTime,true);  
        }
    }
}


