import React from 'react'

const SummaryComponent = ({tasks})=> {
    console.log("Summary tasks:",tasks)
  return (
    <div>
        <h2>Summary for component</h2>
        <ul className='text-white'>
            {tasks.map(task=>(
                <li key={task.taskid}>{task.title}</li>
            ))}
        </ul>
    </div>
  )
}

export default SummaryComponent