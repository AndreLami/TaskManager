
export class TaskDoesNotExist {}

export class TooManyTaskDependencies {
    constructor(
        public readonly maxDependenciesNumber: number
    ) {}
}

export class IncorrectTaskDependencies {}

export class CouldNotCompleteTaskTaskIsNotInProgressState {}