import { defineScene } from '../scene';

export default defineScene('DefaultNotFound', {
  enter(payload) {
    console.warn(
      'Asphalt: [Warning] strongly recommend to set default scene. You can set it via AsphaltContext.default()'
    );
    return [];
  },
  leave() {
    return [];
  }
});
