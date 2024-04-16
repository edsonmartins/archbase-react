import { t } from 'i18next';
import React, { PureComponent } from 'react';
import { FallbackProps } from './types';

export type ArchbaseErrorFallbackProps = FallbackProps;

export class ArchbaseErrorFallback extends PureComponent<ArchbaseErrorFallbackProps> {
	onClick() {
		window.location.reload();
	}

	render() {
		return (
			<div id="notfound" {...this.props.othersProps}>
				<div className="notfound">
					<div className="notfound-404">
						<h1>Oops!</h1>
					</div>
					<h3>{`${t('archbase:Sentimos muito, ocorreu um erro inesperado.')}`}</h3>
					<div
						style={{
							minHeight: '50px',
							borderRadius: '8px',
							borderWidth: '1px 1px 1px 10px',
							borderStyle: 'solid',
							borderColor: 'silver silver silver red',
							fontSize: '18px',
							color: 'red',
							margin: '20px',
							justifyContent: 'center',
							display: 'flex',
							alignItems: 'center',
							padding: '8px',
						}}
					>
						{this.props.error.message}
					</div>
					<button onClick={this.onClick}>{`${t('archbase:Voltar')}`}</button>
				</div>
			</div>
		);
	}
}
