// Show metric graphs
// var current_img_x;
// var current_img_y;
// var current_img_z;


window.onload = function() {
  // Try create the 3D renderer
  _webGLFriendly = true;
  try {
    threeD = new X.renderer3D();
    threeD.container = 'threeD';
    threeD.init();
    threeD.camera.position = [0, 0, 800];
    threeD.camera.up = [0, 0, 1];
  } catch (Exception) {
    // no webgl on this machine
    _webGLFriendly = false;
  }

  // console.log(globalThis);
  // Create the 2D renderers
  // X orientation
  var sliceX = new X.renderer2D();
  sliceX.container = 'SliceX';
  sliceX.orientation = 'X';
  sliceX.init();
  // sliceX.interactor.config.MOUSEWHEEL_ENABLED = false;

  // Y orientation
  var sliceY = new X.renderer2D();
  sliceY.container = 'SliceY';
  sliceY.orientation = 'Y';
  sliceY.init();

  // Z orientation
  var sliceZ = new X.renderer2D();
  sliceZ.container = 'SliceZ';
  sliceZ.orientation = 'Z';
  sliceZ.init();


  // create a volume and mesh
  var volume  = new X.volume();
  var mesh    = new X.mesh();
  // var mesh2   = new X.cube();

  // XTK does not like the original nrrd! That's why it has been converted using 3D Slicer.
  volume.file = './data/6465antrumRIMSCUBICx20z08Ex920stacktile22x3transprox_2015_03_15__07_32_04__m53-CH2_after3D.nrrd';
  mesh.file = './data/6465antrumRIMSCUBICx20z08Ex920stacktile22x3transprox_2015_03_15__07_32_04__m53.stl';
  // mesh2.file = 'avf.vtk';
  mesh.color = [0.33, 1.0, 0.1];
  mesh.opacity = 0.8;
  volume.labelmap.file = 'ICC_label.nrrd';
  volume.labelmap.colortable.file = 'my_ct.txt';


  // Add the volume in the main renderer
  // Choose the sliceX here, since this should work also on
  // non-webGL-friendly devices like Safari on iOS
  sliceX.add(volume);
  sliceX.render();


  // Area
  d3.csv("areaX.csv",function(dataX) {
    window.areaX = dataX;
  });

  d3.csv("areaY.csv",function(dataY) {
    window.areaY = dataY;
  });

  d3.csv("areaZ.csv",function(dataZ) {
    window.areaZ = dataZ;
  });

  // density
  d3.csv("densityX.csv",function(dataX) {
    window.densityX = dataX;
  });

  d3.csv("densityY.csv",function(dataY) {
    window.densityY = dataY;
  });

  d3.csv("densityZ.csv",function(dataZ) {
    window.densityZ = dataZ;
  });

  // Connectivity
  d3.csv("connectivityX.csv",function(dataX) {
    window.connectivityX = dataX;
  });

  d3.csv("connectivityY.csv",function(dataY) {
    window.connectivityY = dataY;
  });

  d3.csv("connectivityZ.csv",function(dataZ) {
    window.connectivityZ = dataZ;
  });

  // The onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  sliceX.onShowtime = function() {
    // add the volume to the other 3 renderers\
    window.dataX = window.areaX;
    window.dataY = window.areaY;
    window.dataZ = window.areaZ;

    // alert("Hi!");

    // Window handleResize
    if (typeof window.dataX === 'undefined') {
      alert("Data is not loaded!");
      console.log("Data is not loaded!");
    }
    // recenter
    var center = [volume.bbox[0] + (volume.bbox[1]-volume.bbox[0])/2,
    volume.bbox[2] + (volume.bbox[3]-volume.bbox[2])/2,
    volume.bbox[4] + (volume.bbox[5]-volume.bbox[4])/2
  ];

  mesh.transform.flipX();
  mesh.transform.flipY();

  mesh.transform.translateX(center[0]*2);
  mesh.transform.translateY(center[1]*2);

  // console.log(volume.maxColor);
  // console.log(mesh.color);
   // console.log(mesh.type);
  // mesh.type = 'TRIANGLES';
  volume.opacity = 1.0;

  sliceY.add(volume);
  sliceY.render();

  sliceZ.add(volume);
  sliceZ.render();

  if (_webGLFriendly) {
    threeD.add(volume);
    threeD.add(mesh);
    // threeD.add(mesh2);
    threeD.render();
  }

  // // threejs
  // init();
	// animate();
  // function init() {
  //   container = document.getElementById( 'threeD' );
  //   const width  = container.clientWidth;
  //   const height = container.clientHeight;
  //   // camera
  //   camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1e10 );
  //   camera.position.set(0, 0, 800);
  //
  //   // scene
  //   scene = new THREE.Scene();
  //   scene.add( camera );
  //
  //   const axesHelper = new THREE.AxesHelper( 5 );
  //   scene.add( axesHelper );
  //   // light
  //   const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
  //   scene.add( hemiLight );
  //
  //   const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  //   dirLight.position.set( 0, 0, 200 );
  //   scene.add( dirLight );
  //
  //   // renderer
  //   renderer = new THREE.WebGLRenderer();
  //   renderer.setSize( width, height );
  //   container.appendChild( renderer.domElement );
  // }
  //
  // function animate() {
  //   renderer.render( scene, camera );
  // }

  // Show metric graphs
  var current_img_x = Math.floor(volume.range[0]/2);
  var current_img_y = Math.floor(volume.range[1]/2);
  var current_img_z = Math.floor((volume.range[2]-1)/2);


  var number_of_images_x = volume.range[0];
  var number_of_images_y = volume.range[1];
  var number_of_images_z = volume.range[2]-1;
  // console.log(volume.range[0],volume.range[1],volume.range[2]);

  var container_txt_x = document.getElementById( 'TextX' );
  container_txt_x.textContent = (current_img_x).toString() + "/" + (volume.range[0]-1).toString();

  var container_txt_y = document.getElementById( 'TextY' );
  container_txt_y.textContent = (current_img_y).toString() + "/" + (volume.range[1]-1).toString();

  var container_txt_z = document.getElementById( 'TextZ' );
  container_txt_z.textContent = (current_img_z).toString() + "/" + (volume.range[2]-1).toString();


  var step_size = 19;
  var images_start_index = 0;
  // Scrolling
  function onScrolling (number_of_images, data, counter, output, sliceController, container, step_size) {
    var delta = -Math.sign(event.deltaY);
    if (delta > 0) {
      counter = sliceController.getValue() + step_size;
      if (counter > number_of_images){
        counter = number_of_images;
      }
    }  else  {
      counter = sliceController.getValue() - step_size;
      if (counter < images_start_index){
        counter = images_start_index;
      }
    }
    // if (counter > images_start_index && counter < number_of_images) {
    // graphUpdate(data, counter, output, container);
    container.textContent = counter.toString() + "/" + (volume.range[0]-1).toString();
    sliceController.setValue(counter);
    // }
  }


  function graphUpdate(data, counter, output, container) {
    var number_of_images = Object.keys(data).length - 2;

    if (counter >= number_of_images){
      counter = number_of_images;
      console.log('out of range!');
    }

    if (counter <= images_start_index){
      counter = images_start_index;
      console.log('out of range!');
    }

    var x = output[0];
    var y = output[1];
    var svg = output[2];

    selectedData = data[counter];
    console.log(selectedData)


    svg.selectAll('circle')
    .datum(selectedData)
    .style("fill", "red")
    .attr("stroke", "red")
    .attr('r', 5)
    .attr("cx", x(selectedData.x))
    .attr("cy", y(selectedData.y))
    .style("opacity", 1)
  }

  window.addEventListener('resize', function(event){
    // X
    document.getElementById("MetricsX").innerHTML = "";
    var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, current_img_x, graph_title);
    // Y
    document.getElementById("MetricsY").innerHTML = "";
    var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, current_img_y, graph_title);
    // Z
    document.getElementById("MetricsZ").innerHTML = "";
    var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, current_img_z, graph_title);
  });


  // X
  document.getElementById("MetricsX").innerHTML = "";
  document.getElementById('SliceX').addEventListener("wheel", event => {
    onScrolling (number_of_images_x, window.dataX, sliceXController.getValue(), outputX, sliceXController, container_txt_x, step_size);
  });
  document.getElementById('SliceX').addEventListener("touchmove", event => {
    onScrolling (number_of_images_x, window.dataX, sliceXController.getValue(), outputX, sliceXController, container_txt_x, step_size);
  });
  // Y
  document.getElementById("MetricsY").innerHTML = "";
  document.getElementById('SliceY').addEventListener("wheel", event => {
    onScrolling (number_of_images_y, window.dataY, sliceYController.getValue(), outputY, sliceYController, container_txt_y, step_size);
  });
  document.getElementById('SliceY').addEventListener("touchmove", event => {
    onScrolling (number_of_images_y, window.dataY, sliceYController.getValue(), outputY, sliceYController, container_txt_y, step_size);
  });
  // Z
  document.getElementById("MetricsZ").innerHTML = "";
  document.getElementById('SliceZ').addEventListener("wheel", event => {
    onScrolling (number_of_images_z, window.dataZ, sliceZController.getValue(), outputZ, sliceZController, container_txt_z, step_size);
  });
  document.getElementById('SliceZ').addEventListener("touchmove", event => {
    onScrolling (number_of_images_z, window.dataZ, sliceZController.getValue(), outputZ, sliceZController, container_txt_z, step_size);
  });

  function graphShow(container, divName, data, current_img, graph_title) {
    var number_of_images = Object.keys(data).length - 2;

    if (current_img >= number_of_images){
      current_img = number_of_images;
      // console.log('out of range!');
    }

    if (current_img <= images_start_index){
      current_img = images_start_index;
      // console.log('out of range!');
    }

    // max and min for axis
    var rangeXmin = Math.min.apply(Math, data.map(function(o) { return o.x; }));
    var rangeXmax = Math.max.apply(Math, data.map(function(o) { return o.x; }));
    var rangeYmin = Math.min.apply(Math, data.map(function(o) { return o.y; }));
    rangeYmin -= rangeYmin * 0.1;
    var rangeYmax = Math.max.apply(Math, data.map(function(o) { return o.y; }));
    rangeYmax += rangeYmax * 0.1;
    // console.log(rangeXmin,rangeXmax);
    // set the dimensions and margins of the graph

    var width = container.clientWidth * 0.8;
    var height = container.clientHeight * 0.8;

    // var current_img_x = 50;
    var params = '-50 ' + '-30 ' + (container.clientWidth * 1.2).toString() + ' ' + (container.clientHeight * 1.2).toString();
    // append the svg object to the body of the page
    var svg = d3.select(divName)
    .append("svg")
    // .attr("width", width)
    // .attr("height", height)
    .attr("viewBox", params)
    .append("g")

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
    .domain([rangeXmin, rangeXmax])
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(7));


    // Add Y axis
    var y = d3.scaleLinear()
    .domain([rangeYmin, rangeYmax])
    .range([height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y).ticks(7)); //.tickFormat(d3.format(".2f")));

    // Title
    svg.append("text")
    .attr("transform", "translate(" + width/2 + "," + 0 + ")")
    .style("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size","18px")
    .attr("font-family", "Calibri")
    .style("font-weight", "bold")

    .text(graph_title);


    // X axis
    // svg.append("text")
    // .attr("transform", "translate(" + width/2 + "," + (height+40) + ")")
    // .style("text-anchor", "middle")
    // .attr("fill", "white")
    // .attr("font-size","14px")
    // // .style("font-weight", "bold")
    // .text("Slice Number");

    // Need adjustments!!!
    // Y axis
    // svg.append("text")
    // .attr("transform", "translate(" + width/2 + "," + (height) + ")")
    // .attr("transform", "rotate(-90)")
    // .style("text-anchor", "middle")
    // .attr("fill", "white")
    // .attr("font-size","14px")
    // // .style("font-weight", "bold")
    // .text("Area");

    selectedData = data[current_img];
    // Create the circle that travels along the curve of chart
    // Add the line
    svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
    .x(function(d) { return x(d.x) })
    .y(function(d) { return y(d.y) })
  )

  svg
  .append('circle')
  .style("fill", "red")
  .attr("stroke", "red")
  .attr('r', 5)
  .attr("cx", x(selectedData.x))
  .attr("cy", y(selectedData.y))
  .style("opacity", 1)

  return [x, y, svg];
}

