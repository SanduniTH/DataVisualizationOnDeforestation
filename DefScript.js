function init(){
  var w = 800;
  var h = 400;

  var barPadding = 1;

  var sortOrder = false;

  var dataset = [176977, 339888, 57935, 154488, 1347132, 144571, 94785, 140185, 77266, 481248]
  var dataset2 = [
                    [7, "Colombia 176,977 ha"],
                    [8, "Indonesia 339,888 ha"],
                    [1, "Cameroon 57,935 ha"],
                    [6, "Bolivia 154,488 ha"],
                    [99, "Brazil 1,1347,132 ha"],
                    [5, "Malaysia 144,571 ha"],
                    [3, "Madagascar 94,785 ha"],
                    [4, "Peru 140,185 ha"],
                    [2, "Papua New Guinea 77,266 ha"],
                    [9, "DRC 481,248 ha"]

                  ];

  var numValues = dataset.length;
  var maxValue = 30;

  var yScale1 = d3.scaleBand()
                 .domain(d3.range(dataset.length))
                 .rangeRound([0, 325])
                 .paddingInner(0.05);


  var xScale1 = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) {
                      return d;         })])
                  .rangeRound([0, w]);

  var BarChart = d3.select("#BarChart")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("class", "svg");


      BarChart.selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("x", function(d, i){
            return 230;
          })
          .attr("y", function(d, i){
            return yScale1(i);
          })
          .attr("height", yScale1.bandwidth())
          .attr("width", function(d){
            return xScale1(d);
          })
          .attr("fill", "#339966");

      BarChart.selectAll("text")
          .data(dataset2)
          .enter()
          .append("text")
          .text(function(d){
            return d[1];
          })
          .attr("x", function(d, i){
            return 110;
          })
          .attr("y", function(d, i){
            return yScale1(i) + 20;
          })
          .attr("fill", "#339966")
          .attr("text-anchor", "middle");



          d3.select("#Transform")
            .on("click", function(){

              sortOrder = !sortOrder;

              BarChart.selectAll("rect")
                  .sort(function(a, b){
                    if(sortOrder){
                      return d3.ascending(a, b);
                    } else{
                      return d3.descending(a, b);
                    }
                  })
                  .transition()
                  .duration(1000)
                  .attr("y", function(d, i){
                    return yScale1(i);
                  });

               BarChart.selectAll("text")
                  .sort(function(a, b){
                    if(sortOrder){
                      return d3.ascending(a, b);
                    } else{
                      return d3.descending(a, b);
                    }
                  })
                  .transition()
                  .duration(1000)
                  .attr("y", function(d, i){
                        return yScale1(i) + 20;
                  })
                  .attr("fill", "#339966")
                  .attr("text-anchor", "middle");

          //      };

          })

  var projection = d3.geoMercator()
                      .translate([450, h/2])
                      .scale(100);

  var path = d3.geoPath()
                .projection(projection);

  var color = d3.scaleQuantize()
                .range(['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#70db70','#74c476','#41ab5d','#238b45','#006d2c','#00441b']);

  var WorldMap1 =  d3.select("#WorldMap1")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

  var WorldMap2 =  d3.select("#WorldMap2")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h);

  d3.csv("ForestLandArea.csv").then(function(data){

      color.domain([
              d3.min(data, function(d){ return d.TLA2000; }),
              d3.max(data, function(d){ return d.TLA2000; })
      ]);

      d3.json("countries.geojson").then(function(json){

          for(var i = 0; i < data.length; i++){
            var dataCountry = data[i].Entity;
            var dataValue1 = parseFloat(data[i].TLA2000);
            var dataValue2 = parseFloat(data[i].TLA2015);


            for(var j = 0; j < json.features.length; j++){
              var jsonCountry = json.features[j].properties.Entity;

              if(dataCountry == jsonCountry){

                json.features[j].properties.value1 = dataValue1;
                json.features[j].properties.value2 = dataValue2;

                break;
              }
            }
          }

          WorldMap1.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("stroke", "black")
              .attr("stroke-opacity", 0.2)
              .style("fill", function(d){
                  var value = d.properties.value1;

                  if(value){
                    return color(value);
                  } else {
                    return "#ccc"
                  }
              })
              .append("title")
              .attr("class", "tooltip")
              .text(function(d){

                    return (d.properties.Entity + " " + Math.round(d.properties.value1 * 100)/100 + "%");
              });

          WorldMap2.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("stroke", "black")
              .attr("stroke-opacity", 0.2)
              .style("fill", function(d){
                  var value = d.properties.value2;

                  if(value){
                    return color(value);
                  } else {
                    return "#ccc"
                  }
              })
              .append("title")
              .attr("class", "tooltip")
              .text(function(d){

                    return (d.properties.Entity + " " + Math.round(d.properties.value2 * 100)/100 + "%");
              });

      });
  });

  var padding1 = 60;

  var dataset3;

  d3.csv("DeforestationBrazil.csv", function(d){
    return{
      year: new Date(d.year),
      number: parseFloat(d.hectares)
    };
    }).then(function(data){
          dataset3 = data;

          console.table(dataset3,["year", "number"]);

  xScale2 = d3.scaleTime()
            .domain([
              d3.min(dataset3, function(d) { return d.year; }),
              d3.max(dataset3, function(d) { return d.year; })
            ])
            .range([0, 600]);

yScale2 = d3.scaleLinear()
            .domain([0, 3200000])
            .range([300, 0]);

var xAxis = d3.axisBottom()
              .scale(xScale2);

var yAxis = d3.axisLeft()
              .scale(yScale2);


var area = d3.area()
              .x(function(d) { return xScale2(d.year); })
              .y0(function() { return yScale2.range()[0]; })
              .y1(function(d) { return yScale2(d.number); });


var AreaChart = d3.select("#AreaChart")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

AreaChart.append("path")
    .datum(dataset3)
    .attr("class", "line")
    .attr("d", area)
    .attr("transform", "translate(" + padding1 + ", 0)")
    .attr("fill", "#b3ffb3");

AreaChart.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + padding1 + ", " + (300) + ")")
   .call(xAxis)
   .attr("color", "#339966");

AreaChart.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + padding1 + ", 0)")
   .call(yAxis)
   .attr("color", "#339966");

d3.select("#Show")
  .on("click", function(){

    AreaChart.append("line")
              .transition()
              .duration(2000)
              .attr("x1", padding1)
              .attr("y1", yScale2(2830976))
              .attr("x2", 585)
              .attr("y2", yScale2(2830976))
              .attr("stroke", "red")
              .attr("stroke-dasharray","10,10");

    AreaChart.append("text")
              .transition()
              .duration(2000)
              .attr("x", padding1 + 10)
              .attr("y", yScale2(2830976) + 17)
              .attr("fill", "red")
              .text("2016 record losses due to Historic Fires! -  2,830,976 ha");

    AreaChart.append("line")
              .transition()
              .duration(2000)
              .attr("x1", padding1)
              .attr("y1", yScale2(2134648))
              .attr("x2", 625)
              .attr("y2", yScale2(2134648))
              .attr("stroke", "red")
              .attr("stroke-dasharray","10,10");

    AreaChart.append("text")
              .transition()
              .duration(2000)
              .attr("x", padding1 + 10)
              .attr("y", yScale2(2134648) + 17)
              .attr("fill", "red")
              .text("2017 record losses due to Historic Fires! - 2,134,648 ha");

      //};

  })

})


}

window.onload = init;
