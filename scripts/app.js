
function starDistance(starA, starB) {
  //d = ((x2 - x1)2 + (y2 - y1)2 + (z2 - z1)2)1/2
  return Math.pow(Math.pow(starA.Xg - starB.Xg, 2)+ Math.pow(starA.Yg - starB.Yg, 2) + Math.pow(starA.Zg - starB.Zg, 2),0.5)
}


/*(function () {
   "use strict";
   //the following is to link the slider with the text box*/
  $('#dateSlider').change(function(){
    $dateVal = $('#dateSlider').val();
    $('#dateBox').text($dateVal);
    for (var n in jumpList){
      if(jumpList[n].year>= $dateVal){
        map.links[n].element.classList.add("undiscovered");
      }
      if(jumpList[n].year<= $dateVal){
        map.links[n].element.classList.remove("undiscovered");
      }
    }
  });
const systemsArr = []
// const jumpList = []
fetch('http://localhost:5500/NyrathStars.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      systemsArr.push(item)
    })
    data.forEach(item => {

    })
    //console.log(data)
    // map.init();
    // map.animate();
  }).then(console.log)

var map = map || {};
    map.systems = [];
    map.links = [];
    map.alphaLinks =[];
    map.betaLinks =[];
    map.gammaLinks =[];
    map.deltaLinks =[];
    map.epsiLinks =[];
    map.linkTypes = [];
    map.$alpha=$("#alphaLink");
    map.$beta=$("#betaLink");
    map.$gamma=$("#gammaLink");
    map.$delta=$("#deltaLink");
    map.$epsi=$("#epsiLink");
    map.linkTypes=[map.$alpha,map.$beta,map.$gamma,map.$delta,map.$epsi];
    map.tmpVec1 = new THREE.Vector3();
    map.tmpVec2 = new THREE.Vector3();
    map.tmpVec3 = new THREE.Vector3();
    map.tmpVec4 = new THREE.Vector3();
    map.Scale = 200;
    $("#allLinks").change(function(){
      if (this.checked){
        for (var i in map.linkTypes){
          if (map.linkTypes[i].prop("checked")===false){
            map.linkTypes[i].prop("checked",true);
            map.linkTypes[i].change();
          }
        }
      }else{
        for (var j in map.linkTypes){
          if (map.linkTypes[j].prop("checked")===true){
            map.linkTypes[j].prop("checked",false);
            map.linkTypes[j].change();
          }
        }
      }
    });
    map.$alpha.change(function(){
      map.toggleAlpha();
    });
    map.$beta.change(function(){
      map.toggleBeta();
    });
    map.$gamma.change(function(){
      map.toggleGamma();
    });
    map.$delta.change(function(){
      map.toggleDelta();
    });
    map.$epsi.change(function(){
      map.toggleEpsi();
    });
