export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'Stockable',

      code: '',
      status: 'active',
      name: '',
      printName: '',
      unitOfMeasure: null,
      variableWeight: false,

      storageType: null,
      storageSize: 0,
      stackable: true,

      caption: '',
      desecription: '',
      specification: '',
      storageDescription: ''
    }
  }
}
