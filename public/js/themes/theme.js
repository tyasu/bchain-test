angular.module('mytheme', ['ngMaterial'])
	.config(function($mdThemingProvider) {
		var customPrimary = {
			'50': '#54ecff',
			'100': '#3be9ff',
			'200': '#21e6ff',
			'300': '#08e3ff',
			'400': '#00d3ed',
			'500': '#00BCD4',
			'600': '#00a5ba',
			'700': '#008fa1',
			'800': '#007887',
			'900': '#00626e',
			'A100': '#6eefff',
			'A200': '#87f1ff',
			'A400': '#a1f4ff',
			'A700': '#004b54',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
      'contrastLightColors': undefined
		};
		$mdThemingProvider
			.definePalette('customPrimary',
				customPrimary);

		var customAccent = {
			'50': '#0040aa',
        '100': '#0049c3',
        '200': '#0053dd',
        '300': '#005cf6',
        '400': '#116aff',
        '500': '#2a7aff',
        '600': '#5d9aff',
        '700': '#77aaff',
        '800': '#90baff',
        '900': '#aacaff',
        'A100': '#5d9aff',
        'A200': '#448AFF',
        'A400': '#2a7aff',
        'A700': '#c3daff',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
      'contrastLightColors': undefined
		};
		$mdThemingProvider
			.definePalette('customAccent',
				customAccent);

		var customWarn = {
			'50': '#ffd080',
        '100': '#ffc666',
        '200': '#ffbd4d',
        '300': '#ffb333',
        '400': '#ffaa1a',
        '500': '#ffa000',
        '600': '#e69000',
        '700': '#cc8000',
        '800': '#b37000',
        '900': '#996000',
        'A100': '#ffd999',
        'A200': '#ffe3b3',
        'A400': '#ffeccc',
        'A700': '#805000',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
      'contrastLightColors': undefined
		};
		$mdThemingProvider
			.definePalette('customWarn',
				customWarn);

		var customBackground = {
			'50': '#ffffff',
			'100': '#ffffff',
			'200': '#ffffff',
			'300': '#ffffff',
			'400': '#ffffff',
			'500': '#fff',
			'600': '#f2f2f2',
			'700': '#e6e6e6',
			'800': '#d9d9d9',
			'900': '#cccccc',
			'A100': '#ffffff',
			'A200': '#ffffff',
			'A400': '#ffffff',
			'A700': '#bfbfbf',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
      'contrastLightColors': undefined
		};
		$mdThemingProvider
			.definePalette('customBackground',
				customBackground);

		$mdThemingProvider.theme('default')
			.primaryPalette('customPrimary')
			.accentPalette('customAccent')
			.warnPalette('customWarn')
			.backgroundPalette('customBackground');
	});
