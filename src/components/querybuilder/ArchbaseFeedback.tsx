import React, { Component, ReactNode } from 'react'

interface ArchbaseFeedbackProps {
  style?: React.CSSProperties
  classNameFeedback?: string | undefined
  when?: (inputValue: any) => boolean
  inputValue?: any
  primary?: boolean
  info?: boolean
  danger?: boolean
  warning?: boolean
  secondary?: boolean
  default?: boolean
  children?: ReactNode
}

export class ArchbaseFeedback extends Component<ArchbaseFeedbackProps> {
  render = () => {
    const { style, when, inputValue, children, classNameFeedback } = this.props

    if (when && inputValue) {
      const result = when(inputValue)
      if (result === true) {
        return (
          <div style={style} className={classNameFeedback}>
            {children}
          </div>
        )
      }
    }
    return null
  }
}
