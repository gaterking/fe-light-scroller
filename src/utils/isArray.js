// eslint-disable-next-line import/prefer-default-export
export function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}
