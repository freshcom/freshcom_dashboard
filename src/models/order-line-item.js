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
      chargeQuantity: 1,
      isEstimate: false,
      subTotalCents: 0,
      taxOneCents: 0,
      taxTwoCents: 0,
      taxThreeCents: 0,
      grandTotalCents: 0,

      product: undefined,

      priceTaxOnePercentage: 0,
      priceTaxTwoPercentage: 0,
      priceTaxThreePercentage: 0,

      children: []
    }
  },

  balanceByTax (sourceLineItem) {
    if (isNaN(sourceLineItem.taxOneCents) || isNaN(sourceLineItem.taxTwoCents) || isNaN(sourceLineItem.taxThreeCents)) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    lineItem.grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

    return lineItem
  },

  balanceBySubTotalCents (sourceLineItem) {
    if (isNaN(sourceLineItem.subTotalCents)) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    if (lineItem.isEstimate && lineItem.price) {
      lineItem.chargeQuantity = lineItem.subTotalCents / lineItem.priceChargeAmountCents
    }

    if (lineItem.price) {
      lineItem.taxOneCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxOnePercentage / 100))
      lineItem.taxTwoCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxTwoPercentage / 100))
      lineItem.taxThreeCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxThreePercentage / 100))
    }

    lineItem.grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

    return lineItem
  },

  balanceByOrderQuantity (sourceLineItem) {
    if (isNaN(sourceLineItem.orderQuantity)) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    if (lineItem.priceEstimateByDefault) {
      lineItem.chargeQuantity = lineItem.orderQuantity * (lineItem.priceEstimateAveragePercentage / 100)
    } else {
      lineItem.chargeQuantity = lineItem.orderQuantity
    }

    return this.balanceByChargeQuantity(lineItem)
  },

  balanceByChargeQuantity (sourceLineItem) {
    if (isNaN(sourceLineItem.chargeQuantity) || isNaN(sourceLineItem.priceChargeAmountCents)) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)

    lineItem.subTotalCents = Math.round(lineItem.chargeQuantity * lineItem.priceChargeAmountCents)
    lineItem.taxOneCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxOnePercentage / 100))
    lineItem.taxTwoCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxTwoPercentage / 100))
    lineItem.taxThreeCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxThreePercentage / 100))
    lineItem.grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

    return lineItem
  },

  balanceByPrice (sourceLineItem) {
    if (!sourceLineItem.price) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    let price = lineItem.price

    lineItem.priceEstimateAveragePercentage = price.estimateAveragePercentage
    lineItem.priceEstimateByDefault = price.estimateByDefault
    lineItem.priceChargeAmountCents = price.chargeAmountCents
    lineItem.priceTaxOnePercentage = price.taxOnePercentage
    lineItem.priceTaxTwoPercentage = price.taxTwoPercentage
    lineItem.priceTaxThreePercentage = price.taxThreePercentage
    lineItem.priceChargeUnit = price.chargeUnit
    lineItem.priceOrderUnit = price.orderUnit

    if (lineItem.priceEstimateByDefault) {
      lineItem.chargeQuantity = lineItem.orderQuantity * (lineItem.priceEstimateAveragePercentage / 100)
      lineItem.isEstimate = true
    } else {
      lineItem.chargeQuantity = lineItem.orderQuantity
      lineItem.isEstimate = false
    }

    return this.balanceByChargeQuantity(lineItem)
  },

  // Expects product.defaultPrice and product.items be loaded
  balanceByProduct (sourceLineItem) {
    if (!sourceLineItem.product) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    lineItem.price = lineItem.product.defaultPrice
    return this.balanceByPrice(lineItem)
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
        subTotal: subTotal,
        taxTotal: taxTotal,
        grandTotal: grandTotal,
        fulfillmentStatus: lineItem.fulfillmentStatus,
        amount: `${subTotal} | ${taxTotal} | ${grandTotal}`
      })
    }, [])
  }
}
