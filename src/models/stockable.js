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
      weight: undefined,
      weightUnit: undefined,

      storageType: undefined,
      storageSize: undefined,
      storageDescription: undefined,
      stackable: false,

      width: undefined,
      length: undefined,
      height: undefined,
      dimenstion_unit: undefined,

      caption: '',
      desecription: ''
    }
  }
}
