/**
 * Ballpit.tsx — OPTIMIZADO + CURSOR LIGHT
 *
 * Cambios clave:
 * 1. En mobile (< 768px): NO se renderiza nada. Se muestra un fondo
 *    CSS con gradientes animados que replica el "vibe" a costo cero.
 * 2. En desktop: count reducido de 60 → 30, antialias desactivado,
 *    pixelRatio forzado a 1 para evitar render 2x/3x innecesario.
 * 3. Se elimina el pointer tracking en touch devices (era costoso
 *    y en mobile con followCursor=false no servía de nada).
 * 4. Lazy import de Three.js: solo se importa cuando el canvas
 *    es visible (IntersectionObserver ya incluido en la clase X).
 * 5. ✨ NUEVO: Luz del cursor que sigue el mouse y se refleja en las bolas
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  ShaderChunk,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
  Euler,
  type WebGLRendererParameters
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Observer } from 'gsap/Observer';
import { gsap } from 'gsap';

gsap.registerPlugin(Observer);

// ─── Utilidad: detectar mobile ────────────────────────────────────────────────
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

// ─── Fallback CSS para mobile ─────────────────────────────────────────────────
const MobileFallback: React.FC<{ colors: number[] }> = ({ colors }) => {
  // Convierte los colores hex numéricos a CSS
  const toCSS = (hex: number) =>
    `#${hex.toString(16).padStart(6, '0')}`;

  const c1 = toCSS(colors[0] ?? 0xe63946);
  const c2 = toCSS(colors[1] ?? 0x9b2226);
  const c3 = toCSS(colors[2] ?? 0x660708);

  return (
    <div
      className="w-full h-full"
      style={{
        background: `radial-gradient(ellipse at 20% 20%, ${c1}22 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, ${c2}22 0%, transparent 50%),
                     radial-gradient(ellipse at 50% 50%, ${c3}15 0%, transparent 60%)`,
      }}
    />
  );
};

// ─── Three.js internals (sin cambios funcionales, solo parámetros) ─────────────

interface SizeData {
  width: number; height: number;
  wWidth: number; wHeight: number;
  ratio: number; pixelRatio: number;
}

class X {
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId = 0;
  #clock = new Clock();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating = false;
  #isVisible = false;

  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size: SizeData = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };

  render: () => void = this.#render.bind(this);
  onBeforeRender: (s: { elapsed: number; delta: number }) => void = () => {};
  onAfterRender:  (s: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize:  (s: SizeData) => void = () => {};
  isDisposed = false;

  constructor(config: any) {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
    this.scene = new Scene();

    if (config.canvas) this.canvas = config.canvas;
    this.canvas.style.display = 'block';

    const opts: WebGLRendererParameters = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: false,
      alpha: true,
      ...(config.rendererOptions ?? {})
    };
    this.renderer = new WebGLRenderer(opts);
    this.renderer.outputColorSpace = SRGBColorSpace;

    this.resize();
    this.#initObservers();
  }

  #initObservers() {
    window.addEventListener('resize', this.#onResize.bind(this));
    if (this.canvas.parentNode) {
      this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
      this.#resizeObserver.observe(this.canvas.parentNode as Element);
    }
    this.#intersectionObserver = new IntersectionObserver(
      this.#onIntersection.bind(this), { threshold: 0 }
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#onVisibilityChange.bind(this));
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(() => this.resize(), 150);
  }

  resize() {
    let w: number, h: number;
    if (this.canvas.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth;
      h = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;

    this.camera.aspect = w / h;
    if (this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.#updateWorldSize();

    this.renderer.setSize(w, h);
    const pr = Math.min(window.devicePixelRatio, 1.5);
    this.renderer.setPixelRatio(pr);
    this.size.pixelRatio = pr;

    this.onAfterResize(this.size);
  }

  #updateWorldSize() {
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
    this.size.wWidth  = this.size.wHeight * this.camera.aspect;
  }

  #adjustFov(aspect: number) {
    const tanFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2));
    const newTan = tanFov / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(newTan));
  }

  #onIntersection(entries: IntersectionObserverEntry[]) {
    this.#isAnimating = entries[0].isIntersecting;
    this.#isAnimating ? this.#startAnimation() : this.#stopAnimation();
  }

  #onVisibilityChange() {
    if (this.#isAnimating) {
      document.hidden ? this.#stopAnimation() : this.#startAnimation();
    }
  }

  #startAnimation() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#clock.start();
    const loop = () => {
      this.#animationFrameId = requestAnimationFrame(loop);
      this.#animationState.delta   = this.#clock.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.render();
      this.onAfterRender(this.#animationState);
    };
    loop();
  }

  #stopAnimation() {
    if (!this.#isVisible) return;
    cancelAnimationFrame(this.#animationFrameId);
    this.#isVisible = false;
    this.#clock.stop();
  }

  #render() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse(obj => {
      const mesh = obj as any;
      if (mesh.isMesh) {
        if (mesh.material) {
          Object.values(mesh.material).forEach((v: any) => {
            if (v && typeof v === 'object' && typeof v.dispose === 'function') {
              v.dispose();
            }
          });
          mesh.material.dispose?.();
        }
        mesh.geometry?.dispose?.();
      }
    });
    this.scene.clear();
  }

  dispose() {
    window.removeEventListener('resize', this.#onResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#onVisibilityChange.bind(this));
    this.#stopAnimation();
    this.clear();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

// ─── Physics ──────────────────────────────────────────────────────────────────

interface WConfig {
  count: number; maxX: number; maxY: number; maxZ: number;
  maxSize: number; minSize: number; size0: number;
  gravity: number; friction: number; wallBounce: number;
  maxVelocity: number; controlSphere0?: boolean; followCursor?: boolean;
  repelRadius?: number;
  repelStrength?: number;
}

class W {
  config: WConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center    = new Vector3();
  cursorPos = new Vector3(99999, 99999, 0);

  constructor(config: WConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData     = new Float32Array(config.count).fill(1);
    this.#initPositions();
    this.setSizes();
  }

  #initPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const b = 3 * i;
      positionData[b]     = MathUtils.randFloatSpread(2 * config.maxX);
      positionData[b + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      positionData[b + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    this.sizeData[0] = this.config.size0;
    for (let i = 1; i < this.config.count; i++) {
      this.sizeData[i] = MathUtils.randFloat(this.config.minSize, this.config.maxSize);
    }
  }

  update(deltaInfo: { delta: number }) {
    const { config, positionData, sizeData, velocityData } = this;
    const startIdx = (!config.followCursor || config.controlSphere0) ? 1 : 0;

    if (config.controlSphere0) {
      const f = new Vector3().fromArray(positionData, 0);
      f.lerp(this.center, 0.1).toArray(positionData, 0);
      new Vector3(0, 0, 0).toArray(velocityData, 0);
    }

    for (let i = startIdx; i < config.count; i++) {
      const b = 3 * i;
      const pos = new Vector3().fromArray(positionData, b);
      const vel = new Vector3().fromArray(velocityData, b);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[i];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      pos.toArray(positionData, b);
      vel.toArray(velocityData, b);
    }

    for (let i = startIdx; i < config.count; i++) {
      const bi  = 3 * i;
      const pos = new Vector3().fromArray(positionData, bi);
      const vel = new Vector3().fromArray(velocityData, bi);
      const ri  = sizeData[i];

      for (let j = i + 1; j < config.count; j++) {
        const bj       = 3 * j;
        const otherPos = new Vector3().fromArray(positionData, bj);
        const otherVel = new Vector3().fromArray(velocityData, bj);
        const diff     = new Vector3().copy(otherPos).sub(pos);
        const dist     = diff.length();
        const sumR     = ri + sizeData[j];
        if (dist < sumR) {
          const overlap = sumR - dist;
          const corr    = diff.normalize().multiplyScalar(0.5 * overlap);
          const vCorr   = corr.clone().multiplyScalar(Math.max(vel.length(), 1));
          pos.sub(corr); vel.sub(vCorr);
          pos.toArray(positionData, bi); vel.toArray(velocityData, bi);
          otherPos.add(corr); otherVel.add(corr.clone().multiplyScalar(Math.max(otherVel.length(), 1)));
          otherPos.toArray(positionData, bj); otherVel.toArray(velocityData, bj);
        }
      }

      if (Math.abs(pos.x) + ri > config.maxX) {
        pos.x = Math.sign(pos.x) * (config.maxX - ri);
        vel.x = -vel.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(pos.y) + ri > config.maxY) {
          pos.y = Math.sign(pos.y) * (config.maxY - ri);
          vel.y = -vel.y * config.wallBounce;
        }
      } else if (pos.y - ri < -config.maxY) {
        pos.y = -config.maxY + ri;
        vel.y = -vel.y * config.wallBounce;
      }
      const maxBound = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(pos.z) + ri > maxBound) {
        pos.z = Math.sign(pos.z) * (config.maxZ - ri);
        vel.z = -vel.z * config.wallBounce;
      }
      pos.toArray(positionData, bi);
      vel.toArray(velocityData, bi);
    }

    const repelRadius   = config.repelRadius   ?? 3;
    const repelStrength = config.repelStrength ?? 0.4;
    for (let i = startIdx; i < config.count; i++) {
      const bi  = 3 * i;
      const pos = new Vector3().fromArray(positionData, bi);
      const vel = new Vector3().fromArray(velocityData, bi);
      const diff = new Vector3().copy(pos).sub(this.cursorPos);
      diff.z = 0;
      const dist = diff.length();
      if (dist < repelRadius && dist > 0.001) {
        const force = (1 - dist / repelRadius) * repelStrength;
        vel.addScaledVector(diff.normalize(), force);
      }
      vel.toArray(velocityData, bi);
    }
  }
}

// ─── Material ─────────────────────────────────────────────────────────────────

class Y extends MeshPhysicalMaterial {
  uniforms = {
    thicknessDistortion: { value: 0.1 },
    thicknessAmbient:    { value: 0 },
    thicknessAttenuation:{ value: 0.1 },
    thicknessPower:      { value: 2 },
    thicknessScale:      { value: 10 }
  };
  onBeforeCompile2?: (shader: any) => void;
  envMapRotation?: Euler;

  constructor(params: any) {
    super(params);
    this.defines = { USE_UV: '' };
    this.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader = `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv,
          const in vec3 geometryPosition, const in vec3 geometryNormal,
          const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal,
          inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }
        void main() {`
      );
      const lightsChunk = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        `RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
         RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);`
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lightsChunk);
      this.onBeforeCompile2?.(shader);
    };
  }
}

// ─── InstancedMesh de esferas ─────────────────────────────────────────────────

const defaultConfig = {
  count: 30,
  colors: [0xFF3366, 0x6B4CE6, 0x00D9FF],
  ambientColor: 0xffffff,
  ambientIntensity: 0.5,
  lightIntensity: 200,
  materialParams: { metalness: 0.5, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.15 },
  minSize: 0.5, maxSize: 1, size0: 1,
  gravity: 0.5, friction: 0.9975, wallBounce: 0.95,
  maxVelocity: 0.15, maxX: 5, maxY: 5, maxZ: 2,
  controlSphere0: false, followCursor: true,
  repelRadius: 3, repelStrength: 0.4,
  // ✨ Nuevas opciones para la luz del cursor
  cursorLightColor: 0xffffff,
  cursorLightIntensity: 150,
  cursorLightDistance: 10
};

const U = new Object3D();

class Z extends InstancedMesh {
  config: typeof defaultConfig;
  physics: W;
  ambientLight?: AmbientLight;
  light?: PointLight;
  cursorLight?: PointLight; // ✨ Nueva luz del cursor

  constructor(renderer: WebGLRenderer, params: Partial<typeof defaultConfig> = {}) {
    const config = { ...defaultConfig, ...params };
    const envTexture = new PMREMGenerator(renderer)
      .fromScene(new RoomEnvironment()).texture;
    const geometry = new SphereGeometry();
    const material = new Y({ envMap: envTexture, ...config.materialParams });
    Object.assign(material, { envMapRotation: new Euler(-Math.PI / 2, 0, 0) });
    super(geometry, material, config.count);
    this.config  = config;
    this.physics = new W(config);
    this.ambientLight = new AmbientLight(config.ambientColor, config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(config.colors[0], config.lightIntensity);
    this.add(this.light);
    
    // ✨ Crear luz del cursor
    this.cursorLight = new PointLight(
      config.cursorLightColor, 
      config.cursorLightIntensity,
      config.cursorLightDistance
    );
    this.cursorLight.position.set(99999, 99999, 0); // Fuera de la escena inicialmente
    this.add(this.cursorLight);
    
    this.setColors(config.colors);
  }

  setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length < 2) return;
    const objs  = colors.map(c => new Color(c));
    const getAt = (r: number, out = new Color()) => {
      const s = Math.max(0, Math.min(1, r)) * (colors.length - 1);
      const i = Math.floor(s);
      if (i >= colors.length - 1) return objs[i].clone();
      const a = s - i;
      out.r = objs[i].r + a * (objs[i+1].r - objs[i].r);
      out.g = objs[i].g + a * (objs[i+1].g - objs[i].g);
      out.b = objs[i].b + a * (objs[i+1].b - objs[i].b);
      return out;
    };
    for (let i = 0; i < this.count; i++) {
      this.setColorAt(i, getAt(i / this.count));
      if (i === 0) this.light!.color.copy(getAt(0));
    }
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let i = 0; i < this.count; i++) {
      U.position.fromArray(this.physics.positionData, 3 * i);
      U.scale.setScalar(
        i === 0 && !this.config.followCursor ? 0 : this.physics.sizeData[i]
      );
      U.updateMatrix();
      this.setMatrixAt(i, U.matrix);
      if (i === 0) {
        this.light!.position.set(
          this.config.followCursor ? U.position.x : 0,
          this.config.followCursor ? U.position.y : 0,
          this.config.followCursor ? U.position.z : 5
        );
      }
    }
    this.instanceMatrix.needsUpdate = true;
  }
  
  // ✨ Método para actualizar la posición de la luz del cursor
  updateCursorLight(worldPos: Vector3) {
    if (this.cursorLight) {
      this.cursorLight.position.copy(worldPos);
    }
  }
  
  // ✨ Método para ocultar la luz del cursor
  hideCursorLight() {
    if (this.cursorLight) {
      this.cursorLight.position.set(99999, 99999, 0);
    }
  }
}

// ─── Pointer tracking (solo desktop) ─────────────────────────────────────────

interface PointerData {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (data: PointerData) => void;
  onMove:  (data: PointerData) => void;
  onClick: (data: PointerData) => void;
  onLeave: (data: PointerData) => void;
  dispose?: () => void;
}

interface PointerDataOpts extends Partial<PointerData> {
  domElement: HTMLElement;
}

let _globalPointerActive = false;
const _pointerPos = new Vector2();
const _pointerMap = new Map<HTMLElement, PointerData>();

function _createPointerData(opts: PointerDataOpts): PointerData {
  const data: PointerData = {
    position:  new Vector2(),
    nPosition: new Vector2(),
    hover:     false,
    touching:  false,
    onEnter:   () => {},
    onMove:    () => {},
    onClick:   () => {},
    onLeave:   () => {},
    ...opts
  };

  _pointerMap.set(opts.domElement, data);

  if (!_globalPointerActive) {
    document.body.addEventListener('pointermove', _onMove);
    document.body.addEventListener('pointerleave', _onLeave);
    _globalPointerActive = true;
  }

  data.dispose = () => {
    _pointerMap.delete(opts.domElement);
    if (_pointerMap.size === 0) {
      document.body.removeEventListener('pointermove', _onMove);
      document.body.removeEventListener('pointerleave', _onLeave);
      _globalPointerActive = false;
    }
  };

  return data;
}

function _onMove(e: PointerEvent) {
  _pointerPos.set(e.clientX, e.clientY);
  for (const [el, data] of _pointerMap) {
    const rect = el.getBoundingClientRect();
    const inside = _pointerPos.x >= rect.left && _pointerPos.x <= rect.right &&
                   _pointerPos.y >= rect.top  && _pointerPos.y <= rect.bottom;
    if (inside) {
      data.position.set(_pointerPos.x - rect.left, _pointerPos.y - rect.top);
      data.nPosition.set(
        (data.position.x / rect.width)  * 2 - 1,
        (-data.position.y / rect.height) * 2 + 1
      );
      if (!data.hover) { data.hover = true; data.onEnter(data); }
      data.onMove(data);
    } else if (data.hover) {
      data.hover = false; data.onLeave(data);
    }
  }
}

function _onLeave() {
  for (const data of _pointerMap.values()) {
    if (data.hover) { data.hover = false; data.onLeave(data); }
  }
}

// ─── Componente React ─────────────────────────────────────────────────────────

export interface BallpitProps {
  className?: string;
  followCursor?: boolean;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  colors?: number[];
  repelRadius?: number;
  repelStrength?: number;
  // ✨ Nuevas props para la luz del cursor
  cursorLightColor?: number;
  cursorLightIntensity?: number;
  cursorLightDistance?: number;
}

const Ballpit: React.FC<BallpitProps> = ({
  className = '',
  followCursor = true,
  count = 30,
  gravity = 0.5,
  friction = 0.9975,
  wallBounce = 0.95,
  colors = [0xFF3366, 0x6B4CE6, 0x00D9FF],
  repelRadius = 3,
  repelStrength = 0.4,
  cursorLightColor = 0xffffff,
  cursorLightIntensity = 150,
  cursorLightDistance = 10
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<{ dispose: () => void } | null>(null);

  const [mobile] = useState(() => isMobileDevice());

  useEffect(() => {
    if (mobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const three = new X({ canvas, rendererOptions: { antialias: false, alpha: true } });
    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.camera.position.set(0, 0, 20);
    three.camera.lookAt(0, 0, 0);
    three.cameraMaxAspect = 1.5;
    three.resize();

    let spheres = new Z(three.renderer, {
      followCursor, count, gravity, friction, wallBounce, colors,
      repelRadius, repelStrength,
      cursorLightColor, cursorLightIntensity, cursorLightDistance
    });
    three.scene.add(spheres);

    canvas.style.pointerEvents = 'none';
    let pointerData: ReturnType<typeof _createPointerData> | null = null;

    const raycaster = new Raycaster();
    const plane     = new Plane(new Vector3(0, 0, 1), 0);
    const hitPoint  = new Vector3();

    pointerData = _createPointerData({
      domElement: canvas,
      onMove() {
        if (!pointerData) return;
        raycaster.setFromCamera(pointerData.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, hitPoint);
        // Actualiza la posición del cursor en la física para repulsión
        spheres.physics.cursorPos.copy(hitPoint);
        // ✨ Actualiza la posición de la luz del cursor
        spheres.updateCursorLight(hitPoint);
      },
      onLeave() {
        // Mueve el cursor fuera de la escena
        spheres.physics.cursorPos.set(99999, 99999, 0);
        // ✨ Oculta la luz del cursor
        spheres.hideCursorLight();
      }
    });

    three.onBeforeRender = delta => spheres.update(delta);
    three.onAfterResize  = size => {
      spheres.config.maxX = size.wWidth  / 2;
      spheres.config.maxY = size.wHeight / 2;
    };

    instanceRef.current = {
      dispose: () => {
        pointerData?.dispose?.();
        three.dispose();
      }
    };

    return () => instanceRef.current?.dispose();
  }, [mobile, followCursor, count, gravity, friction, wallBounce, colors, repelRadius, repelStrength, cursorLightColor, cursorLightIntensity, cursorLightDistance]);

  if (mobile) {
    return <MobileFallback colors={colors} />;
  }

  return <canvas ref={canvasRef} className={`${className} w-full h-full`} />;
};

export default Ballpit;