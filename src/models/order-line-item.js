import _ from 'lodash'
import { dollar } from '@/helpers/filters'

export default {
  objectWithDefaults () {
    return {
      id: undefined,
      type: 'OrderLineItem',

      name: '',
      printName: '',
      orderQuantity: 1,
      isEstimate: false,
      subTotalCents: 0,
      taxOneCents: 0,
      taxTwoCents: 0,
      taxThreeCents: 0,
      grandTotalCents: 0,

      product: null,
      productItem: null,
      sku: null,
      unlockable: null,

      priceTaxOnePercentage: 0,
      priceTaxTwoPercentage: 0,
      priceTaxThreePercentage: 0,

      children: []
    }
  },

  tableData (lineItems) {
    return _.reduce(lineItems, (acc, lineItem) => {
      let quantity = `${lineItem.orderQuantity}`
      let chargeQuantity = Number(lineItem.chargeQuantity).toFixed(2)
      if (lineItem.isEstimate) {
        quantity += ` (~ ${chargeQuantity}${lineItem.priceChargeUnit})`
      } else if (lineItem.priceEstimateByDefault) {
        quantity += ` (${chargeQuantity}${lineItem.priceChargeUnit})`
      }

      let taxTotalCents = lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents
      let grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

      let subTotal = dollar(lineItem.subTotalCents)
      if (lineItem.isEstimate) {
        subTotal = `~ ${subTotal}`
      }

      let grandTotal = dollar(grandTotalCents)
      if (lineItem.isEstimate) {
        grandTotal = `~ ${grandTotal}`
      }

      let taxTotal = dollar(taxTotalCents)

      return _.concat(acc, {
        id: lineItem.id,
        name: lineItem.name,
        quantity: quantity,
        children: lineItem.children,
        amount: `${subTotal} | ${taxTotal} | ${grandTotal}`
      })
    }, [])
  }
}
