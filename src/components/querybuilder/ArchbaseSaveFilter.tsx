import { Button } from '@mantine/core';
import { ArchbaseCheckBox, ArchbaseEdit } from 'components/editors';
import { ArchbaseDialog } from 'components/notification';
import React, { Component } from 'react';

interface ArchbaseSaveFilterProps {
  title: string;
  id: string;
  onClickOk?: (event?: React.MouseEvent) => void;
  onClickCancel?: (event?: React.MouseEvent) => void;
  modalOpen?: string;
  placeholder?: string;
}

class ArchbaseSaveFilter extends Component<ArchbaseSaveFilterProps> {
  private edFilterName: any;
  private edFilterPublic: any;
  constructor(props: ArchbaseSaveFilterProps) {
    super(props);
    this.edFilterName = React.createRef();
    this.edFilterPublic = React.createRef();
  }
  onClick = (id: string, event: React.MouseEvent) => {
    if (id === 'btnOK') {
      if (!this.edFilterName.current.value || this.edFilterName.current.value === '') {
        ArchbaseDialog.showWarning('Informe o nome do filtro.');
        return;
      } else if (!this.edFilterPublic.current.value) {
        ArchbaseDialog.showWarning('Informe se o filtro é público.');
        return;
      }
      if (this.props.onClickOk) {
        this.props.onClickOk(event);
      }
    } else if (id === 'btnCancel') {
      if (this.props.onClickCancel) {
        this.props.onClickCancel(event);
      }
    }
  };

  onCloseButton() {
    if (this.props.onClickCancel) {
      this.props.onClickCancel();
    }
  }

  render() {
    return (
      <ArchbaseModal
        title={this.props.title}
        id={this.props.id}
        primary
        showHeaderColor={true}
        showContextIcon={false}
        isOpen={this.props.modalOpen === this.props.id}
        onCloseButton={this.onCloseButton}
        withScroll={false}
        hideExternalScroll={true}
      >
        <ModalActions>
          {this.positionUserActions === 'first' ? (this.hasUserActions ? this.getUserActions() : null) : null}
          <Button onClick={(event)=>this.onClick("btnOK",event)}>
            OK
          </Button>{' '}
          <Button color="red" onClick={(event)=>this.onClick("btnCancel",event)}>
            Fechar
          </Button>
          {this.positionUserActions === 'last' ? (this.hasUserActions ? this.getUserActions() : null) : null}
        </ModalActions>
        <ArchbaseForm inline>
          <ArchbaseFormGroup row={false}>
            <ArchbaseEdit
              ref={this.edFilterName}
              placeHolder={this.props.placeholder}
              style={{ width: '100%' }}
            />
          </ArchbaseFormGroup>
          <ArchbaseFormGroup>
            <ArchbaseCheckBox
              ref={this.edFilterPublic}
              valueChecked={true}
              valueUnchecked={false}
              small={{ size: 8, push: 2 }}
              value="Filtro público ?"
            />
          </ArchbaseFormGroup>
        </ArchbaseForm>
      </ArchbaseModal>
    );
  }
}

export default ArchbaseSaveFilter;
