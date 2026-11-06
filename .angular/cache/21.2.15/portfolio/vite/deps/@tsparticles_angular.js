import {
  isPlatformServer
} from "./chunk-S3HEONXT.js";
import "./chunk-2SYOYM7I.js";
import {
  Component,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  NgModule,
  Output,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵproperty
} from "./chunk-R4ZEFLFC.js";
import {
  tsParticles
} from "./chunk-LOASKGXV.js";
import "./chunk-KIDNQMHF.js";
import "./chunk-RSS3ODKE.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@tsparticles/angular/fesm2022/tsparticles-angular.mjs
var initialized = false;
var initPromise;
var initCallback;
var NgParticlesService = class NgParticlesService2 {
  get loaded() {
    return initialized;
  }
  assertInitialized() {
    if (!initialized) throw new Error("NgParticlesService.init(...) must be called once before rendering ngx-particles components.");
  }
  async init(particlesInit) {
    if (initialized) return;
    if (initPromise) {
      if (initCallback !== particlesInit) throw new Error("NgParticlesService init callback must be stable across the app lifecycle.");
      await initPromise;
      return;
    }
    initCallback = particlesInit;
    initPromise = (async () => {
      if (particlesInit) await particlesInit(tsParticles);
      await tsParticles.init();
      initialized = true;
    })().catch((error) => {
      initPromise = void 0;
      initCallback = void 0;
      initialized = false;
      throw error;
    });
    await initPromise;
  }
  async waitForInitialization() {
    await (initPromise ?? Promise.resolve());
  }
  static ɵfac = function NgParticlesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NgParticlesService2)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: NgParticlesService2,
    factory: NgParticlesService2.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgParticlesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NgxParticlesComponent = class NgxParticlesComponent2 {
  platformId;
  options;
  url;
  id = "tsparticles";
  theme;
  particlesLoaded = new EventEmitter();
  #container;
  #loadingPromise;
  #particlesService;
  constructor(platformId, particlesService) {
    this.platformId = platformId;
    this.#particlesService = particlesService;
  }
  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) return;
    this.#loadingPromise = this.#loadParticles();
  }
  ngOnChanges(changes) {
    if (isPlatformServer(this.platformId)) return;
    if (!this.#container) return;
    if (changes["id"] || changes["options"] || changes["url"]) this.#loadParticles();
    if (changes["theme"]) this.#container.loadTheme?.(changes["theme"].currentValue);
  }
  ngOnDestroy() {
    this.#container?.destroy();
    this.#loadingPromise = void 0;
  }
  async #loadParticles() {
    await this.#particlesService.waitForInitialization();
    this.#particlesService.assertInitialized();
    this.#container?.destroy();
    const container = await tsParticles.load({
      id: this.id,
      options: this.options,
      url: this.url
    });
    this.#container = container;
    if (container && this.theme) container.loadTheme?.(this.theme);
    this.particlesLoaded.emit(container);
  }
  static ɵfac = function NgxParticlesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NgxParticlesComponent2)(ɵɵdirectiveInject(PLATFORM_ID), ɵɵdirectiveInject(NgParticlesService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NgxParticlesComponent2,
    selectors: [["ngx-particles"]],
    inputs: {
      options: "options",
      url: "url",
      id: "id",
      theme: "theme"
    },
    outputs: {
      particlesLoaded: "particlesLoaded"
    },
    standalone: false,
    features: [ɵɵNgOnChangesFeature],
    decls: 1,
    vars: 1,
    consts: [[3, "id"]],
    template: function NgxParticlesComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "div", 0);
      }
      if (rf & 2) {
        ɵɵproperty("id", ctx.id);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxParticlesComponent, [{
    type: Component,
    args: [{
      selector: "ngx-particles",
      standalone: false,
      template: '<div [id]="id"></div>'
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: NgParticlesService
  }], {
    options: [{
      type: Input
    }],
    url: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    theme: [{
      type: Input
    }],
    particlesLoaded: [{
      type: Output
    }]
  });
})();
var NgxParticlesModule = class NgxParticlesModule2 {
  static ɵfac = function NgxParticlesModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NgxParticlesModule2)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: NgxParticlesModule2,
    declarations: [NgxParticlesComponent],
    exports: [NgxParticlesComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [NgParticlesService]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxParticlesModule, [{
    type: NgModule,
    args: [{
      declarations: [NgxParticlesComponent],
      exports: [NgxParticlesComponent],
      providers: [NgParticlesService]
    }]
  }], null, null);
})();
export {
  NgParticlesService,
  NgxParticlesComponent,
  NgxParticlesModule
};
//# sourceMappingURL=@tsparticles_angular.js.map
