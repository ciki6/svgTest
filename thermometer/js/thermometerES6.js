// import $ from "jquery";
// import * as d3 from "d3";

class Thermometer{
    constructor(){
        _setDefaultValues();
        _setDefaultFunctions();
    };

    static render(userOptions){
        console.log("render");
        _render(userOptions);
    }

    static update(userOptions){
        _calculateHeight(userOptions);
    }


}

// export {thermometerES6};

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
    for (let x in option1){
        if (option2[x]){
            option1[x] = option2[x];
        }
    }
    return option1;
}

function _calculateHeight(userOptions) {
    if(this.options ===undefined){
        this.options = this._mergeOptions(this.defaults, userOptions);
    }else if(userOptions === undefined) {
        this.options = this._mergeOptions(this.options, this.defaults);
    }else{
        this.options = this._mergeOptions(this.options, userOptions);
    }
    if(this.options.target > this.options.max || this.options.target < this.options.min){
        alert("值必须在最小值"+this.options.min+"和最大值"+this.options.max+"之间");
    }
    this.height = (this.options.target-this.options.min)*this.options.Height/(this.options.max-this.options.min);
    this._update();

}

function _render(userOptions) {

    this._calculateHeight(userOptions);

    let svgContainer = d3.select("body").append("svg")
        .attr("width" , 200)
        .attr("height" , 400);

    let rect = svgContainer.append("rect")
        .attr("x",this.options.X)
        .attr("y",this.options.Y)
        .attr("width",this.options.Width)
        .attr("height",this.options.Height)
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("fill","transparent");

    let circle = svgContainer.append("circle")
        .attr("cx",this.options.X+this.options.Width/2)
        .attr("cy",this.options.Y+this.options.Height+this.options.Width/2+4)
        .attr("r",this.options.Width/2+4)
        .attr("fill",this.options.fillColor)
        .attr("stroke","black")
        .attr("stroke-width",2);

    let yScale = d3.scaleLinear()
        .domain([this.options.min,this.options.max])
        .range([this.options.Height, 0]);

    let yAxis = d3.axisRight(yScale);

    svgContainer.append("g")
        .attr("class","axis")
        .attr("transform","translate(20,10)")
        .call(yAxis);

    let fillRect = svgContainer.append("rect")
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
