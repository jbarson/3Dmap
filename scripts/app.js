(function () {
  'use strict'

  // Constants
  const CONSTANTS = {
    SCALE: 200,
    CAMERA_FOV: 60,
    CAMERA_Z_POSITION: 5000,
    CAMERA_NEAR: 1,
    CAMERA_FAR: 75000,
    LINK_LENGTH_OFFSET: 25,
    TEXT_VISIBILITY_DISTANCE: 500,
    TRACKBALL_ROTATE_SPEED: 0.05,
    TRACKBALL_DAMPING_FACTOR: 0.3,
    TRACKBALL_MAX_DISTANCE: 7500
  }

  // Star type configuration
  const STAR_TYPES = {
    A: { className: 'a_star', src: 'img/A-star.png' },
    F: { className: 'f_star', src: 'img/F-star.png' },
    G: { className: 'g_star', src: 'img/G-star.png' },
    K: { className: 'k_star', src: 'img/K-star.png' },
    M: { className: 'm_star', src: 'img/M-star.png' },
    D: { className: 'm_star', src: 'img/D-star.png' },
    default: { className: '', src: 'img/spark1.png' }
  }

  // Link type configuration
  const LINK_TYPES = {
    A: 'alpha',
    B: 'beta',
    G: 'gamma',
    D: 'delta',
    E: 'epsilon'
  }

  const map = window.map || {}
  let dateVal

  /**
   * Handles date slider input changes and updates link visibility
   * @param {Event} e - Input event from the date slider
   */
  function handleDateSliderChange (e) {
    try {
      dateVal = e.target.value
      const dateBox = document.querySelector('#dateBox');
      if (dateBox) {
        dateBox.textContent = dateVal;
      }
      updateLinksVisibilityByDate(dateVal);
    } catch (error) {
      console.error('Error handling date slider change:', error);
    }
  }

  /**
   * Updates link visibility based on discovery date
   * @param {string} currentDate - Current selected date
   */
  function updateLinksVisibilityByDate (currentDate) {
    try {
      if (!jumpList || !map.links) {
        console.warn('Missing jumpList or map.links data');
        return;
      }

      jumpList.forEach((jump, index) => {
        if (map.links[index] && map.links[index].element) {
          const linkElement = map.links[index].element;
          if (jump.year >= currentDate) {
            linkElement.classList.add('undiscovered');
          } else {
            linkElement.classList.remove('undiscovered');
          }
        }
      });
    } catch (error) {
      console.error('Error updating link visibility:', error);
    }
  }

  const dateSlider = document.querySelector('#dateSlider');
  if (dateSlider) {
    dateSlider.addEventListener('input', handleDateSliderChange);
  } else {
    console.error('Date slider element not found');
  }

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
    Scale: CONSTANTS.SCALE
  }

  Object.assign(map, mapProperties)

  /**
   * Initialize THREE.js vectors for calculations
   */
  function initializeVectors() {
    const vectors = ['tmpVec1', 'tmpVec2', 'tmpVec3', 'tmpVec4']
    vectors.forEach(vec => {
      map[vec] = new window.THREE.Vector3()
    })
  }

  /**
   * Initialize DOM element references and event handlers
   */
  function initializeDOMElements () {
    try {
      const elements = {
        alpha: document.querySelector('#alphaLink'),
        beta: document.querySelector('#betaLink'),
        gamma: document.querySelector('#gammaLink'),
        delta: document.querySelector('#deltaLink'),
        epsi: document.querySelector('#epsiLink')
      };

      // Validate all elements exist
      const missingElements = Object.entries(elements)
        .filter(([, element]) => !element)
        .map(([name]) => name);

      if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
        return;
      }

      Object.assign(map, elements);
      map.linkTypes = Object.values(elements);

      // Handle "All Links" checkbox
      const allLinksCheckbox = document.querySelector('#allLinks');
      if (allLinksCheckbox) {
        allLinksCheckbox.addEventListener('change', handleAllLinksToggle);
      } else {
        console.error('All links checkbox not found');
      }

      // Handle individual link type checkboxes
      Object.entries(elements).forEach(([type, el]) => {
        if (el) {
          el.addEventListener('change', () => {
            const toggleMethod = map[`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`];
            if (toggleMethod) {
              toggleMethod();
            }
          });
        }
      });
    } catch (error) {
      console.error('Error initializing DOM elements:', error);
    }
  }

  /**
   * Handles the "All Links" checkbox toggle
   * @param {Event} e - Change event from the checkbox
   */
  function handleAllLinksToggle (e) {
    try {
      const checked = e.target.checked;
      if (map.linkTypes) {
        map.linkTypes.forEach(element => {
          if (element && element.checked !== checked) {
            element.checked = checked;
            element.dispatchEvent(new Event('change'));
          }
        });
      }
    } catch (error) {
      console.error('Error handling all links toggle:', error);
    }
  }

  initializeVectors()
  initializeDOMElements()

  /**
   * Creates a star element with appropriate styling based on star type
   * @param {Object} system - System data containing star information
   * @returns {HTMLElement} - The created star div element
   */
  function createStarElement(system) {
    const systemDiv = document.createElement('div')
    systemDiv.className = 'starDiv'
    
    const starPic = document.createElement('img')
    const starType = system.type[0][0].toUpperCase()
    const starConfig = STAR_TYPES[starType] || STAR_TYPES.default
    
    starPic.className = starConfig.className
    starPic.src = starConfig.src
    systemDiv.appendChild(starPic)

    // Add system name
    const name = document.createElement('div')
    name.className = 'starText'
    name.textContent = system.sysName
    systemDiv.appendChild(name)

    // Add planet name if exists
    if (system.planetName) {
      const planet = document.createElement('div')
      planet.className = 'starText'
      planet.textContent = system.planetName
      systemDiv.appendChild(planet)
    }

    return systemDiv
  }

  /**
   * Creates all star systems in the 3D scene
   */
  function createStarSystems () {
    try {
      if (!systemsArr || !Array.isArray(systemsArr)) {
        console.error('systemsArr is not available or not an array');
        return;
      }

      systemsArr.forEach((system, index) => {
        try {
          const systemDiv = createStarElement(system);
          const star = new THREE.CSS3DObject(systemDiv);

          // Position the star in 3D space
          star.position.x = (system.x || 0) * map.Scale;
          star.position.y = (system.y || 0) * map.Scale;
          star.position.z = (system.z || 0) * map.Scale;

          map.scene.add(star);
          map.systems.push(star);
        } catch (error) {
          console.error(`Error creating star system at index ${index}:`, error);
        }
      });
    } catch (error) {
      console.error('Error creating star systems:', error);
    }
  }

  /**
   * Creates a hyperlink element between two star systems
   * @param {Object} jump - Jump data containing bridge information
   * @param {Array} systemIndex - Array of system IDs for indexing
   */
  function createHyperLink(jump, systemIndex) {
    const startPos = map.systems[_.indexOf(systemIndex, jump.bridge[0])].position
    const endPos = map.systems[_.indexOf(systemIndex, jump.bridge[1])].position
    
    map.tmpVec1.subVectors(endPos, startPos)
    const linkLength = map.tmpVec1.length() - CONSTANTS.LINK_LENGTH_OFFSET
    
    const hyperLink = document.createElement('div')
    const linkType = LINK_TYPES[jump.type] || 'jumpLink'
    hyperLink.className = linkType
    hyperLink.style.height = `${linkLength}px`
    
    const object = new THREE.CSS3DObject(hyperLink)
    object.position.copy(startPos)
    object.position.lerp(endPos, 0.5)
    
    // Calculate rotation to align with the connection vector
    const axis = map.tmpVec2.set(0, 1, 0).cross(map.tmpVec1)
    const radians = Math.acos(map.tmpVec3.set(0, 1, 0).dot(map.tmpVec4.copy(map.tmpVec1).normalize()))
    const objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians)
    
    object.matrix = objMatrix
    object.rotation.setEulerFromRotationMatrix(object.matrix, object.eulerOrder)
    object.matrixAutoUpdate = false
    object.updateMatrix()
    
    // Add to appropriate link type array
    const linkTypeProp = `${linkType}Links`
    if (map[linkTypeProp]) {
      map[linkTypeProp].push(object)
    }
    
    map.scene.add(object)
    map.links.push(object)
  }

  /**
   * Creates all hyperlinks between star systems
   */
  function createHyperLinks() {
    const systemIndex = _.pluck(systemsArr, 'id')
    jumpList.forEach(jump => createHyperLink(jump, systemIndex))
  }

  /**
   * Initialize the 3D scene, camera, and controls
   */
  map.init = function () {
    // Initialize camera
    map.camera = new THREE.PerspectiveCamera(
      CONSTANTS.CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CONSTANTS.CAMERA_NEAR,
      CONSTANTS.CAMERA_FAR
    )
    map.camera.position.z = CONSTANTS.CAMERA_Z_POSITION

    // Initialize scene
    map.scene = new THREE.Scene()

    // Create star systems and hyperlinks
    createStarSystems()
    createHyperLinks()

    // Initialize renderer
    map.renderer = new THREE.CSS3DRenderer()
    map.renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('container').appendChild(map.renderer.domElement)

    // Initialize controls
    map.controls = new THREE.TrackballControls(map.camera, map.renderer.domElement)
    map.controls.rotateSpeed = CONSTANTS.TRACKBALL_ROTATE_SPEED
    map.controls.dynamicDampingFactor = CONSTANTS.TRACKBALL_DAMPING_FACTOR
    map.controls.maxDistance = CONSTANTS.TRACKBALL_MAX_DISTANCE
    map.controls.addEventListener('change', map.render)

    // Handle window resize
    window.addEventListener('resize', map.onWindowResize, false)
  }

  /**
   * Handle window resize events
   */
  map.onWindowResize = function () {
    map.camera.aspect = window.innerWidth / window.innerHeight
    map.camera.updateProjectionMatrix()
    map.renderer.setSize(window.innerWidth, window.innerHeight)
    map.render()
  }

  /**
   * Animation loop
   */
  map.animate = function () {
    requestAnimationFrame(map.animate)
    map.controls.update()
    map.render()
  }

  /**
   * Updates star text visibility based on camera distance
   * @param {Object} system - Star system object
   */
  function updateStarTextVisibility(system) {
    const distance = system.position.distanceTo(map.camera.position)
    const isClose = distance < CONSTANTS.TEXT_VISIBILITY_DISTANCE

    // Update system name visibility
    const nameElement = system.element.children[1]
    if (nameElement) {
      nameElement.className = isClose ? 'invis' : 'starText'
    }

    // Update planet name visibility if it exists
    const planetElement = system.element.children[2]
    if (planetElement) {
      planetElement.className = isClose ? 'invis' : 'planetText'
    }
  }

  /**
   * Render the scene
   */
  map.render = function () {
    map.systems.forEach(system => {
      system.lookAt(map.camera.position.clone())
      system.up = map.camera.up.clone()
      updateStarTextVisibility(system)
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
