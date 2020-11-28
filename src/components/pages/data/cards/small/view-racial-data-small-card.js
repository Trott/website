import React from 'react'
import { SmallCard, SmallCardIcon, SmallCardLink } from './index'

import spreadsheetIcon from '~images/icons/spreadsheet.svg'

const ViewRacialDataSmallCard = ({ stateAbbreviation, ignoreStates }) =>
  ignoreStates.indexOf(stateAbbreviation) === -1 && (
    <SmallCard
      destination={`/race/dashboard#state-${stateAbbreviation.toLowerCase()}`}
    >
      <SmallCardIcon>
        <img
          src={spreadsheetIcon}
          alt="Spreadsheet icon"
          width="30px"
          aria-hidden
        />
      </SmallCardIcon>
      <SmallCardLink>
        View all racial data for {stateAbbreviation}
      </SmallCardLink>
    </SmallCard>
  )

export default ViewRacialDataSmallCard
