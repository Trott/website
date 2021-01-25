import { useMemo } from 'react'
import { formatDateToString } from '~components/utils/format'

const getAvailableMetricFields = (latestDay, startsWith, raceOnly) => {
  /**
   * Returns a list of all of the available metric fields.
   * raceOnly: returns only race values when true, only ethnicity
   *  values when false
   */
  const listOfMetrics = []

  Object.keys(latestDay).forEach(value => {
    if (
      value.startsWith(startsWith) &&
      latestDay[value] != null &&
      !value.includes('Total')
    ) {
      listOfMetrics.push(value)
    }
  })

  if (raceOnly) {
    return listOfMetrics.filter(metric => !metric.includes('Ethnicity'))
  }
  if (!raceOnly) {
    return listOfMetrics.filter(metric => metric.includes('Ethnicity'))
  }

  return listOfMetrics
}

const formatTableValues = (timeSeriesData, usingRates) => {
  /**
   * Adds the formattedDate field, adds asterisks for small numbers.
   * @param usingRates: whether or not the user is looking at rates or
   *   total numbers. true means the user is using rates.
   */
  const newDays = []

  timeSeriesData.forEach((day, index) => {
    newDays[index] = day
    newDays[index].formattedDate = formatDateToString(day.Date, 'MMMM d, yyyy')

    const availableDataPoints = Object.keys(day)
    const smallNumberCutoff = 10

    availableDataPoints.forEach(dataPointName => {
      const dataPointValue = day[dataPointName]

      if (
        typeof dataPointValue === 'number' &&
        dataPointValue != null &&
        !dataPointName.toLowerCase().includes('date')
      ) {
        // Format the value if the value is numeric.
        newDays[index][dataPointName] = dataPointValue.toLocaleString()
      }
      if (usingRates) {
        // todo double-check this logic is right
        if (
          dataPointValue != null &&
          Number.isInteger(dataPointValue) &&
          dataPointValue < smallNumberCutoff
        ) {
          newDays[index][dataPointName] = `${dataPointValue}*`
        }
      }
    })
  })

  return newDays
}

const removeMetricPrefix = metric => {
  /**
   * Removes the 'Cases_' or 'Hosp_', etc. prefix from a string.
   */
  return metric.replace(/^[A-z]*_/, '')
}

const addPer100kValues = (timeSeriesData, populationData) => {
  /**
   * Adds per 100k fields to the timeSeries data.
   */

  const crdtToAcsDict = {
    AIAN: 'aian',
    Asian: 'asian',
    Black: 'black',
    Hispanic: 'hisp',
    LatinX: 'hisp',
    NHPI: 'nhpi',
    NonHispanic: 'notHisp',
    Other: 'other',
    Total: 'total',
    Multiracial: 'twoOrMore',
    White: 'white',
    // todo handle other and unknown
  }

  const timeSeriesWithPer100k = useMemo(() => {
    const completeData = timeSeriesData

    timeSeriesData.forEach((day, dayIndex) => {
      // For each day...
      Object.keys(day).forEach(metricKey => {
        // For each metric on each day...
        if (day[metricKey] === null) {
          // Skip if the value is null
          return
        }
        const raceEthnicityGroup = removeMetricPrefix(metricKey)
        const groupAcsName = crdtToAcsDict[raceEthnicityGroup]

        if (groupAcsName === undefined) {
          return
        }

        const groupPopulation = populationData[groupAcsName]
        const perCapitaRate = day[metricKey] / groupPopulation
        const per100kRate = Math.round(perCapitaRate * 100000)

        const newMetricKey = `${metricKey}_per100k`

        completeData[dayIndex][newMetricKey] = per100kRate
      })
    })
    return completeData
  }, [timeSeriesData])

  return timeSeriesWithPer100k
}

const isCombined = (combined, separate) => {
  /**
   * Identifies if a state reports racial data as combined or separate.
   */
  if (combined.length === 1) {
    return true
  }
  if (separate.length === 1) {
    return false
  }
  return null
}

export {
  getAvailableMetricFields,
  formatTableValues,
  isCombined,
  addPer100kValues as addPerCapitaValues,
  removeMetricPrefix,
}
