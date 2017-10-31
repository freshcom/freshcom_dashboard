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
      subTotalCents: 19300,
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

  balanceByChargeQuantity (sourceLineItem) {
    if (!sourceLineItem.chargeQuantity || !sourceLineItem.priceChargeCents) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)

    lineItem.subTotalCents = Math.round(lineItem.chargeQuantity * lineItem.priceChargeCents)
    lineItem.taxOneCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxOnePercentage / 100))
    lineItem.taxTwoCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxTwoPercentage / 100))
    lineItem.taxThreeCents = Math.round(lineItem.subTotalCents * (lineItem.priceTaxThreePercentage / 100))
    lineItem.grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + this.formModel.taxThreeCents

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
    lineItem.priceChargeCents = price.chargeCents
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

  balanceByProductItem (sourceLineItem) {
    if (!sourceLineItem.productItem) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    let productItem = lineItem.productItem

    lineItem.price = productItem.defaultPrice
    return this.balanceByPrice(lineItem)
  },

  // Expects product.defaultPrice and product.items be loaded
  balanceByProduct (sourceLineItem) {
    if (!sourceLineItem.product) {
      return sourceLineItem
    }

    let lineItem = _.cloneDeep(sourceLineItem)
    let product = lineItem.product

    if (product.itemMode === 'all') {
      lineItem.price = product.defaultPrice
      return this.balanceByPrice(lineItem)
    } else {
      let primaryItem = _.find(product.items, { primary: true })
      lineItem.productItem = primaryItem
      return this.balanceByProductItem(lineItem)
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
