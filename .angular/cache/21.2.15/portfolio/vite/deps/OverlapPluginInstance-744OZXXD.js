import {
  ErrorCodes
} from "./chunk-5X6GYRMJ.js";
import "./chunk-LOASKGXV.js";
import {
  getDistance,
  getErrorMessage
} from "./chunk-KIDNQMHF.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@tsparticles/interaction-particles-collisions/browser/OverlapPluginInstance.js
var minRetries = 0;
var OverlapPluginInstance = class {
  #container;
  constructor(container) {
    this.#container = container;
  }
  checkParticlePosition(particle, position, tryCount) {
    return !this.#hasOverlaps(particle, position, tryCount);
  }
  #hasOverlaps(particle, pos, tryCount) {
    const collisionsOptions = particle.options.collisions;
    if (!collisionsOptions?.enable) {
      return false;
    }
    const overlapOptions = collisionsOptions.overlap;
    if (overlapOptions.enable) {
      return false;
    }
    const retries = overlapOptions.retries;
    if (retries >= minRetries && tryCount > retries) {
      throw new Error(getErrorMessage(ErrorCodes.overlapNotPlaced));
    }
    return !!this.#container.particles.find((p) => getDistance(pos, p.position) < particle.getRadius() + p.getRadius());
  }
};
export {
  OverlapPluginInstance
};
//# sourceMappingURL=OverlapPluginInstance-744OZXXD.js.map
