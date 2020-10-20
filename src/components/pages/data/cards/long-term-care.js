import React from 'react'
import { Link } from 'gatsby'
import { Card, CardBody, CardNote } from '~components/common/card'
import { Statistic, DrillDown } from '~components/common/statistic'
import { FormatDate, formatDateToString } from '~components/utils/format'

export default ({ data, stateSlug }) => {
  const { current, last, facilities } = data

  const getChange = field => {
    if (!current[field] || !last[field]) {
      return 'N/A'
    }
    return `${Math.round(
      ((current[field] - last[field]) / last[field]) * 100 * 10,
    ) / 10}%`
  }

  return (
    <Card
      title="Long Term Care"
      link={
        <Link to={`/data/state/${stateSlug}/long-term-care`}>More data</Link>
      }
    >
      <CardBody>
        {data ? (
          <>
            <Statistic title="Total cases" value={current.total_cases}>
              <DrillDown
                label={`New cases since ${formatDateToString(
                  last.date,
                  'LLL dd',
                )}`}
                value={getChange('total_cases')}
                calculated
              />
            </Statistic>
            <Statistic title="Total deaths" value={current.total_death}>
              <DrillDown
                label={`New deaths since ${formatDateToString(
                  last.date,
                  'LLL dd',
                )}`}
                value={getChange('total_death')}
                calculated
              />
            </Statistic>
            <Statistic title="Facilities tracked" value={facilities} />
          </>
        ) : (
          <CardNote>No long-term care data reported.</CardNote>
        )}
        <CardNote>
          Data as of <FormatDate date={current.date} format="LLLL dd yyyy" />
        </CardNote>
      </CardBody>
    </Card>
  )
}
