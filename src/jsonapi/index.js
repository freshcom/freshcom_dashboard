import _ from 'lodash'

export default {

  serialize (object) {
    let data = {
      type: object.type,
      attributes: {},
      relationships: {}
    }

    if (object.id) {
      data.id = object.id
    }

    _.forEach(object, (value, key) => {
      // Match relationship base on key
      if (key.endsWith('Id')) {
        let relationshipKey = _.trimEnd(key, 'Id')
        let type = _.snakeCase(relationshipKey)
        data.relationships[relationshipKey] = { data: { id: value, type: type } }
        return
      }

      // Match relationship base on key & value
      if (key.endsWith('Ids') && _.isArray(value)) {
        let relationshipKey = _.trimEnd(key, 'Ids')
        let type = _.snakeCase(relationshipKey)
        let rioArray = []

        _.forEach(value, item => {
          // If item is an object we assume there is an id attribute
          if (_.isPlainObject(item)) {
            let resourceIdentifierObject = { id: item.id, type: item.type }
            resourceIdentifierObject.type = resourceIdentifierObject.type || type
            rioArray.push(resourceIdentifierObject)
          // If item is not an object we assume it is an id
          } else {
            rioArray.push({ id: item, type: type })
          }
        })

        data.relationships[relationshipKey] = { data: rioArray }
        return
      }

      // Match relationship base on value
      if (_.isArray(value) && _.isPlainObject(value[0])) {
        let type = _.snakeCase(key)
        let rioArray = []

        _.forEach(value, item => {
          let resourceIdentifierObject = { id: item.id, type: item.type }
          resourceIdentifierObject.type = resourceIdentifierObject.type || type
          rioArray.push(resourceIdentifierObject)
        })

        data.relationships[key] = { data: rioArray }
        return
      }

      // Match relationship base on value
      if (_.isPlainObject(value)) {
        let type = _.snakeCase(key)
        let rio = { id: value.id, type: value.type }

        rio.type = rio.type || type
        data.relationships[key] = { data: rio }
        return
      }

      // Match attributes
      data.attributes[key] = value
    })

    return data
  },

  deserialize (data, included = []) {
    let db = {}
    if (!_.isEmpty(included)) {
      db = this._deserializeIncluded(included)
    }

    if (_.isArray(data)) {
      return this._deserializeArray(data, db)
    }

    return this._deserializeResourceObject(data, db)
  },

  deserializeErrors (errors) {
    let errorObjects = { }

    _.forEach(errors, item => {
      let pointerArray = _.split(item.source.pointer, '/')
      errorObjects[pointerArray[3]] = errorObjects[pointerArray[3]] || []
      errorObjects[pointerArray[3]].push(item.title)
    })

    return errorObjects
  },

  _deserializeIncluded (included) {
    let db = {}

    _.forEach(included, resourceObject => {
      let object = this._deserializeResourceObject(resourceObject)
      db[object.type] = db[object.type] || {}
      db[object.type][object.id] = object
    })

    return db
  },

  _deserializeArray (data, db = {}) {
    let objectArray = []
    _.forEach(data, resourceObject => {
      let object = this._deserializeResourceObject(resourceObject, db)
      objectArray.push(object)
    })

    return objectArray
  },

  _deserializeResourceObject (data, db = {}) {
    let object = {}
    object.id = data.id
    object.type = data.type

    if (data.attributes) {
      _.forEach(data.attributes, (value, name) => {
        object[name] = value
      })
    }

    if (data.relationships) {
      _.forEach(data.relationships, (value, name) => {
        if (_.isArray(value.data)) {
          object[name] = []

          _.forEach(value.data, rio => {
            let relationshipObject = this._find(db, rio.type, rio.id)
            if (relationshipObject) {
              object[name].push(relationshipObject)
            }
          })
        }

        if (_.isPlainObject(value.data)) {
          let rio = value.data
          let relationshipObject = this._find(db, rio.type, rio.id)
          object[name] = relationshipObject
        }
      })
    }

    return object
  },

  _find (db, type, id) {
    if (db[type]) {
      return db[type][id]
    }

    return undefined
  }
}
