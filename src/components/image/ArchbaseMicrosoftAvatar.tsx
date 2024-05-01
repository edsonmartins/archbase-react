import { Avatar, AvatarProps } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { processErrorMessage } from '../core/exceptions';

export const DEFAULT_AVATAR =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAAAOVBMVEXw5+ft39/y8vLQ0NDz9PTOzs7w8PDV1dXb29vj4+Pu7u7Y2Njs7OzS0tLl5eXq6urf39/p6end3d3l8ge2AAAAAnRSTlP+/qap3hAAAAo2SURBVHja7NNLjoMwEEXRNC5sExsI7H+xzWfQUkcMKgz8pNwrWfJnduR6/Dzo8za+jm71QPCeH4AAegJQLQABdAWgWgAC6ApAtQAE0BWAagEIoCsA1QIQQFcAqgUggK4AVAtAAF0BqBaAALoCUC0AAXQFoFoAAugKQLUABNAVgGoBCKArANUCEEBXAKoFIICuAFQLQABdAagWgAC6AlAtAAF0BaBaAALoCkC1AATQFYBqAQigKwDVAhBAVwCqBSCArgBUC0AAXQGoFoAAugJQLQABdAWgWgAC6OpLAOO27F/HtV5ygPGk62J87tWtYxPjcS+nqAZoZrHOy7DmUlIax7A1jimVktdhmWvcEZVSAtzx5mktKYT+LJz9HVNZp1kKUQTwmM865DSGHeqq43FMeaidmcYwiwCaPaf8jneNmKenxjeUALS4vNKF3aViei1RgFAA0LqlhJPPRxjK0jUnbA5o3bzxhY/aCOe2hO0BreY3Phdhri0FWwNaHE6+O4RDbEfYGNBq7vtws75v+Al3wF/27i3lbRgIoDDMRZbvife/2Lb80JfWiUH2ESN0lvARImUsK0lqZdvqekO+bvUE630ATQ53vSXXQ+oQVgS0lF1vy3OqIlgP0KbZ9cZ8nkz4qgHaMrjemg+LCV41wOnEr0hwErxagGl2vT2fk9DVAsyuD+RZ6OoA2sv1kfxlQscDJhv1sUZLwsYD2rK6PpSv9FLMA5pk18fyLLAgDzi6PpiPrQMuqz7auggYD2jZ9dE8m3DRgMl2fbwdXIlhwP9/AGN/BFlAeyvQmxOkAU+3MHF/0aGAtivSbgIFA8rLFchfQgUDpoEBHJJAsYC2uSL5ZsIEA+ZzwLA7GQzw6xgm6FCGArw0B4w4FyQBsyuU5wYBbRo4wGEyIcIAr80RIk4UKMArk9SQc1UOMGUSMDf3Hfj1KzDolyAHuKwKti7NAb5dwfzdHOD3NSTkKkIBXhxlxRtpcYAzCzgLEQk4sICDEIGA6RJgvKEqBWjTqmgrtBFMFOCicNRGkALc9UoBH81RgG+9VrjH6xTgpnBbB+yAf+uAhXXAwjpgYR2wsA5YWAcsrG+kC+s/5Qrrw4TCGh5nSR+oFtZH+oX1h0pFgYD5EmC8l0UYwMvv+cd7+7+fTCgKBNxZwL05wEZPZ0k/H1hYP6FaFAf4/XhWyMNZIv2QeVEcYGJHqps191vY9lWx1r25T+ClOxcj3sZIAV64NDDmVYIYYLKDAzysvW1Mo6+7coBiO/bCNbeGoIBpoACH1CJgm3cmoICjQo2NAu76sXgP1f/EXryjSEMSKhZQmJ2gH4JFAn67uijkxUUw4KIfi3Ys5ncw4MepdND/FgEBPw5VQw5TRZq8gXFvF/B0pBV0lCUCAybggIe/DBRkAc8mMmEnMSI04Nkpt4jn2n5iAU/W4cBrMAx4flY63tnon3BAefjJiB+t/yPLyTG3eMfafqoA+OhW0OfUOuC/y0joJeQXefe63CoIRQH4DKy9uV/0/R/2NGU6To6mVREJPetfbUYm32AABbwd8LkK/oIKeD8gw7QDvP21aB0AtxctDbY8aUkPwHYD4gxxc3oArt/tOvT7XTsAPj8bGfVZSEkXwKUhHr4JFl0AVxsADLbI/yldAJcR8dCj4JJOgDbQxX7hP3tLfZQlw21z8pxugAIz/YYLuB+gsIpG7wJ+pCMgpvFbYCE6AjIyjfooc0kB7BVNo22QsA53BAQ7GngIUvKnH2BZhD3U4upV+gKW9XMjrYtbpTcgF8FaPxa9UgB7Bt5RlZ/rWv/6AzKsoxo/27X+9Qcs837pJB9phuiZdwAU4CzplJ/M3f3eAVAIJEUn/FTqztcHEFgdsVnS4epnsXHme9MBkAE/bXzzyUk6wuemtRYmj3vblPsBAW/C1gwWcHREO/nIRd44haFg/K218G5AwGdFm3OA9hMSKbPBV2Ytkcp3Et4KCIikQyHaEmQBG+cgib7Dk2GOFoLXpzdUPhF0EncZ3gbIArDRFZxXgp/G1uiH4UqxHAva2G0dGFqQXbQoyI1zFyDAKasnFMoCLz7rY9aqKC6RQekcX12e4ExP2ConvqEa3gIIIGUXiPauCQQgrI8m51lr57SeczbRW4FXJLD637NTcDmhtWFzwHJRFr39HWFmgUeE4M+I8ufj+EaWjvjasFzw7dIU8KHANuqXzQKF+HO3DfipGCAGetnk6Gi53e9hU0DAGx2+b1OzRXUxNn9fRtDtOoftAAGetCL6cTwbgbpyoqKfO4564iaGrQABa5zc1SuWuqJ6AF7LPaWQdMY2IGwDCJHmsHtkS8rYUyNYBqxRu4uRYU7iasImgPDzorebUBzOwrfbcPaXC/qrAcF51SbuG93iUDFgo+hwQeH6W7AXAyI5ojM3l1XeP4IFRMpKnimHXLpKsAkgzJmvtYxgGd/32VgA4GVUfTx02c5kDQAr94UhUtokC+D1GA82Ga2I3mdfmXrAlV8NIUmnzeQZXxECX2E/Ge0kEb3TzjzXAV402+rBE5SbTZym5L213qdpimZ2Kjz++26zuS4EvG7S7nI/MHxkOfaO+7tdBghDcpjUrStuAohJDpWpQrAJIKuBKmDdytgmgJiH8qtZF9EEEEkOBlixyVsDQIYezo80WBxPE0AerQUpmU4JtrmEx6uAp7vTLQCR5JA58SvYBnDAX8BSBd8EEF4OGn9UsBFgHrICSkn5PQAHG4TUDEdaADKiHDYRRwnrAX9LE3KmGWkCCB/GBQy+UrAekIe6D1i53VubS3i0+zAVt6ZbAMKO2gb/be8OcyMEgSgAuyK2WRWX+1+2pPywyTbU8WWk82CO8GUDzPBwxW+NlQCjYb8kGKsDWj1F5/Kv2oDjYhtwGQWFAxL1weJ+WAfQchuSK9wIyLcEihZBHJBvCRQtgjggVx8n7OZwQM4l0LlQEXA2vwSmEny4DAWkGmVJR1oqgNPT+h6SPz0DEICAq+VJAvDtLQTQcqbt94r3ApoNVaJhSxyQbJiKD1VxwNn+JpwAP+85xtBNo0VTaRyQc5aVa60GGAh+gM75UAtwJGjk8hdYBIUBEuQqLyYtdQAZ9pAE+AEQIIDTc3MUJfgrEgSQJtn7Xrs2IO80NVfQB6S8UDq2YW1A2mmqYKYKAxJFe+VRXxCQd5qKzFRxwEhyinFui+qAZOFyadgcB2TL9uJJXxzQ3Bvr0lBaFZB7lACME0DA2f6d8HE3XP4BYoDU83xgqg8D7taDWT9q228ApHjmf+X5vxIgyYVILh80AYlTCeJ0ghyQf5iVB1qagMSxjpPxDgyQOdYhjXfIAZs4RyfARQmwjXN0qtJJugP+Xb4C4E4zTs2tiB4gc7r3qKgGyJ3MOloRHcBGGhGgFVk7IAY4lAEb6eQS4EsNkDtcKQtZygEbaYXLzTAE2MKV0ncVrpU64InyqoCUb/3Pv/zvgB3wrTrgf6sSYN9EFDeRqV/Koddyw2O4VmyAFxkeX1AhulXZJBV5AAAAAElFTkSuQmCC';