var graph_title = "Area";
// X
var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, current_img_x, graph_title);
// Y
var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, current_img_y, graph_title);
// Z
var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, current_img_z, graph_title);

//  GUI
var gui = new dat.GUI( { autoPlace: false } );
// The following configures the gui for interacting with the X.volume
var volumegui = gui.addFolder('Volume');
// Switch between slicing and volume rendering
// var vrController = volumegui.add(volume, 'volumeRendering');
// Configure the volume rendering opacity
var opacityController = volumegui.add(mesh, 'opacity', 0, 1);
// Slice numbers
var sliceXController = volumegui.add(volume, 'indexX', 0, volume.range[0]-1).name('Lateral X').step(1).listen().onChange(updateGraphX);
var sliceYController = volumegui.add(volume, 'indexY', 0, volume.range[1]-1).name('Lateral Y').step(1).listen().onChange(updateGraphY);
var sliceZController = volumegui.add(volume, 'indexZ', 0, volume.range[2]-1).name('Axial Z').step(1).listen().onChange(updateGraphZ);


// X
function updateGraphX(value){
  document.getElementById("MetricsX").innerHTML = "";
  var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, value, graph_title);
  graphUpdate(window.dataX, value, outputX, container_txt_x);
  container_txt_x.textContent = value.toString() + "/" + (volume.range[0]-1).toString();
};
// Y
function updateGraphY(value){
  document.getElementById("MetricsY").innerHTML = "";
  var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, value, graph_title);
  graphUpdate(window.dataY, value, outputY, container_txt_y);
  container_txt_y.textContent = value.toString() + "/" + (volume.range[1]-1).toString();
};
// Z
function updateGraphZ(value){
  document.getElementById("MetricsZ").innerHTML = "";
  var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, value, graph_title);
  graphUpdate(window.dataZ, value, outputZ, container_txt_z);
  container_txt_z.textContent = value.toString() + "/" + (volume.range[2]-1).toString();
};

