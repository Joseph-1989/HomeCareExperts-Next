import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload, Image as ImageImpl } from '@react-three/drei';
import { ScrollControls, Scroll } from './ScrollControls';
import * as THREE from 'three';

function Image(props: any) {
	const ref = useRef<THREE.Group>();
	const group = useRef<THREE.Group>();

	return (
		// @ts-ignore
		<group ref={group}>
			<ImageImpl ref={ref} {...props} />
		</group>
	);
}

function Page({ m = 0.4, urls, ...props }: any) {
	const { width } = useThree((state) => state.viewport);
	const w = width < 10 ? 1.5 / 3 : 1 / 3;

	return (
		<group {...props}>
			<Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
			<Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
			<Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
		</group>
	);
}

function Pages() {
	const { width } = useThree((state) => state.viewport);

	return (
		<>
			<Page
				position={[width * 0, 0, 0]}
				urls={['/img/fiber/fiber-1.jpg', '/img/fiber/fiber-6.jpg', '/img/fiber/fiber-11.jpg']}
			/>
			<Page
				position={[width * 1, 0, 0]}
				urls={['/img/fiber/fiber-2.jpg', '/img/fiber/fiber-7.jpg', '/img/fiber/fiber-12.jpg']}
			/>
			<Page
				position={[width * 2, 0, 0]}
				urls={['/img/fiber/fiber-3.jpg', '/img/fiber/fiber-8.jpg', '/img/fiber/fiber-13.jpg']}
			/>
			<Page
				position={[width * 3, 0, 0]}
				urls={['/img/fiber/fiber-4.jpg', '/img/fiber/fiber-9.jpg', '/img/fiber/fiber-14.jpg']}
			/>
			<Page
				position={[width * 4, 0, 0]}
				urls={['/img/fiber/fiber-5.jpg', '/img/fiber/fiber-10.jpg', '/img/fiber/fiber-15.jpg']}
			/>
		</>
	);
}

export default function FiberContainer() {
	return (
		<div className="threeJSContainer" style={{ marginTop: '100px', width: '100%', height: '512px' }}>
			<Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
				<Suspense fallback={null}>
					<ScrollControls infinite horizontal damping={4} pages={4} distance={1}>
						<Scroll>
							<Pages />
						</Scroll>
					</ScrollControls>
					<Preload />
				</Suspense>
			</Canvas>
		</div>
	);
}