const MS_GRAPH_API_ENDPOINT = 'https://graph.microsoft.com/v1.0';

const msGraphApiRequest = async (endpoint: string, accessToken: string, headers: {}) => {
	const response = await fetch(`${MS_GRAPH_API_ENDPOINT}${endpoint}`, {
		headers: {
			...headers,
			Authorization: `Bearer ${accessToken}`,
			ConsistencyLevel: 'eventual',
		},
	});

	if (response.status !== 200) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response;
};

export interface ArchbaseMicrosoftAvatarProps extends AvatarProps {
	token?: string | null;
	email?: string | null;
}

export const ArchbaseMicrosoftAvatar = ({ token, email, ...others }: ArchbaseMicrosoftAvatarProps) => {
	const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
	useEffect(() => {
		setLoadedSrc(null);
		if (token && email) {
			msGraphApiRequest(`/users/${email}/photo/$value`, token, { responseType: 'Blob' })
				.then((photoResponse: any) => {
					photoResponse.blob().then((blob) => {
						const url = URL.createObjectURL(blob);
						setLoadedSrc(url);
					});
				})
				.catch((error) => {
					console.log(processErrorMessage(error));
				});
		}
	}, [email, token]);

	return <Avatar src={loadedSrc ? loadedSrc : DEFAULT_AVATAR} {...others} />;
};
