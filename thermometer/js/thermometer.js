!function () {
    var Thermometer = function() {
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

    function _render() {

        this._calculateHeight();

        var svgContainer = d3.select("body").append("svg")
            .attr("width" , 200)
            .attr("height" , 400);

        var rect = svgContainer.append("rect")
            .attr("x",this.options.X)
            .attr("y",this.options.Y)
            .attr("width",this.options.Width)
            .attr("height",this.options.Height)
            .attr("stroke","black")
            .attr("stroke-width",1)
            .attr("fill","transparent");

        var circle = svgContainer.append("circle")
            .attr("cx",this.options.X+this.options.Width/2)
            .attr("cy",this.options.Y+this.options.Height+this.options.Width/2+4)
            .attr("r",this.options.Width/2+4)
            .attr("fill",this.options.fillColor)
            .attr("stroke","black")
            .attr("stroke-width",2);

        var yScale = d3.scaleLinear()
            .domain([this.options.min,this.options.max])
            .range([this.options.Height, 0]);

        var yAxis = d3.axisRight(yScale);

        svgContainer.append("g")
            .attr("class","axis")
            .attr("transform","translate(20,10)")
            .call(yAxis);

        var fillRect = svgContainer.append("rect")
            .attr("class","fill")
            .attr("x",this.options.X+1)
            .attr("y",this.options.Height-this.height+this.options.Y)
            .attr("width",this.options.Width-2)
            .attr("height",this.height)
            .attr("fill",this.options.fillColor);
    }

    function _update() {
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
    }

    Thermometer.prototype.render = function () {
        this._render();
    };

    Thermometer.prototype.update = function (target) {
        this._calculateHeight(target);
    };

    this.Thermometer = Thermometer;

}();