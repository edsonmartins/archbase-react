//https://github.com/vanilla-masker/vanilla-masker
export type MaskOptions = {
	delimiter?: string;
	lastOutput?: string;
	precision?: number;
	separator?: string;
	showSignal?: boolean;
	suffixUnit?: string;
	unit?: string;
	zeroCents?: boolean;
	pattern?: string;
	placeholder?: string;
};

export class ArchbaseMasker {
	private elements: HTMLElement[];

	constructor(elements: HTMLElement | HTMLElement[]) {
		if (!elements) {
			throw new Error('VanillaMasker: There is no element to bind.');
		}
		this.elements = Array.isArray(elements) ? elements : [elements];
	}

	private static isAllowedKeyCode(keyCode: number): boolean {
		const BY_PASS_KEYS = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93];
		return !BY_PASS_KEYS.includes(keyCode);
	}

	private bindElementToMask(maskFunction: (value: string, opts?: MaskOptions) => string, opts?: MaskOptions): void {
		this.elements.forEach((element: any) => {
			const onType = (e: KeyboardEvent) => {
				if (ArchbaseMasker.isAllowedKeyCode(e.keyCode)) {
					setTimeout(() => {
						const value = element.value;
						element.value = maskFunction(value, opts);
						if (element.setSelectionRange && opts && opts.suffixUnit) {
							element.setSelectionRange(element.value.length, element.value.length - opts.suffixUnit.length);
						}
					}, 0);
				}
			};

			element.onkeyup = onType;
		});
	}

	public static toMoney(value: string, opts: MaskOptions = {}): string {
		opts = {
			delimiter: '.',
			separator: ',',
			precision: 2,
			unit: '',
			suffixUnit: '',
			zeroCents: false,
			...opts,
		};

		let money = value.replace(/[\D]/g, '').padStart(opts.precision + 1, '0');
		let decimalPart = money.slice(-opts.precision);
		let integerPart = money.slice(0, -opts.precision);

		if (!opts.zeroCents) {
			decimalPart = '.' + decimalPart;
		}

		integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.delimiter);

		return opts.unit + integerPart + (opts.precision > 0 ? opts.separator + decimalPart : '') + opts.suffixUnit;
	}

	public static toPattern(value: string, opts: MaskOptions): string {
		const pattern = opts.pattern || '';
		let iValue = 0; // index of value
		let output = '';

		for (let iPattern = 0; iPattern < pattern.length; iPattern++) {
			const patternChar = pattern[iPattern];
			const valueChar = value[iValue] || '';

			switch (patternChar) {
				case '9': // Digit
					if (/\d/.test(valueChar)) {
						output += valueChar;
						iValue++;
					} else if (opts.placeholder) {
						output += opts.placeholder;
					}
					break;
				case 'A': // Alpha
					if (/[a-zA-Z]/.test(valueChar)) {
						output += valueChar;
						iValue++;
					} else if (opts.placeholder) {
						output += opts.placeholder;
					}
					break;
				case 'S': // Alphanumeric
					if (/[0-9a-zA-Z]/.test(valueChar)) {
						output += valueChar;
						iValue++;
					} else if (opts.placeholder) {
						output += opts.placeholder;
					}
					break;
				default:
					output += patternChar;
					if (valueChar === patternChar) {
						iValue++;
					}
					break;
			}
		}

		return output;
	}

	public maskMoney(opts: MaskOptions): void {
		this.bindElementToMask(ArchbaseMasker.toMoney, opts);
	}

	public maskNumber(): void {
		this.bindElementToMask(ArchbaseMasker.toNumber);
	}

	public maskAlphaNum(): void {
		this.bindElementToMask(ArchbaseMasker.toAlphaNumeric);
	}

	public maskPattern(pattern: string, placeholder?: string): void {
		this.bindElementToMask(ArchbaseMasker.toPattern, { pattern, placeholder });
	}

	public unMask(): void {
		this.elements.forEach((element: any) => {
			element.onkeyup = null;
		});
	}

	public static toNumber(value: string): string {
		return value.replace(/(?!^-)[^0-9]/g, '');
	}

	public static toAlphaNumeric(value: string): string {
		return value.replace(/[^a-z0-9 ]+/i, '');
	}
}
