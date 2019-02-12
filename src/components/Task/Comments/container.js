import React, { Component } from 'react'

import { Api } from 'services/api'

import Spinner from 'components/UI/Spinner'
import Error from 'components/UI/Error'

import TaskCommentsFormContainer from './Form/container'
import Comments from '../../Comments'

class TaskCommentsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      msg: '',
      comments: []
    }
  }

  componentDidMount = () => {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({ isLoading: true })
    Api.fetchData(`task/${this.props.taskId}/comment`)
      .then(comments => {
        this.setState({ isLoading: false, comments })
      })
      .catch(err => {
        this.setState({ isLoading: false, msg: Api.handleHttpError(err) })
      })
  }

  render() {
    const { isLoading, msg, comments } = this.state
    const { taskId, showForm } = this.props

    if (isLoading) {
      return <Spinner />
    } else if (msg.length) {
      return <Error message={msg} />
    } else {
      const form = showForm ? (
        <div className="mt-4">
          <TaskCommentsFormContainer taskId={taskId} updateParentState={this.fetchData} />
        </div>
      ) : null

      return (
        <div className="TaskCommentsContainer">
          <Comments type="Task" typeId={taskId} commentList={comments} />
          {form}
        </div>
      )
    }
  }
}

TaskCommentsContainer.defaultProps = {
  showForm: true
}

export default TaskCommentsContainer