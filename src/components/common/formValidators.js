export const requiredField = value => {
    if(value) return undefined;
    return "Field is required";
}

const maxValue = max => value => 
    value && value > max ? `Value must be not bigger then ${max}`: undefined;

export const isIneger = value =>  {
    if(typeof value === 'undefined') return undefined
    return !Number.isInteger(+value) || Object.is(parseInt(value), NaN) ? `Value must be an integer`  : undefined; 
}

export const maxValue19 = maxValue(19)    
  