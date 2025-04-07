(function () {
  'use strict'

  const map = window.map || {}
  let dateVal

  document.querySelector('#dateSlider').addEventListener('input', (e) => {
    dateVal = e.target.value
    document.querySelector('#dateBox').textContent = dateVal
    jumpList.forEach((jump, index) => {
      if (jump.year >= dateVal) {
        map.links[index].element.classList.add('undiscovered')
      }
      if (jump.year <= dateVal) {
        map.links[index].element.classList.remove('undiscovered')
      }
    })
  })

  // Initialize map properties
  const mapProperties = {
    systems: [],
    links: [],
    alphaLinks: [],
    betaLinks: [],
    gammaLinks: [],
    deltaLinks: [],
    epsiLinks: [],
    linkTypes: [],
    Scale: 200
  }

  Object.assign(map, mapProperties)

  // THREE.js vectors initialization
  ['tmpVec1', 'tmpVec2', 'tmpVec3', 'tmpVec4'].forEach(vec => {
    map[vec] = new window.THREE.Vector3()
  })

  // DOM element references
  const elements = {
    alpha: document.querySelector('#alphaLink'),
    beta: document.querySelector('#betaLink'),
    gamma: document.querySelector('#gammaLink'),
    delta: document.querySelector('#deltaLink'),
    epsi: document.querySelector('#epsiLink')
  }

  Object.assign(map, elements)
  map.linkTypes = Object.values(elements)

  document.querySelector('#allLinks').addEventListener('change', (e) => {
    const checked = e.target.checked
    map.linkTypes.forEach(element => {
      if (element.checked !== checked) {
        element.checked = checked
        element.dispatchEvent(new Event('change'))
      }
    })
  })

  // Event handlers
  Object.entries(elements).forEach(([type, el]) => {
    el.addEventListener('change', () => map[`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`]())
  })

  map.init = function () {
    map.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 75000)
    map.camera.position.z = 5000
    map.scene = new THREE.Scene()
    systemsArr.forEach(system => {
      const starText = 'starText'
      const starType = system.type[0][0].toUpperCase()
      const systemDiv = document.createElement('div')
      systemDiv.className = 'starDiv'
      const starPic = document.createElement('img')
      switch (starType) {
        case 'A':
          starPic.className = 'a_star'
          starPic.src = 'img/A-star.png'
          break
        case 'F':
          starPic.className = 'f_star'
          starPic.src = 'img/F-star.png'
          break
        case 'G':
          starPic.className = 'g_star'
          starPic.src = 'img/G-star.png'
          break
        case 'K':
          starPic.className = 'k_star'
          starPic.src = 'img/K-star.png'
          break
        case 'M':
          starPic.className = 'm_star'
          starPic.src = 'img/M-star.png'
          break
        case 'D':
          starPic.className = 'm_star'
          starPic.src = 'img/D-star.png'
          break
        default:
          starPic.src = 'img/spark1.png'
          break
      }
      systemDiv.appendChild(starPic)
      const name = document.createElement('div')
      name.className = starText
      name.textContent = system.sysName
      systemDiv.appendChild(name)
      if (system.planetName) {
        const planet = document.createElement('div')
        planet.className = starText
        planet.textContent = system.planetName
        systemDiv.appendChild(planet)
      }
      const star = new THREE.CSS3DObject(systemDiv)
      star.position.x = system.x * map.Scale
      star.position.y = system.y * map.Scale
      star.position.z = system.z * map.Scale
      map.scene.add(star)
      map.systems.push(star)
    })
    const systemIndex = _.pluck(systemsArr, 'id')
    jumpList.forEach(jump => {
      // const startSys = systemsArr[_.indexOf(systemIndex, jump.bridge[0])]
      // const endSys = systemsArr[_.indexOf(systemIndex, jump.bridge[1])]
      const startPos = map.systems[_.indexOf(systemIndex, jump.bridge[0])].position
      const endPos = map.systems[_.indexOf(systemIndex, jump.bridge[1])].position
      map.tmpVec1.subVectors(endPos, startPos)
      const linkLength = map.tmpVec1.length() - 25
      const hyperLink = document.createElement('div')
      hyperLink.className = 'jumpLink'
      if (jump.type === 'A') {
        hyperLink.className = 'alpha'
      }
      if (jump.type === 'B') {
        hyperLink.className = 'beta'
      }
      if (jump.type === 'G') {
        hyperLink.className = 'gamma'
      }
      if (jump.type === 'D') {
        hyperLink.className = 'delta'
      }
      if (jump.type === 'E') {
        hyperLink.className = 'epsilon'
      }
      hyperLink.style.height = `${linkLength}px`
      const object = new THREE.CSS3DObject(hyperLink)
      object.position.copy(startPos)
      object.position.lerp(endPos, 0.5)
      const axis = map.tmpVec2.set(0, 1, 0).cross(map.tmpVec1)
      const radians = Math.acos(map.tmpVec3.set(0, 1, 0).dot(map.tmpVec4.copy(map.tmpVec1).normalize()))
      const objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians)
      object.matrix = objMatrix
      object.rotation.setEulerFromRotationMatrix(object.matrix, object.eulerOrder)
      object.matrixAutoUpdate = false
      object.updateMatrix()
      if (object.element.className === 'alpha') {
        map.alphaLinks.push(object)
      }
      if (object.element.className === 'beta') {
        map.betaLinks.push(object)
      }
      if (object.element.className === 'delta') {
        map.deltaLinks.push(object)
      }
      if (object.element.className === 'gamma') {
        map.gammaLinks.push(object)
      }
      if (object.element.className === 'epsilon') {
        map.epsiLinks.push(object)
      }
      map.scene.add(object)
      map.links.push(object)
    })
    map.renderer = new THREE.CSS3DRenderer()
    map.renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('container').appendChild(map.renderer.domElement)
    map.controls = new THREE.TrackballControls(map.camera, map.renderer.domElement)
    map.controls.rotateSpeed = 0.05
    map.controls.dynamicDampingFactor = 0.3
    map.controls.maxDistance = 7500
    map.controls.addEventListener('change', map.render)
    window.addEventListener('resize', map.onWindowResize, false)
  }

  map.onWindowResize = function () {
    map.camera.aspect = window.innerWidth / window.innerHeight
    map.camera.updateProjectionMatrix()
    map.renderer.setSize(window.innerWidth, window.innerHeight)
    map.render()
  }

  map.animate = function () {
    requestAnimationFrame(map.animate)
    map.controls.update()
    map.render()
  }

  map.render = function () {
    map.systems.forEach(system => {
      system.lookAt(map.camera.position.clone())
      system.up = map.camera.up.clone()
      if (system.position.distanceTo(map.camera.position) < 500) {
        system.element.children[1].className = 'invis'
        if (system.element.children[2]) {
          system.element.children[2].className = 'invis'
        }
      } else {
        system.element.children[1].className = 'starText'
        if (system.element.children[2]) {
          system.element.children[2].className = 'planetText'
        }
      }
    })
    map.renderer.render(map.scene, map.camera)
  }

  /**
   * Toggles visibility for a given type of links
   * @param {string} type - The type of links to toggle (alpha, beta, etc)
   */
  const toggleLinks = (type) => {
    map[`${type}Links`].forEach(link => {
      link.element.classList.toggle('hidden')
    })
  }

  // Map toggle handlers to link types
  map.toggleAlpha = () => toggleLinks('alpha')
  map.toggleBeta = () => toggleLinks('beta')
  map.toggleGamma = () => toggleLinks('gamma')
  map.toggleDelta = () => toggleLinks('delta')
  map.toggleEpsi = () => toggleLinks('epsi')

  map.init()
  map.animate()
}())
