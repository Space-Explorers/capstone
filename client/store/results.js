import axios from 'axios'

// ACTION TYPES

const GOT_RESULTS = 'GOT_RESULTS'

// ACTION CREATORS

const gotResults = results => ({
  type: GOT_RESULTS,
  results
})

// THUNK CREATORS

export const getResults = (code, problemId, userId, points, userProgress) => async dispatch => {
  try {
    console.log('PROGRESS', userProgress)
    const resultsData = await axios.post('/api/docker', {
      code,
      problemId,
      userId
    })
    if (resultsData.data.stats.passPercent === 100) {
      resultsData.data.success = true;
      const { data } = await axios.put(`/api/users/${userId}`, {
        userProgress,
        points,
        problemId
      })
      console.log('data', data)
      dispatch(gotResults(resultsData.data))
    }
    console.log('THUNK DATA', resultsData.data)
    dispatch(gotResults(resultsData.data))
  } catch (err) {
    console.error(err)
  }
}

// REDUCER

export default function (state = '', action) {
  switch (action.type) {
    case GOT_RESULTS: {
      return action.results
    }
    default:
      return state
  }
}
