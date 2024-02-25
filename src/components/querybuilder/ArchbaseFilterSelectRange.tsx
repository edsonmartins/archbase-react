import { ActionIcon, Box, Button, Space, Tooltip, Variants } from '@mantine/core'
import { IconCalendar, IconCalendarEvent, IconCalendarMonth, IconCalendarWeek } from '@tabler/icons-react'
import { t } from 'i18next'
import React, { Component } from 'react'
import { Calendar, Value } from 'react-multi-date-picker'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface ArchbaseFilterSelectRangeProps {
  id?: string
  key?: string
  onCancelSelectRange?: () => void
  onConfirmSelectRange?: (value: Value | undefined, selectRangeType: any) => void
  width?: string | undefined
  selectRangeType?: 'day' | 'week' | 'month' | 'range'
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
}

interface ArchbaseFilterSelectRangeState {
  value?: Value
  selectRangeType?: 'day' | 'week' | 'month' | 'range'
}

class ArchbaseFilterSelectRange extends Component<
  ArchbaseFilterSelectRangeProps,
  ArchbaseFilterSelectRangeState
> {
  private dateRef: any
  constructor(props: ArchbaseFilterSelectRangeProps) {
    super(props)
    this.state = { value: undefined, selectRangeType: 'range' }
    this.dateRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps = (_nextProps: ArchbaseFilterSelectRangeProps) => {
    this.setState({ value: undefined })
  }

  handleDateChange = (value: Value) => {
    this.setState({ value })
  }

  render = () => {
    return (
      <div
        id={this.props.id}
        key={this.props.key}
        style={{width:this.props.width, display:'grid', justifyContent:'center', height:'344px'}}
      >
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Calendar
            ref={this.dateRef}
            value={this.state.value}
            shadow={false}
            weekDays={weekDays}
            months={months}
            weekPicker={this.state.selectRangeType === 'week'}
            onlyMonthPicker={this.state.selectRangeType === 'month'}
            range={
              this.state.selectRangeType === 'week' ||
              this.state.selectRangeType === 'month' ||
              this.state.selectRangeType === 'range'
            }
            multiple={this.state.selectRangeType === 'day'}
            format={'DD/MM/YYYY'}
            numberOfMonths={2}
            onChange={this.handleDateChange}
          />
        </div>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems:"center",
            width: this.props.width,
            height: '40px',
            marginTop: '10px'
          }}
        >
          <div style={{display:'flex', alignItems:'center'}}>
            <Tooltip withinPortal withArrow label={`${t('archbase:Intervalo')}`}>
                <ActionIcon
                  variant={this.props.variant}
                  size="lg"
                  color="primary"
                  onClick={()=>this.setState({...this.state, selectRangeType:'range'})}
                  sx={{ width: '36px', height: '36px', marginRight: 2 }}
                >
                  <IconCalendarEvent size="1.4rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip withinPortal withArrow label={`${t('archbase:Mês')}`}>
                <ActionIcon
                  variant={this.props.variant}
                  size="lg"
                  color="primary"
                  onClick={()=>this.setState({...this.state, selectRangeType:'month'})}
                  sx={{ width: '36px', height: '36px', marginRight: 2 }}
                >
                  <IconCalendarMonth size="1.4rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip withinPortal withArrow label={`${t('archbase:Semana')}`}>
                <ActionIcon
                  variant={this.props.variant}
                  size="lg"
                  color="primary"
                  onClick={()=>this.setState({...this.state, selectRangeType:'week'})}
                  sx={{ width: '36px', height: '36px', marginRight: 2 }}
                >
                  <IconCalendarWeek size="1.4rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip withinPortal withArrow label={`${t('archbase:Dia')}`}>
                <ActionIcon
                  variant={this.props.variant}
                  size="lg"
                  color="primary"
                  onClick={()=>this.setState({...this.state, selectRangeType:'day'})}
                  sx={{ width: '36px', height: '36px', marginRight: 2 }}
                >
                  <IconCalendar size="1.4rem" />
                </ActionIcon>
              </Tooltip>
          </div>
          <div style={{display:'flex'}}>
            <Button variant={this.props.variant} onClick={() => this.props.onConfirmSelectRange!(this.state.value, this.state.selectRangeType)}>
              Aplicar
            </Button>
            <Space w={"sm"}></Space>
            <Button variant={this.props.variant} color="red" onClick={this.props.onCancelSelectRange}>
              Cancela
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

export { ArchbaseFilterSelectRange }