var metrics = {Metrics:"Area"};
volumegui.add(metrics, 'Metrics', [ 'Area', 'Density', 'Connectivity' ] ).listen().onChange(newValue => {switchElement(newValue)});

volumegui.open();

// Put gui on top right
var customContainer = document.getElementById('gui');
customContainer.appendChild(gui.domElement);


// Change metric image
function switchElement(values) {
  // Switch function
  switch (values) {

    case "Area":
    console.log('Area');
    window.dataX = window.areaX;
    window.dataY = window.areaY;
    window.dataZ = window.areaZ;

    graph_title = "Area";
    // X
    document.getElementById("MetricsX").innerHTML = "";
    var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, Math.round(volume.indexX), graph_title);
    // Y
    document.getElementById("MetricsY").innerHTML = "";
    var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, Math.round(volume.indexY), graph_title);
    // Z
    document.getElementById("MetricsZ").innerHTML = "";
    var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, Math.round(volume.indexZ), graph_title);
    break;


    case "Density":
    console.log('Density');
    window.dataX = window.densityX;
    window.dataY = window.densityY;
    window.dataZ = window.densityZ;
    // threeD.camera.position = [0, 0, 1500];

    graph_title = "Density";
    // X
    document.getElementById("MetricsX").innerHTML = "";
    var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, Math.round(volume.indexX), graph_title);
    // Y
    document.getElementById("MetricsY").innerHTML = "";
    var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, Math.round(volume.indexY), graph_title);
    // Z
    document.getElementById("MetricsZ").innerHTML = "";
    var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, Math.round(volume.indexZ), graph_title);
    break;


    case "Connectivity":
    console.log('Connectivity');
    window.dataX = window.connectivityX;
    window.dataY = window.connectivityY;
    window.dataZ = window.connectivityZ;

    graph_title = "Connectivity";
    // X
    document.getElementById("MetricsX").innerHTML = "";
    var outputX = graphShow(MetricsX, "#MetricsX", window.dataX, Math.round(volume.indexX), graph_title);
    // Y
    document.getElementById("MetricsY").innerHTML = "";
    var outputY = graphShow(MetricsY, "#MetricsY", window.dataY, Math.round(volume.indexY), graph_title);
    // Z
    document.getElementById("MetricsZ").innerHTML = "";
    var outputZ = graphShow(MetricsZ, "#MetricsZ", window.dataZ, Math.round(volume.indexZ), graph_title);
    break;


    default:
    break;
  }
}



};
};
