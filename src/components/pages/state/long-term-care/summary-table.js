/* eslint-disable no-underscore-dangle */
import React from 'react'
import classnames from 'classnames'
import { Link } from 'gatsby'
import tableStyle from '~components/common/table.module.scss'
import summaryTableStyle from './summary-table.module.scss'
import { FormatNumber } from '~components/utils/format'

const categoryLabels = {
  nh: 'Nursing home',
  ltc: 'Long-term-care facility',
  alf: 'Assisted-living facility',
  other: 'Other facility',
  lumpedother: 'Lumped or other long-term-care facilities',
}

const getAllowedCategories = data => {
  const categories = ['nh', 'alf', 'other', 'ltc']
  const allowedCategories = []
  categories.forEach(category => {
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (
          key.search(`_${category}`) > -1 &&
          item[key] > 0 &&
          allowedCategories.indexOf(category) === -1
        ) {
          allowedCategories.push(category)
        }
      })
    })
  })

  return allowedCategories.sort(category =>
    categories.indexOf(category) < allowedCategories.indexOf(category) ? -1 : 1,
  )
}

const fields = [
  'posres_',
  'deathres_',
  'posstaff_',
  'deathstaff_',
  'posresstaff_',
  'deathresstaff_',
  'outbrkfac_',
]

const getValue = (data, field, category) => {
  if (data[`${field}${category}`] || field.search('resstaff') === -1) {
    if (data[`prob${field}${category}`]) {
      return data[`prob${field}${category}`] + data[`${field}${category}`]
    }
    return data[`${field}${category}`]
  }
  if (field === 'posresstaff_') {
    let result = null
    const fieldList = ['posres', 'posstaff', 'probposres', 'probposstaff']
    fieldList.forEach(fieldItem => {
      if (data[`${fieldItem}_${category}`] !== null) {
        result += data[`${fieldItem}_${category}`]
      }
    })
    return result
  }

  if (field === 'deathresstaff_') {
    let result = null
    const fieldList = [
      'deathres',
      'deathstaff',
      'probdeathres',
      'probdeathstaff',
    ]
    fieldList.forEach(fieldItem => {
      if (data[`${fieldItem}_${category}`] !== null) {
        result += data[`${fieldItem}_${category}`]
      }
    })
    return result
  }
  if (
    data[`prob${field}${category}`] &&
    data[`prob${field}${category}`] !== null
  ) {
    return data[`prob${field}${category}`] + data[`prob${field}${category}`]
  }
  return data[`${field}${category}`]
}

const CategoryRows = ({ data, category }) => (
  <>
    {fields.map(field => (
      <td>
        <FormatNumber number={getValue(data, field, category)} />
      </td>
    ))}
  </>
)

const TotalRows = ({ data, categories }) => {
  const totals = {}
  fields.forEach(field => {
    totals[field] = null
    categories.forEach(category => {
      if (
        field === 'posresstaff_' &&
        !data[`${field}${category}`] &&
        (data[`posres_${category}`] !== null ||
          data[`posstaff_${category}`] !== null)
      ) {
        totals[field] +=
          data[`posres_${category}`] + data[`posstaff_${category}`]
        if (
          data[`probposres_${category}`] !== null ||
          data[`probposstaff_${category}`] !== null
        ) {
          totals[field] +=
            data[`probposres_${category}`] + data[`probposstaff_${category}`]
        }

        return
      }
      if (
        field === 'deathresstaff_' &&
        !data[`${field}${category}`] &&
        (data[`deathres_${category}`] !== null ||
          data[`deathstaff_${category}`] !== null)
      ) {
        totals[field] +=
          data[`deathres_${category}`] + data[`deathstaff_${category}`]
        if (
          data[`probdeathres_${category}`] !== null ||
          data[`probdeathstaff_${category}`] !== null
        ) {
          totals[field] +=
            data[`probdeathres_${category}`] +
            data[`probdeathstaff_${category}`]
        }
        return
      }
      if (data[`${field}${category}`] !== null) {
        totals[field] += data[`${field}${category}`]
      }
      if (
        typeof data[`prob${field}${category}`] !== 'undefined' &&
        data[`prob${field}${category}`] !== null
      ) {
        totals[field] += data[`prob${field}${category}`]
      }
    })
  })
  return (
    <>
      {fields.map(field => (
        <td>
          <FormatNumber number={totals[field]} />
        </td>
      ))}
    </>
  )
}

const LongTermCareSummaryTable = ({ stateSlug, aggregate }) => {
  const categories = getAllowedCategories([aggregate])
  return (
    <table className={classnames(summaryTableStyle.table, tableStyle.table)}>
      <thead>
        <tr>
          <th scope="col">Facility type</th>
          <th scope="col">Resident cases</th>
          <th scope="col">Resident deaths</th>
          <th scope="col">Staff cases</th>
          <th scope="col">Staff deaths</th>
          <th scope="col">Staff &amp; Resident cases</th>
          <th scope="col">Staff &amp; Resident deaths</th>
          <th scope="col">Facilities impacted</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(category => (
          <tr>
            <th scope="row">{categoryLabels[category]}</th>
            <CategoryRows data={aggregate} category={category} />
          </tr>
        ))}
        <tr className={summaryTableStyle.totals}>
          <th scope="row">
            Totals{' '}
            <span>
              <Link to={`/data/state/${stateSlug}/long-term-care/history`}>
                history
              </Link>
            </span>
          </th>
          <TotalRows data={aggregate} categories={categories} />
        </tr>
      </tbody>
    </table>
  )
}

export default LongTermCareSummaryTable
