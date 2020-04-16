$('#radio1').on('click', function() {
    $(".text1").show();
    $(".text2").hide();
    $(".text3").hide();
    $(".text4").hide();
});

$('#radio2').on('click', function() {
    $(".text1").hide();
    $(".text2").show();
    $(".text3").hide();
    $(".text4").hide();
});

$('#radio3').on('click', function() {
    $(".text1").hide();
    $(".text2").hide();
    $(".text3").show();
    $(".text4").hide();
});

$('#radio4').on('click', function() {
    $(".text1").hide();
    $(".text2").hide();
    $(".text3").hide();
    $(".text4").show();
});

//margins and radius
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width =  825 - margin.right - margin.left,
    height = 550 - margin.top - margin.bottom,
    radius = width/2;

var color = d3.scaleOrdinal()
    .range(["#00529B","#FFC422"]);

var data1 = "QuarterSeason.csv";
var data2= "HalfSeason.csv";
var data3= "ThreeQuartersSeason.csv";
var data4= "EndSeason.csv";

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("font-weight", "bold")
    .style("width", "120px")
    .style("background-color", "black")
    .style("color", "white")
    .style("text-align", "center")
    .style("border-radius", "6px")
    .style("padding", "5px 0")
    .style("font-size", "1.15em")
    .style("visibility", "hidden")
    .text("a simple tooltip");

//Define svg

var svg = d3.select(".chartBox").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate (" + width/2 + "," + height/2 +")");

let chart = d3.select(".chartBox2").append("svg")
    .attr("width", 250)
    .attr("height", height)
    .attr("transform", "translate (" + 0 + "," + 150 +")");

let pieArray = [];
let pathArray = [];

//define bar svg


    var fields =["points", "PDO", "GF", "xGF"];

    function translate(x, y) {
        return `translate (${x}, ${y})`;
    }

d3.csv("QuarterSeason.csv").then(function(data) {
    $(".text1").show();
    data.forEach(function(d) {
        d.points = +d.points;
        d.team = d.team;
        d.pointsEnd = +d.pointsEnd;
        d.PDO = +d.PDO;
        d.GF = +d.GF;
        d.xGF = +d.xGF;
        d.SeasonResult = +d.SeasonResult;
    })

    var key = function(d){ return d.data.label; };
    console.log(key);
    d3.selectAll("input")
        .on("change", change);

    let team1 = data[0].team;
    let team2 = data[1].team;
    let index = 0;
    for (let key in data[0]) {
        if (key != "team") {
            let temp = [{team: team1, [key]: data[0][key]}, {team: team2, [key]: data[1][key]}];
            var arc =  d3.arc()
                .outerRadius(((index + 1) * 40) - 5)
                .innerRadius(index * 40);

            var pie = d3.pie()
                .value(function (d) {
                    return d[key];
                })
                .sort(null);
            // var data_ready = pie(d3.entries(temp))

            // console.log(data_ready)
            var u = svg.selectAll("arc"+index)
                .data(pie(data));

            u.enter().append("path")
                .on('mouseover', function(d, i, node){
                    console.log(d.value);
                    var selectArc = node[0].className.baseVal;

                    tooltip.style("visibility", "visible")
                    tooltip.text(key + ": " + d.value);

                    d3.select(this)
                        .style("opacity", 0.5)

                    let teams = temp.map(d=>(d.team));
                    let teamValues = temp.map(d=>(d[key]));


                    chart.append("g")
                        .attr("class", "barChart")
                        .attr("transform", "translate (" + width/2 + "," + height/2 +")");

                    let xScale = d3.scaleBand(teams,[0,200])
                        .padding(0.1);
                    let yScale = d3.scaleLinear([0,d3.max(teamValues)], [350, 0]);
                    let xAxis = d3.axisBottom(xScale);
                    let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

                    chart.append("text")
                        .attr("class", "label")
                        .attr("x", 120)
                        .attr("y", 15)
                        .attr("text-anchor", "middle")
                        .style("font-size", "16px")
                        .text(function() {
                            console.log(key)
                            return key;
                        });

                    chart.append("g").attr("class", "axis")
                        .attr("transform", translate(30, margin.top))
                        .style("font-size", "13px")
                        .call(yAxis);

                    chart.append("g").attr("class", "axis")
                        .attr("transform", translate(30, margin.top+350))
                        .style("font-size", "13px")
                        .call(xAxis);

                    let inner = chart.append("g").attr("transform", translate(30, margin.top));
                    let bars = inner.selectAll(".bar").data(temp);
                    let finishedBars = bars.enter().append("rect").attr("class", "bar")
                        .merge(bars)
                        .attr("x", (d)=>(xScale(d.team)))
                        .attr("y", (d)=>(yScale(d[key])))
                        .attr("width", xScale.bandwidth())
                        .attr("height", (d)=>(350-yScale(d[key])))
                        .attr("fill", function(d){ return(color(d.team)) });

                })

                .on("mousemove", function(d, i, node) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })


                .on('mouseout', function(d, i, node){
                    tooltip.style("visibility", "hidden")
                    d3.select(this)
                        .style("opacity", 1)
                    d3.selectAll(".label").remove();
                    d3.selectAll(".label").remove();
                    d3.selectAll(".bar").remove();
                    d3.selectAll(".axis").remove();
                })
                .merge(u)
                .transition()
                .duration(2000)
                .attr("class", "arc"+index)
                .attr('d', arc)
                .attr('fill', function(d){ return(color(d.data.team)) });

            u.exit().remove();

            svg.append("text")
                .attr("x", 0)
                .attr("y", (index+0.15)*-40)
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("fill", "#FFFFFF")
                .style("font-size", "0.65em")
                .text(function(d) {return key;});

            //pieArray.push(pieCharts(temp, index, key));
            index++;
        } else if (key == "team") {
            svg.append("text")
                .attr("class", "team one")
                .attr("text-anchor", "end")
                .attr("x", 385)
                .attr('y', -50)
                .text(data[0][key]);
            svg.append("text")
                .attr("class", "team two")
                .attr("text-anchor", "end")
                .attr("x", -290)
                .attr('y', -55)
                .text(data[1][key]);
        }
    }

    var myimage = svg.append('image')
        .attr('xlink:href', 'https://upload.wikimedia.org/wikipedia/de/thumb/4/49/Logo_St_Louis_Blues2.svg/1920px-Logo_St_Louis_Blues2.svg.png')
        .attr('width', 100)
        .attr('height', 100)
        .attr("x", width/2.75)
        .attr("y", height/-16);

    var myimage2 = svg.append('image')
        .attr('xlink:href', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Boston_Bruins.svg/1200px-Boston_Bruins.svg.png.png')
        .attr('width', 100)
        .attr('height', 100)
        .attr("x", width/-2.025)
        .attr("y", height/-17);


    //console.log(pieArray[1]);
})

