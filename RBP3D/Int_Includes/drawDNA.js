// Author: Marco Tompitak, marcotompitak.github.io
// created for the Schiessel Lab, schiessellab.github.io

var colorset = [[0x0096FF, 0x9E6B29, 0x9C1773, 0x009626, 0x704F38],[0xA1D99B, 0x74C476, 0x31A354, 0x006D2C, 0x9ECAE1]];
var bgcolorset = [0x000000, 0xffffff];
var color_index = 1;
var shape_index = 0;
var bs_index = 1;
var hipol_bool = false;

function changeMeshColor(id, rgb) {
    if ( id < mesh_id ) {
        meshes[id].material.color.setHex(rgb);
    }
}

function setBGColor() {
    renderer.setClearColor( bgcolorset[color_index] );
}

function setDNAColors() {
    var color;
    for ( i = 0; i < state.length; i++ ) {
        switch (sequence[i]) {
            case 'A':
                color = colorset[color_index][0];
                break;
            case 'T':
                color = colorset[color_index][1];
                break;
            case 'C':
                color = colorset[color_index][2];
                break;
            case 'G':
                color = colorset[color_index][3];
                break;
            default:
                color = colorset[color_index][4];
        }
        changeMeshColor(i, color);
    }
}

function drawBP(x, y, z, R, rgb) {    
    //console.log(+x, +y, +z)
    switch (shape_index) {
      case 0:
        var geometry = new THREE.BoxGeometry( 9,18,1 );
        break;
      case 1:
        var polygons = hipol_bool ? 50 : 12;
        var geometry = new THREE.SphereGeometry( 6, polygons, polygons );
        geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.9, 1.8, 0.1 ) );
        break;
      default:
      case 0:
        var geometry = new THREE.BoxGeometry( 9,18,1 );        
    }
    var material =  new THREE.MeshPhongMaterial( { color:rgb, shading: THREE.FlatShading } );
    meshes[mesh_id] = new THREE.Mesh( geometry, material );
    meshes[mesh_id].position.x = +x;
    meshes[mesh_id].position.y = +y;
    meshes[mesh_id].position.z = +z;
    meshes[mesh_id].updateMatrix();
    RJ = new THREE.Matrix4();
    RJ.fromArray(R);
    //displaySequence(String(R));
    meshes[mesh_id].geometry.applyMatrix(RJ);
    meshes[mesh_id].geometry.verticesNeedUpdate = true;
    //meshes[mesh_id].rotation.setFromRotationMatrix(RJ);
    meshes[mesh_id].matrixAutoUpdate = false;
    scene.add( meshes[mesh_id] );
    mesh_id++;
}

function drawBP_Ellipsoid(x, y, z, R, rgb) {              
  var geometry = new THREE.SphereGeometry( 10 );
  geometry.applyMatrix( new THREE.Matrix4().makeScale( 0.5, 1.0, 0.1 ) );
  var material =  new THREE.MeshPhongMaterial( { color:rgb, shading: THREE.FlatShading } );
  meshes[mesh_id] = new THREE.Mesh( geometry, material );
  meshes[mesh_id].position.x = x;
  meshes[mesh_id].position.y = y;
  meshes[mesh_id].position.z = z;
  meshes[mesh_id].updateMatrix();
  RJ = new THREE.Matrix4();
  RJ.fromArray(R);
  //displaySequence(String(R));
  meshes[mesh_id].geometry.applyMatrix(RJ);
  meshes[mesh_id].geometry.verticesNeedUpdate = true;
  //meshes[mesh_id].rotation.setFromRotationMatrix(RJ);
  meshes[mesh_id].matrixAutoUpdate = false;
  scene.add( meshes[mesh_id] );
  mesh_id++;
}

