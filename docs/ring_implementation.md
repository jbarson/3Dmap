# Adding a Ring to a Planet

## Overview
This document describes how to add a procedural ring to a planet in `cinematic_globe.html`.

## Steps

### 1. Create the Ring Material (Shader)
Add a `ShaderMaterial` that creates banded rings using the distance from center:

```javascript
const ringMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
        uTime: commonUniforms.uTime
    },
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
            float dist = length(vPosition.xy);
            float innerEdge = smoothstep(1.615, 1.65, dist);
            float outerEdge = 1.0 - smoothstep(1.85, 1.885, dist);
            float mask = innerEdge * outerEdge;
            
            float band = sin(dist * 40.0) * 0.5 + 0.5;
            band = mix(0.2, 0.5, band) * mask;
            gl_FragColor = vec4(0.65, 0.65, 0.7, band);
        }
    `
});
```

### 2. Create the Ring Mesh
```javascript
const ringGeo = new THREE.RingGeometry(1.615, 1.885, 128);
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI / 2;
ringMesh.rotation.y = 0.3;
ringMesh.visible = false;
scene.add(ringMesh);
```

**Geometry parameters:**
- `1.615` - inner radius
- `1.885` - outer radius  
- `128` - segments

**Rotation:**
- `rotation.x = Math.PI / 2` - tilts flat
- `rotation.y = 0.3` - tilt angle in radians (~17°)

### 3. Add Ring to Planet Data
In the `planets` array, add `hasRing: true`:

```javascript
{ name: 'Novaya', base: 'Map_Novaya', seed: [8.8, 9.9, 0.0], scale: 1.5, hasRing: true },
```

### 4. Toggle Ring Visibility
In `switchPlanet()` function:

```javascript
const hasRing = p.hasRing || false;
ringMesh.visible = hasRing;
```

### 5. Add Rotation Animation
In `animate()` function:

```javascript
if (ringMesh.visible) {
    ringMesh.rotation.z += 0.0002;
}
```

## Customization

### Adjust Ring Width
Change the radii in `RingGeometry(inner, outer, segments)`:
- Current: inner=1.615, outer=1.885 (width = 0.27)
- To make 30% narrower: inner=1.615, outer=1.752

### Adjust Band Density
In fragment shader, change `dist * 40.0`:
- Higher = more bands
- Lower = fewer bands

### Adjust Color
Change RGB values in `gl_FragColor`:
- Current: `vec4(0.65, 0.65, 0.7, band)` = light gray

### Adjust Band Brightness
Change `mix(0.2, 0.5, band)` values:
- First value = minimum opacity
- Second value = maximum opacity
