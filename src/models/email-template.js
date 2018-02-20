export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'EmailTemplate',

      name: '',
      description: undefined,
      to: '',
      replyTo: undefined,
      subject: '',
      bodyHtml: ''
    }
  }
}
