!function () {
    var Thermometer = function(options) {
        this.userOptions = options;

        this._setDefaultValues = _setDefaultValues;
        this._setDefaultFunctions = _setDefaultFunctions;

        this._setDefaultValues();
        this._setDefaultFunctions();
    };

    function _setDefaultValues(){
        this.defaults = {
            target: 100,
            fillColor: "red",
            max: 200,
            min: 0,
            proportion: 10,
            Height: 300,
            Width: 10,
            X: 10,
            Y: 10,
            animateTime: 2
        }
    }

    function _setDefaultFunctions() {
        this._mergeOptions = _mergeOptions;
        this._calculateHeight = _calculateHeight;
        this._makeSVG = _makeSVG;
        this._render = _render;
        this._update = _update;

    }

    function _mergeOptions(option1 , option2){
        this.options = $.extend({}, option1, option2);
        return this.options;
    }

    function _calculateHeight(target) {
        if(target!==undefined){
            this.userOptions.target = target;
        }
        this.options = this._mergeOptions(this.defaults , this.userOptions);
        if(this.options.target > this.options.max || this.options.target < this.options.min){
            alert("值必须在最小值"+this.options.min+"和最大值"+this.options.max+"之间");
        }
        this.height = (this.options.target-this.options.min)*this.options.Height/(this.options.max-this.options.min);
        this._update();

    }

    function _makeSVG(tag , attr){
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attr)
            el.setAttribute(k, attr[k]);
        return el;
    }

    function _render() {
        var bg = this._makeSVG('rect',{'class':'bg' , 'fill':'white'});
        var bottom = this._makeSVG('circle',{'class':'bottom'});
        var fill = this._makeSVG('rect',{'class':'fill'});
        $(".thermometer").append(bg);
        $(".thermometer").append(bottom);
        $(".thermometer").append(fill);

        this._calculateHeight();
    }

    function _update() {
        $(".thermometer").find('line').remove();
        $(".thermometer").find('text').remove();

        $(".bg").attr({
            "x" : this.options.X,
            "y" : this.options.Y,
            "width" : this.options.Width,
            "height" : this.options.Height
        });
        $(".bg").css({
            "stroke-width" : 1,
            "stroke" : "black"
        });
        $(".fill").attr({
            "height" : this.height,
            "width" : this.options.Width-2,
            "x" : this.options.X+1,
            "y" : this.options.Height-this.height+this.options.Y
        });
        $(".fill").css({
            "fill" : this.options.fillColor,
            "transition" : this.options.animateTime+"s"
        });
        $(".bottom").attr({
            "cx" : this.options.X+this.options.Width/2,
            "cy" : this.options.Y+this.options.Height+3,
            "r" : this.options.Width/2+4
        });
        $(".bottom").css({
            "fill" : this.options.fillColor,
            "stroke-width" : 2,
            "stroke" : "black",
            "transition" : this.options.animateTime+"s"
        });

        for(var i=0; i<= (this.options.max-this.options.min)/this.options.proportion; i++){
            var scale = this._makeSVG('line' , {'id' : 'scale'+i});
            var scaleText = this._makeSVG('text' , {'id' : 'scaleText'+i});
            $(".thermometer").append(scale);
            $(".thermometer").append(scaleText);
            var x1 = this.options.X + this.options.Width;
            var x2;
            i % 5 == 0 ? x2 = x1 + 8 : x2 = x1 + 5;
            $("#scale"+i).attr({
                'x1' : x1,
                'y1' : this.options.Y+this.options.Height-i*this.options.Height*this.options.proportion/(this.options.max-this.options.min),
                'x2' : x2,
                'y2' : this.options.Y+this.options.Height-i*this.options.Height*this.options.proportion/(this.options.max-this.options.min)
            });
            $("#scale"+i).css({
                "stroke-width" : 2,
                "stroke" : "black"
            });
            $("#scaleText"+i).attr({
                'x' : x2 + 3,
                'y' : this.options.Y+this.options.Height-i*this.options.Height*this.options.proportion/(this.options.max-this.options.min)+6,
                'fill' : 'black'
            });
            $("#scaleText"+i)[0].textContent = this.options.min + this.options.proportion * i;
        }
    }

    Thermometer.prototype.render = function () {
        this._render();
    };

    Thermometer.prototype.update = function (target) {
        this._calculateHeight(target);
    };

    this.Thermometer = Thermometer;

}();