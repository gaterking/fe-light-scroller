// Returns if a value is an array
export function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}