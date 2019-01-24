export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Stockable',

      status: 'active',
      number: '',
      barcode: '',

      name: '',
      label: '',
      printName: '',
      unitOfMeasure: 'EA',
      specification: '',

      variableWeight: false,
      weight: 0,
      weightUnit: null,

      storageType: null,
      storageSize: 0,
      storageDescription: null,
      stackable: false,

      width: null,
      length: null,
      height: null,
      dimenstion_unit: null,

      caption: '',
      desecription: ''
    }
  }
}
