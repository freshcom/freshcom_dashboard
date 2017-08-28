import _ from 'lodash'
import axios from 'axios'

import ExternalFileAPI from '@/api/external-file'
import JSONAPI from '@/jsonapi'

import ExternalFile from '@/models/external-file'

const MT = {
  PUSH_PENDING_RECORD: 'PUSH_PENDING_RECORD',
  PUSH_UPLOADED_RECORD: 'PUSH_UPLOADED_RECORD',
  POP_UPLOADED_RECORDS: 'POP_UPLOADED_RECORDS',
  PROGRESS_PENDING_RECORD: 'PROGRESS_PENDING_RECORD',
  SET_RECORDS: 'SET_RECORDS',
  SET_RECORD: 'SET_RECORD',
  RESET_RECORD: 'RESET_RECORD',
  DELETE_RECORD: 'DELETE_RECORD'
}

export const Store = {
  namespaced: true,
  state: {
    pendingRecords: [],
    uploadedRecords: [],
    records: [],
    record: ExternalFile.objectWithDefaults()
  },
  actions: {
    pushPendingRecords (context, sourceRecords) {
      let promises = _.map(sourceRecords, (record) => {
        let payloadRecord = _.pick(record, ['type', 'contentType', 'name', 'sizeBytes'])
        let apiPayload = { data: JSONAPI.serialize(payloadRecord) }

        return ExternalFileAPI.createRecord(apiPayload).then(response => {
          return JSONAPI.deserialize(response.data.data)
        }).then(createdExternalFile => {
          return _.merge({}, record, createdExternalFile)
        })
      })

      return Promise.all(promises).then(records => {
        context.commit(MT.PUSH_PENDING_RECORD, records)
        return records
      })
    },

    pushUploadedRecord (context, sourceRecord) {
      let payloadRecord = _.pick(sourceRecord, ['id', 'type', 'status', 'contentType', 'name', 'sizeBytes'])

      payloadRecord.status = 'uploaded'
      let apiPayload = { data: JSONAPI.serialize(payloadRecord) }

      return ExternalFileAPI.updateRecord(sourceRecord.id, apiPayload).then(response => {
        return JSONAPI.deserialize(response.data.data)
      }).then(updatedRecord => {
        let record = _.merge({}, sourceRecord, updatedRecord)
        context.commit(MT.PUSH_UPLOADED_RECORD, record)
      })
    },

    popUploadedRecords (context, records) {
      context.commit(MT.POP_UPLOADED_RECORDS, records)
    },

    progressPendingRecord (context, payload) {
      context.commit(MT.PROGRESS_PENDING_RECORD, payload)
    },

    loadRecord ({ state, commit, rootState }, actionPayload) {
      if (state.record && state.record.id === actionPayload.id && state.record.locale === rootState.resourceLocale) {
        return new Promise((resolve, reject) => {
          resolve(state.record)
        })
      }

      if (state.record.id !== actionPayload.id) {
        commit(MT.RESET_RECORD)
      }

      actionPayload = _.merge({}, actionPayload, { locale: rootState.resourceLocale })
      return ExternalFileAPI.getRecord(actionPayload.id, actionPayload).then(response => {
        let apiPayload = response.data
        let record = JSONAPI.deserialize(apiPayload.data, apiPayload.included)
        commit(MT.SET_RECORD, record)

        return record
      }).catch(error => {
        throw JSONAPI.deserializeErrors(error.response.data.errors)
      })
    },

    resetRecord ({ commit }) {
      commit(MT.RESET_RECORD)
    },

    loadRecords ({ state, commit }, actionPayload) {
      actionPayload = _.merge({}, actionPayload, { locale: state.resourceLocale })

      return ExternalFileAPI.queryRecord(actionPayload).then(response => {
        return { meta: response.data.meta, resources: JSONAPI.deserialize(response.data.data) }
      }).then(response => {
        commit(MT.SET_RECORDS, response.resources)

        return response
      })
    },

    deleteRecord ({ commit }, id) {
      return ExternalFileAPI.deleteRecord(id).then(response => {
        commit(MT.DELETE_RECORD, id)

        return response
      })
    }
  },

  mutations: {
    [MT.PUSH_PENDING_RECORD] (state, records) {
      state.pendingRecords = _.concat(state.pendingRecords, records)
    },

    [MT.PUSH_UPLOADED_RECORD] (state, record) {
      state.pendingRecords = _.reject(state.pendingRecords, (pendingRecord) => { return pendingRecord.id === record.id })
      state.uploadedRecords = _.concat(state.uploadedRecords, record)
    },

    [MT.PROGRESS_PENDING_RECORD] (state, payload) {
      let pendingRecords = _.cloneDeep(state.pendingRecords)
      let record = _.find(pendingRecords, (pendingRecord) => { return pendingRecord.id === payload.record.id })
      if (!record) { return }

      record.percentage = payload.percentage
      state.pendingRecords = pendingRecords
    },

    [MT.POP_UPLOADED_RECORDS] (state, records) {
      let recordIds = _.map(records, (record) => { return record.id })
      state.uploadedRecords = _.reject(state.uploadedRecords, (uploadedRecord) => { return _.includes(recordIds, uploadedRecord.id) })
    },

    [MT.RESET_RECORD] (state) {
      state.record = ExternalFile.objectWithDefaults()
    },

    [MT.SET_RECORD] (state, record) {
      state.record = record
    },

    [MT.SET_RECORDS] (state, records) {
      state.records = records
    },

    [MT.DELETE_RECORD] (state, id) {
      state.records = _.reject(state.records, (record) => { return record.id === id })
      state.record = ExternalFile.objectWithDefaults()
    }
  }
}

export const Plugin = function (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type !== `externalFile/${MT.PUSH_PENDING_RECORD}`) {
      return
    }

    _.forEach(state.externalFile.pendingRecords, (externalFile) => {
      let config = {
        onUploadProgress: _.throttle((progressEvent) => {
          let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          store.dispatch('externalFile/progressPendingRecord', { record: externalFile, percentage: percentage })
        }, 500),
        headers: { 'Content-Type': externalFile.contentType }
      }

      // Upload to S3
      axios.put(externalFile.url, externalFile.file, config).then((res) => {
        store.dispatch('externalFile/pushUploadedRecord', externalFile)
      })
    })
  })
}
