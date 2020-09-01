import React from 'react'
import { graphql } from 'gatsby'
import Layout from '~components/layout'
import StateNavWrapper from '~components/pages/data/state-nav-wrapper'
import StatePreamble from '~components/pages/state/preamble'
import SummaryCharts from '~components/pages/data/summary-charts'
import StateSummary from '~components/pages/data/summary'
import StateNotes from '~components/pages/state/state-notes'

const StateTemplate = ({ pageContext, data, path }) => {
  const state = pageContext
  const {
    covidState,
    allCovidStateDaily,
    allCovidStateInfo,
    covidStateInfo,
    allCovidUsDaily,
    allContentfulEvent,
    sevenDaysAgo,
    contentfulStateOrTerritory,
  } = data
  return (
    <Layout title={state.name} returnLinks={[{ link: '/data' }]} path={path}>
      <StatePreamble state={state} covidState={covidState} />
      {state.notes && <StateNotes notes={state.notes} />}
      <SummaryCharts
        name={state.name}
        history={allCovidStateDaily.nodes}
        usHistory={allCovidUsDaily.nodes}
        annotations={allContentfulEvent}
        testSource={covidState.totalTestResultsSource}
      />
      <StateNavWrapper stateList={allCovidStateInfo.nodes} single>
        <StateSummary
          sevenDaysAgo={sevenDaysAgo}
          stateSlug={state.slug}
          data={covidState}
          population={covidStateInfo.childPopulation.population}
          metadata={contentfulStateOrTerritory}
          lastUpdated={covidState.lastUpdateEt}
        />
      </StateNavWrapper>
    </Layout>
  )
}

export default StateTemplate

export const query = graphql`
  query($state: String!, $sevenDaysAgo: Int) {
    sevenDaysAgo: covidStateDaily(
      date: { eq: $sevenDaysAgo }
      state: { eq: $state }
    ) {
      positive
    }
    allCovidStateInfo(sort: { fields: name }) {
      nodes {
        state
        name
        childSlug {
          slug
        }
      }
    }
    covidStateInfo(state: { eq: $state }) {
      state
      childPopulation {
        population
      }
    }
    allCovidUsDaily {
      nodes {
        totalTestResults
        totalTestResultsIncrease
        positive
        positiveIncrease
        pending
        negative
        hospitalized
        hospitalizedIncrease
        hospitalizedCurrently
        death
        deathIncrease
        date
        childPopulation {
          deathIncrease {
            percent
          }
          hospitalizedCurrently {
            percent
          }
          positiveIncrease {
            percent
          }
          totalTestResultsIncrease {
            percent
          }
        }
      }
    }
    covidState(state: { eq: $state }) {
      state
      positive
      positiveIncrease
      negative
      lastUpdateEt
      dateModified
      pending
      hospitalizedCurrently
      hospitalizedCumulative
      inIcuCurrently
      inIcuCumulative
      recovered
      onVentilatorCurrently
      onVentilatorCumulative
      death
      deathProbable
      deathConfirmed
      totalTestResults
      dateModified
      dataQualityGrade
      posNeg
      positiveCasesViral
      positiveTestsViral
      negativeTestsViral
      totalTestsPeopleViral
      totalTestsViral
      totalTestEncountersViral
      totalTestsAntibody
      totalTestResultsSource
    }
    allCovidStateDaily(
      filter: { state: { eq: $state } }
      sort: { fields: date, order: DESC }
    ) {
      nodes {
        totalTestResults
        totalTestEncountersViralIncrease
        totalTestsViralIncrease
        totalTestsPeopleViralIncrease
        totalTestResultsIncrease
        positive
        positiveIncrease
        pending
        negative
        hospitalized
        hospitalizedCurrently
        hospitalizedIncrease
        death
        deathIncrease
        date
        childPopulation {
          deathIncrease {
            percent
          }
          hospitalizedCurrently {
            percent
          }
          positiveIncrease {
            percent
          }
          totalTestEncountersViralIncrease {
            percent
          }
          totalTestsViralIncrease {
            percent
          }
          totalTestsPeopleViralIncrease {
            percent
          }
          totalTestResultsIncrease {
            percent
          }
        }
      }
    }
    contentfulStateOrTerritory(code: { eq: $state }) {
      testUnitsUnknown
    }
    allContentfulEvent(
      filter: {
        state: { elemMatch: { code: { eq: $state } } }
        displayStateChart: { eq: true }
      }
      sort: { fields: date, order: DESC }
    ) {
      nodes {
        title
        description {
          description
        }
        date(formatString: "YYYYMMDD")
        dataElement
        contentful_id
        childContentfulEventDescriptionTextNode {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`