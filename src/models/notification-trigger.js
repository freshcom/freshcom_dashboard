export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'NotificationTrigger',

      name: '',
      event: '',
      description: undefined,
      actionType: 'sendEmail',
      actionTarget: ''
    }
  }
}