// map.init = function() {
//   map.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 75000 );
//   map.camera.position.z = 5000;
//   map.scene = new THREE.Scene();
//   for (var i in systemsArr){
//     var starText = "starText";
//     var system = systemsArr[i];
//     var starType = system['Spectral Class'][0]?.toUpperCase();
//     var systemDiv = document.createElement('div');
//     systemDiv.className = "starDiv";
//     var starPic = document.createElement('img');
//     if (starType==="A"){
//       starPic.src = 'img/A-star.png';
//     }else if (starType==="F"){
//       starPic.src = 'img/F-star.png';
//     }else if (starType==="G"){
//       starPic.src = 'img/G-star.png';
//     }else if (starType==="K"){
//       starPic.src = 'img/K-star.png';
//     }else if (starType==="M"){
//       starPic.src = 'img/M-star.png';
//     }else if (starType==="D"){
//       starPic.src = 'img/D-star.png';
//     }else{
//       starPic.src = 'img/spark1.png';
//     }
//     systemDiv.appendChild(starPic);
//     var name = document.createElement('div');
//     name.className = starText;
//     name.textContent = system["Display Name"];
//     systemDiv.appendChild(name);
//     if (system.planetName){var planet = document.createElement('div');
//       planet.className = starText;
//       planet.textContent = system.planetName;
//       systemDiv.appendChild(planet);
//     }
//     var star = new THREE.CSS3DObject(systemDiv);
//     star.position.x = system.Xg*map.Scale;
//     star.position.y = system.Yg*map.Scale;
//     star.position.z = system.Zg*map.Scale;
//     map.scene.add( star );
//     map.systems.push(star);
//   }
//   var systemIndex = _.pluck(systemsArr,"HabHyg");
//   for (var j in jumpList){
//     // var startSys=systemsArr[_.indexOf(systemIndex,jumpList[j].bridge[0])];
//     // var endSys=  systemsArr[_.indexOf(systemIndex,jumpList[j].bridge[1])];
//     var startPos=map.systems[_.indexOf(systemIndex,jumpList[j].bridge[0])].position;
//     var endPos=  map.systems[_.indexOf(systemIndex,jumpList[j].bridge[1])].position;
//     map.tmpVec1.subVectors( endPos, startPos );
//     var linkLength = map.tmpVec1.length() -25;
//     var hyperLink=document.createElement('div');
//     hyperLink.className="jumpLink";
//     if (jumpList[j].type==="A"){hyperLink.className="alpha";}
//     if (jumpList[j].type==="B"){hyperLink.className="beta";}
//     if (jumpList[j].type==="G"){hyperLink.className="gamma";}
//     if (jumpList[j].type==="D"){hyperLink.className="delta";}
//     if (jumpList[j].type==="E"){hyperLink.className="epsilon";}
//     hyperLink.style.height=  linkLength + "px";
//     var object = new THREE.CSS3DObject( hyperLink );
//     object.position.copy( startPos );
//     object.position.lerp( endPos, 0.5 );
//     var axis = map.tmpVec2.set( 0, 1, 0 ).cross( map.tmpVec1 );
//     var radians = Math.acos( map.tmpVec3.set( 0, 1, 0 ).dot( map.tmpVec4.copy( map.tmpVec1 ).normalize() ) );
//     var objMatrix = new THREE.Matrix4().makeRotationAxis( axis.normalize(), radians );
//     object.matrix = objMatrix;
//     object.rotation.setEulerFromRotationMatrix( object.matrix, object.eulerOrder );
//     object.matrixAutoUpdate = false;
//     object.updateMatrix();
//     if (object.element.className ==="alpha"){map.alphaLinks.push(object);}
//     if (object.element.className ==="beta"){map.betaLinks.push(object);}
//     if (object.element.className ==="delta"){map.deltaLinks.push(object);}
//     if (object.element.className ==="gamma"){map.gammaLinks.push(object);}
//     if (object.element.className ==="epsilon"){map.epsiLinks.push(object);}
//     map.scene.add( object );
//     map.links.push( object );
//   }
//   map.renderer = new THREE.CSS3DRenderer();
//   map.renderer.setSize( window.innerWidth, window.innerHeight );
//   document.getElementById( 'container' ).appendChild( map.renderer.domElement );
//   map.controls = new THREE.TrackballControls( map.camera, map.renderer.domElement );
//   map.controls.rotateSpeed = 0.05;
//   map.controls.dynamicDampingFactor = 0.3;
//   map.controls.maxDistance=7500;
//   map.controls.addEventListener( 'change', map.render );
//   window.addEventListener( 'resize', map.onWindowResize, false );
// };
map.onWindowResize = function() {
  map.camera.aspect = window.innerWidth / window.innerHeight;
  map.camera.updateProjectionMatrix();
  map.renderer.setSize( window.innerWidth, window.innerHeight );
  map.render();
};
map.animate = function() {
  requestAnimationFrame( map.animate );
  map.controls.update();
  map.render();
};
map.render = function() {
  for (var i in map.systems) {
    map.systems[i].lookAt(map.camera.position.clone());
    map.systems[i].up = map.camera.up.clone();
    if (map.systems[i].position.distanceTo(map.camera.position)<500){
      map.systems[i].element.children[1].className="invis";
      if (map.systems[i].element.children[2]){
        map.systems[i].element.children[2].className="invis";
      }
    }else{
      map.systems[i].element.children[1].className="starText";
      if (map.systems[i].element.children[2]){
        map.systems[i].element.children[2].className="planetText";
      }
    }
  }
  map.renderer.render( map.scene, map.camera );
};
map.toggleAlpha = function(){
  for (var m in map.alphaLinks){
    if(map.alphaLinks[m].element.classList.contains("hidden")){
        map.alphaLinks[m].element.classList.remove("hidden");
      } else {
        map.alphaLinks[m].element.classList.add("hidden");
      }
  }
};
map.toggleBeta = function(){
  for (var m in map.betaLinks){
        if(map.betaLinks[m].element.classList.contains("hidden")){
        map.betaLinks[m].element.classList.remove("hidden");
      }else{
        map.betaLinks[m].element.classList.add("hidden");
      }
}};
map.toggleGamma = function(){
  for (var m in map.gammaLinks){
    if(map.gammaLinks[m].element.classList.contains("hidden")){
        map.gammaLinks[m].element.classList.remove("hidden");
      }else{
        map.gammaLinks[m].element.classList.add("hidden");
      }
}};
map.toggleDelta = function(){
  for (var m in map.deltaLinks){
        if(map.deltaLinks[m].element.classList.contains("hidden")){
        map.deltaLinks[m].element.classList.remove("hidden");
      }else{
        map.deltaLinks[m].element.classList.add("hidden");
      }
}};
map.toggleEpsi = function(){
      for (var m in map.epsiLinks){
        if(map.epsiLinks[m].element.classList.contains("hidden")){
        map.epsiLinks[m].element.classList.remove("hidden");
      }else{
        map.epsiLinks[m].element.classList.add("hidden");
      }
}};


/*}());*/


const newJump = jumpList.map( item => {return{...item, distance: starDistance(systemsArr[item.bridge[0]], systemsArr[item.bridge[0]])}})