function drawBS(x, y, z, rgb) {              
  var geometry = new THREE.SphereGeometry( 1.2, 30, 30 );
  var material =  new THREE.MeshPhongMaterial( { color:rgb, shading: THREE.FlatShading } );
  meshes_bs[mesh_id_bs] = new THREE.Mesh( geometry, material );
  //console.log(x,y,z)
  meshes_bs[mesh_id_bs].position.x = x;
  meshes_bs[mesh_id_bs].position.y = y;
  meshes_bs[mesh_id_bs].position.z = z;
  //meshes_bs[mesh_id_bs].updateMatrix();
  scene.add( meshes_bs[mesh_id_bs] );
  mesh_id_bs++;
}

function drawBS_hipol(x, y, z, rgb) {              
  var geometry = new THREE.SphereGeometry( 1.2, 100, 100 );
  var material =  new THREE.MeshPhongMaterial( { color:rgb, shading: THREE.FlatShading } );
  meshes_bs[mesh_id_bs] = new THREE.Mesh( geometry, material );
  //console.log(x,y,z)
  meshes_bs[mesh_id_bs].position.x = x;
  meshes_bs[mesh_id_bs].position.y = y;
  meshes_bs[mesh_id_bs].position.z = z;
  //meshes_bs[mesh_id_bs].updateMatrix();
  scene.add( meshes_bs[mesh_id_bs] );
  mesh_id_bs++;
}

function drawBSs(open_sites = [false, false, false, false, false, false, false, false, false, 
                 false, false, false, false, false, false, false, false, false, false, false, 
                 false, false, false, false, false, false, false, false]) {
  //loadNBS()
  //console.log('Drawing BSs')
  for ( i = 0; i < 28; i++) {
    //console.log(binding_site_coordinates[i][0])
    //console.log(binding_site_coordinates[i][1])
    //console.log(binding_site_coordinates[i][2])
    if ( open_sites[i] ) {
      bscolor = 0x4d9cea;
    } else {
      bscolor = 0xFF0000;
    }
    drawBS(binding_site_coordinates[i][0], binding_site_coordinates[i][1], binding_site_coordinates[i][2], bscolor)
  }
  render();
}

function removeBSs() {
  //console.log('Removing BSs')
  if ( mesh_id_bs > 0 ) {
    for ( i = 0; i < mesh_id_bs; i++ ) {
      scene.remove(meshes_bs[i]);
      meshes_bs[i].geometry.dispose();
      meshes_bs[i].material.dispose();
      delete(meshes_bs[i]);
    }
  }
  mesh_id_bs = 0;
  render();
}

function removeBP(id) {
    scene.remove(meshes[id]);
    meshes[id].geometry.dispose();
    meshes[id].material.dispose();
    delete(meshes[id]);
}

function destroyDNA() {
    if ( mesh_id > 0 ) {
        for ( i = 0; i < mesh_id; i++ ) {
            removeBP(i);
        }
    }
    mesh_id = 0;
    //removeBSs();
}

function drawDNA() {
    for ( i = 0; i < state.length; i++ ) {
        var R = [1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1];
        R[0] = state[i][3];
        R[4] = state[i][4];
        R[8] = state[i][5];
        R[1] = state[i][6];
        R[5] = state[i][7];
        R[9] = state[i][8];
        R[2] = state[i][9];
        R[6] = state[i][10];
        R[10] = state[i][11];
        var x = state[i][0];
        var y = state[i][1];
        var z = state[i][2];
        switch (sequence[i]) {
            case 'A':
                color = 0xFF0000;
                break;
            case 'T':
                color = 0x00FF00;
                break;
            case 'C':
                color = 0x0000FF;
                break;
            case 'G':
                color = 0x00FFFF;
                break;
            default:
                color = 0xFFFFFF;
        }
        drawBP(x, y, z, R, color);
    }
}

function redrawDNA() {  
  
  var mydiv = document.getElementById('rendering_splash');
  mydiv.style.display = 'block';
  window.setTimeout(function(){
      destroyDNA();
      drawDNA();
      setDNAColors();
      setBGColor();
      render();
    }
  , 100);    
  window.setTimeout(function(){mydiv.style.display = 'none';}, 100); 
}




function drawZArrow() {
  scene.add(zarrow)
}

function removeZArrow() {
  scene.remove(zarrow)
}
