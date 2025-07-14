import React from "react"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Todo from "./Todo"

describe('Todo component', () => {
  const mockTodoObj = {
    text: 'Test todo',
    done: false
  }

  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button>Delete</button>
      </span>
    </>
  )

  const notDoneInfo = (
    <>
      <span>This todo is not done</span>
      <span>
        <button>Delete</button>
        <button>Set as done</button>
      </span>
    </>
  )

  test('When todo is rendered, the text correctly appears', () => {
    render(<Todo todo={mockTodoObj} doneInfo={doneInfo} notDoneInfo={notDoneInfo}/>)
    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  test('When the todo is not done, the not done info is shown', () => {
    render(<Todo todo={mockTodoObj} doneInfo={doneInfo} notDoneInfo={notDoneInfo}/>)
    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
    expect(screen.getByText('Set as done')).toBeInTheDocument()
  })

  test('When the todo is done, the done info is shown', () => {
    const doneTodoObj = { ...mockTodoObj, done:true }
    render(<Todo todo={doneTodoObj} doneInfo={doneInfo} notDoneInfo={notDoneInfo}/>)
    expect(screen.getByText('This todo is done')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

})