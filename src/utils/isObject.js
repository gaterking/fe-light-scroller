// eslint-disable-next-line import/prefer-default-export
export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
