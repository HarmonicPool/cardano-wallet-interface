
let private_wasm = undefined;
/**
 * *.wasm module can only be imported asyncronously
 * Loader class allow to load the cardano serializaton lib once and make it aviable every time
 */
 class Loader {

  
    // always call this method to be shure the wasm has been loaded;
    static async load() {
  
      //load once
      if ( private_wasm !== undefined ) return;
  
      /**
       * @private
       */
       private_wasm = await import(
        "@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib"
      );
    }
  
    static get Cardano() {
      return private_wasm;
    }
  }
    
  module.exports = Loader;