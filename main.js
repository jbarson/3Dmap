for(let i=0; i < star_data.length; i++) {
    star_data[i].x = star_data[i].x * 10;
    star_data[i].y = star_data[i].y * 10;
    star_data[i].z = star_data[i].z * 10;
}

// star sizes
const subgiant = new THREE.SphereGeometry(1.3, 32, 32);
const main_sequence = new THREE.SphereGeometry(.8, 32, 32);
const dwarf = new THREE.SphereGeometry(0.3, 32, 32);

// link types
const alpha = new THREE.LineBasicMaterial({color:'#0000ff'});
const beta = new THREE.LineBasicMaterial({color:'#800080'});
const gamma = new THREE.LineBasicMaterial({color:'#E68949'});
const delta = new THREE.LineBasicMaterial({color:'#FAE75E'});
const epsilon = new THREE.LineBasicMaterial({color:'#65B657'});

// setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== BELOW HERE ===== //
const orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.minDistance = 5;
orbit.maxDistance = 350;

let ns_mat = new THREE.MeshBasicMaterial({color:'#FFFFFF'})
let ns_geo = new THREE.SphereGeometry(1, 32, 32);
let ns = new THREE.Mesh(ns_geo, ns_mat)
ns.position.x = 0;
ns.position.y = 400;
ns.position.z = 0;
scene.add(ns);

// dynamic star creation
for(let i=0; i < star_data.length; i++) {
    let s_color = get_star_color(star_data[i].type[0][0]);
    let s_size = get_star_size(star_data[i].type[0][0]);
    let mat = new THREE.MeshBasicMaterial({color:s_color});
    let star = new THREE.Mesh(s_size, mat);
    let x_coord = star_data[i].x;
    let y_coord = star_data[i].y;
    let z_coord = star_data[i].z;
    star.position.x = x_coord;
    star.position.y = y_coord;
    star.position.z = z_coord;
    let s_name;
    let p_name;
    if(star_data[i].planetName) {
        p_name = new SpriteText(star_data[i].planetName, 1, '#999999');
        p_name.center = new THREE.Vector2(0.5, -1.5);
        p_name.strokeWidth = 0.5;
        p_name.strokeColor = '#333333';
        p_name.fontsize = 150;
        star.add(p_name);
    }
    s_name = new SpriteText(star_data[i].starName, 1.25, '#999999');
    s_name.center = new THREE.Vector2(0.5, 2);
    s_name.strokeWidth = 0.5;
    s_name.strokeColor = '#333333';
    s_name.fontsize = 150;
    star.add(s_name);
    scene.add(star);
}

// dynamic link creation
for(let i=0; i < star_links.length; i++) {
    let start_coords = null;
    let end_coords = null;
    let start_id = star_links[i].bridge[0];
    let end_id = star_links[i].bridge[1];
    for(let j=0; j < star_data.length; j++) {
        if(start_id === star_data[j].id) start_coords = new THREE.Vector3(star_data[j].x, star_data[j].y, star_data[j].z);
        if(end_id === star_data[j].id) end_coords = new THREE.Vector3(star_data[j].x, star_data[j].y, star_data[j].z);
    }
    let geom = new THREE.BufferGeometry().setFromPoints([start_coords, end_coords]);
    let link_color = get_link_color(star_links[i].range);
    let line = new THREE.Line(geom, link_color);
    line.name = star_links[i].range;
    line.year = star_links[i].year;
    scene.add(line);
}

// ===== ABOVE HERE =====//
camera.position.z = 350;
animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function get_link_color(value) {
    if(value === 'A') return alpha;
    else if(value === 'B') return beta;
    else if(value === 'G') return gamma;
    else if(value === 'E') return epsilon;
    else return delta;
}

function get_star_size(value) {
    if(value.includes('IV')) return subgiant;
    else if(value.includes('D')) return dwarf;
    else return main_sequence;
}

function get_star_color(value) {
    if(value.includes('D')) return '#999999';
    else if(value.includes('A')) return '#AABBFF';
    else if(value.includes('F')) return '#FFFFCC';
    else if(value.includes('G')) return '#FFFF00';
    else if(value.includes('K')) return '#FFA500';
    else return '#FF0000';
}

function toggle_links(value, name) {
    for(let i=0; i < scene.children.length; i++) {
        if(scene.children[i].name === name) {
            scene.children[i].visible = value.checked !== true;
        }
    }
}

function toggle_all_links(value) {
    let ids = ['la', 'lb', 'lg', 'ld', 'le'];
    let lnk = ['A', 'B', 'G', 'D', 'E'];
    for(let i=0; i < ids.length; i++) {
        let temp = document.getElementById(ids[i]);
        temp.checked = value.checked === true;
        temp.disabled = !temp.disabled;
    }
    for(let i=0; i < lnk.length; i++) {
        toggle_links(value, lnk[i])
    }
}

function dateChanged(value) {
    document.getElementById("dateBox").textContent = value.value;
    for(let i=0; i < scene.children.length; i++) {
        if(scene.children[i].type === 'Line') {
            scene.children[i].visible = scene.children[i].year <= value.value;
        }
    }
}

function setLinks(value, other) {
    if(other === 'W') {
        dateChanged(value);
    } else if(other === 'Z') {
        toggle_all_links(value);
    } else {
        toggle_links(value, other);
    }
}

function myResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}