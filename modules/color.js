/*
 * Copyright 2000-2020 Sergio Rando <segio.rando@yahoo.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @param {Array<number>} aRGBA [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 * @returns {string} "rgba(r, g, b, a)" r = 0..255, g = 0..255, g = 0..255, a = 0..1
 */
export function RGBA2STR(aRGBA) {
	return 'rgba(' + ((aRGBA[0] * 255) | 0) + ',' + ((aRGBA[1] * 255) | 0) + ',' + ((aRGBA[2] * 255) | 0) + ',' + aRGBA[3].toFixed(2) + ')';
}

/**
 * @param {number} min 0..1
 * @param {number} max 0..1
 * @param {number} hue 0..360
 * @param {Array<number>} rgba [r, g, b, a]
 */
function HUE2RGB(min, max, hue, rgba) {
	hue /= 360;
	hue -= hue | 0;
	hue *= 6;
	let n = hue | 0;
	let factor = hue - n;

	switch (n) {
		case 0: rgba[0] = max; rgba[1] = min + (max - min) * factor; rgba[2] = min; return;
		case 1: rgba[0] = max - (max - min) * factor; rgba[1] = max; rgba[2] = min; return;
		case 2: rgba[0] = min; rgba[1] = max; rgba[2] = min + (max - min) * factor; return;
		case 3: rgba[0] = min; rgba[1] = max - (max - min) * factor; rgba[2] = max; return;
		case 4: rgba[0] = min + (max - min) * factor; rgba[1] = min; rgba[2] = max; return;
		default: rgba[0] = max; rgba[1] = min; rgba[2] = max - (max - min) * factor; return;
	}
}

/**
 * @param {number} fHue 0..360
 * @param {number} fSaturation 0..1
 * @param {number} fLightness 0..1
 * @param {number} fAlpha 0..1
 * @returns {Array<number>} [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 */
export function HSLA2RGBA(fHue, fSaturation, fLightness, fAlpha) {
	let aRGBA = [0, 0, 0, fAlpha];

	if (fLightness <= 0) {
		aRGBA[0] = aRGBA[1] = aRGBA[2] = 0;
	} else if (fLightness >= 1) {
		aRGBA[0] = aRGBA[1] = aRGBA[2] = 1;
	} else if (fSaturation <= 0) {
		aRGBA[0] = aRGBA[1] = aRGBA[2] = fLightness;
	} else {
		let fDelta = (fLightness <= 0.5) ? (fSaturation * fLightness) : (fSaturation * (1 - fLightness));
		HUE2RGB(fLightness - fDelta, fLightness + fDelta, fHue, aRGBA);
	}

	return aRGBA;
}

/**
 * @param {number} fHue 0..360
 * @param {number} fSaturation 0..1
 * @param {number} fIntensity 0..1
 * @param {number} fAlpha 0..1
 * @returns {Array<number>} [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 */
export function HSIA2RGBA(fHue, fSaturation, fIntensity, fAlpha) {
	let aRGBA = [0, 0, 0, fAlpha];

	if (fIntensity <= 0) {
		aRGBA[0] = aRGBA[1] = aRGBA[2] = 0;
	} else if (fSaturation <= 0) {
		aRGBA[0] = aRGBA[1] = aRGBA[2] = fIntensity;
	} else {
		let m = fIntensity * (1 - fSaturation);
		HUE2RGB(m, fIntensity, fHue, aRGBA);
	}

	return aRGBA;
}

/**
 * @param {Array<number>} aRGBA1 [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 * @param {Array<number>} aRGBA2 [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 * @param {number} fPercent 0..1
 * @returns {Array<number>} [r, g, b, a] r = 0..1, g = 0..1, g = 0..1, a = 0..1
 */
export function MorphRGBA(aRGBA1, aRGBA2, fPercent) {
	return [
		(aRGBA2[0] - aRGBA1[0]) * fPercent + aRGBA1[0],
		(aRGBA2[1] - aRGBA1[1]) * fPercent + aRGBA1[1],
		(aRGBA2[2] - aRGBA1[2]) * fPercent + aRGBA1[2],
		(aRGBA2[3] - aRGBA1[3]) * fPercent + aRGBA1[3]
	]
}
