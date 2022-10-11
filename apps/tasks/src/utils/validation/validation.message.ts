import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

export function ValidationMessage(message: string): ((validationArguments: ValidationArguments) => string) {
    return (validationArguments) => {
        return validationArguments.property + ':' + message
    }
}