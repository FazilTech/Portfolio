import {
  ErrorCodes,
  EventType,
  deleteCount,
  getCanvasFromContainer,
  getDataFromUrl,
  getDomContainer,
  getErrorMessage,
  getLogger,
  getRandom,
  getRandomFn,
  itemFromSingleOrMultiple,
  loadMinIndex,
  loadRandomFactor,
  minIndex,
  none,
  one,
  removeDeleteCount,
  removeMinIndex,
  setLogger,
  setRandom
} from "./chunk-KIDNQMHF.js";

// node_modules/@tsparticles/engine/browser/Utils/EventDispatcher.js
var EventDispatcher = class {
  #listeners;
  constructor() {
    this.#listeners = /* @__PURE__ */ new Map();
  }
  addEventListener(type, listener) {
    this.removeEventListener(type, listener);
    const arr = this.#listeners.get(type);
    this.#listeners.set(type, arr ? [...arr, listener] : [listener]);
  }
  dispatchEvent(type, args) {
    const listeners = this.#listeners.get(type);
    listeners?.forEach((handler) => {
      handler(args);
    });
  }
  hasEventListener(type) {
    return !!this.#listeners.get(type);
  }
  removeAllEventListeners(type) {
    if (!type) {
      this.#listeners = /* @__PURE__ */ new Map();
    } else {
      this.#listeners.delete(type);
    }
  }
  removeEventListener(type, listener) {
    const arr = this.#listeners.get(type);
    if (!arr) {
      return;
    }
    const length = arr.length, idx = arr.indexOf(listener);
    if (idx < minIndex) {
      return;
    }
    if (length === deleteCount) {
      this.#listeners.delete(type);
    } else {
      this.#listeners.set(type, [...arr.slice(minIndex, idx), ...arr.slice(idx + deleteCount)]);
    }
  }
};

// node_modules/@tsparticles/engine/browser/Core/Utils/PluginManager.js
var PluginManager = class {
  colorManagers = /* @__PURE__ */ new Map();
  easingFunctions = /* @__PURE__ */ new Map();
  initializers = {
    effects: /* @__PURE__ */ new Map(),
    shapes: /* @__PURE__ */ new Map(),
    updaters: /* @__PURE__ */ new Map()
  };
  palettes = /* @__PURE__ */ new Map();
  plugins = [];
  presets = /* @__PURE__ */ new Map();
  #allLoadersSet = /* @__PURE__ */ new Set();
  #configs = /* @__PURE__ */ new Map();
  #engine;
  #executedSet = /* @__PURE__ */ new Set();
  #initialized = false;
  #isRunningLoaders = false;
  #loadPromises = /* @__PURE__ */ new Set();
  constructor(engine) {
    this.#engine = engine;
  }
  get configs() {
    const res = {};
    for (const [name, config] of this.#configs) {
      res[name] = config;
    }
    return res;
  }
  get initialized() {
    return this.#initialized;
  }
  addColorManager(name, manager) {
    if (this.#initialized) {
      return;
    }
    this.colorManagers.set(name, manager);
  }
  addConfig(config) {
    if (this.#initialized) {
      return;
    }
    const key = config.key ?? config.name ?? "default";
    this.#configs.set(key, config);
    this.#engine.dispatchEvent(EventType.configAdded, { data: { name: key, config } });
  }
  addEasing(name, easing) {
    if (this.#initialized) {
      return;
    }
    if (this.easingFunctions.get(name)) {
      return;
    }
    this.easingFunctions.set(name, easing);
  }
  addEffect(effect, drawer) {
    if (this.#initialized) {
      return;
    }
    this.initializers.effects.set(effect, drawer);
  }
  addPalette(name, palette) {
    if (this.#initialized) {
      return;
    }
    this.palettes.set(name, palette);
  }
  addParticleUpdater(name, updaterInitializer) {
    if (this.#initialized) {
      return;
    }
    this.initializers.updaters.set(name, updaterInitializer);
  }
  addPlugin(plugin) {
    if (this.#initialized) {
      return;
    }
    if (this.getPlugin(plugin.id)) {
      return;
    }
    this.plugins.push(plugin);
  }
  addPreset(preset, options, override = false) {
    if (this.#initialized) {
      return;
    }
    if (!(override || !this.getPreset(preset))) {
      return;
    }
    this.presets.set(preset, options);
  }
  addShape(shapes, drawer) {
    if (this.#initialized) {
      return;
    }
    for (const shape of shapes) {
      this.initializers.shapes.set(shape, drawer);
    }
  }
  getEasing(name) {
    return this.easingFunctions.get(name) ?? ((value) => value);
  }
  getPalette(name) {
    return this.palettes.get(name);
  }
  getPlugin(plugin) {
    return this.plugins.find((t) => t.id === plugin);
  }
  getPreset(preset) {
    return this.presets.get(preset);
  }
  async init() {
    if (this.#initialized || this.#isRunningLoaders) {
      return;
    }
    this.#isRunningLoaders = true;
    this.#executedSet = /* @__PURE__ */ new Set();
    this.#allLoadersSet = new Set(this.#loadPromises);
    try {
      for (const loader of this.#allLoadersSet) {
        await this.#runLoader(loader, this.#executedSet, this.#allLoadersSet);
      }
    } finally {
      this.#loadPromises.clear();
      this.#isRunningLoaders = false;
      this.#initialized = true;
    }
  }
  async register(...loaders) {
    if (this.#initialized) {
      throw new Error(getErrorMessage(ErrorCodes.pluginRegisterAfterLoad));
    }
    for (const loader of loaders) {
      if (this.#isRunningLoaders) {
        await this.#runLoader(loader, this.#executedSet, this.#allLoadersSet);
      } else {
        this.#loadPromises.add(loader);
      }
    }
  }
  async #runLoader(loader, executed, allLoaders) {
    if (executed.has(loader)) {
      return;
    }
    executed.add(loader);
    allLoaders.add(loader);
    await loader(this.#engine);
  }
};

