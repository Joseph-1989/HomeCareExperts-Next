import { Html, Head, Main, NextScript } from 'next/document';
import { RiServiceLine } from 'react-icons/ri';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/logoHomeCareServices.png" />

				{/* SEO */}
				<meta name="keyword" content={'HomeCareExperts, home care, home services, care experts'} />
				<meta
					name={'description'}
					content={
						'Find and hire the best home care services in your area with HomeCareExperts. Get top-rated professionals for all your home care needs. | ' +
						'Найдите и наймите лучших специалистов по уходу на дому в вашем районе с помощью HomeCareExperts. Получите услуги от высококвалифицированных специалистов по уходу за домом. | ' +
						'집에서 필요한 모든 홈케어 서비스를 HomeCareExperts와 함께 찾아보세요. 최고 평점을 받은 전문가를 만나보세요.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
