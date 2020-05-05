//1.
function init(sample) {
  option = d3.select("#selDataset")

  d3.json("static/samples.json").then((data) => {

  var names = data.names
  console.log(data);
  names.forEach(name => {
    option.append("option")
          .text(name)
          .attr("value", name)
  })

  var metadata = data.metadata[0];
  var idPanel = d3.select("#sample-metadata")

  Object.entries(metadata).forEach(([key, value]) => {
    idPanel.append("p")
            .text(`${key}: ${value}`)
    })
  })
charts();
d3.select("#selDataset").on("change", optionChanged)
}

function info(newData) {

  var metadata = d3.select("#selDataset").node().value
  console.log(metadata)
  var idPanel = d3.select("#sample-metadata")

  idPanel.html("")

  d3.json("static/samples.json").then(data => {

    var updateData = data.metadata.filter(function(item) {
      return item.id === parseInt(metadata);
    })
     Object.entries(updateData[0]).forEach(([key, value]) => {
    idPanel.append("p")
            .text(`${key}: ${value}`)


    })
  })

}

function optionChanged(sample){
  charts(sample);
  info(sample);


}

function charts(sample){

  d3.json("static/samples.json").then(data => {

    var metadata = d3.select("#selDataset").node().value
    console.log(metadata);
    var updateData = data.samples.filter(function(item) {
      return item.id === metadata.toString();
    })
    console.log(updateData)
    var otu_ids = updateData[0].otu_ids;
    var sample_values = updateData[0].sample_values;
    var labels = updateData[0].otu_labels;

    var top10_samples = sample_values.slice(0, 10).reverse();
    var top10_otu = otu_ids.slice(0, 10).reverse();
    var top10_labels = labels.slice(0, 10);
     var top10_otu_id = top10_otu.map(d => "OTU " + d);
    console.log(top10_otu)
    console.log(top10_samples);

    var trace = {
      x: top10_samples,
      y: top10_otu_id,
      text: top10_labels,
      marker: {
        color: "blue"
      },
      type: "bar",
      orientation: "h"
    }

    var layout = {
      title: "Top 10 OTUs",
    }

    var barData = [trace]

    Plotly.newPlot('bar', barData, layout);

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: labels,
      mode: 'markers',
      marker: {
         size: sample_values,
         color: otu_ids
       }
    }
    var data1 = [trace1];

    var layout1 = {
    title: "OTU ID"
    };

    Plotly.newPlot('bubble', data1, layout1);

  })
}


init();
