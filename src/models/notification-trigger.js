export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'NotificationTrigger',

      name: '',
      event: '',
      description: undefined,
      actionType: 'sendEmail',
      actionTarget: '',

      targetResource: {}
    }
  },

  setTargetResource (object) {
    if (object.actionType === 'sendEmail') {
      let targetType = 'EmailTemplate'
      object.targetResource = { id: object.actionTarget, type: targetType }
    }

    if (object.actionType === 'sendSms') {
      let targetType = 'SmsTemplate'
      object.targetResource = { id: object.actionTarget, type: targetType }
    }

    return object
  }
}