function change(data) {

    if(data == undefined)
        return;

    d3.csv(data).then(function(data) {
        data.forEach(function(d) {
            d.points = +d.points;
            d.team = d.team;
            d.pointsEnd = +d.pointsEnd;
            d.PDO = +d.PDO;
            d.GF = +d.GF;
            d.xGF = +d.xGF;
            d.SeasonResult = +d.SeasonResult;
        })

        let i = 0;
        var key = function(d){ return d.data.label; };
        let team1 = data[0].team;
        let team2 = data[1].team;
        for (let key in data[0]) {
            if (key != "team") {
                let temp = [{team: team1, [key]: data[0][key]}, {team: team2, [key]: data[1][key]}];

                svg.selectAll(".arc"+i)
                    .remove();
                d3.select("#narrative").remove();

                var arc =  d3.arc()
                    .outerRadius(((i + 1) * 40) - 5)
                    .innerRadius(i * 40);


                var pie = d3.pie()
                    .value(function (d) {
                        return d[key];
                    })
                    .sort(null);

                var u = svg.selectAll("arc"+i)
                    .data(pie(temp))



                u.enter().append('path')
                    .on('mouseover', function(d, i, node){
                        console.log(d.value);
                        var selectArc = node[0].className.baseVal;

                        tooltip.style("visibility", "visible")
                        tooltip.text(key + ": " + d.value);

                        d3.select(this)
                            .style("opacity", 0.5)

                        let teams = temp.map(d=>(d.team));
                        let teamValues = temp.map(d=>(d[key]));


                        chart.append("g")
                            .attr("class", "barChart")
                            .attr("transform", "translate (" + width/2 + "," + height/2 +")");

                        chart.append("text")
                            .attr("class", "label")
                            .attr("x", 120)
                            .attr("y", 15)
                            .attr("text-anchor", "middle")
                            .style("font-size", "16px")
                            .text(function() {
                                console.log(key)
                                return key;
                            });

                        let xScale = d3.scaleBand(teams,[0,200])
                            .padding(0.1);
                        let yScale = d3.scaleLinear([0,d3.max(teamValues)], [350, 0]);
                        let xAxis = d3.axisBottom(xScale);
                        let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

                        chart.append("g").attr("class", "axis")
                            .attr("transform", translate(30, margin.top))
                            .call(yAxis);

                        chart.append("g").attr("class", "axis")
                            .attr("transform", translate(30, margin.top+350))      // This controls the vertical position of the Axis
                            .call(xAxis);

                        let inner = chart.append("g").attr("transform", translate(30, margin.top));
                        let bars = inner.selectAll(".bar").data(temp);
                        let finishedBars = bars.enter().append("rect").attr("class", "bar")
                            .merge(bars)
                            .attr("x", (d)=>(xScale(d.team)))
                            .attr("y", (d)=>(yScale(d[key])))
                            .attr("width", xScale.bandwidth())
                            .attr("height", (d)=>(350-yScale(d[key])))
                            .attr("fill", function(d){ return(color(d.team)) });
                    })

                    .on("mousemove", function(d, i, node) {
                        tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                    })


                    .on('mouseout', function(d, i, node){
                        d3.select(this)
                            .style("opacity", 1)
                        tooltip.style("visibility", "hidden");
                        d3.selectAll(".bar").remove();
                        d3.selectAll(".axis").remove();
                        d3.selectAll(".label").remove();
                    })

                    .merge(u)
                    .transition()
                    .duration(10000)
                    .attr('d', arc)
                    .attr("class", "arc"+i)
                    .attr('fill', function(d){ return(color(d.data.team)) });

                u.exit().remove()

                svg.append("text")
                    .attr("x", 0)
                    .attr("y", (i+0.15)*-40)
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .style("fill", "#FFFFFF")
                    .style("font-size", "0.65em")
                    .text(function(d) {return key;});

                i++;
            }
        }

    })
}