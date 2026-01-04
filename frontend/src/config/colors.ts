/**
 * Blue Teal Color Palette
 * A modern palette combining blues, teals, and grays for a professional look
 */

// Color palette array for programmatic use
export const palettes = {
  blue: {
    blue0: '#E4F3FF',
    blue1: '#90D5FF',
    blue2: '#00B2EB',
    blue3: '#008AB7',
    blue4: '#006486',
    blue5: '#004158',
    blue6: '#00202E',
  },
  sky: {
    sky0: '#BBDCFF',
    sky1: '#57B9FF',
    sky2: '#0093D7',
    sky3: '#006DA1',
    sky4: '#004A6E',
    sky5: '#00293F',
    sky6: '#001220',
  },
  teal: {
    teal0: '#E9F2F9',
    teal1: '#B6D5EC',
    teal2: '#77B1D4',
    teal3: '#5C8AA6',
    teal4: '#42657A',
    teal5: '#2A4251',
    teal6: '#14222B',
  },
  dusty: {
    dusty0: '#DAE8F4',
    dusty1: '#97C4E4',
    dusty2: '#6C9EBE',
    dusty3: '#517891',
    dusty4: '#375466',
    dusty5: '#20333F',
    dusty6: '#0A141A',
  },
  grey: {
    grey0: '#F0F1F1',
    grey1: '#CACDCF',
    grey2: '#A2A6A9',
    grey3: '#7E8183',
    grey4: '#5B5D5F',
    grey5: '#3A3C3D',
    grey6: '#1C1D1E',
  },
  danger: {
    danger0: '#FFE6E6',
    danger1: '#FF9999',
    danger2: '#FF4D4D',
    danger3: '#E60000',
    danger4: '#B30000',
    danger5: '#800000',
    danger6: '#4D0000',
  },
  success: {
    success0: '#E6F7E6',
    success1: '#99E699',
    success2: '#4DD94D',
    success3: '#00CC00',
    success4: '#009900',
    success5: '#006600',
    success6: '#003300',
  },
  warning: {
    warning0: '#FFF2E6',
    warning1: '#FFCC99',
    warning2: '#FF994D',
    warning3: '#FF6600',
    warning4: '#CC5200',
    warning5: '#993D00',
    warning6: '#662900',
  },
  purple: {
    purple0: '#F5EFF2',
    purple1: '#DCC2CE',
    purple2: '#C494AB',
    purple3: '#A76A89',
    purple4: '#794B63',
    purple5: '#4E2F3F',
    purple6: '#27151E',
  },
  green: {
    green0: '#D5F7B5',
    green1: '#ABD085',
    green2: '#89A76A',
    green3: '#688050',
    green4: '#4A5B38',
    green5: '#2D3921',
    green6: '#13190C',
  },
} as const;

export const primary = {
  blue: palettes.blue.blue2,
  sky: palettes.sky.sky2,
  teal: palettes.teal.teal2,
  dusty: palettes.dusty.dusty2,
  purple: palettes.purple.purple2,
  green: palettes.green.green2,
};

export const semantic = {
  danger: palettes.danger.danger3,
  success: palettes.success.success3,
  warning: palettes.warning.warning3,
};

export const text = {
  primary: palettes.grey.grey6,
  secondary: palettes.grey.grey5,
  subtle: palettes.grey.grey3,
};

export const background = {
  blue: palettes.blue.blue0,
  sky: palettes.sky.sky0,
  teal: palettes.teal.teal0,
  dusty: palettes.dusty.dusty0,
  grey: palettes.grey.grey0,
  purple: palettes.purple.purple0,
  green: palettes.green.green0,
};

export const border = {
  blue: palettes.blue.blue1,
  sky: palettes.sky.sky1,
  teal: palettes.teal.teal1,
  dusty: palettes.dusty.dusty1,
  grey: palettes.grey.grey1,
  purple: palettes.purple.purple1,
  green: palettes.green.green1,
};