// node_modules/@tsparticles/engine/browser/Core/Engine.js
var Engine = class {
  pluginManager = new PluginManager(this);
  #domArray = [];
  #eventDispatcher = new EventDispatcher();
  #initialized = false;
  get items() {
    return this.#domArray;
  }
  get version() {
    return "4.5.1";
  }
  addEventListener(type, listener) {
    this.#eventDispatcher.addEventListener(type, listener);
  }
  checkVersion(pluginVersion) {
    if (this.version === pluginVersion) {
      return;
    }
    throw new Error(getErrorMessage(ErrorCodes.engineVersionMismatch, this.version, pluginVersion));
  }
  dispatchEvent(type, args) {
    this.#eventDispatcher.dispatchEvent(type, args);
  }
  async init() {
    if (this.#initialized) {
      return;
    }
    await this.pluginManager.init();
    this.#initialized = true;
  }
  item(index) {
    const items = this.items, item = items[index];
    if (item?.destroyed) {
      items.splice(index, removeDeleteCount);
      return;
    }
    return item;
  }
  async load(params) {
    await this.init();
    let domSourceElement;
    if (typeof HTMLElement !== "undefined" && params.element instanceof HTMLElement) {
      domSourceElement = params.element;
    }
    const { Container } = await import("./Container-6N5IOTFX.js"), id = params.id ?? domSourceElement?.id ?? `tsparticles${Math.floor(getRandom() * loadRandomFactor).toString()}`, { index, url } = params, options = url ? await getDataFromUrl({ fallback: params.options, url, index }) : params.options, currentOptions = itemFromSingleOrMultiple(options, index), { items } = this, oldIndex = items.findIndex((v) => v.id.description === id), newItem = new Container({
      dispatchCallback: (eventType, args) => {
        this.dispatchEvent(eventType, args);
      },
      id,
      onDestroy: (remove) => {
        if (!remove) {
          return;
        }
        const mainArr = this.items, idx = mainArr.indexOf(newItem);
        if (idx >= removeMinIndex) {
          mainArr.splice(idx, removeDeleteCount);
        }
      },
      pluginManager: this.pluginManager,
      sourceOptions: currentOptions
    });
    if (oldIndex >= loadMinIndex) {
      const old = this.item(oldIndex), deleteCount2 = old ? one : none;
      if (old && !old.destroyed) {
        old.destroy(false);
      }
      items.splice(oldIndex, deleteCount2, newItem);
    } else {
      items.push(newItem);
    }
    const sourceCanvas = typeof OffscreenCanvas !== "undefined" && params.element instanceof OffscreenCanvas ? params.element : getCanvasFromContainer(getDomContainer(id, domSourceElement));
    newItem.canvas.loadCanvas(sourceCanvas);
    await newItem.start();
    return newItem;
  }
  async refresh(refresh = true) {
    if (!refresh) {
      return;
    }
    await Promise.all(this.items.map((t) => t.refresh()));
  }
  removeEventListener(type, listener) {
    this.#eventDispatcher.removeEventListener(type, listener);
  }
};

// node_modules/@tsparticles/engine/browser/initEngine.js
function initEngine() {
  const existing = globalThis.tsParticles;
  if (existing?.pluginManager) {
    return existing;
  }
  return new Engine();
}

// node_modules/@tsparticles/engine/browser/Enums/Directions/RotateDirection.js
var RotateDirection;
(function(RotateDirection2) {
  RotateDirection2["clockwise"] = "clockwise";
  RotateDirection2["counterClockwise"] = "counter-clockwise";
  RotateDirection2["random"] = "random";
})(RotateDirection || (RotateDirection = {}));

// node_modules/@tsparticles/engine/browser/Enums/Types/DestroyType.js
var DestroyType;
(function(DestroyType2) {
  DestroyType2["none"] = "none";
  DestroyType2["max"] = "max";
  DestroyType2["min"] = "min";
})(DestroyType || (DestroyType = {}));

// node_modules/@tsparticles/engine/browser/Enums/Types/GradientType.js
var GradientType;
(function(GradientType2) {
  GradientType2["linear"] = "linear";
  GradientType2["radial"] = "radial";
  GradientType2["random"] = "random";
})(GradientType || (GradientType = {}));

// node_modules/@tsparticles/engine/browser/index.js
var tsParticles = initEngine();

// node_modules/@tsparticles/engine/browser/browser.js
var globalObject = globalThis;
globalObject.__tsParticlesInternals = globalObject.__tsParticlesInternals ?? {};
globalObject.tsParticles = tsParticles;
globalObject.getParticlesLogger = getLogger;
globalObject.setParticlesLogger = setLogger;
globalObject.getParticlesRandom = getRandom;
globalObject.getParticlesRandomFn = getRandomFn;
globalObject.setParticlesRandom = setRandom;

export {
  RotateDirection,
  DestroyType,
  tsParticles
};
//# sourceMappingURL=chunk-LOASKGXV.js.map
